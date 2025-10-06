# IG Thar Village - Desert Experience Platform

A comprehensive Next.js application for IG Thar Village, featuring authentic desert experiences, natural products, and cultural tourism in West Rajasthan.

## 🌟 Features

### Public Website
- **Home Page**: Hero section with desert theme and service highlights
- **About Us**: Story of founders Dr. Devaram Pawar and Dhapu
- **Services**: Farm stays, desert safaris, cultural experiences
- **Products**: Natural desert products with ordering system
- **Gallery**: Visual showcase of experiences and culture
- **Awards**: Recognition and achievements
- **Media Corner**: Press releases and media coverage
- **Contact**: Inquiry forms and contact information

### Admin Panel
- **Dashboard**: Overview of bookings, products, and analytics
- **Product Management**: Add, edit, and manage natural products
- **Blog Management**: Create and manage blog posts
- **Media Management**: Upload and organize images/videos
- **Booking Management**: Handle service bookings
- **Message Management**: Customer inquiries and communications
- **Analytics**: Performance metrics and insights

## 🛠 Tech Stack

- **Framework**: Next.js 15 with App Router
- **Styling**: Tailwind CSS with custom desert theme
- **UI Components**: shadcn/ui with custom styling
- **Authentication**: Firebase Auth
- **Database**: Firebase Firestore
- **Storage**: Firebase Storage
- **Icons**: Lucide React
- **Forms**: React Hook Form with Zod validation

## 🎨 Design Theme

The application features a custom desert and agricultural theme with:
- **Primary Colors**: Earth tones and desert browns
- **Border Radius**: Consistent 4px, 8px, and 12px values
- **Custom Gradients**: Desert sand, agricultural green, Rajasthani orange
- **Typography**: Clean, readable fonts with proper hierarchy

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ 
- npm or yarn
- Firebase project

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd ig-thar-village
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Firebase Setup**
   - Create a new Firebase project at [Firebase Console](https://console.firebase.google.com)
   - Enable Authentication (Email/Password)
   - Create Firestore database
   - Enable Storage
   - Get your Firebase config

4. **Environment Configuration**
   Update `.env.local` with your Firebase configuration:
   ```env
   NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key_here
   NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
   NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
   NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
   NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
   NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
   ```

5. **Run the development server**
   ```bash
   npm run dev
   ```

6. **Access the application**
   - Public website: http://localhost:3000
   - Admin panel: http://localhost:3000/admin/login

### Firebase Setup Details

1. **Authentication Setup**
   - Go to Firebase Console > Authentication > Sign-in method
   - Enable "Email/Password" provider
   - Create an admin user account

2. **Firestore Database**
   - Go to Firebase Console > Firestore Database
   - Create database in production mode
   - Set up the following collections:
     - `products` - for natural products
     - `blogs` - for blog posts
     - `bookings` - for service bookings
     - `messages` - for contact inquiries
     - `media` - for uploaded images/videos

3. **Storage Rules**
   ```javascript
   rules_version = '2';
   service firebase.storage {
     match /b/{bucket}/o {
       match /{allPaths=**} {
         allow read: if true;
         allow write: if request.auth != null;
       }
     }
   }
   ```

4. **Firestore Security Rules**
   ```javascript
   rules_version = '2';
   service cloud.firestore {
     match /databases/{database}/documents {
       // Allow read access to all documents
       match /{document=**} {
         allow read: if true;
         allow write: if request.auth != null;
       }
     }
   }
   ```

## 📁 Project Structure

```
ig-thar-village/
├── src/
│   ├── app/                    # Next.js App Router pages
│   │   ├── (public pages)/     # Public website pages
│   │   └── admin/              # Admin panel pages
│   ├── components/             # Reusable components
│   │   ├── ui/                 # shadcn/ui components
│   │   ├── layout/             # Layout components
│   │   └── admin/              # Admin-specific components
│   └── lib/                    # Utilities and configurations
│       ├── firebase.ts         # Firebase configuration
│       └── utils.ts            # Utility functions
├── public/                     # Static assets
└── .env.local                  # Environment variables
```

## 🎯 Key Pages

### Public Website
- `/` - Home page with hero and features
- `/about` - About IG Thar Village and founders
- `/services` - Available services and packages
- `/products` - Natural products catalog
- `/gallery` - Photo gallery and virtual tours
- `/awards` - Awards and recognition
- `/media` - Media coverage and press kit
- `/contact` - Contact form and information

### Admin Panel
- `/admin` - Dashboard overview
- `/admin/login` - Admin authentication
- `/admin/products` - Product management
- `/admin/blogs` - Blog post management
- `/admin/media` - Media file management
- `/admin/bookings` - Booking management
- `/admin/messages` - Customer inquiries

## 🔧 Customization

### Theme Colors
The application uses custom CSS variables for theming. Update `src/app/globals.css` to modify colors:

```css
:root {
  --primary: oklch(0.45 0.12 35);     /* Desert brown */
  --secondary: oklch(0.88 0.04 40);   /* Light sand */
  --accent: oklch(0.85 0.05 35);      /* Accent brown */
  /* ... other colors */
}
```

### Adding New Pages
1. Create page component in appropriate directory
2. Add navigation link to `src/components/layout/navbar.tsx`
3. Update admin sidebar if it's an admin page

## 📱 Responsive Design

The application is fully responsive with:
- Mobile-first approach
- Breakpoints: sm (640px), md (768px), lg (1024px), xl (1280px)
- Touch-friendly interface
- Optimized images and content

## 🔒 Security

- Firebase Authentication for admin access
- Secure API routes with authentication checks
- Input validation with Zod schemas
- XSS protection with proper sanitization
- CSRF protection built into Next.js

## 🚀 Deployment

### Vercel (Recommended)
1. Push code to GitHub repository
2. Connect repository to Vercel
3. Add environment variables in Vercel dashboard
4. Deploy automatically

### Other Platforms
The application can be deployed to any platform supporting Next.js:
- Netlify
- Railway
- DigitalOcean App Platform
- AWS Amplify

## 📈 Performance

- Next.js App Router for optimal performance
- Image optimization with Next.js Image component
- Code splitting and lazy loading
- Optimized bundle size with tree shaking
- CDN delivery for static assets

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

This project is proprietary software for IG Thar Village.

## 📞 Support

For technical support or questions:
- Email: tech@igtharvillage.com
- Documentation: [Project Wiki]
- Issues: [GitHub Issues]

---

**Built with ❤️ for preserving desert culture and promoting sustainable tourism**