export interface User {
  id: string;
  adminUid: string;
  createdAt: Date;
  documentNumber: string;
  email: string;
  imagePath: string;
  lastName: string;
  name: string;
  updatedAt: Date;
  verified: boolean;
  type: 'admin' | 'user';

  /**
   * Check if the user is an admin
   * @returns boolean indicating if user is admin
   */
  isAdmin(): boolean;
}

export class UserModel implements User {
  id: string;
  adminUid: string;
  createdAt: Date;
  documentNumber: string;
  email: string;
  imagePath: string;
  lastName: string;
  name: string;
  updatedAt: Date;
  verified: boolean;
  type: 'admin' | 'user';

  constructor(userData: Partial<User>) {
    this.id = userData.id || '';
    this.adminUid = userData.adminUid || '';
    this.createdAt = userData.createdAt || new Date();
    this.documentNumber = userData.documentNumber || '';
    this.email = userData.email || '';
    this.imagePath = userData.imagePath || '';
    this.lastName = userData.lastName || '';
    this.name = userData.name || '';
    this.updatedAt = userData.updatedAt || new Date();
    this.verified = userData.verified || false;
    this.type = userData.type || 'user';
  }

  isAdmin(): boolean {
    return this.type === 'admin';
  }
}
