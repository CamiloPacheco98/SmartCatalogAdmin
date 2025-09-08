# Simple Firebase Auth Setup

## Steps to configure Firebase:

### 1. Create project in Firebase Console
1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Create a new project
3. Enable Authentication > Sign-in method > Email/Password

### 2. Get configuration
1. Go to Project Settings > General
2. In "Your apps", select Web app
3. Copy the configuration values

### 3. Configure in your project
1. Open `src/environments/environment.ts`
2. Replace these values with yours:
   ```typescript
   firebase: {
     apiKey: "YOUR_API_KEY_HERE",           // Replace
     authDomain: "your-project.firebaseapp.com", // Replace  
     projectId: "your-project-id"          // Replace
   }
   ```

**Just one file!** You don't need separate files if you only have one environment.

### 4. Use authentication
The login component is already configured to use Firebase Auth.

### 5. Available functions
- `authService.login(email, password)` - Sign in
- `authService.logout()` - Sign out
- `authService.isAuthenticated()` - Check if authenticated
- `authService.getCurrentUser()` - Get current user synchronously

### 6. Security
- ✅ Keys are in environment files
- ✅ Not uploaded to repository (they're in .gitignore)
- ✅ Error handling with user-friendly messages
- ✅ Guard to protect routes

## Example usage in components:
```typescript
constructor(private authService: AuthService) {}

async login() {
  try {
    await this.authService.login('user@example.com', 'password');
    // User logged in successfully
  } catch (error) {
    console.error(error.message);
  }
}

// Check current user
const user = this.authService.getCurrentUser();
if (user) {
  console.log(`Hello ${user.email}`);
}
```

## Authentication Flow
1. User enters credentials in login form
2. `AuthService.login()` calls Firebase Auth
3. Firebase validates credentials
4. On success: `onAuthStateChanged` updates current user
5. On error: User-friendly error message is displayed
6. Components can check auth status with `getCurrentUser()` or `isAuthenticated()`
