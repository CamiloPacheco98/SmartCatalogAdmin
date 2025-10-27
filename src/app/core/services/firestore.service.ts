import { Injectable, Inject } from "@angular/core";
import {
  Firestore,
  collection,
  addDoc,
  getDocs,
  doc,
  setDoc,
  getDoc,
  query,
  where,
  orderBy,
} from "firebase/firestore";
import { FIREBASE_FIRESTORE } from "./firebase.providers";
import { User, UserModel } from "../models/user.model";

export interface Product {
  id: string;
  catalogId: string;
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
  providedIn: "root",
})
export class FirestoreService {
  constructor(@Inject(FIREBASE_FIRESTORE) private firestore: Firestore) { }

  /**
   * Save products to catalog collection organized by catalogId
   * @param catalogId - The catalog ID to save products under
   * @param products - Array of products to save (must include catalogId)
   */
  async saveProductsToCatalog(
    catalogId: string,
    products: Product[]
  ): Promise<void> {
    try {
      // Create a document for this catalog with all its products
      const catalogDocRef = doc(this.firestore, "catalogs", catalogId);

      const catalogData = {
        catalogId,
        products: products.map((product) => ({
          ...product,
          catalogId, // Ensure catalogId is set
          createdAt: new Date(),
          updatedAt: new Date(),
        })),
        totalProducts: products.length,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      await setDoc(catalogDocRef, catalogData);

      console.log(`Saved ${products.length} products to catalog ${catalogId}`);
    } catch (error) {
      console.error("Error saving products to catalog:", error);
      throw error;
    }
  }

  /**
   * Save catalog metadata with download URLs
   * @param catalogId - Unique identifier for the catalog
   * @param catalogName - Name of the catalog
   * @param downloadUrls - Array of download URLs for the catalog pages
   */
  async saveCatalogMetadata(
    catalogId: string,
    catalogName: string,
    downloadUrls: string[]
  ): Promise<void> {
    try {
      const catalogsCollection = collection(this.firestore, "catalog");

      const catalogData = {
        catalogId,
        catalogName: catalogName,
        downloadUrls,
        totalPages: downloadUrls.length,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      await addDoc(catalogsCollection, catalogData);
      console.log(
        `Saved catalog metadata for ${catalogName} with ${downloadUrls.length} pages`
      );
    } catch (error) {
      console.error("Error saving catalog metadata:", error);
      throw error;
    }
  }

  /**
   * Get all products from a specific catalog
   * @param catalogId - The catalog ID to get products from
   * @returns Promise with array of products from the catalog
   */
  async getProductsByCatalog(catalogId: string): Promise<Product[]> {
    try {
      const catalogDocRef = doc(this.firestore, "catalogs", catalogId);
      const catalogDoc = await getDoc(catalogDocRef);

      if (!catalogDoc.exists()) {
        console.log(`No catalog found with ID: ${catalogId}`);
        return [];
      }

      const catalogData = catalogDoc.data();
      return catalogData?.["products"] || [];
    } catch (error) {
      console.error("Error getting products by catalog:", error);
      throw error;
    }
  }

  /**
   * Get all catalogs with their metadata
   * @returns Promise with array of catalog metadata
   */
  async getAllCatalogs(): Promise<any[]> {
    try {
      const catalogsCollection = collection(this.firestore, "catalogs");
      const querySnapshot = await getDocs(catalogsCollection);

      const catalogs: any[] = [];
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        catalogs.push({
          id: doc.id,
          catalogId: data["catalogId"],
          totalProducts: data["totalProducts"],
          createdAt: data["createdAt"],
          updatedAt: data["updatedAt"],
        });
      });

      return catalogs;
    } catch (error) {
      console.error("Error getting all catalogs:", error);
      throw error;
    }
  }

  /**
   * Get all products from all catalogs
   * @returns Promise with array of all products from all catalogs
   */
  async getAllProducts(): Promise<Product[]> {
    try {
      const catalogs = await this.getAllCatalogs();
      const allProducts: Product[] = [];

      for (const catalog of catalogs) {
        const products = await this.getProductsByCatalog(catalog.catalogId);
        allProducts.push(...products);
      }

      return allProducts;
    } catch (error) {
      console.error("Error getting all products:", error);
      throw error;
    }
  }
  async getUserInfo(uid: string): Promise<User> {
    try {
      const userDocRef = doc(this.firestore, "users", uid);
      const userDoc = await getDoc(userDocRef);

      if (!userDoc.exists()) {
        throw new Error("User not found");
      }

      const userData = userDoc.data() as User;
      return new UserModel(userData);
    } catch (error) {
      console.error("Error getting user info:", error);
      throw new Error("Error al obtener la información del usuario");
    }
  }

  async getAllUsers(adminUid: string): Promise<User[]> {
    try {
      const usersCollection = query(collection(this.firestore, "users"), where("adminUid", "==", adminUid), orderBy("updatedAt", "desc"));
      const querySnapshot = await getDocs(usersCollection);
      const users: User[] = [];
      querySnapshot.forEach((doc) => {
        const userData = doc.data();
        users.push(new UserModel(userData));
      });
      return users;
    } catch (error) {
      console.error("Error getting all users:", error);
      throw new Error("Error al obtener la lista de usuarios");
    }
  }
}
