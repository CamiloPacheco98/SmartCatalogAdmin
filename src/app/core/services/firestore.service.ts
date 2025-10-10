import { Injectable, Inject } from '@angular/core';
import { Firestore, collection, addDoc, getDocs, query, where, orderBy } from 'firebase/firestore';
import { FIREBASE_FIRESTORE } from './firebase.providers';

export interface Product {
  id: string;
  name: string;
  price: number | null;
  pageIndex: number;
  pageName: string;
  originalData: any;
  createdAt?: Date;
  updatedAt?: Date;
  desc?: string;
}

@Injectable({
  providedIn: 'root'
})
export class FirestoreService {
  constructor(@Inject(FIREBASE_FIRESTORE) private firestore: Firestore) {}

  /**
   * Save products to catalog collection with page grouping
   * @param products - Array of products to save (must include pageId)
   */
  async saveProductsToCatalog(products: Product[]): Promise<void> {
    try {
      const productsCollection = collection(this.firestore, 'catalog');
      
      // Save each product
      for (const product of products) {
        const productData = {
          ...product,
          createdAt: new Date(),
          updatedAt: new Date()
        };
        
        await addDoc(productsCollection, productData);
      }

      console.log(`Saved ${products.length} products to catalog`);
    } catch (error) {
      console.error('Error saving products to catalog:', error);
      throw error;
    }
  }

  /**
   * Get all products from catalog
   * @returns Promise with array of all products
   */
  async getAllProducts(): Promise<Product[]> {
    try {
      const productsCollection = collection(this.firestore, 'catalog');
      const querySnapshot = await getDocs(productsCollection);
      
      const products: Product[] = [];
      querySnapshot.forEach((doc) => {
        products.push({ id: doc.id, ...doc.data() } as Product);
      });

      return products;
    } catch (error) {
      console.error('Error getting all products:', error);
      throw error;
    }
  }

}
