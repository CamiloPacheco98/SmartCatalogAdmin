import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { environment } from '../../../environments/environment';

export interface PdfCoFindRequest {
  url: string;
  searchstring?: string;
  regexsearch?: boolean;
  wordmatchingmode?: string;
  casesensitive?: boolean;
  pages?: string;
  name?: string;
  inline?: boolean;
  async?: boolean;
  password?: string;
  expiration?: number;
  profiles?: string;
  httpusername?: string;
  httppassword?: string;
}

export interface PdfCoConvertRequest {
  url: string;
  pages?: string;
  name?: string;
  async?: boolean;
  inline?: boolean;
  password?: string;
}

export interface PdfCoResponse {
  error: boolean;
  status: number;
  message?: string;
  url?: string;
  urls?: string[];
  remainingCredits?: number;
}

@Injectable({
  providedIn: 'root'
})
export class PdfCoService {
  private readonly API_BASE_URL = 'https://api.pdf.co/v1';
  private readonly API_KEY = environment.pdfCo.apiKey;

  constructor(private http: HttpClient) {}

  /**
   * Find text in PDF
   */
  async findInPdf(request: PdfCoFindRequest): Promise<PdfCoResponse> {
    const headers = this.getHeaders();
    const url = `${this.API_BASE_URL}/pdf/find`;

    const response = await firstValueFrom(
      this.http.post<PdfCoResponse>(url, request, { headers })
    );

    return response;
  }

  /**
   * Convert PDF pages to images
   * @param pdfUrl - URL of the PDF file in PDF.co storage
   * @param pages - Page range (e.g., "0-2", "1,3,5", "" for all pages)
   */
  async convertPdfToImages(pdfUrl: string, pages: string = ''): Promise<PdfCoResponse> {
    const headers = this.getHeaders();
    const url = `${this.API_BASE_URL}/pdf/convert/to/jpg`;

    const request = {
      url: pdfUrl,
      pages: pages, // Empty string = all pages, "0-2" = first 3 pages, etc.
      async: false,
      inline: true
    };

    const response = await firstValueFrom(
      this.http.post<PdfCoResponse>(url, request, { headers })
    );

    return response;
  }

  /**
   * Upload file to PDF.co temporary storage
   */
  async uploadFile(file: File): Promise<string> {
    const formData = new FormData();
    formData.append('file', file);

    const headers = new HttpHeaders({
      'x-api-key': this.API_KEY
      // NO incluir Content-Type, Angular lo setea automáticamente para FormData
    });

    const url = `${this.API_BASE_URL}/file/upload`;

    const response = await firstValueFrom(
      this.http.post<{ 
        error: boolean; 
        url: string;
        message?: string;
      }>(
        url,
        formData,
        { headers }
      )
    );

    if (response.error) {
      throw new Error(response.message || 'Failed to upload file');
    }

    return response.url;
  }

  /**
   * Get HTTP headers with API key
   */
  private getHeaders(): HttpHeaders {
    return new HttpHeaders({
      'Content-Type': 'application/json',
      'x-api-key': this.API_KEY
    });
  }
}

