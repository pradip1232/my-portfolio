# CSS Architecture Documentation

This directory contains a comprehensive CSS-based styling system for the portfolio project. The architecture follows modern CSS best practices with a modular, maintainable structure using CSS custom properties and utility classes.

## 📁 File Structure

```
styles/
├── variables.css      # CSS custom properties & design tokens
├── mixins.css        # Utility classes & reusable patterns
├── components.css    # Component-specific styles
├── globals.css       # Global base styles & resets
├── index.css         # Main entry point
└── README.md         # This documentation
```

## 🎨 Architecture Overview

### 1. **variables.css**
- **CSS Custom Properties**: Complete design token system
- **Color Palette**: Primary, secondary, accent, semantic colors
- **Typography Scale**: Font families, sizes, weights, line heights
- **Spacing System**: Consistent spacing scale (4px base)
- **Component Tokens**: Shadows, borders, transitions, z-index
- **Theme Support**: Light/dark mode variables

### 2. **mixins.css**
- **Layout Utilities**: Flexbox, grid, container classes
- **Typography Classes**: Headings, body text, gradients
- **Component Classes**: Buttons, cards, forms, inputs
- **Animation Classes**: Fade, slide, scale, bounce effects
- **Utility Classes**: Truncation, aspect ratios, glass effects
- **Responsive Utilities**: Mobile-first design patterns

### 3. **globals.css**
- **CSS Reset**: Modern CSS reset and normalization
- **Base Typography**: Headings, paragraphs, links, code
- **Form Elements**: Inputs, buttons, selects
- **Media Elements**: Images, videos, SVGs
- **Accessibility**: Focus styles, reduced motion, high contrast
- **Print Styles**: Optimized for printing
- **Utility Classes**: Spacing, text, display, position utilities

### 4. **components.css**
- **Navigation**: Header, menu, logo styles
- **Hero Section**: Landing page hero components
- **Project Cards**: Portfolio project display
- **Contact Form**: Form styling and validation states
- **Analytics**: Dashboard and metric components
- **Footer**: Site footer styling
- **Responsive**: Mobile-first responsive design

### 5. **index.css**
- **Main Entry Point**: Imports all modules in correct order
- **Custom Overrides**: Project-specific customizations

## 🚀 Usage Examples

### Using SCSS Mixins

```scss
// Button with primary styling
.my-button {
  @include btn-primary;
}

// Custom container with specific max-width
.my-container {
  @include container(900px);
}

// Responsive grid layout
.my-grid {
  @include responsive-grid(250px);
}

// Typography with gradient
.my-heading {
  @include heading($text-3xl, $font-bold);
  @include text-gradient($primary, $secondary);
}
```

### Using CSS Custom Properties

```scss
.my-component {
  background: var(--color-primary);
  padding: var(--space-4);
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-md);
  transition: var(--transition-fast);
}
```

### Using SCSS Variables

```scss
.my-element {
  color: $primary;
  font-size: $text-lg;
  margin: $space-6;
  border-radius: $radius-md;
}
```

### Responsive Design

```scss
.my-responsive-component {
  padding: $space-4;
  
  @include tablet-up {
    padding: $space-6;
  }
  
  @include desktop-up {
    padding: $space-8;
  }
}
```

## 🎯 Key Features

### ✅ **Modern SCSS Architecture**
- Modular file structure with clear separation of concerns
- Comprehensive mixin library for rapid development
- CSS custom properties for runtime theming
- SCSS variables for compile-time optimizations

### ✅ **Design System Integration**
- Complete design token system
- Consistent spacing and typography scales
- Semantic color palette with theme support
- Component-based styling approach

### ✅ **Developer Experience**
- Intuitive mixin names and parameters
- Comprehensive utility class library
- Mobile-first responsive design patterns
- Extensive documentation and examples

### ✅ **Performance Optimized**
- Efficient CSS output with minimal redundancy
- Tree-shakeable utility classes
- Optimized for production builds
- Modern CSS features with fallbacks

### ✅ **Accessibility First**
- WCAG compliant focus styles
- Reduced motion support
- High contrast mode compatibility
- Semantic HTML structure support

## 🔧 Customization

### Adding New Colors

```scss
// In _variables.scss
:root {
  --color-brand: #ff6b6b;
  --color-brand-light: #ff8e8e;
  --color-brand-dark: #e55555;
}

// SCSS variable
$brand: var(--color-brand);
```

### Creating Custom Mixins

```scss
// In _mixins.scss
@mixin my-custom-button($bg-color: $primary, $text-color: $white) {
  @include btn-base;
  background: $bg-color;
  color: $text-color;
  
  &:hover {
    background: darken($bg-color, 10%);
  }
}
```

### Extending Components

```scss
// In _components.scss or your component file
.my-special-card {
  @include card-base;
  @include card-hover;
  
  // Custom additions
  border: 2px solid $accent;
  background: linear-gradient(135deg, $primary-50, $accent-50);
}
```

## 📱 Responsive Breakpoints

```scss
$breakpoint-sm: 640px;   // Mobile landscape
$breakpoint-md: 768px;   // Tablet portrait
$breakpoint-lg: 1024px;  // Tablet landscape / Small desktop
$breakpoint-xl: 1280px;  // Desktop
$breakpoint-2xl: 1536px; // Large desktop
```

## 🎨 Color System

### Primary Palette
- **Primary**: Blue scale for main brand elements
- **Secondary**: Purple scale for accents and highlights
- **Accent**: Orange scale for call-to-action elements

### Semantic Colors
- **Success**: Green for positive states
- **Warning**: Yellow for caution states
- **Error**: Red for error states
- **Info**: Blue for informational states

### Neutral Palette
- **Gray Scale**: 50-900 for text, borders, backgrounds
- **Theme Colors**: Background, foreground, muted variants

## 🔄 Migration from CSS

The SCSS system is fully backward compatible with the previous CSS system. All existing utility classes and component styles are preserved while adding powerful SCSS features like mixins, variables, and nesting.

## 🛠 Build Integration

The SCSS files are automatically compiled by Next.js with the installed `sass` package. No additional configuration is required.

```bash
# SASS is already installed
npm install sass --save-dev
```

## 📚 Best Practices

1. **Use mixins for reusable patterns**
2. **Leverage CSS custom properties for theming**
3. **Follow the mobile-first responsive approach**
4. **Keep component styles modular and focused**
5. **Use semantic class names and BEM methodology**
6. **Prefer composition over inheritance**
7. **Document custom mixins and variables**

This SCSS architecture provides a solid foundation for scalable, maintainable styling while preserving the flexibility to customize and extend as needed.