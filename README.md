<div align="center">

# 📍 NearbyHire

### *Find NearbyHire. Build Experience.*

An enterprise-ready, student-first hyperlocal employment exchange engineered with the MERN stack. Connecting students looking for flexible gigs with neighborhood businesses requiring immediate, verified talent.

[![React](https://img.shields.io/badge/Frontend-React%2018-61DAFB?style=flat-square&logo=react&logoColor=black)](https://reactjs.org/)
[![Node.js](https://img.shields.io/badge/Backend-Node.js%20LTS-339933?style=flat-square&logo=nodedotjs&logoColor=white)](https://nodejs.org/)
[![Express.js](https://img.shields.io/badge/Framework-Express%204.x-000000?style=flat-square&logo=express&logoColor=white)](https://expressjs.com/)
[![MongoDB](https://img.shields.io/badge/Database-MongoDB%20Atlas-47A248?style=flat-square&logo=mongodb&logoColor=white)](https://www.mongodb.com/)
[![Socket.IO](https://img.shields.io/badge/RealTime-Socket.IO%204.x-010101?style=flat-square&logo=socketdotio&logoColor=white)](https://socket.io/)
[![JWT](https://img.shields.io/badge/Auth-JWT-000000?style=flat-square&logo=jsonwebtokens&logoColor=white)](https://jwt.io/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg?style=flat-square)](LICENSE)

[Features](#-key-features) • [Architecture](#-system-architecture--project-structure) • [Data Models](#-database-schemas--models) • [API Docs](#-api-endpoints-reference) • [Getting Started](#-local-setup--installation-guide)

---
</div>

## 📌 Executive Overview

**NearbyHire** bridges the gap between academic commitments and financial independence. Students often need flexible micro-employment (part-time shifts, event assistance, weekend gigs, urgent store staffing), while local brick-and-mortar merchants struggle with unpredictable staff shortages.

Using geospatial indexing (`2dsphere`), algorithmic reputation scoring, and event-driven communication, NearbyHire matches verified students to hyper-localized shifts within minutes.

---

## 📑 Table of Contents

- [Key Features](#-key-features)
- [System Architecture & Project Structure](#-system-architecture--project-structure)
- [Database Schemas & Models](#-database-schemas--models)
- [API Endpoints Reference](#-api-endpoints-reference)
- [UI & Navigation Flow](#-ui--navigation-flow)
- [Local Setup & Installation Guide](#-local-setup--installation-guide)
- [Environment Variables Reference](#-environment-variables-reference)
- [Testing & Quality Assurance](#-testing--quality-assurance)
- [Contributing](#-contributing)
- [License](#-license)

---

## ⚡ Key Features

### 1. Dual-Role Authentication & Security
- **Role Isolation:** Strict separation of privileges between `STUDENT` and `BUSINESS` accounts.
- **Stateless Auth:** Secure token issuance with JSON Web Tokens (JWT), encrypted payloads, and HTTP-only cookie support.
- **Passcode Hashing:** `bcryptjs` salted hashing (12 rounds) applied directly at the pre-save schema layer.

### 2. Geospatial Engine (MongoDB `$nearSphere`)
- **Automatic Device Resolution:** Captures browser GPS coordinates (HTML5 Geolocation API) upon initial consent.
- **Proximity Queries:** Employs GeoJSON `Point` primitives and spherical geometry calculations on indexed fields.
- **Distance Radials:** Seamless toggle between radius tiers: **Near Me (< 2 km)**, **5 km**, **10 km**, **20 km**, or manual query by city/zipcode (e.g., Bhiwandi, Mumbai, Pune).

### 3. Urgent Hiring Subsystem
- Flagged priority posts for immediate operational vacancies (e.g., barista, banquet staff, cashier, event helper).
- Accelerated application and notification loops highlighted with visual pulses across UI feeds.

### 4. WebSocket Real-Time Chat (Socket.IO)
- Private, bi-directional, event-driven messaging channel between applicant and hiring manager.
- Features delivery indicators, automated room generation per application context, and message history caching.

### 5. Service Record & Reputation Engine
- Cumulative **Employee Rating** (1.0 to 5.0) and algorithmic **Reliability Score** (derived from completion rate, punctual check-ins, and verified employer reviews).
- Eliminates standard resume friction by transforming verified task performance into portable workplace reputation.

### 6. Integrated Virtual Wallet (₹ INR)
- **Indian Currency (₹ INR):** Full native support for Indian numbering formatting (`₹1,250`, `₹15,000`).
- **Ledger Breakdown:** Real-time visibility into gross revenue, pending dispatches, cleared funds, and payout requests.
- **Payout Rails:** Ready for UPI (GPay, PhonePe, Paytm, BHIM) and direct NEFT/IMPS bank transfers.
- **Integrity:** Built with atomic MongoDB updates (`$inc`, transactions) preventing double-spend anomalies.

---

## 🏗 System Architecture & Project Structure

```text
NearbyHire/
├── backend/
│   ├── config/             # DB connectivity & third-party service configs
│   │   ├── db.js
│   │   └── socket.js
│   ├── controllers/        # Request processing & business logic
│   │   ├── authController.js
│   │   ├── businessController.js
│   │   ├── chatController.js
│   │   ├── jobController.js
│   │   ├── userController.js
│   │   └── walletController.js
│   ├── middleware/         # Security, validation, role verification
│   │   ├── authMiddleware.js
│   │   ├── errorMiddleware.js
│   │   └── roleMiddleware.js
│   ├── models/             # Mongoose ODM schemas & indexes
│   │   ├── Application.js
│   │   ├── BusinessProfile.js
│   │   ├── Message.js
│   │   ├── Job.js
│   │   ├── Transaction.js
│   │   ├── User.js
│   │   └── Wallet.js
│   ├── routes/             # Express API endpoint declarations
│   │   ├── authRoutes.js
│   │   ├── businessRoutes.js
│   │   ├── chatRoutes.js
│   │   ├── jobRoutes.js
│   │   └── walletRoutes.js
│   ├── utils/              # Calculation helpers, geocoders, formatters
│   │   ├── currencyFormatter.js
│   │   ├── geoCoder.js
│   │   └── scoreCalculator.js
│   ├── .env.example
│   ├── package.json
│   └── server.js           # Express app initialization & HTTP/Socket server
│
├── frontend/
│   ├── public/             # Static assets, manifests, icons
│   ├── src/
│   │   ├── assets/         # Visual branding, SVGs, base illustrations
│   │   ├── components/     # Atomic reusable UI components
│   │   │   ├── common/     # Buttons, Modals, Loaders, Badges
│   │   │   ├── layout/     # TopBar, BottomNav, ThreeDotMenu
│   │   │   ├── cards/      # JobCard, ApplicantCard, ReviewCard
│   │   │   └── chat/       # ChatBubble, MessageInput
│   │   ├── context/        # React Context (Auth, Location, Socket, Theme)
│   │   │   ├── AuthContext.jsx
│   │   │   ├── LocationContext.jsx
│   │   │   └── SocketContext.jsx
│   │   ├── hooks/          # Custom hooks (useGeoLocation, useFetch)
│   │   ├── pages/          # Primary view controllers
│   │   │   ├── Auth/       # Welcome, Login, Register
│   │   │   ├── Business/   # PostJob, Applicants, BusinessSettings
│   │   │   ├── Chat/       # ChatList, ActiveConversation
│   │   │   ├── Home/       # MainFeed, UrgentFeed, CategoryFilter
│   │   │   ├── Profile/    # Me, ServiceRecord, Settings
│   │   │   └── Wallet/     # EarningsOverview, WithdrawModal (₹ INR)
│   │   ├── services/       # Axios API client instances
│   │   │   ├── api.js
│   │   │   └── socketService.js
│   │   ├── styles/         # Global themes, animations, utilities
│   │   │   └── index.css
│   │   ├── utils/          # Indian Rupee formatters (Intl.NumberFormat 'en-IN')
│   │   │   └── formatCurrency.js
│   │   ├── App.jsx         # App router & context providers
│   │   └── main.jsx        # Root DOM mount
│   ├── .env.example
│   ├── package.json
│   ├── tailwind.config.js
│   └── vite.config.js
│
├── docs/                   # ER Diagrams, Wireframes, Postman Collections
├── screenshots/            # UI snapshots for presentation
├── .gitignore
├── LICENSE
└── README.md
```

---

## 🗄 Database Schemas & Models

NearbyHire implements standard entity relationships using Mongoose schemas:

```text
┌─────────────────┐       1:1       ┌─────────────────────┐
│      User       ├─────────────────┤   BusinessProfile   │
│  (Student/Biz)  │                 │ (Name, RegNo, Loc)  │
└────────┬────────┘                 └──────────┬──────────┘
         │                                     │
         │ 1:1                                 │ 1:N
         ▼                                     ▼
┌─────────────────┐       N:1       ┌─────────────────────┐
│     Wallet      │                 │         Job         │
│(₹ Bal, UPI, TX) │                 │ (GeoJSON, ₹ Pay)    │
└────────┬────────┘                 └──────────┬──────────┘
         │                                     │
         │ 1:N                                 │ 1:N
         ▼                                     ▼
┌─────────────────┐                 ┌─────────────────────┐
│   Transaction   │                 │     Application     │
│ (₹ Amt, Status) │                 │  (Status, Review)   │
└─────────────────┘                 └─────────────────────┘
```

### Job Schema with Indian Rupee (₹) Wage & Spatial Indexing
```javascript
// models/Job.js snippet
const JobSchema = new mongoose.Schema({
  title: { type: String, required: true },
  business: { type: mongoose.Schema.Types.ObjectId, ref: 'BusinessProfile', required: true },
  isUrgent: { type: Boolean, default: false },
  category: { type: String, required: true },
  wage: {
    amount: { type: Number, required: true }, // Amount in ₹ (INR)
    rateType: { type: String, enum: ['per_hour', 'per_day', 'fixed'], default: 'per_day' },
    currency: { type: String, default: 'INR' }
  },
  location: {
    type: {
      type: String,
      enum: ['Point'],
      default: 'Point'
    },
    coordinates: {
      type: [Number], // [Longitude, Latitude]
      required: true
    },
    address: String,
    city: String
  }
}, { timestamps: true });

JobSchema.index({ location: '2dsphere' });
```

### Wallet Schema (₹ INR & UPI)
```javascript
// models/Wallet.js snippet
const WalletSchema = new mongoose.Schema({
  student: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
  balance: { type: Number, default: 0.0 }, // Balance in ₹
  totalEarnings: { type: Number, default: 0.0 },
  currency: { type: String, default: 'INR' },
  payoutDetails: {
    upiId: { type: String, trim: true }, // e.g. student@okaxis
    accountNumber: String,
    ifscCode: String,
    accountHolderName: String
  }
}, { timestamps: true });
```

---

## 🔌 API Endpoints Reference

### Authentication Routes (`/api/v1/auth`)
| Method | Endpoint | Description | Access |
| :--- | :--- | :--- | :--- |
| `POST` | `/register` | Create a new Student or Business account | Public |
| `POST` | `/login` | Authenticate credentials and return JWT | Public |
| `GET` | `/me` | Get currently signed-in user payload | Private (All) |

### Job Management & Discovery (`/api/v1/jobs`)
| Method | Endpoint | Description | Access |
| :--- | :--- | :--- | :--- |
| `GET` | `/nearby` | Query jobs using `lng`, `lat`, and `distance` ($nearSphere) | Public |
| `GET` | `/urgent` | Fetch urgent hiring positions sorted by recency | Public |
| `POST` | `/` | Publish new employment posting with ₹ INR pay | Private (Business) |
| `PUT` | `/:id` | Update posting parameters | Private (Business) |
| `DELETE`| `/:id` | Soft/Hard delete posting | Private (Business) |

### Applications & Service Records (`/api/v1/applications`)
| Method | Endpoint | Description | Access |
| :--- | :--- | :--- | :--- |
| `POST` | `/:jobId/apply` | Submit student application | Private (Student) |
| `GET` | `/job/:jobId` | Fetch all applicants for a posted opening | Private (Business) |
| `PATCH`| `/:id/status` | Accept, Reject, or Mark Task as Completed | Private (Business) |
| `POST` | `/:id/review` | Submit rating, feedback, and adjust Reliability Score | Private (Business) |

### Financial / Wallet (`/api/v1/wallet`)
| Method | Endpoint | Description | Access |
| :--- | :--- | :--- | :--- |
| `GET` | `/balance` | Fetch total earnings and balance in ₹ (INR) | Private (Student) |
| `GET` | `/transactions`| List complete earnings & payout ledger in ₹ | Private (Student) |
| `POST` | `/withdraw` | Request payout to UPI ID / Indian Bank Account | Private (Student) |

---

## 📱 UI & Navigation Flow

The interface is engineered with a **mobile-first layout** adapted for fluid responsive interaction on desktop displays.

### Navigation Architecture
- **Welcome View:** Immediate role assignment:
  - `I'm Student` ➡️ Targeted registration with skills, academic tags, and verification docs.
  - `I'm Business Man` ➡️ Fast registration with company name and location.
  - `I Already Have an Account` ➡️ Direct route to credentials entry.
- **Bottom Navigation Bar:**
  1. 🏠 **Home:** Location breadcrumb, dynamic search, urgent postings, category tags.
  2. 💼 **Business:** Manage job listings, monitor applicant queues, view candidacies.
  3. 💳 **Wallet:** Visual ₹ INR balance breakdown, earnings summary, UPI withdrawal requests.
  4. 👤 **Me (Profile):** Dynamic reputation score, verified service history, account configuration.
- **Contextual Action Menus (⋮):**
  - *Home View:* Saved Jobs, Share App, Help.
  - *Business View:* My Job Posts, Business Settings, Help.
  - *Me View:* Settings, About App, Logout.

---

## 🚀 Local Setup & Installation Guide

### Prerequisites
- Node.js v18.0.0 or higher
- npm v9.0.0 or higher
- Local MongoDB daemon running OR a [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) cluster URI

### 1. Clone the Repository
```bash
git clone https://github.com/your-username/NearbyHire.git
cd NearbyHire
```

### 2. Configure the Backend
```bash
cd backend
npm install
cp .env.example .env
```
Populate the backend `.env` variables (see reference below). Then start the backend server:
```bash
# Development mode with hot-reloading
npm run dev
```

### 3. Configure the Frontend
In a new terminal window:
```bash
cd ../frontend
npm install
cp .env.example .env
```
Start the frontend development server:
```bash
npm run dev
```

The client will initialize at `http://localhost:5173` pointing to backend services running on `http://localhost:5000`.

---

## 🔑 Environment Variables Reference

### Backend (`/backend/.env`)
```ini
PORT=5000
NODE_ENV=development
MONGO_URI=mongodb+srv://<username>:<password>@cluster.mongodb.net/nearbyhire?retryWrites=true&w=majority
JWT_SECRET=your_super_secret_high_entropy_jwt_key_here
JWT_EXPIRE=30d
CLIENT_URL=http://localhost:5173
DEFAULT_CURRENCY=INR
```

### Frontend (`/frontend/.env`)
```ini
VITE_API_BASE_URL=http://localhost:5000/api/v1
VITE_SOCKET_URL=http://localhost:5000
VITE_DEFAULT_CURRENCY=INR
```

---

## 🧪 Testing & Quality Assurance

```bash
# Execute backend test suites (Jest + Supertest)
cd backend
npm run test

# Run ESLint validation checks across frontend modules
cd ../frontend
npm run lint
```

---

## 🤝 Contributing

Contributions make the open-source community an inspiring place to learn, inspire, and create. Any contributions you make are **greatly appreciated**.

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'feat: Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📄 License

Distributed under the MIT License. See [`LICENSE`](LICENSE) for more information.

---

<div align="center">
  <sub>Built with care for students and local businesses everywhere.</sub>
</div>