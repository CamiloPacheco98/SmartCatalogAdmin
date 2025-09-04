# Smart Catalog Admin - Design System

## Overview
This design system provides a consistent visual language and component library for the Smart Catalog Admin application. It's built using CSS custom properties (variables) and the Montserrat font family.

## Color Palette

### Primary Colors
```css
--primary-color: #E87722        /* Main orange */
--primary-dark-color: #C85A1B   /* Darker orange for hover states */
--secondary-color: #F5EEE6      /* Light cream */
--background-color: #FAFAFA     /* Off-white background */
```

### Semantic Colors
```css
--text-color: #333333           /* Main text color */
--error-color: #D9534F          /* Error states */
--success-color: #57BA98        /* Success states */
--hint-color: #BDBDBD           /* Placeholder/hint text */
```

### UI Colors
```css
--white: #FFFFFF
--light-gray: #F8F9FA
--medium-gray: #6C757D
--dark-gray: #495057
--border-color: #DEE2E6
--shadow-color: rgba(0, 0, 0, 0.1)
```

## Typography

### Font Family
The system uses **Montserrat** as the primary font with fallbacks:
```css
--font-family: 'Montserrat', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
```

### Font Weights
```css
--font-light: 300
--font-regular: 400
--font-medium: 500
--font-semibold: 600
--font-bold: 700
--font-extrabold: 800
```

### Typography Scale
- **H1**: 2.25rem, font-weight: 700 (bold)
- **H2**: 1.875rem, font-weight: 600 (semibold)
- **H3**: 1.5rem, font-weight: 600 (semibold)
- **H4**: 1.25rem, font-weight: 500 (medium)
- **H5**: 1.125rem, font-weight: 500 (medium)
- **H6**: 1rem, font-weight: 500 (medium)
- **Body**: 14px, font-weight: 400 (regular)

## Spacing System

```css
--spacing-xs: 0.25rem    /* 4px */
--spacing-sm: 0.5rem     /* 8px */
--spacing-md: 1rem       /* 16px */
--spacing-lg: 1.5rem     /* 24px */
--spacing-xl: 2rem       /* 32px */
--spacing-xxl: 3rem      /* 48px */
```

## Border Radius

```css
--radius-sm: 0.25rem     /* 4px */
--radius-md: 0.5rem      /* 8px */
--radius-lg: 0.75rem     /* 12px */
--radius-xl: 1rem        /* 16px */
```

## Shadows

```css
--shadow-sm: 0 1px 2px 0 var(--shadow-color)
--shadow-md: 0 4px 6px -1px var(--shadow-color)
--shadow-lg: 0 10px 15px -3px var(--shadow-color)
--shadow-xl: 0 20px 25px -5px var(--shadow-color)
```

## Utility Classes

### Spacing
```css
.m-xs, .m-sm, .m-md, .m-lg, .m-xl     /* Margin */
.mt-xs, .mt-sm, .mt-md, .mt-lg, .mt-xl /* Margin top */
.mb-xs, .mb-sm, .mb-md, .mb-lg, .mb-xl /* Margin bottom */
.p-xs, .p-sm, .p-md, .p-lg, .p-xl     /* Padding */
```

### Colors
```css
.text-primary, .text-secondary, .text-success, .text-error, .text-hint
.bg-primary, .bg-secondary, .bg-white, .bg-light
```

### Typography
```css
.text-center, .text-left, .text-right
.font-light, .font-regular, .font-medium, .font-semibold, .font-bold
```

## Components

### Buttons
```css
.btn                 /* Base button styles */
.btn-primary         /* Primary orange button */
.btn-secondary       /* Secondary cream button */
.btn-outline         /* Outlined button */
```

### Form Inputs
```css
.form-input          /* Base input styles */
.form-input.error    /* Error state */
```

### Cards
```css
.card                /* Base card container */
.card-header         /* Card header section */
.card-title          /* Card title styling */
```

## Usage Examples

### Using Colors
```css
.my-component {
  background-color: var(--primary-color);
  color: var(--white);
  border: 1px solid var(--border-color);
}
```

### Using Spacing
```css
.my-element {
  margin: var(--spacing-md);
  padding: var(--spacing-lg);
  border-radius: var(--radius-md);
}
```

### Using Typography
```css
.my-text {
  font-family: var(--font-family);
  font-weight: var(--font-semibold);
  color: var(--text-color);
}
```

### Button Example
```html
<button class="btn btn-primary">Primary Action</button>
<button class="btn btn-secondary">Secondary Action</button>
<button class="btn btn-outline">Outline Action</button>
```

### Form Example
```html
<div class="form-group">
  <label for="email">Email Address</label>
  <input type="email" id="email" class="form-input" placeholder="Enter your email">
</div>
```

### Card Example
```html
<div class="card">
  <div class="card-header">
    <h3 class="card-title">Card Title</h3>
  </div>
  <p>Card content goes here...</p>
</div>
```

## Responsive Design

The design system includes responsive utilities and breakpoints:
- Mobile: max-width: 480px
- Tablet: max-width: 768px
- Desktop: 1200px max-width containers

## Accessibility

- All interactive elements have proper focus states
- Color contrast ratios meet WCAG guidelines
- Font sizes are readable and scalable
- Semantic HTML structure is maintained

## Implementation Notes

1. All CSS custom properties are defined in `src/styles.css`
2. Components should use the design system variables instead of hardcoded values
3. The Montserrat font is loaded from Google Fonts in `src/index.html`
4. Utility classes are available globally for quick styling
5. The color palette is based on the provided Flutter/Dart color specifications

## Browser Support

This design system uses modern CSS features:
- CSS Custom Properties (CSS Variables)
- Flexbox and Grid
- Modern color functions
- Supports all modern browsers (Chrome, Firefox, Safari, Edge)
