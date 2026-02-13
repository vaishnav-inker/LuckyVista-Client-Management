# Super Admin Client Management Module

A comprehensive React + TypeScript + Supabase module for managing client organizations in the LuckyVista platform.

## Features

- ✅ Complete client CRUD operations
- ✅ Organization logo upload with validation
- ✅ Advanced search and filtering
- ✅ Real-time data updates
- ✅ Role-based access control
- ✅ Responsive design with Tailwind CSS
- ✅ Form validation and error handling
- ✅ Pagination support
- ✅ Modern purple-themed UI

## Quick Start

### For Integration into Existing Project

**📖 Read the [Integration Guide](docs/INTEGRATION_GUIDE.md) first!**

This module is designed to be integrated into your main React application. The integration guide provides step-by-step instructions.

### For Standalone Development

```bash
# Install dependencies
npm install

# Set up environment variables
cp .env.example .env
# Edit .env with your Supabase credentials

# Run database migrations
# Execute supabase/migrations/001_create_clients_table.sql in Supabase SQL Editor

# Start development server
npm run dev
```

## Project Structure

```
├── src/
│   ├── components/       # React components
│   │   ├── auth/        # Authentication components
│   │   ├── clients/     # Client management components
│   │   └── layout/      # Layout components
│   ├── contexts/        # React contexts
│   ├── hooks/           # Custom React hooks
│   ├── pages/           # Page components
│   ├── services/        # API services
│   ├── types/           # TypeScript types
│   ├── utils/           # Utility functions
│   └── lib/             # Third-party configurations
├── supabase/
│   └── migrations/      # Database migrations
├── docs/                # Documentation and guides
└── public/              # Static assets
```

## Tech Stack

- **Frontend**: React 18, TypeScript 5, Vite
- **Styling**: Tailwind CSS 3
- **Backend**: Supabase (PostgreSQL + Auth + Storage)
- **Routing**: React Router DOM 6
- **Form Handling**: Custom hooks with validation
- **State Management**: React Context + Hooks

## Documentation

- **[Integration Guide](docs/INTEGRATION_GUIDE.md)** - How to integrate this module into your project
- **[Database Setup](docs/DATABASE_SETUP.md)** - Database schema and migration guide
- **[Getting Started](docs/GETTING_STARTED.md)** - Development setup guide
- **[Project Summary](docs/PROJECT_SUMMARY.md)** - Feature overview
- **[Troubleshooting](docs/RLS_TROUBLESHOOTING.md)** - Common issues and solutions

## Key Components

### Client Management
- `ClientListView` - List view with search, filter, and pagination
- `ClientForm` - Comprehensive form for creating/editing clients
- `LogoUpload` - Drag-and-drop logo upload with validation
- `SearchAndFilter` - Advanced search and filtering controls

### Layout
- `DashboardLayout` - Main dashboard layout with sidebar
- `Sidebar` - Navigation sidebar with user profile

### Authentication
- `SuperAdminRoute` - Protected route wrapper
- `AuthContext` - Authentication state management

## Environment Variables

```env
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

## Database Schema

The module uses a single `clients` table with:
- Organization details (name, logo, category)
- Tenant admin information (name, email, mobile, role)
- Branding preferences (display name, brand color)
- Operational settings (timezone, region, draw frequency)
- Compliance data (verification status, consents)
- Communication contacts (primary, support, escalation)
- Audit trail (created_by, updated_by, timestamps)

See `supabase/migrations/001_create_clients_table.sql` for full schema.

## Scripts

```bash
# Development
npm run dev          # Start dev server
npm run build        # Build for production
npm run preview      # Preview production build

# Type Checking
npm run type-check   # Run TypeScript compiler check
```

## Integration Checklist

Before integrating into your main project:

- [ ] Read the [Integration Guide](docs/INTEGRATION_GUIDE.md)
- [ ] Set up Supabase project and credentials
- [ ] Run database migrations
- [ ] Configure environment variables
- [ ] Test authentication flow
- [ ] Customize styling to match your brand
- [ ] Update routing configuration
- [ ] Test all CRUD operations
- [ ] Verify RLS policies
- [ ] Test file uploads

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## License

Proprietary - LuckyVista Platform

## Support

For integration support or questions:
- Review documentation in `docs/` folder
- Check troubleshooting guides
- Contact the development team

---

**Ready to integrate?** Start with the [Integration Guide](docs/INTEGRATION_GUIDE.md)!
