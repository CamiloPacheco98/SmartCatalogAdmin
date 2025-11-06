import { Component, OnInit } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";
import { StorageService } from "../../../../core/services/storage.service";
import { PdfCoService } from "../../../../core/services/pdf-co.service";
import { TranslatePipe, TranslateService } from "@ngx-translate/core";
import {
  FirestoreService,
} from "../../../../core/services/firestore.service";
import { AuthService } from "../../../../core/services/auth.service";

@Component({
  selector: "app-home",
  standalone: true,
  imports: [CommonModule, FormsModule, TranslatePipe],
  templateUrl: "./home.component.html",
  styleUrls: ["./home.component.css"],
})
export class HomeComponent implements OnInit {
  // PDF Upload properties
  selectedFile: File | null = null;
  isDragOver = false;
  isUploading = false;
  uploadError: string | null = null;
  uploadSuccess = false;
  uploadProgress: string = "";

  // JSON Upload properties
  selectedJsonFile: File | null = null;
  isJsonDragOver = false;
  isJsonUploading = false;
  jsonUploadError: string | null = null;
  jsonUploadSuccess = false;
  jsonData: any = null;

  // Sign-in Link properties
  signinEmail: string = "";
  isSendingLink = false;
  signinError: string | null = null;
  signinSuccess = false;

  //file Size properties
  pdfFileSize: String = "";
  jsonFileSize: String = "";


  constructor(
    private storageService: StorageService,
    private pdfCoService: PdfCoService,
    private firestoreService: FirestoreService,
    private authService: AuthService,
    private translate: TranslateService
  ) { }

  ngOnInit(): void {
    // Componente inicializado
  }

  onDragOver(event: DragEvent): void {
    event.preventDefault();
    event.stopPropagation();
    this.isDragOver = true;
  }

  onDragLeave(event: DragEvent): void {
    event.preventDefault();
    event.stopPropagation();
    this.isDragOver = false;
  }

  onDrop(event: DragEvent): void {
    event.preventDefault();
    event.stopPropagation();
    this.isDragOver = false;

    const files = event.dataTransfer?.files;
    if (files && files.length > 0) {
      this.handleFileSelection(files[0]);
    }
  }

  onFileSelected(event: Event): void {
    const target = event.target as HTMLInputElement;
    if (target.files && target.files.length > 0) {
      this.handleFileSelection(target.files[0]);
    }
  }

  private handleFileSelection(file: File): void {
    this.clearMessages();

    // Validate file type
    if (file.type !== "application/pdf") {
      this.uploadError = this.translate.instant('app.home.uploadPdf.error.pleaseSelectValidPdfFile');
      return;
    }

    // Validate file size (25MB limit)
    const maxSize = 25 * 1024 * 1024; // 25MB in bytes
    if (file.size > maxSize) {
      this.uploadError = this.translate.instant('app.home.uploadPdf.error.fileSizeMustBeLessThan25MB');
      return;
    }

    this.selectedFile = file;
    this.pdfFileSize = this.formatFileSize(file.size);
  }

  removeFile(): void {
    this.selectedFile = null;
    this.pdfFileSize = "";
    this.clearMessages();
  }

  async uploadFile(): Promise<void> {
    if (!this.selectedFile) {
      return;
    }

    this.isUploading = true;
    this.clearMessages();

    try {
      // Process and upload page by page for better performance and progress tracking
      const downloadUrls = await this.processAndUploadPageByPage(
        this.selectedFile
      );

      console.log("Uploaded catalog pages:", {
        totalPages: downloadUrls.length,
        pages: downloadUrls,
      });

      // Save catalog metadata with download URLs to Firestore
      await this.firestoreService.saveCatalogMetadata(downloadUrls);

      this.isUploading = false;
      this.uploadSuccess = true;
      this.uploadProgress = "";
      this.selectedFile = null;
      this.pdfFileSize = "";

      // Clear success message after 3 seconds
      setTimeout(() => {
        this.uploadSuccess = false;
      }, 3000);
    } catch (error) {
      console.error("Error uploading file:", error);
      this.isUploading = false;
      this.uploadProgress = "";
      this.uploadError = this.translate.instant('app.home.uploadPdf.error.errorUploadingFile');
    }
  }

  /**
   * Process and upload PDF page by page for better performance with large PDFs
   */
  private async processAndUploadPageByPage(pdfFile: File): Promise<string[]> {
    try {
      // Step 1: Upload PDF to PDF.co
      this.uploadProgress = this.translate.instant('app.home.uploadPdf.uploadingPdfToCloud');
      console.log("Uploading PDF to PDF.co...");
      const pdfUrl = await this.pdfCoService.uploadFile(pdfFile);
      console.log("PDF uploaded to:", pdfUrl);

      // Step 2: Get total page count by converting first page
      this.uploadProgress = this.translate.instant('app.home.uploadPdf.analyzingPdf');
      const firstPageResponse = await this.pdfCoService.convertPdfToImages(
        pdfUrl,
        "0"
      );

      if (firstPageResponse.error || !firstPageResponse.urls) {
        throw new Error(firstPageResponse.message || this.translate.instant('app.home.uploadPdf.error.failedToAnalyzePDF'));
      }

      // Get page count from PDF.co (we need to make multiple requests to get total)
      // For now, we'll try converting all and handle pagination
      let currentPage = 0;
      let hasMorePages = true;
      const downloadUrls: string[] = [];

      // Process first page
      this.uploadProgress = this.translate.instant('app.home.uploadPdf.processingPage') + '1...';
      const firstImageUrl = firstPageResponse.urls[0];
      const firstImageResponse = await fetch(firstImageUrl);
      const firstImageBlob = await firstImageResponse.blob();
      const firstImageFile = new File([firstImageBlob], `page-01.jpg`, {
        type: "image/jpeg",
      });

      const firstPath = `catalog/page_01.jpg`;
      const firstFirebaseUrl = await this.storageService.uploadFile(
        firstImageFile,
        firstPath
      );
      downloadUrls.push(firstFirebaseUrl);
      console.log(`Page 1 uploaded successfully`);

      // Step 3: Process remaining pages one by one
      currentPage = 1;
      while (hasMorePages) {
        const pageNumber = currentPage + 1;
        this.uploadProgress = this.translate.instant('app.home.uploadPdf.processingPage') + pageNumber + '...';

        try {
          // Convert single page
          const pageResponse = await this.pdfCoService.convertPdfToImages(
            pdfUrl,
            `${currentPage}`
          );

          if (
            pageResponse.error ||
            !pageResponse.urls ||
            pageResponse.urls.length === 0
          ) {
            // No more pages
            hasMorePages = false;
            break;
          }

          // Download image from PDF.co
          const imageUrl = pageResponse.urls[0];
          const imageResponse = await fetch(imageUrl);
          const imageBlob = await imageResponse.blob();
          const imageFile = new File(
            [imageBlob],
            `page-${String(pageNumber).padStart(2, "0")}.jpg`,
            {
              type: "image/jpeg",
            }
          );

          // Upload to Firebase Storage
          const path = `catalog/page_${String(pageNumber).padStart(
            2,
            "0"
          )}.jpg`;
          const firebaseUrl = await this.storageService.uploadFile(
            imageFile,
            path
          );
          downloadUrls.push(firebaseUrl);

          console.log(`Page ${pageNumber} uploaded successfully`);
          currentPage++;
        } catch (error) {
          // Likely reached end of document
          console.log(
            `Finished processing. Total pages: ${downloadUrls.length}`
          );
          hasMorePages = false;
        }
      }

      return downloadUrls;
    } catch (error) {
      console.error("Error processing PDF page by page:", error);
      throw error;
    }
  }

  private formatFileSize(bytes: number): string {
    if (bytes === 0) return "0 Bytes";

    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));

    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  }

  private clearMessages(): void {
    this.uploadError = null;
    this.uploadSuccess = false;
  }

  // JSON Upload Methods
  onJsonDragOver(event: DragEvent): void {
    event.preventDefault();
    event.stopPropagation();
    this.isJsonDragOver = true;
  }

  onJsonDragLeave(event: DragEvent): void {
    event.preventDefault();
    event.stopPropagation();
    this.isJsonDragOver = false;
  }

  onJsonDrop(event: DragEvent): void {
    event.preventDefault();
    event.stopPropagation();
    this.isJsonDragOver = false;

    const files = event.dataTransfer?.files;
    if (files && files.length > 0) {
      this.handleJsonFileSelection(files[0]);
    }
  }

  onJsonFileSelected(event: Event): void {
    const target = event.target as HTMLInputElement;
    if (target.files && target.files.length > 0) {
      this.handleJsonFileSelection(target.files[0]);
    }
  }

  private handleJsonFileSelection(file: File): void {
    this.clearJsonMessages();

    // Validate file type
    if (file.type !== "application/json" && !file.name.endsWith(".json")) {
      this.jsonUploadError = this.translate.instant('app.home.uploadJson.error.pleaseSelectValidJsonFile');
      return;
    }

    // Validate file size (10MB limit for JSON)
    const maxSize = 10 * 1024 * 1024; // 10MB in bytes
    if (file.size > maxSize) {
      this.jsonUploadError = this.translate.instant('app.home.uploadJson.error.fileSizeMustBeLessThan10MB');
      return;
    }

    this.selectedJsonFile = file;
    this.jsonFileSize = this.formatFileSize(file.size);
    this.validateJsonContent(file);
  }

  private async validateJsonContent(file: File): Promise<void> {
    try {
      const text = await file.text();
      const json = JSON.parse(text);

      // Validate that the JSON contains product data
      const hasValidStructure = this.validateJsonStructure(json);

      if (!hasValidStructure) {
        this.jsonUploadError =
          this.translate.instant('app.home.uploadJson.error.jsonDoesNotContainValidProductData');
        this.selectedJsonFile = null;
        this.jsonFileSize = "";
        return;
      }

      this.jsonData = json;
      console.log("Valid JSON file loaded with product data:", json);
    } catch (error) {
      this.jsonUploadError = this.translate.instant('app.home.uploadJson.error.invalidJsonFormat');
      this.selectedJsonFile = null;
      this.jsonFileSize = "";
    }
  }

  /**
   * Validate that the JSON has a structure that contains product data
   */
  private validateJsonStructure(json: any): boolean {
    if (!json || typeof json !== "object") {
      return false;
    }

    // Check for different possible structures
    if (json.enrichments && Array.isArray(json.enrichments)) {
      return json.enrichments.some(
        (item: any) =>
          item &&
          (item.productId || item.id) &&
          (item.name || item.title || item.productName)
      );
    }

    if (json.products && Array.isArray(json.products)) {
      return json.products.some(
        (item: any) =>
          item &&
          (item.productId || item.id) &&
          (item.name || item.title || item.productName)
      );
    }

    if (Array.isArray(json)) {
      return json.some(
        (item: any) =>
          item &&
          (item.productId || item.id) &&
          (item.name || item.title || item.productName)
      );
    }

    return false;
  }

  removeJsonFile(): void {
    this.selectedJsonFile = null;
    this.jsonData = null;
    this.jsonFileSize = "";
    this.clearJsonMessages();
  }

  async uploadJsonFile(): Promise<void> {
    if (!this.selectedJsonFile || !this.jsonData) {
      return;
    }

    this.isJsonUploading = true;
    this.clearJsonMessages();

    try {
      // Process the JSON data before uploading
      const processedData = this.processProductData(this.jsonData);

      if (!processedData || processedData.length === 0) {
        throw new Error(this.translate.instant('app.home.uploadJson.error.noValidProductsFound'));
      }

      // Create a unique catalog ID for this JSON upload
      const catalogId = `catalog_${Date.now()}`;

      // Add catalogId to each product
      const productsWithCatalogId = processedData.map((product) => ({
        ...product,
        catalogId,
      }));

      // Save products to Firestore using the new structure
      await this.firestoreService.saveProductsToCatalog(productsWithCatalogId);

      console.log("Products saved to Firestore:", {
        productCount: processedData.length,
        products: processedData,
      });

      this.isJsonUploading = false;
      this.jsonUploadSuccess = true;
      this.selectedJsonFile = null;
      this.jsonFileSize = "";
      this.jsonData = null;

      // Clear success message after 5 seconds
      setTimeout(() => {
        this.jsonUploadSuccess = false;
      }, 5000);
    } catch (error) {
      console.error("Error uploading JSON file:", error);
      this.isJsonUploading = false;
      this.jsonUploadError =
        error instanceof Error
          ? error.message
          : this.translate.instant('app.home.uploadJson.error.errorUploadingFile');
    }
  }

  /**
   * Process the JSON data to extract and format product information
   */
  private processProductData(jsonData: any): any[] {
    try {
      // Check if the data has the expected structure
      if (!jsonData || typeof jsonData !== "object") {
        throw new Error(this.translate.instant('app.home.uploadJson.error.invalidJsonStructure'));
      }

      // Handle different possible data structures
      let enrichments: any[] = [];

      if (jsonData.enrichments && Array.isArray(jsonData.enrichments)) {
        enrichments = jsonData.enrichments;
      } else if (Array.isArray(jsonData)) {
        enrichments = jsonData;
      } else if (jsonData.products && Array.isArray(jsonData.products)) {
        enrichments = jsonData.products;
      } else {
        throw new Error(
          this.translate.instant('app.home.uploadJson.error.noValidProductData')
        );
      }

      // Filter and map products with validation
      const processedProducts = enrichments
        .filter((item: any) => {
          // Validate required fields
          return (
            item &&
            (item.productId || item.id) &&
            (item.name || item.title || item.productName)
          );
        })
        .map((item: any, index: number) => {
          // Normalize the data structure
          return {
            id: item.productId || item.id || `product_${index}`,
            catalogId: "", // Will be set when saving to Firestore
            name: item.name || "Unnamed Product",
            price: this.parsePrice(item.price),
            pageIndex: item.pageIndex || index + 1,
            pageName: item.pageName || `Page ${item.pageIndex || index + 1}`,
            desc: item.desc || "",
            // Keep original data for reference
            originalData: item,
          };
        });

      console.log(
        `Processed ${processedProducts.length} products from ${enrichments.length} items`
      );
      return processedProducts;
    } catch (error) {
      console.error("Error processing product data:", error);
      throw new Error(
        this.translate.instant('app.home.uploadJson.error.failedToProcessProductData') + (error instanceof Error ? error.message : "Unknown error")
      );
    }
  }

  /**
   * Parse price from various formats
   */
  private parsePrice(price: any): number | null {
    if (price === null || price === undefined || price === "") {
      return null;
    }

    if (typeof price === "number") {
      return price;
    }

    if (typeof price === "string") {
      // Remove currency symbols and parse
      const cleanPrice = price.replace(/[^\d.,]/g, "");
      const parsed = parseFloat(cleanPrice.replace(",", "."));
      return isNaN(parsed) ? null : parsed;
    }

    return null;
  }

  private clearJsonMessages(): void {
    this.jsonUploadError = null;
    this.jsonUploadSuccess = false;
  }

  // Sign-in Link Methods
  async sendSigninLink(): Promise<void> {
    if (!this.signinEmail) {
      this.signinError = this.translate.instant('app.home.sendSigninLink.error.pleaseFillAllFields');
      return;
    }

    this.isSendingLink = true;
    this.clearSigninMessages();

    try {
      const currentUser = this.authService.getCurrentUser();

      if (!currentUser?.uid) {
        this.signinError = this.translate.instant('app.home.sendSigninLink.error.pleaseLogin');
        return;
      }

      // Use Firebase's sendSignInLinkToEmail method
      await this.authService.sendSignInLinkToEmail(
        this.signinEmail,
        currentUser.uid
      );

      this.isSendingLink = false;
      this.signinSuccess = true;

      // Clear form
      this.signinEmail = "";

      // Clear success message after 5 seconds
      setTimeout(() => {
        this.signinSuccess = false;
      }, 5000);
    } catch (error) {
      console.error("Error sending sign-in link:", error);
      this.isSendingLink = false;
      this.signinError =
        error instanceof Error
          ? error.message
          : this.translate.instant('app.home.sendSigninLink.error.message');
    }
  }

  private clearSigninMessages(): void {
    this.signinError = null;
    this.signinSuccess = false;
  }
}
