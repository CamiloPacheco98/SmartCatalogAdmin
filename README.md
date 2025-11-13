# Smart Catalog Admin

A comprehensive admin dashboard application for managing product catalogs, orders, and users. This application provides an intuitive interface for uploading PDF catalogs, managing product data, processing orders, and administering user accounts.

## 📋 Project Description

Smart Catalog Admin is a feature-rich administrative platform designed to streamline catalog and order management operations. The application enables administrators to:

- **Catalog Management**: Upload PDF catalogs that are automatically converted to images and stored in the cloud
- **Product Management**: Import and manage product data via JSON files with automatic validation and processing
- **Order Management**: View, track, and manage customer orders with detailed status tracking
- **User Management**: Administer user accounts and send sign-in links to users
- **Multi-language Support**: Built-in internationalization supporting English and Spanish

The application uses Firebase as the backend infrastructure, providing secure authentication, real-time database capabilities, and cloud storage for catalog images.

## 🛠️ Technologies Used

### Frontend Framework
- **Angular 20.2.0** - Modern web framework for building single-page applications
- **TypeScript 5.9.2** - Typed superset of JavaScript
- **RxJS 7.8.0** - Reactive programming library

### Backend & Services
- **Firebase 12.2.1** - Backend-as-a-Service platform providing:
  - **Firebase Authentication** - User authentication and authorization
  - **Cloud Firestore** - NoSQL document database for storing products, orders, and user data
  - **Firebase Storage** - Cloud storage for catalog images and files

### Third-Party Services
- **PDF.co API** - PDF to image conversion service for processing catalog pages
- **ngx-translate 17.0.0** - Internationalization (i18n) library for multi-language support

### Development Tools
- **Angular CLI 20.2.1** - Command-line interface for Angular development
- **Karma & Jasmine** - Testing framework and test runner
- **Prettier** - Code formatter for consistent code style

## 🏗️ Architecture

The application follows a **feature-based architecture** with clear separation of concerns and modular design principles.

### Folder Structure

```
src/app/
├── core/                    # Core Module (Singleton Services)
│   ├── guards/             # Route guards (AuthGuard)
│   ├── interceptors/       # HTTP interceptors
│   ├── services/          # Global services
│   │   ├── auth.service.ts
│   │   ├── firestore.service.ts
│   │   ├── storage.service.ts
│   │   └── pdf-co.service.ts
│   └── models/            # TypeScript interfaces and types
│       ├── user.model.ts
│       ├── product.model.ts
│       └── order.model.ts
├── shared/                 # Shared Module (Reusable Components)
│   ├── components/        # Reusable UI components
│   ├── pipes/            # Custom pipes
│   ├── directives/       # Custom directives
│   └── utils/           # Utility functions
├── features/              # Feature Modules (Lazy Loaded)
│   ├── auth/             # Authentication module
│   │   └── components/
│   │       └── login/
│   └── dashboard/        # Dashboard module
│       ├── components/
│       │   ├── home/     # Catalog & product upload
│       │   ├── orders/   # Order management
│       │   └── users/    # User management
│       └── dashboard-layout.component.ts
└── layout/                # Layout Components
    ├── header/           # Top navigation bar
    ├── sidebar/          # Side menu navigation
    └── footer/           # Footer component
```

### Architectural Principles

1. **Separation of Concerns**
   - **Core**: Singleton services used throughout the application (Auth, Firestore, Storage)
   - **Shared**: Reusable components, pipes, and utilities
   - **Features**: Business-specific functionalities organized by domain
   - **Layout**: Application visual structure components

2. **Lazy Loading**
   - Feature modules are lazy-loaded to improve initial application performance
   - Routes are configured with lazy loading for optimal bundle sizes

3. **Dependency Injection**
   - Services registered at appropriate levels (root, feature, component)
   - Core services provided as singletons
   - Feature services with limited scope when needed

4. **Type Safety**
   - Strong TypeScript typing throughout the application
   - Model classes and interfaces for data structures
   - Type-safe service methods and component properties

### Key Features

- **Authentication & Authorization**: Firebase Authentication with route guards
- **Real-time Data**: Firestore integration for real-time data synchronization
- **File Processing**: PDF conversion and image processing via PDF.co API
- **Internationalization**: Multi-language support with ngx-translate
- **Responsive Design**: Modern UI with responsive layouts

For more detailed architecture information, see [ARCHITECTURE.md](./ARCHITECTURE.md).

## 🚀 Getting Started

### Prerequisites

- Node.js (v18 or higher)
- npm or yarn
- Firebase project with Authentication, Firestore, and Storage enabled

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd SmartCatalogAdmin
```

2. Install dependencies:
```bash
npm install
```

3. Configure Firebase:
   - Follow the instructions in [FIREBASE_SETUP.md](./FIREBASE_SETUP.md)
   - Update `src/environments/environment.ts` with your Firebase configuration

4. Start the development server:
```bash
ng serve
```

5. Open your browser and navigate to `http://localhost:4200/`

The application will automatically reload whenever you modify any of the source files.

## 📝 Development

### Code Scaffolding

Angular CLI includes powerful code scaffolding tools. To generate a new component, run:

```bash
ng generate component component-name
```

For a complete list of available schematics (such as `components`, `directives`, or `pipes`), run:

```bash
ng generate --help
```

### Building

To build the project for production:

```bash
ng build
```

This will compile your project and store the build artifacts in the `dist/` directory. The production build optimizes your application for performance and speed.

### Testing

To execute unit tests with the [Karma](https://karma-runner.github.io) test runner:

```bash
ng test
```

For end-to-end (e2e) testing:

```bash
ng e2e
```

## 📚 Additional Resources

- [Angular Documentation](https://angular.dev)
- [Firebase Documentation](https://firebase.google.com/docs)
- [Angular CLI Overview](https://angular.dev/tools/cli)
- [ARCHITECTURE.md](./ARCHITECTURE.md) - Detailed architecture documentation
- [FIREBASE_SETUP.md](./FIREBASE_SETUP.md) - Firebase configuration guide
- [DESIGN_SYSTEM.md](./DESIGN_SYSTEM.md) - Design system documentation
