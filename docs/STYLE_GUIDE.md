# OutfitSave Style Guide

## 🎨 Design System Overview

This document showcases all the design components, colors, and styles used throughout the OutfitSave application.

## 🎯 Brand Colors

### Primary Colors
- **Royal Blue**: `#4F46E5` - Primary brand color
- **Royal Light**: `#6366F1` - Hover states and accents
- **Royal Dark**: `#3730A3` - Active states and emphasis

### Background Colors
- **Background**: `#FFFFFF` - Main background
- **Background Secondary**: `#F9FAFB` - Subtle backgrounds
- **Background Tertiary**: `#F3F4F6` - Cards and sections

### Text Colors
- **Text Primary**: `#111827` - Main text
- **Text Secondary**: `#6B7280` - Secondary text
- **Text Muted**: `#9CA3AF` - Disabled or subtle text

### Status Colors
- **Success**: `#10B981` - Positive actions
- **Warning**: `#F59E0B` - Warnings and alerts
- **Error**: `#EF4444` - Errors and destructive actions
- **Info**: `#3B82F6` - Information and links

## 🔤 Typography

### Headings
- **H1**: `text-3xl font-bold` - Page titles
- **H2**: `text-2xl font-semibold` - Section headers
- **H3**: `text-xl font-semibold` - Subsection headers
- **H4**: `text-lg font-semibold` - Card titles

### Body Text
- **Large**: `text-lg` - Important content
- **Base**: `text-base` - Regular content
- **Small**: `text-sm` - Secondary information
- **Extra Small**: `text-xs` - Captions and metadata

### Font Weights
- **Bold**: `font-bold` - Headings and emphasis
- **Semibold**: `font-semibold` - Subheadings
- **Medium**: `font-medium` - Important text
- **Normal**: `font-normal` - Regular text

## 🧩 Components

### Buttons

#### Primary Button
```html
<Button className="bg-gradient-royal hover:bg-gradient-royal-light text-white transition-all duration-300 transform hover:scale-105 shadow-md hover:shadow-lg">
  Primary Action
</Button>
```

#### Secondary Button
```html
<Button variant="outline" className="border-royal/30 text-royal hover:bg-royal hover:text-white transition-all duration-300 transform hover:scale-105 shadow-sm hover:shadow-md">
  Secondary Action
</Button>
```

#### Destructive Button
```html
<Button variant="destructive" className="bg-red-600 hover:bg-red-700 text-white transition-all duration-300">
  Delete
</Button>
```

### Cards

#### Outfit Card
```html
<div className="group relative overflow-hidden rounded-lg shadow-md hover:shadow-xl transition-all duration-500 transform hover:-translate-y-1">
  <div className="aspect-square relative">
    <Image src={imageUrl} alt={name} fill className="object-cover transition-transform duration-500 group-hover:scale-110" />
  </div>
  <div className="p-4 bg-white">
    <h3 className="font-semibold text-lg mb-2">{name}</h3>
    <p className="text-gray-600 text-sm mb-3">{description}</p>
    <div className="flex justify-between items-center">
      <div className="flex gap-1">
        {tags.map(tag => <span className="text-xs bg-gray-100 px-2 py-1 rounded">{tag}</span>)}
      </div>
    </div>
  </div>
</div>
```

### Forms

#### Input Field
```html
<input 
  type="text" 
  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-royal focus:border-transparent"
  placeholder="Enter text..."
/>
```

#### Textarea
```html
<textarea 
  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-royal focus:border-transparent resize-vertical"
  rows={4}
  placeholder="Enter description..."
/>
```

#### Select Dropdown
```html
<select className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-royal focus:border-transparent">
  <option value="">Select an option</option>
  <option value="option1">Option 1</option>
  <option value="option2">Option 2</option>
</select>
```

### Navigation

#### Header Navigation
```html
<nav className="flex justify-between items-center">
  <Logo variant="header" />
  <div className="flex items-center space-x-4">
    <Button asChild variant="outline">Browse</Button>
    <Button asChild variant="outline">My Outfits</Button>
    <Button>Sign In</Button>
  </div>
</nav>
```

### Modals & Dialogs

#### Confirmation Dialog
```html
<div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
  <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
    <h3 className="text-lg font-semibold mb-2">Confirm Action</h3>
    <p className="text-gray-600 mb-4">Are you sure you want to proceed?</p>
    <div className="flex justify-end space-x-3">
      <Button variant="outline">Cancel</Button>
      <Button variant="destructive">Confirm</Button>
    </div>
  </div>
</div>
```

## 📱 Responsive Design

### Breakpoints
- **Mobile**: `< 768px` - Single column layout
- **Tablet**: `768px - 1024px` - Two column layout
- **Desktop**: `> 1024px` - Multi-column layout

### Grid System
```html
<!-- Mobile: Single column -->
<div className="grid grid-cols-1 gap-4">
  <!-- Content -->
</div>

<!-- Tablet: Two columns -->
<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
  <!-- Content -->
</div>

<!-- Desktop: Three columns -->
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
  <!-- Content -->
</div>
```

## 🎭 Interactive States

### Hover Effects
- **Scale**: `hover:scale-105` - Subtle growth on hover
- **Shadow**: `hover:shadow-lg` - Enhanced shadow on hover
- **Color**: `hover:bg-royal` - Color change on hover

### Focus States
- **Ring**: `focus:ring-2 focus:ring-royal` - Blue ring on focus
- **Outline**: `focus:outline-none` - Remove default outline

### Active States
- **Scale**: `active:scale-95` - Slight shrink on click
- **Color**: `active:bg-royal-dark` - Darker color on active

## 🎨 Gradients

### Royal Gradient
```css
.bg-gradient-royal {
  background: linear-gradient(135deg, #4F46E5 0%, #6366F1 100%);
}
```

### Royal Light Gradient
```css
.bg-gradient-royal-light {
  background: linear-gradient(135deg, #6366F1 0%, #818CF8 100%);
}
```

## 📐 Spacing

### Padding
- **XS**: `p-1` (4px)
- **SM**: `p-2` (8px)
- **MD**: `p-4` (16px)
- **LG**: `p-6` (24px)
- **XL**: `p-8` (32px)

### Margin
- **XS**: `m-1` (4px)
- **SM**: `m-2` (8px)
- **MD**: `m-4` (16px)
- **LG**: `m-6` (24px)
- **XL**: `m-8` (32px)

### Gap
- **XS**: `gap-1` (4px)
- **SM**: `gap-2` (8px)
- **MD**: `gap-4` (16px)
- **LG**: `gap-6` (24px)
- **XL**: `gap-8` (32px)

## 🔄 Transitions

### Duration
- **Fast**: `duration-150` (150ms)
- **Normal**: `duration-300` (300ms)
- **Slow**: `duration-500` (500ms)

### Easing
- **Default**: `ease-in-out`
- **Smooth**: `ease-out`

## 🎯 Accessibility

### Focus Indicators
- All interactive elements have visible focus states
- Use `focus:ring-2 focus:ring-royal` for consistent focus styling

### Color Contrast
- Text meets WCAG AA contrast requirements
- Use semantic colors for status indicators

### Screen Readers
- Proper ARIA labels on interactive elements
- Semantic HTML structure
- Alt text on all images

## 📋 Usage Guidelines

### Do's
- ✅ Use consistent spacing and typography
- ✅ Apply hover and focus states to interactive elements
- ✅ Use semantic colors for status indicators
- ✅ Maintain responsive design principles
- ✅ Follow accessibility guidelines

### Don'ts
- ❌ Don't use hardcoded colors - use design system colors
- ❌ Don't skip hover and focus states
- ❌ Don't use low contrast text
- ❌ Don't ignore mobile responsiveness
- ❌ Don't forget accessibility considerations

## 🔧 Custom CSS Classes

### Utility Classes
```css
/* Royal color utilities */
.text-royal { color: #4F46E5; }
.bg-royal { background-color: #4F46E5; }
.border-royal { border-color: #4F46E5; }

/* Gradient utilities */
.bg-gradient-royal { background: linear-gradient(135deg, #4F46E5 0%, #6366F1 100%); }
.bg-gradient-royal-light { background: linear-gradient(135deg, #6366F1 0%, #818CF8 100%); }

/* Animation utilities */
.hover-lift { transition: transform 0.3s ease; }
.hover-lift:hover { transform: translateY(-2px); }
```

This style guide ensures consistency across the OutfitSave application and provides a reference for developers working on the project. 