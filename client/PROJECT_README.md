# BarakahAid - Frontend Application

A comprehensive global donation management platform built with **React**, **Tailwind CSS**, and **Redux Toolkit**.

## 🚀 Features

- **Multi-Role System**: Donors, Recipients, Volunteers, NGOs, and Admins
- **Beautiful UI**: Clean, modern interface inspired by Visily design system
- **State Management**: Redux Toolkit for scalable state management
- **Responsive Design**: Mobile-first approach with Tailwind CSS
- **Modular Architecture**: Reusable components and clean code structure

## 📦 Project Structure

```
src/
├── components/
│   ├── ui/              # Reusable UI components (Button, Input, Card, Modal, etc.)
│   ├── layout/          # Layout components (Navbar, Sidebar, Footer, DashboardLayout)
│   ├── shared/          # Shared components (LoadingSpinner, EmptyState, ErrorState)
│   └── *.jsx            # Domain-specific components (RequestCard, CampaignCard, etc.)
├── pages/
│   ├── auth/            # Authentication pages (Login, Register, ForgotPassword)
│   ├── donor/           # Donor role pages
│   ├── recipient/       # Recipient role pages
│   ├── volunteer/       # Volunteer role pages
│   ├── ngo/             # NGO role pages
│   └── admin/           # Admin role pages
├── store/               # Redux slices and store configuration
├── hooks/               # Custom React hooks (useAuth, useForm, useFetchMock)
├── utils/               # Utility functions and constants
│   ├── constants.js     # Application constants
│   ├── helpers.js       # Helper functions
│   ├── validation.js    # Form validation utilities
│   ├── theme.js         # Theme configuration
│   └── dummyData.js     # Mock data for development
└── assets/              # Static assets (images, icons, logos)
```

## 🛠️ Tech Stack

- **React 19** - UI library
- **Redux Toolkit** - State management
- **React Router DOM** - Routing
- **Tailwind CSS** - Styling
- **Vite** - Build tool

## 🎨 Color Palette

- **Primary**: Blue (#0ea5e9) - Trust, reliability
- **Success**: Green (#22c55e) - Positive actions
- **Warning**: Yellow (#eab308) - Alerts
- **Danger**: Red (#ef4444) - Errors, urgent
- **Secondary**: Slate (#64748b) - Neutral elements
- **Accent**: Purple (#d946ef) - Highlights

## 🚦 Getting Started

### Prerequisites

- Node.js 18+ and npm

### Installation

1. Install dependencies:
   ```bash
   npm install
   ```

2. Run development server:
   ```bash
   npm run dev
   ```

3. Build for production:
   ```bash
   npm run build
   ```

## 👤 Demo Accounts

For testing, use these demo credentials:

- **Donor**: donor@example.com / password
- **Recipient**: recipient@example.com / password
- **Volunteer**: volunteer@example.com / password
- **NGO**: ngo@example.com / password
- **Admin**: admin@example.com / password

## 🎯 Key Components

### UI Components
- `Button` - Multiple variants and sizes
- `Input` - Text input with validation
- `Select` - Dropdown select
- `TextArea` - Multi-line text input
- `Card` - Content container
- `Modal` - Dialog/popup
- `Badge` - Status indicators
- `Avatar` - User profile picture
- `ProgressBar` - Visual progress indicator

### Layout Components
- `Navbar` - Main navigation
- `Sidebar` - Dashboard navigation
- `Footer` - Site footer
- `DashboardLayout` - Dashboard wrapper with sidebar

### Domain Components
- `RequestCard` - Donation request display
- `CampaignCard` - Campaign display
- `DonationCard` - Donation history item
- `EventCard` - Volunteer event display

## 📋 Redux Slices

- **userSlice** - Authentication and user management
- **requestsSlice** - Donation requests
- **donationsSlice** - Donation tracking
- **volunteerSlice** - Volunteer events and tasks
- **ngoSlice** - NGO and campaign management
- **adminSlice** - Admin operations and analytics

## 🎨 Design System

The UI follows a consistent design system with:
- **Spacing**: 4px increments
- **Border Radius**: 8px (buttons), 12px (cards)
- **Shadows**: Subtle elevation for depth
- **Typography**: Inter (body), Poppins (headings)
- **Transitions**: 300ms ease-in-out

## 🔧 Custom Hooks

- `useAuth` - Authentication operations
- `useForm` - Form state and validation
- `useFetchMock` - Mock API data fetching

## 📱 Responsive Design

- Mobile-first approach
- Breakpoints:
  - sm: 640px
  - md: 768px
  - lg: 1024px
  - xl: 1280px
  - 2xl: 1536px

## 🚧 Development Status

✅ **Completed:**
- Project setup and configuration
- UI component library
- Layout components
- Redux store and slices
- Authentication system
- Donor dashboard (sample)
- Routing infrastructure

🔄 **In Progress / Coming Soon:**
- Additional role-specific dashboards
- Complete page implementations
- Form submissions
- Detailed analytics
- Advanced filtering
- Real-time notifications
- Backend integration (future)

## 📝 Notes

- This is a **frontend-only** application
- Uses **mock data** for development
- No backend integration yet
- All API calls are simulated with delays
- Forms have client-side validation only

## 🤝 Contributing

When adding new features:
1. Follow the existing folder structure
2. Use Tailwind CSS for styling
3. Create reusable components
4. Add PropTypes or TypeScript interfaces
5. Keep components small and focused
6. Document complex logic with comments

## 📄 License

This project is part of the BarakahAid platform.

---

Built with ❤️ for making a difference in the world.
