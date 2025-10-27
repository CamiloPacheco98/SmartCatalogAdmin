import { Injectable, Inject } from '@angular/core';
import { FirebaseStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { FIREBASE_STORAGE } from './firebase.providers';

@Injectable({
  providedIn: 'root'
})
export class StorageService {
  constructor(@Inject(FIREBASE_STORAGE) private storage: FirebaseStorage) { }

  /**
   * Upload a file to Firebase Storage
   * @param file - The file to upload
   * @param path - The storage path where the file should be stored
   * @returns Promise with the download URL
   */
  async uploadFile(file: File, path: string): Promise<string> {
    const storageRef = ref(this.storage, path);
    const snapshot = await uploadBytes(storageRef, file);
    const downloadURL = await getDownloadURL(snapshot.ref);
    return downloadURL;
  }

  /**
   * Upload multiple files to Firebase Storage
   * @param files - Array of files to upload
   * @param basePath - Base path for storage
   * @returns Promise with array of download URLs
   */
  async uploadFiles(files: File[], basePath: string): Promise<string[]> {
    const uploadPromises = files.map((file, index) => {
      const path = `${basePath}/${file.name}`;
      return this.uploadFile(file, path);
    });

    return Promise.all(uploadPromises);
  }

  async downloadFile(path: string): Promise<string> {
    const storageRef = ref(this.storage, path);
    const downloadURL = await getDownloadURL(storageRef);
    return downloadURL;
  }
}
