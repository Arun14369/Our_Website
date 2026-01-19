# BuildPro Construction Website

A modern, professional React-based website for a construction business specializing in government tenders and AAC Blocks manufacturing manpower services.

## Features

- ✨ Modern and responsive design
- 🎨 Beautiful animations using Framer Motion
- 📱 Mobile-friendly layout
- 🔄 React Router for smooth navigation
- 📧 Contact form integration
- 🏗️ Services showcase
- 📊 Project portfolio
- 📞 Multiple contact options

## Tech Stack

- **React 18** - Frontend framework
- **React Router DOM** - Navigation
- **Framer Motion** - Animations
- **React Icons** - Icon library
- **EmailJS** - Contact form handling (optional)

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn

### Installation

1. Install dependencies:
```bash
npm install
```

2. Start the development server:
```bash
npm start
```

3. Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

### Build for Production

```bash
npm run build
```

This creates an optimized production build in the `build` folder.

## Project Structure

```
src/
├── components/
│   ├── Navbar.js          # Navigation component
│   ├── Footer.js          # Footer component
│   └── *.css              # Component styles
├── pages/
│   ├── Home.js            # Homepage
│   ├── About.js           # About page
│   ├── Services.js        # Services page
│   ├── Projects.js        # Projects portfolio
│   ├── Contact.js         # Contact page
│   └── *.css              # Page styles
├── App.js                 # Main app component
├── index.js               # Entry point
└── index.css              # Global styles
```

## Customization

### Update Company Information

1. Edit contact details in `/src/components/Footer.js` and `/src/pages/Contact.js`
2. Update services in `/src/pages/Services.js`
3. Add projects in `/src/pages/Projects.js`

### Colors and Styling

Modify CSS variables in `/src/index.css`:
```css
:root {
  --primary-color: #ff6b35;
  --secondary-color: #004e89;
  --dark-color: #1a1a1a;
  /* ... */
}
```

### Email Form Setup

To enable the contact form:
1. Create an account at [EmailJS](https://www.emailjs.com/)
2. Get your Service ID, Template ID, and User ID
3. Uncomment and update the EmailJS code in `/src/pages/Contact.js`

## Deployment

### Deploy to Netlify

1. Build the project: `npm run build`
2. Drag and drop the `build` folder to Netlify
3. Or connect your GitHub repository for automatic deployments

### Deploy to Vercel

1. Install Vercel CLI: `npm i -g vercel`
2. Run: `vercel`
3. Follow the prompts

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## License

This project is created for BuildPro Construction business.

## Support

For support, email info@buildpro.com or call +91 98765 43210
