# Finance Hub - Personal Finance Dashboard

A modern, responsive, and interactive personal finance dashboard built with React, TypeScript, and Tailwind CSS. This project demonstrates a clean architectural approach to state management, component design, and user experience.

## 🎯 Project Overview

Finance Hub is a comprehensive dashboard application that empowers users to track and understand their financial activity. It provides an intuitive interface for viewing financial summaries, exploring transactions, analyzing spending patterns, and gaining actionable insights.

## ✨ Core Features

### 1. Dashboard Overview
- **Summary Cards**: Display of Total Balance, Total Income, and Total Expenses with trend indicators
- **Balance Trend Chart**: Time-series visualization showing balance history over months
- **Expense Breakdown**: Categorical pie chart displaying spending distribution across categories
- **Budget Overview**: Quick view of budget status with warning indicators
- Real-time calculations and updates

### 2. Transactions Management
- **Advanced List View**: Comprehensive transaction table with all relevant details
- **Filtering System**:
  - Filter by transaction type (All, Income, Expenses)
  - Filter by multiple categories
  - Filter by date range with date picker
  - Filter by custom tags
  - Quick clear filters button
- **Sorting**: Sort by date or amount in ascending/descending order
- **Search & Pagination**: Search functionality with pagination controls (10 items per page)
- **Admin Actions**: Add, edit, and delete transactions (admin role only)
- **Bulk Operations**: Select and delete multiple transactions
- **Export**: CSV export functionality for data portability

### 3. Role-Based Access Control (Frontend)
- **Viewer Role**: Read-only access to all data
- **Admin Role**: Full CRUD operations on transactions and budgets
- **Easy Toggle**: Simple switch in sidebar to toggle between roles for demonstration
- Role-based UI adjustments (add/edit/delete buttons only for admins)

### 4. Budget Tracking
- **Budget Management**: Create, view, and manage spending budgets by category
- **Progress Visualization**: Visual progress bars with color coding
- **Status Indicators**: 
  - ✓ On Track (green)
  - ⚠️ Warning (yellow) - approaching limit
  - ❌ Exceeded (red) - budget exceeded
- **Budget Stats**: Overview cards showing total budget, spent amount, warnings, and exceeded budgets
- **Alerts**: Warning messages for approaching limits

### 5. Insights Section
- **Smart Observations**: AI-generated insights about spending patterns
  - Positive observations (savings, income growth)
  - Warnings (increased spending, budget issues)
  - Neutral observations (spending insights)
- **Spending Trends**: 
  - Overall trend direction (increasing/decreasing)
  - Volatility assessment
  - Peak and lowest spending months
- **Category Trends**: Month-over-month comparison for top spending categories
- **Charts**:
  - Spending History (line chart)
  - Quarterly Performance (bar chart)

### 6. State Management
- **Zustand-based Store** (`useFinanceStore`): Centralized state management
  - Transactions data
  - Budgets with spending calculations
  - Filters and sorting preferences
  - Role management
  - UI state
- **Derived Statistics**: Computed values for performance optimization
- **Persistent Data**: Local storage integration for data persistence

## 🎨 Design & UX Features

### Responsiveness
- **Mobile-first approach**: Fully responsive design
- **Breakpoints**: 
  - Mobile (< 640px)
  - Tablet (640px - 1024px)
  - Desktop (> 1024px)
- **Adaptive layout**: Cards stack on mobile, grid on desktop
- **Touch-friendly**: Appropriate sizing for mobile interactions

### Visual Design
- **Clean & Modern**: Minimalist aesthetic with purposeful design
- **Color Scheme**:
  - Primary: Blue (#2563eb)
  - Income: Green (#10b981)
  - Expense: Red (#ef4444)
  - Semantic use of colors
- **Typography**: Inter font family with clear hierarchy
- **Component Library**: Shadcn/ui components for consistency

### Animations & Transitions
- **Entrance Animations**:
  - Staggered fade-in for cards
  - Smooth scale-in for modals
  - Slide-up effects for lists
- **Interactive Feedback**:
  - Hover effects on cards (lift & shadow)
  - Button press feedback (scale)
  - Smooth transitions on state changes
- **Performance**: GPU-accelerated animations using CSS transforms
- **Accessibility**: Respects `prefers-reduced-motion` for users with motion sensitivity

### Light & Dark Mode
- **Theme Toggle**: Easy switch in top navbar
- **Persistent**: Theme preference saved to local storage
- **System Detection**: Respects system theme preference on first visit

### Empty States
- **Graceful Handling**: Dedicated empty state components
- **Helpful Messages**: Clear instructions when no data is available
- **Call-to-Action**: Buttons to create first records

## 🏗️ Technical Architecture

### Tech Stack
- **Frontend Framework**: React 18 with TypeScript
- **Styling**: Tailwind CSS with custom animations
- **State Management**: Zustand
- **UI Components**: Shadcn/ui (Radix UI primitives)
- **Charting**: Recharts
- **Routing**: React Router
- **Form Handling**: React Hook Form
- **Notifications**: Sonner Toast Library
- **Icons**: Lucide React
- **Build Tool**: Vite
- **Testing**: Vitest with Playwright

### Folder Structure
```
src/
├── components/
│   ├── ui/              # Shadcn UI components
│   ├── layout/          # Layout components (Sidebar, Navbar)
│   ├── dashboard/       # Dashboard charts
│   └── transactions/    # Transaction-related components
├── pages/               # Page components
├── store/               # Zustand store
├── hooks/               # Custom React hooks
├── lib/                 # Utilities and helpers
└── main.tsx             # Entry point
```

### Key Design Patterns
- **Custom Hooks**: `useMemo` for performance, `useState` for local state
- **Composition**: Flexible component composition for reusability
- **Separation of Concerns**: Logic separated from presentation
- **DRY Principle**: Reusable utilities and helpers
- **Type Safety**: Full TypeScript coverage

## 🚀 Getting Started

### Prerequisites
- Node.js 16+ 
- Bun or npm

### Installation

```bash
# Clone the repository
git clone <repository-url>

# Navigate to project
cd nimblefin-dash

# Install dependencies
bun install
# or
npm install
```

### Development

```bash
# Start development server
bun run dev
# or
npm run dev
```


### Build

```bash
# Build for production
bun run build
# or
npm run build

# Preview production build
bun run preview
# or
npm run preview
```

## 📊 Usage Guide

### Dashboard Navigation
1. **Dashboard**: Overview of financial status and trends
2. **Transactions**: Manage and track all transactions
3. **Budgets**: Create and monitor spending budgets
4. **Insights**: Analyze spending patterns and trends

### Adding Transactions (Admin only)
1. Navigate to Transactions page
2. Click "Add" button
3. Fill in transaction details
4. Save to add to dashboard

### Creating Budgets (Admin only)
1. Navigate to Budgets page
2. Click "Add Budget" button
3. Set category and spending limit
4. Track spending against budget

### Filtering Data
- Use category, type, date range, and tag filters
- Combine multiple filters for precise results
- Click "Clear filters" to reset

### Toggling Roles
- Look for role switch in sidebar (bottom)
- Toggle between Viewer and Admin
- UI updates based on selected role

### Dark Mode
- Click sun/moon icon in top navbar
- Theme persists across sessions

## ✅ Requirements Coverage

### Core Requirements Met
- ✅ **Dashboard Overview**: Summary cards, balance trend chart, expense breakdown
- ✅ **Transactions Section**: Full-featured list with filtering, sorting, search
- ✅ **Role-Based UI**: Viewer/Admin roles with appropriate UI changes
- ✅ **Insights Section**: Smart observations, trends, categorical analysis
- ✅ **State Management**: Zustand store with proper data handling
- ✅ **Responsive Design**: Mobile, tablet, and desktop layouts
- ✅ **Empty State Handling**: Graceful handling of no-data scenarios
- ✅ **Documentation**: This comprehensive README

### Enhancements Implemented
- ✅ **Dark Mode**: Full light/dark theme support
- ✅ **Data Persistence**: Local storage integration
- ✅ **Animations**: Polished entrance and interaction animations
- ✅ **Export Functionality**: CSV export for transactions
- ✅ **Advanced Filtering**: Multiple filter criteria with combinations
- ✅ **Bulk Operations**: Multi-select and bulk delete
- ✅ **Budget System**: Advanced budget tracking with alerts
- ✅ **Advanced Insights**: AI-powered observations and trend analysis
- ✅ **Quarterly Analysis**: Performance breakdown by quarter
- ✅ **Responsive Charts**: Interactive, responsive visualizations

## 🎨 Approach & Design Philosophy

### Design Thinking
- **User-Centric**: Every feature designed with user needs in mind
- **Simplicity First**: Complex features simplified without losing power
- **Progressive Disclosure**: Advanced features available without cluttering UI
- **Consistency**: Unified design language across all pages
- **Accessibility**: Keyboard navigation, screen reader friendly

### Performance Optimization
- **Memoization**: Derived stats calculated only when data changes
- **Lazy Loading**: Components loaded on demand
- **CSS Animations**: GPU-accelerated for smooth performance
- **React Optimization**: Key props, memo for expensive components

### Code Quality
- **TypeScript**: Full type safety across the application
- **Component Modularity**: Small, focused, reusable components
- **Utility Functions**: Centralized helpers for common tasks
- **Error Handling**: Graceful error states and fallbacks
- **Clean Code**: Readable, well-commented code

## 📱 Browser Support
- Chrome/Edge (latest)
- Firefox (latest)
- Safari (latest)
- Mobile browsers (iOS Safari, Chrome Mobile)

## 📝 Test Data
The application comes with pre-populated sample data for demonstration:
- Multiple transactions spanning different months
- Various categories (Food, Transport, Entertainment, etc.)
- Budget examples with different statuses
- Tags for organization

## 🔐 Notes on Security
As this is a frontend-only demonstration:
- All data is stored in local storage
- No real backend authentication
- Role switching is simulated for UI demonstration
- Suitable for personal use only

## 📄 License
This project is created as an assignment submission.

## 🤝 Contributing
This is an assignment project and not open for contributions.

## 📧 Contact
For questions about this project, please refer to the assignment brief.

---

**Built with ❤️ as an assignment submission showcasing frontend development skills.**
