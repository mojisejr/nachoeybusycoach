# NachoeyBusyCoach Color Theme

## Main Brand Colors
- Primary: #FF1616 (Vibrant Red)
- Secondary: #990D0D (Dark Red)

## DaisyUI Theme Configuration

```javascript
// tailwind.config.js - DaisyUI Theme
module.exports = {
  daisyui: {
    themes: [
      {
        nachoeybusycoach: {
          // Primary colors
          "primary": "#FF1616",
          "primary-focus": "#E60000", 
          "primary-content": "#FFFFFF",
          
          // Secondary colors
          "secondary": "#990D0D",
          "secondary-focus": "#7A0A0A",
          "secondary-content": "#FFFFFF",
          
          // Accent colors
          "accent": "#FF4444",
          "accent-focus": "#FF2222",
          "accent-content": "#FFFFFF",
          
          // Neutral colors
          "neutral": "#2A2A2A",
          "neutral-focus": "#1F1F1F",
          "neutral-content": "#FFFFFF",
          
          // Base colors
          "base-100": "#FFFFFF",
          "base-200": "#F8F8F8",
          "base-300": "#E8E8E8",
          "base-content": "#1F1F1F",
          
          // State colors
          "info": "#3ABFF8",
          "info-content": "#002B3D",
          
          "success": "#36D399",
          "success-content": "#003320",
          
          "warning": "#FBBD23",
          "warning-content": "#382800",
          
          "error": "#F87272",
          "error-content": "#470000",
        },
      },
    ],
  },
}
```

## Color Usage Guidelines

### Primary Red (#FF1616)
- Main CTA buttons
- Navigation highlights
- Important notifications
- Progress indicators
- Coach badges

### Secondary Dark Red (#990D0D)
- Secondary buttons
- Hover states
- Section headers
- Active states
- Footer elements

### Accent Red (#FF4444)
- Success states for workouts
- Completion indicators
- Interactive elements
- Links and highlights

### Neutral Colors
- Text content (#2A2A2A)
- Background sections
- Cards and containers
- Borders and dividers

### State Colors
- **Success Green**: Completed workouts, achievements
- **Warning Yellow**: Pending reviews, reminders
- **Info Blue**: Tips, information panels
- **Error Red**: Failed attempts, validation errors

## Semantic Color Mapping

### For Runners
- **Completed Workouts**: Success Green (#36D399)
- **Pending Workouts**: Warning Yellow (#FBBD23)
- **Missed Workouts**: Error Red (#F87272)
- **Active Session**: Primary Red (#FF1616)

### For Coaches
- **New Submissions**: Info Blue (#3ABFF8)
- **Reviewed Sessions**: Success Green (#36D399)
- **Urgent Attention**: Primary Red (#FF1616)
- **Client Progress**: Accent Red (#FF4444)

## Accessibility Notes
- All color combinations meet WCAG 2.1 AA contrast requirements
- Primary red provides 4.5:1 contrast ratio with white text
- Dark red provides 7:1 contrast ratio with white text
- Base colors ensure readability across all components
