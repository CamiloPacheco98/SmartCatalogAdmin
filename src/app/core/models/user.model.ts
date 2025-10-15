export interface User {
  cc: string;
  created_at: Date;
  email: string;
  image: string;
  is_active: boolean;
  last_name: string;
  name: string;
  phone: string;
  type: string;
  uid: string;
  updated_at: Date;
  
  /**
   * Check if the user is an admin
   * @returns boolean indicating if user is admin
   */
  isAdmin(): boolean;
}

export class UserModel implements User {
  cc: string;
  created_at: Date;
  email: string;
  image: string;
  is_active: boolean;
  last_name: string;
  name: string;
  phone: string;
  type: string;
  uid: string;
  updated_at: Date;

  constructor(userData: Partial<User>) {
    this.cc = userData.cc || '';
    this.created_at = userData.created_at || new Date();
    this.email = userData.email || '';
    this.image = userData.image || '';
    this.is_active = userData.is_active || false;
    this.last_name = userData.last_name || '';
    this.name = userData.name || '';
    this.phone = userData.phone || '';
    this.type = userData.type || '';
    this.uid = userData.uid || '';
    this.updated_at = userData.updated_at || new Date();
  }

  /**
   * Check if the user is an admin
   * @returns boolean indicating if user is admin
   */
  isAdmin(): boolean {
    return this.type === 'admin';
  }
}
