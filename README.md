# BarakahAid 🕌

**BarakahAid** (derived from the Arabic "Barakah," signifying blessing, growth, and prosperity) is a comprehensive, centralized, and transparent global donation management platform designed to connect donors with impactful charitable causes.

[![Build Status](https://github.com/Leader437/BarakahAid/actions/workflows/docker.yml/badge.svg)](https://github.com/Leader437/BarakahAid/actions)

---

## 🌐 Live Demo

| Application | URL |
|-------------|-----|
| **Client Portal** | [https://barakahaid.onrender.com](https://barakahaid.onrender.com) |
| **Admin Dashboard** | [https://barakahaid-admin.onrender.com](https://barakahaid-admin.onrender.com) |
| **API Server** | [https://barakahaid-server.onrender.com](https://barakahaid-server.onrender.com) |

---

## 📋 Overview

BarakahAid addresses critical challenges in the charitable giving ecosystem:

- **Transparency**: Full visibility into how donations are utilized
- **Accessibility**: Connect donors worldwide with verified NGOs and campaigns
- **Accountability**: Track donations from contribution to impact
- **Emergency Response**: Rapid deployment for disaster relief and urgent needs

### Key Features

#### For Donors
- 🔐 Secure authentication (Email & Google OAuth)
- 💳 Seamless payment processing via Stripe
- 📊 Donation history and downloadable receipts
- 🗺️ Interactive map showing campaign locations
- 📱 Responsive design for all devices

#### For NGOs
- 📝 Campaign creation and management
- 📈 Real-time analytics and reporting
- 👥 Volunteer coordination
- 🖼️ Media uploads via Cloudinary

#### For Administrators
- 👤 User and role management
- ✅ Campaign approval workflow
- 📊 Platform-wide analytics dashboard
- 🔔 Activity monitoring

---

## 🏗️ Architecture

```
BarakahAid/
├── client/          # React frontend (donor-facing)
├── admin/           # React admin dashboard
├── server/          # NestJS backend API
└── docker-compose.yml
```

---

## 🛠️ Tech Stack

### Frontend
| Technology | Purpose |
|------------|---------|
| **React 19** | UI framework |
| **Vite** | Build tool & dev server |
| **Redux Toolkit** | State management |
| **React Router v7** | Client-side routing |
| **Tailwind CSS v4** | Styling |
| **Axios** | HTTP client |
| **Leaflet** | Interactive maps |
| **GSAP** | Animations |

### Backend
| Technology | Purpose |
|------------|---------|
| **NestJS** | Node.js framework |
| **TypeORM** | ORM for PostgreSQL |
| **PostgreSQL** | Database |
| **Passport.js** | Authentication |
| **JWT** | Token-based auth |
| **Stripe** | Payment processing |
| **Cloudinary** | Image hosting |
| **Socket.io** | Real-time updates |

### DevOps & Deployment
| Technology | Purpose |
|------------|---------|
| **Docker** | Containerization |
| **GitHub Actions** | CI/CD pipeline |
| **Render** | Cloud hosting |
| **Nginx** | Static file serving |

---

## 🚀 Getting Started

### Prerequisites
- Node.js 20+
- PostgreSQL
- Docker (optional)

### Local Development

1. **Clone the repository**
   ```bash
   git clone https://github.com/Leader437/BarakahAid.git
   cd BarakahAid
   ```

2. **Install dependencies**
   ```bash
   # Install all workspaces
   npm install

   # Or individually
   cd server && npm install
   cd ../client && npm install
   cd ../admin && npm install
   ```

3. **Configure environment variables**
   ```bash
   # Server
   cp server/.env.sample server/.env
   # Edit server/.env with your database and API keys

   # Client
   echo "VITE_API_URL=http://localhost:5500" > client/.env

   # Admin
   echo "VITE_API_URL=http://localhost:5500" > admin/.env
   ```

4. **Start the development servers**
   ```bash
   # Terminal 1 - Server
   cd server && npm run start:dev

   # Terminal 2 - Client
   cd client && npm run dev

   # Terminal 3 - Admin
   cd admin && npm run dev
   ```

5. **Access the applications**
   - Client: http://localhost:5174
   - Admin: http://localhost:5173
   - API: http://localhost:5500

### Docker Deployment

```bash
# Build and run all services
docker-compose up --build

# Or build individually
docker build -t barakahaid-server ./server
docker build --build-arg VITE_API_URL=https://your-api.com -t barakahaid-client ./client
docker build --build-arg VITE_API_URL=https://your-api.com -t barakahaid-admin ./admin
```

---

## 🔧 Environment Variables

### Server
| Variable | Description |
|----------|-------------|
| `DATABASE_URL` | PostgreSQL connection string |
| `JWT_SECRET` | JWT signing secret |
| `JWT_REFRESH_SECRET` | Refresh token secret |
| `FRONTEND_URL` | Client app URL (CORS) |
| `ADMIN_URL` | Admin app URL (CORS) |
| `CLOUDINARY_*` | Cloudinary credentials |
| `STRIPE_*` | Stripe API keys |
| `GOOGLE_*` | Google OAuth credentials |

### Client & Admin
| Variable | Description |
|----------|-------------|
| `VITE_API_URL` | Backend API URL |

---

## 📦 Docker Images

Available on Docker Hub:

```bash
docker pull saifurrehmanzahid/barakahaid-server:latest
docker pull saifurrehmanzahid/barakahaid-client:latest
docker pull saifurrehmanzahid/barakahaid-admin:latest
```

---

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

## 📄 License

This project is private and proprietary.

---

## 👥 Team

Built with ❤️ by the BarakahAid Team

---

<p align="center">
  <i>Empowering global generosity through technology</i>
</p>
