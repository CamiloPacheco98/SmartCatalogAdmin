# 🏗️ Smart Catalog Admin - Project Architecture

## 📁 Folder Structure

```
src/app/
├── core/                    # Core Module (Singleton)
│   ├── guards/             # Route guards (AuthGuard, RoleGuard)
│   ├── interceptors/       # HTTP interceptors (AuthInterceptor, ErrorInterceptor)
│   ├── services/          # Global services (AuthService, ApiService)
│   └── models/            # TypeScript interfaces and types
├── shared/                 # Shared Module (Reusable)
│   ├── components/        # Reusable components (Button, Modal, Table)
│   ├── pipes/            # Custom pipes (DateFormat, Currency)
│   ├── directives/       # Custom directives (Highlight, Permission)
│   └── utils/            # Utilities and helpers
├── features/              # Feature Modules
│   ├── auth/             # Authentication module (Login, Register)
│   └── home/             # Home/Dashboard module
└── layout/                # Layout Components
    ├── header/           # Top navigation bar
    ├── sidebar/          # Side menu
    └── footer/           # Footer
```

## 🎯 Architectural Principles

### 1. **Separation of Concerns**
- **Core**: Singleton services used throughout the application
- **Shared**: Reusable components and utilities
- **Features**: Business-specific functionalities
- **Layout**: Application visual structure

### 2. **Lazy Loading**
- Each feature module loads only when needed
- Improves initial application performance

### 3. **Dependency Injection**
- Services registered at the appropriate level
- Core services as singletons
- Feature services with limited scope

## 🔧 Development Patterns

### Guards
```typescript
// Example: auth.guard.ts
export class AuthGuard implements CanActivate {
  // Controls access to protected routes
}
```

### Services
```typescript
// Example: auth.service.ts
@Injectable({ providedIn: 'root' })
export class AuthService {
  // Centralized authentication logic
}
```

### Components
```typescript
// Example: shared/button/button.component.ts
@Component({
  selector: 'app-button',
  // Reusable component
})
```

## 📋 Next Steps

1. ✅ Folder structure created
2. ⏳ Implement Core and Shared modules
3. ⏳ Create Layout components
4. ⏳ Develop feature modules (Auth, Home)
5. ⏳ Configure routing and guards

## 🚀 Useful Commands

```bash
# Generate a new component
ng generate component features/auth/login

# Generate a new service
ng generate service core/services/auth

# Generate a new guard
ng generate guard core/guards/auth

# Generate a new pipe
ng generate pipe shared/pipes/product-status
```
