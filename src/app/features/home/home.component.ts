import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StorageService } from '../../core/services/storage.service';
import { PdfCoService } from '../../core/services/pdf-co.service';
import { FirestoreService, Product } from '../../core/services/firestore.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  // PDF Upload properties
  selectedFile: File | null = null;
  isDragOver = false;
  isUploading = false;
  uploadError: string | null = null;
  uploadSuccess = false;
  uploadProgress: string = '';

  // JSON Upload properties
  selectedJsonFile: File | null = null;
  isJsonDragOver = false;
  isJsonUploading = false;
  jsonUploadError: string | null = null;
  jsonUploadSuccess = false;
  jsonData: any = null;

  constructor(
    private storageService: StorageService,
    private pdfCoService: PdfCoService,
    private firestoreService: FirestoreService
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
    if (file.type !== 'application/pdf') {
      this.uploadError = 'Please select a valid PDF file.';
      return;
    }

    // Validate file size (25MB limit)
    const maxSize = 25 * 1024 * 1024; // 25MB in bytes
    if (file.size > maxSize) {
      this.uploadError = 'File size must be less than 25MB.';
      return;
    }

    this.selectedFile = file;
  }

  removeFile(): void {
    this.selectedFile = null;
    this.clearMessages();
  }

  async uploadFile(): Promise<void> {
    if (!this.selectedFile) {
      return;
    }

    this.isUploading = true;
    this.clearMessages();

    try {
      // Save reference to file name before processing
      const originalFileName = this.selectedFile.name;

      // Create unique identifier for this catalog
      const catalogId = `catalog_${Date.now()}`;
      const catalogName = originalFileName.replace('.pdf', '');

      // Process and upload page by page for better performance and progress tracking
      const downloadUrls = await this.processAndUploadPageByPage(
        this.selectedFile,
        catalogId,
        catalogName
      );

      console.log('Uploaded catalog pages:', {
        catalogId,
        catalogName,
        totalPages: downloadUrls.length,
        pages: downloadUrls
      });

      // Save catalog metadata with download URLs to Firestore
      await this.firestoreService.saveCatalogMetadata(catalogId, catalogName, downloadUrls);

      this.isUploading = false;
      this.uploadSuccess = true;
      this.uploadProgress = '';
      this.selectedFile = null;

      // Clear success message after 3 seconds
      setTimeout(() => {
        this.uploadSuccess = false;
      }, 3000);

    } catch (error) {
      console.error('Error uploading file:', error);
      this.isUploading = false;
      this.uploadProgress = '';
      this.uploadError = 'Error uploading file. Please try again.';
    }
  }

  /**
   * Process and upload PDF page by page for better performance with large PDFs
   */
  private async processAndUploadPageByPage(
    pdfFile: File,
    catalogId: string,
    catalogName: string
  ): Promise<string[]> {
    try {
      // Step 1: Upload PDF to PDF.co
      this.uploadProgress = 'Uploading PDF to cloud...';
      console.log('Uploading PDF to PDF.co...');
      const pdfUrl = await this.pdfCoService.uploadFile(pdfFile);
      console.log('PDF uploaded to:', pdfUrl);

      // Step 2: Get total page count by converting first page
      this.uploadProgress = 'Analyzing PDF...';
      const firstPageResponse = await this.pdfCoService.convertPdfToImages(pdfUrl, '0');

      if (firstPageResponse.error || !firstPageResponse.urls) {
        throw new Error(firstPageResponse.message || 'Failed to analyze PDF');
      }

      // Get page count from PDF.co (we need to make multiple requests to get total)
      // For now, we'll try converting all and handle pagination
      let currentPage = 0;
      let hasMorePages = true;
      const downloadUrls: string[] = [];

      // Process first page
      this.uploadProgress = `Processing page 1...`;
      const firstImageUrl = firstPageResponse.urls[0];
      const firstImageResponse = await fetch(firstImageUrl);
      const firstImageBlob = await firstImageResponse.blob();
      const firstImageFile = new File([firstImageBlob], `page-1.jpg`, { type: 'image/jpeg' });

      const firstPath = `catalogs/${catalogId}/${catalogName}_page_01.jpg`;
      const firstFirebaseUrl = await this.storageService.uploadFile(firstImageFile, firstPath);
      downloadUrls.push(firstFirebaseUrl);
      console.log(`Page 1 uploaded successfully`);

      // Step 3: Process remaining pages one by one
      currentPage = 1;
      while (hasMorePages) {
        const pageNumber = currentPage + 1;
        this.uploadProgress = `Processing page ${pageNumber}...`;

        try {
          // Convert single page
          const pageResponse = await this.pdfCoService.convertPdfToImages(pdfUrl, `${currentPage}`);

          if (pageResponse.error || !pageResponse.urls || pageResponse.urls.length === 0) {
            // No more pages
            hasMorePages = false;
            break;
          }

          // Download image from PDF.co
          const imageUrl = pageResponse.urls[0];
          const imageResponse = await fetch(imageUrl);
          const imageBlob = await imageResponse.blob();
          const imageFile = new File([imageBlob], `page-${pageNumber}.jpg`, { type: 'image/jpeg' });

          // Upload to Firebase Storage
          const path = `catalogs/${catalogId}/${catalogName}_page_${String(pageNumber).padStart(2, '0')}.jpg`;
            const firebaseUrl = await this.storageService.uploadFile(imageFile, path);
          downloadUrls.push(firebaseUrl);

          console.log(`Page ${pageNumber} uploaded successfully`);
          currentPage++;

        } catch (error) {
          // Likely reached end of document
          console.log(`Finished processing. Total pages: ${downloadUrls.length}`);
          hasMorePages = false;
        }
      }

      return downloadUrls;

    } catch (error) {
      console.error('Error processing PDF page by page:', error);
      throw error;
    }
  }

  formatFileSize(bytes: number): string {
    if (bytes === 0) return '0 Bytes';

    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));

    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
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
    if (file.type !== 'application/json' && !file.name.endsWith('.json')) {
      this.jsonUploadError = 'Please select a valid JSON file.';
      return;
    }

    // Validate file size (10MB limit for JSON)
    const maxSize = 10 * 1024 * 1024; // 10MB in bytes
    if (file.size > maxSize) {
      this.jsonUploadError = 'File size must be less than 10MB.';
      return;
    }

    this.selectedJsonFile = file;
    this.validateJsonContent(file);
  }

  private async validateJsonContent(file: File): Promise<void> {
    try {
      const text = await file.text();
      const json = JSON.parse(text);

      // Validate that the JSON contains product data
      const hasValidStructure = this.validateJsonStructure(json);

      if (!hasValidStructure) {
        this.jsonUploadError = 'JSON file does not contain valid product data. Expected structure: {enrichments: [...]} or {products: [...]} or array of products';
        this.selectedJsonFile = null;
        return;
      }

      this.jsonData = json;
      console.log('Valid JSON file loaded with product data:', json);
    } catch (error) {
      this.jsonUploadError = 'Invalid JSON format. Please check your file.';
      this.selectedJsonFile = null;
    }
  }

  /**
   * Validate that the JSON has a structure that contains product data
   */
  private validateJsonStructure(json: any): boolean {
    if (!json || typeof json !== 'object') {
      return false;
    }

    // Check for different possible structures
    if (json.enrichments && Array.isArray(json.enrichments)) {
      return json.enrichments.some((item: any) =>
        item && (item.productId || item.id) && (item.name || item.title || item.productName)
      );
    }

    if (json.products && Array.isArray(json.products)) {
      return json.products.some((item: any) =>
        item && (item.productId || item.id) && (item.name || item.title || item.productName)
      );
    }

    if (Array.isArray(json)) {
      return json.some((item: any) =>
        item && (item.productId || item.id) && (item.name || item.title || item.productName)
      );
    }

    return false;
  }

  removeJsonFile(): void {
    this.selectedJsonFile = null;
    this.jsonData = null;
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
        throw new Error('No valid products found in the JSON file');
      }

      // Create a unique catalog ID for this JSON upload
      const catalogId = `catalog_${Date.now()}`;
      
      // Add catalogId to each product
      const productsWithCatalogId = processedData.map(product => ({
        ...product,
        catalogId
      }));

      // Save products to Firestore using the new structure
      await this.firestoreService.saveProductsToCatalog(catalogId, productsWithCatalogId);

      console.log('Products saved to Firestore:', {
        productCount: processedData.length,
        products: processedData
      });

      this.isJsonUploading = false;
      this.jsonUploadSuccess = true;
      this.selectedJsonFile = null;
      this.jsonData = null;

      // Clear success message after 5 seconds
      setTimeout(() => {
        this.jsonUploadSuccess = false;
      }, 5000);

    } catch (error) {
      console.error('Error uploading JSON file:', error);
      this.isJsonUploading = false;
      this.jsonUploadError = error instanceof Error ? error.message : 'Error uploading file. Please try again.';
    }
  }

  /**
   * Process the JSON data to extract and format product information
   */
  private processProductData(jsonData: any): any[] {
    try {
      // Check if the data has the expected structure
      if (!jsonData || typeof jsonData !== 'object') {
        throw new Error('Invalid JSON structure');
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
        throw new Error('No valid product data found. Expected structure: {enrichments: [...]} or {products: [...]} or array of products');
      }

      // Filter and map products with validation
      const processedProducts = enrichments
        .filter((item: any) => {
          // Validate required fields
          return item &&
            (item.productId || item.id) &&
            (item.name || item.title || item.productName);
        })
        .map((item: any, index: number) => {
          // Normalize the data structure
          return {
            id: item.productId || item.id || `product_${index}`,
            catalogId: '', // Will be set when saving to Firestore
            name: item.name || 'Unnamed Product',
            price: this.parsePrice(item.price),
            pageIndex: item.pageIndex || index + 1,
            pageName: item.pageName || `Page ${item.pageIndex || index + 1}`,
            desc: item.desc || '',
            // Keep original data for reference
            originalData: item
          };
        });

      console.log(`Processed ${processedProducts.length} products from ${enrichments.length} items`);
      return processedProducts;

    } catch (error) {
      console.error('Error processing product data:', error);
      throw new Error(`Failed to process product data: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Parse price from various formats
   */
  private parsePrice(price: any): number | null {
    if (price === null || price === undefined || price === '') {
      return null;
    }

    if (typeof price === 'number') {
      return price;
    }

    if (typeof price === 'string') {
      // Remove currency symbols and parse
      const cleanPrice = price.replace(/[^\d.,]/g, '');
      const parsed = parseFloat(cleanPrice.replace(',', '.'));
      return isNaN(parsed) ? null : parsed;
    }

    return null;
  }

  private clearJsonMessages(): void {
    this.jsonUploadError = null;
    this.jsonUploadSuccess = false;
  }
}
