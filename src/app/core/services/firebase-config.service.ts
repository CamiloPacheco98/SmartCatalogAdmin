import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';

export interface FirebaseConfig {
  apiKey: string;
  authDomain: string;
  projectId: string;
  storageBucket: string;
}

@Injectable({
  providedIn: 'root'
})
export class FirebaseConfigService {
  
  /**
   * Get simple Firebase configuration
   */
  getConfig(): FirebaseConfig {
    return environment.firebase;
  }
}
