# CMWorks Project Setup Guide

A React-based project onboarding application built with Vite, featuring a responsive navbar and sidebar navigation.

## Project Overview

This is a modern React application designed for project onboarding functionality. It includes:
- **Navbar**: Navigation header with sidebar toggle
- **Sidebar**: Collapsible navigation menu
- **Project Onboarding**: Main content page for onboarding workflows

## Prerequisites

Before setting up this project on your system, ensure you have the following installed:

- **Node.js**: Version 16.x or higher ([Download](https://nodejs.org/))
- **npm**: Version 7.x or higher (comes with Node.js) or **yarn/pnpm** as alternatives
- **Git**: For cloning the repository (optional, if cloning from a repo)

## Installation Steps

### 1. Clone or Download the Project

**If cloning from a repository:**
```bash
git clone <repository-url>
cd cmworks
```

**If you have a ZIP file:**
- Extract the ZIP file to your desired location
- Open a terminal in the extracted folder

### 2. Install Dependencies

Navigate to the project directory and install all required packages:

```bash
npm install
```

Or if using yarn:
```bash
yarn install
```

Or if using pnpm:
```bash
pnpm install
```

This will install:
- React 19.2.0
- React DOM 19.2.0
- React Icons 5.5.0
- Vite 7.2.4
- ESLint and related dev dependencies

## Running the Project

### Development Server

Start the development server with hot module replacement:

```bash
npm run dev
```

The application will typically be available at `http://localhost:5173`

### Production Build

Build the project for production:

```bash
npm run build
```

This creates an optimized build in the `dist/` directory.

### Preview Production Build

Preview the production build locally:

```bash
npm run preview
```

### Linting

Check code quality and style:

```bash
npm run lint
```

Fix linting issues automatically:

```bash
npm run lint -- --fix
```

## Project Structure

```
cmworks/
├── src/
│   ├── components/
│   │   ├── Navbar/
│   │   │   ├── Navbar.jsx
│   │   │   └── Navbar.css
│   │   └── Sidebar/
│   │       ├── Sidebar.jsx
│   │       └── Sidebar.css
│   ├── pages/
│   │   └── ProjectOnboarding.jsx
│   ├── App.jsx
│   ├── App.css
│   ├── main.jsx
│   ├── index.css
│   └── assets/
├── public/
├── vite.config.js
├── eslint.config.js
├── package.json
├── index.html
└── README.md
```

## Key Technologies

- **React 19**: Latest React library for building UI components
- **Vite**: Ultra-fast build tool and development server
- **React Icons**: Icon library for UI components
- **ESLint**: Code quality and consistency checking

## Configuration Files

- **vite.config.js**: Vite configuration with React SWC plugin for fast builds
- **eslint.config.js**: ESLint configuration for code quality
- **package.json**: Project metadata and dependencies

## Development Tips

1. **Hot Module Replacement**: Changes to files are automatically reflected in the browser during development
2. **React DevTools**: Install React DevTools browser extension for enhanced debugging
3. **ESLint Integration**: Most IDEs can integrate ESLint for real-time code quality feedback

## Troubleshooting

### Port Already in Use
If port 5173 is already in use, Vite will automatically try the next available port. Check the terminal output for the actual URL.

### Module Not Found Errors
If you encounter module errors after cloning:
```bash
npm install
npm run dev
```

### Dependencies Issues
Clear node_modules and reinstall:
```bash
rm -rf node_modules
npm install
```

On Windows:
```bash
rmdir /s /q node_modules
npm install
```

## Deployment

To deploy the built project:

1. Build the project: `npm run build`
2. Upload the `dist/` folder contents to your hosting provider
3. Ensure your server is configured to serve `index.html` for all routes (SPA configuration)

## Browser Support

Modern browsers that support ES2020+:
- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Additional Resources

- [React Documentation](https://react.dev/)
- [Vite Documentation](https://vitejs.dev/)
- [Node.js Documentation](https://nodejs.org/docs/)

## Support

For issues or questions, check:
1. The project's issue tracker (if available)
2. Vite documentation for build/dev issues
3. React documentation for component-related questions

---

**Last Updated**: January 16, 2026
