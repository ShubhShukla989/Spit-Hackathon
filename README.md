# 🚀 StockMaster - Inventory Management System

<div align="center">

## 🌐 **LIVE SITE**
### **[https://stockmaster-gold.vercel.app](https://stockmaster-gold.vercel.app)**

[![Live Demo](https://img.shields.io/badge/Live-Demo-success?style=for-the-badge&logo=vercel)](https://stockmaster-gold.vercel.app)
[![GitHub](https://img.shields.io/badge/GitHub-Repository-blue?style=for-the-badge&logo=github)](https://github.com/ShubhShukla989/Spit-Hackathon)
[![Video Demo](https://img.shields.io/badge/Video-Prototype-red?style=for-the-badge&logo=youtube)](https://drive.google.com/file/d/1FWyeLTM-uOYFP813cxLkDKypqftFBZXf/view?usp=sharing)

---

**🎉 The site is LIVE and fully functional!**

### 🎥 [Watch Video Prototype](https://drive.google.com/file/d/1FWyeLTM-uOYFP813cxLkDKypqftFBZXf/view?usp=sharing)

</div>

## 📋 Table of Contents
- [About](#about)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Screenshots](#screenshots)
- [Getting Started](#getting-started)
- [Environment Variables](#environment-variables)
- [Deployment](#deployment)
- [Usage](#usage)
- [Contributing](#contributing)

## 🎯 About

**StockMaster** is a comprehensive inventory management system built for modern warehouses and businesses. It provides real-time stock tracking, automated reordering, and detailed analytics to streamline your inventory operations.

### Key Highlights
- ✅ Real-time inventory tracking
- ✅ Automated stock alerts and reordering
- ✅ Receipt and delivery management
- ✅ Kanban board views for better visualization
- ✅ Move history tracking
- ✅ Multi-warehouse support
- ✅ Role-based access control

## ✨ Features

### 📦 Inventory Management
- **Products Management**: Add, edit, delete products with categories
- **Stock Levels**: Real-time stock tracking across multiple locations
- **Stock Alerts**: Automated alerts for low stock items
- **Reordering Rules**: Configure automatic reorder points

### 📥 Operations
- **Receipts**: Manage incoming inventory with validation
- **Deliveries**: Track outgoing shipments
- **Stock Adjustments**: Manual stock corrections
- **Move History**: Complete audit trail of all stock movements

### 📊 Visualization
- **Kanban Views**: Visual boards for products, categories, and rules
- **Dashboard**: Real-time KPIs and analytics
- **Stock by Location**: Location-wise inventory distribution

### 🔐 Authentication
- **Secure Login/Signup**: Email-based authentication
- **Password Reset**: OTP-based password recovery
- **User Profiles**: Manage user information

### 🎨 UI/UX
- **Premium Theme**: Modern, professional design
- **Responsive**: Works on desktop, tablet, and mobile
- **Dark Mode Ready**: Eye-friendly interface
- **Smooth Animations**: Delightful user experience

## 🛠️ Tech Stack

### Frontend
- **React 18** - UI library
- **TypeScript** - Type safety
- **Vite** - Build tool
- **Tailwind CSS** - Styling
- **React Router** - Navigation
- **Zustand** - State management

### Backend
- **Supabase** - Backend as a Service
  - PostgreSQL database
  - Authentication
  - Real-time subscriptions
  - Row Level Security (RLS)

### Deployment
- **Vercel** - Frontend hosting
- **Supabase Cloud** - Database and backend

## 📸 Screenshots

### Dashboard
![Dashboard](https://via.placeholder.com/800x400?text=Dashboard+Screenshot)

### Products Management
![Products](https://via.placeholder.com/800x400?text=Products+Management)

### Kanban View
![Kanban](https://via.placeholder.com/800x400?text=Kanban+Board)

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ installed
- npm or yarn package manager
- Supabase account

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/ShubhShukla989/Spit-Hackathon.git
   cd Spit-Hackathon
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   
   Create a `.env` file in the root directory:
   ```env
   VITE_SUPABASE_URL=your_supabase_project_url
   VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```

4. **Run the development server**
   ```bash
   npm run dev
   ```

5. **Open your browser**
   ```
   http://localhost:5173
   ```

## 🔑 Environment Variables

| Variable | Description | Example |
|----------|-------------|---------|
| `VITE_SUPABASE_URL` | Your Supabase project URL | `https://xxxxx.supabase.co` |
| `VITE_SUPABASE_ANON_KEY` | Your Supabase anonymous key | `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...` |

### Getting Supabase Credentials

1. Go to [Supabase Dashboard](https://supabase.com/dashboard)
2. Select your project
3. Go to **Settings** → **API**
4. Copy **Project URL** and **anon/public key**

## 📦 Deployment

### Deploy to Vercel

1. **Push to GitHub**
   ```bash
   git add .
   git commit -m "Ready for deployment"
   git push origin main
   ```

2. **Import to Vercel**
   - Go to [Vercel Dashboard](https://vercel.com)
   - Click "New Project"
   - Import your GitHub repository
   - Add environment variables
   - Click "Deploy"

3. **Configure Supabase**
   - Go to Supabase Dashboard → Authentication → URL Configuration
   - Set **Site URL**: `https://your-app.vercel.app`
   - Add **Redirect URLs**:
     - `https://your-app.vercel.app/**`
     - `https://your-app.vercel.app/reset-password`

## 📖 Usage

### Default Login Credentials
```
Email: demo@stockmaster.com
Password: demo123
```

### Quick Start Guide

1. **Login** to the application
2. **Add Products** from Stock → Products
3. **Create Categories** to organize products
4. **Set up Locations** for your warehouse
5. **Configure Reorder Rules** for automatic alerts
6. **Create Receipts** for incoming inventory
7. **Create Deliveries** for outgoing shipments
8. **Monitor** stock levels and alerts

## 🗂️ Project Structure

```
Spit-Hackathon/
├── src/
│   ├── components/       # Reusable UI components
│   ├── pages/           # Page components
│   │   ├── stock/       # Stock management pages
│   │   ├── operations/  # Operations pages
│   │   └── settings/    # Settings pages
│   ├── services/        # API services
│   ├── stores/          # State management
│   ├── styles/          # CSS and themes
│   └── utils/           # Utility functions
├── public/              # Static assets
└── dist/               # Build output
```

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👥 Authors

- **Shubh Shukla** - [GitHub](https://github.com/ShubhShukla989)

## 🙏 Acknowledgments

- Built for SPIT Hackathon
- Inspired by modern inventory management systems
- UI/UX design inspired by premium SaaS applications

## 📞 Support

For support, email: support@stockmaster.com or open an issue on GitHub.

---

<div align="center">

**Made with ❤️ for SPIT Hackathon**

⭐ Star this repo if you find it helpful!

</div>
