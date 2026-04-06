# 💰 Finance Hub - Your Personal Finance Dashboard

Ever wanted to see exactly where your money goes? **Finance Hub** is your friendly neighborhood financial dashboard! Built with modern tech (React, TypeScript, and Tailwind CSS), it makes understanding your finances actually *fun* rather than overwhelming.

## 🎯 What Is This?

Think of Finance Hub as your personal accountant's assistant. It helps you see the bigger picture of your spending, track your income, set budgets, and discover spending patterns you never knew existed. Whether you're curious about your habits or just want to take control of your finances, this dashboard has your back.

## ✨ What Can You Do?

### 💳 Dashboard Overview
Your at-a-glance financial snapshot! See your total balance, income, and expenses all at once. There's also a beautiful chart showing how your balance has changed over time, and a pie chart breaking down where you're actually spending your money.

### 🧾 Transactions Management
Get down to the nitty-gritty details:
- **See All Your Transactions**: Every purchase, payment, and deposit in one organized table
- **Smart Filtering**: Filter by type (income/expenses), pick specific categories, choose a date range, or find transactions by tags—or mix and match multiple filters
- **Search & Sort**: Quickly find what you're looking for and sort by date or amount
- **Pagination**: View 10 transactions at a time without overwhelming your screen
- **Admin Powers** (if you're the admin): Add new transactions, edit existing ones, or delete mistakes
- **Bulk Actions**: Need to delete multiple transactions? Select them all at once
- **Export to Excel**: Download your data as a CSV file for spreadsheet nerds like us

### 👤 Different Access Levels
You can switch between two modes:
- **Viewer Mode**: Just looking? Read everything but can't make changes
- **Admin Mode**: Full control—add, edit, and delete transactions and budgets
- You can toggle between modes right in the sidebar (great for testing!)

### 💰 Budget Tracking
Set spending limits and keep yourself accountable:
- **Create Budgets**: Set a spending limit for each category
- **Visual Progress**: See bars that fill up as you spend (and change color as you approach your limit)
- **At a Glance Status**: Green means you're good, yellow means you're getting close, red means you've gone over
- **Budget Overview Cards**: See your total budget, how much you've spent, and any warnings
- **Smart Alerts**: Get notified when you're approaching your budget limit

### 🎯 Insights Section
Let the app do some thinking for you:
- **Smart Observations**: Get friendly insights about your spending ("Great job! Your income is growing!" or "⚠️ Warning: Spending increased 30% this month")
- **Spending Trends**: See whether you're spending more or less over time, and which months were your biggest splurges
- **Category Breakdown**: How does your spending in different categories compare month-to-month?
- **Beautiful Charts**: Interactive charts showing your spending history and quarterly performance

### 📦 Smart State Management
Under the hood, the app keeps everything organized using Zustand (a lightweight state manager):
- All your data stays in sync
- Your preferences (filters, sorting) are remembered
- Your data persists even if you refresh the page

## 🎨 Design & UX Features

### 📱 Works on Everything
- **Phone**: Perfectly sized for mobile browsing
- **Tablet**: Nicely formatted for medium screens  
- **Desktop**: Full-featured experience on big screens
- Everything adapts beautifully—cards stack on your phone, organize into grids on desktop

### 🎨 Beautiful & Consistent
- **Clean Design**: No clutter, just what you need
- **Colors That Mean Something**: Blue for general info, green for income (good vibes!), red for expenses (heads up!)
- **Modern Typography**: Easy to read and beautiful
- **Quality Components**: Built with battle-tested UI component library (Shadcn/ui)

### ✨ Smooth & Polished
- **Satisfying Animations**: Cards fade in elegantly when you load a page, modals pop up smoothly
- **Responsive Buttons**: Visual feedback when you click—they feel real and responsive
- **Accessible Animations**: If you prefer reduced motion, we respect that

### 🌙 Dark Mode Built In
- **Light or Dark**: Toggle between themes in the top bar
- **Your Preference is Remembered**: Close the app and come back—your theme choice stays with you
- **Respects Your System Settings**: On first visit, we match your phone/computer's settings

### 🎯 Smart Empty States
- **Not Broken, Just Empty**: When you start out, you see helpful messages instead of confusing blank screens
- **Get Started Buttons**: Each empty state has a button to create your first transaction or budget

## 🏗️ Built With... (For the Curious)

If you're interested in the technical side, here's what powers this app:

### 🛠️ The Tech Stack
- **React 18**: The foundation (with TypeScript for safety)
- **Tailwind CSS**: Makes everything pretty and responsive
- **Zustand**: Keeps all the app state organized and simple
- **Shadcn/ui**: Pre-built UI components that actually look good
- **Recharts**: Creates those beautiful charts
- **React Hook Form**: Handles form validation so you don't have to deal with errors
- **Sonner**: Toast notifications (those little popups that tell you something happened)
- **Lucide React**: Icons everywhere
- **Vite**: Super fast build tool
- **Vitest + Playwright**: For testing (making sure nothing breaks)

### 📂 How It's Organized
```
src/
├── components/        # The building blocks
│   ├── ui/           # Buttons, cards, inputs, etc.
│   ├── layout/       # Sidebar, navbar, main layout
│   ├── dashboard/    # Dashboard charts
│   └── transactions/ # Transaction components
├── pages/            # The main pages
├── store/            # Where data lives (Zustand store)
├── hooks/            # Reusable JavaScript helpers
├── lib/              # Utility functions
└── main.tsx          # The entry point
```

### 💡 Design Principles We Follow
- **Modular**: Small components that do one thing well
- **Type-Safe**: TypeScript catches errors before they become bugs
- **DRY**: We don't repeat ourselves—shared utilities everywhere
- **Performance**: Only recalculate things when they actually change

## 🚀 Getting Started (It's Simple!)

### What You'll Need
- **Node.js** 16 or higher (you can download it from [nodejs.org](https://nodejs.org))
- **Bun** or **npm** for managing packages (npm comes with Node, or [install Bun](https://bun.sh))

### Step 1: Get the Code
```bash
# Download the project
git clone <repository-url>

# Go into the project folder
cd nimblefin-dash
```

### Step 2: Install Dependencies
```bash
# Using Bun (faster!)
bun install

# OR using npm (if you prefer)
npm install
```

### Step 3: Run It Locally
```bash
# Start the development server
bun run dev
# or
npm run dev
```

Then open http://localhost:5173 in your browser and you're all set! 🎉

### When You're Ready to Deploy
```bash
# Build for production
bun run build
# or
npm run build

# Test the production build locally
bun run preview
# or
npm run preview
```

## 📊 How to Use Finance Hub

### 🗺️ Finding Your Way Around
The sidebar has four main sections:
1. **Dashboard**: Your financial overview at a glance
2. **Transactions**: See and manage every transaction
3. **Budgets**: Set and track budgets for each category
4. **Insights**: Deep dive into your spending patterns

### ➕ Adding a Transaction (Admin Mode)
1. Switch to **Admin** mode (look at the bottom of the sidebar)
2. Go to the **Transactions** page
3. Click the "Add" button
4. Fill in the details (amount, category, date, etc.)
5. Hit save and watch it appear on your dashboard!

### 💰 Setting Up a Budget (Admin Mode)
1. Go to **Budgets** page
2. Click "Add Budget"
3. Pick a category and set your spending limit
4. As you add transactions, the progress bars update automatically

### 🔍 Finding Specific Transactions
Use the filters at the top of the Transactions page:
- **Type**: Income, Expenses, or all
- **Category**: Pick one or multiple categories
- **Date Range**: Use the calendar picker
- **Tags**: Filter by custom tags
- **Search**: Type to find specific transactions

Mix and match filters to find exactly what you're looking for. Click "Clear filters" to start fresh.

### 🌙 Switching to Dark Mode
Look for the sun/moon icon in the top right corner. Click it to toggle between light and dark mode. Your preference is automatically saved!

### 👤 Trying Admin vs Viewer Mode
Look at the bottom of the sidebar—you'll see a role toggle. Switch between "Admin" and "Viewer" to see how the UI changes. Viewers can see everything but can't make changes.

## ✅ What's Included

### 📋 The Essentials (All Covered!)
- ✅ **Dashboard**: Summary cards, charts showing balance trends, expense breakdown
- ✅ **Transactions**: Full list with advanced filtering, sorting, and search
- ✅ **Role-Based Access**: Switch between admin and viewer modes
- ✅ **Insights**: Smart observations about your spending, trend analysis, category breakdowns
- ✅ **State Management**: Everything synced and persistent
- ✅ **Responsive**: Works great on phones, tablets, and desktops
- ✅ **Empty States**: Friendly messages when you don't have data yet
- ✅ **Documentation**: This awesome README!

### 🎁 Bonus Features (Extra Stuff We Added!)
- ✅ **Dark Mode**: Easy on the eyes, looks awesome
- ✅ **Data Persistence**: Your data stays even if you close the browser
- ✅ **Smooth Animations**: Everything feels polished and responsive
- ✅ **CSV Export**: Download your transactions to Excel or Google Sheets
- ✅ **Advanced Filtering**: Combine multiple filters to find exactly what you need
- ✅ **Bulk Actions**: Select and delete multiple transactions at once
- ✅ **Smart Budgets**: Track spending with alerts and visual indicators
- ✅ **AI-Powered Insights**: Observations about your spending habits
- ✅ **Quarterly Reports**: See how your spending changes by quarter
- ✅ **Interactive Charts**: Beautiful, responsive visualizations

## 💭 Our Philosophy

### 👥 Built for Real People
- **Simple First**: If it's complicated, we rethink it
- **No Clutter**: We show you what matters, hide what doesn't
- **Discoveries**: Advanced features are there when you need them, but they're not in your face
- **Consistency**: Everything works the same way—no surprises
- **Accessibility**: Works with keyboard navigation and screen readers

### ⚡ Smooth Performance
- **Speedy**: Only recalculates things when necessary
- **Responsive**: No lag or stuttering
- **Lazy Loading**: Load components only when you need them
- **GPU Acceleration**: Animations run smoothly, not janky
- **React Best Practices**: Memoization and optimization throughout

### 💪 Code Quality
- **Type Safety**: TypeScript catches errors before users see them
- **Modular**: Small, focused components that are easy to understand
- **DRY**: We don't repeat ourselves
- **Well Organized**: Everything is in a logical place
- **Documented**: Code is readable and well-commented

## 📱 Works on Your Browser

All modern browsers are welcome here:
- **Chrome/Edge**: Fully supported
- **Firefox**: Fully supported
- **Safari**: Fully supported (desktop and mobile)
- **Mobile Browsers**: iOS Safari, Chrome on Android—all good!

## 📝 Built-In Sample Data

When you first open Finance Hub, you'll find it pre-loaded with realistic sample data so you can explore immediately:
- Multiple transactions across different months
- Various spending categories (Food, Transport, Entertainment, etc.)
- Budget examples with different statuses
- Tags to help organize transactions

Feel free to add, edit, or delete anything—it's your sandbox to learn with!

## 🔐 A Note About This Being a Frontend Demo

This is a frontend-only application:
- Data lives in your browser's local storage (it's private to you!)
- No backend server needed to run locally
- Role switching is just for UI demonstration
- Perfect for personal use or learning how to build financial dashboards
- If you build a backend someday, this frontend is ready to connect to it!

## 📖 License & Credit

This project was created as an assignment submission. Feel free to learn from it, build upon it, or use it as inspiration for your own projects!

## 🤝 Want to Contribute?
This is an assignment project and not open for contributions.

## 📧 Contact
For questions about this project, please refer to the assignment brief.

---

**Built with ❤️ as an assignment submission showcasing frontend development skills.**
