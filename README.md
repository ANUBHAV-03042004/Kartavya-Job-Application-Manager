<div align="center">

<img src="https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExOXdkaXA1aHluaGxndWc5eTc5a3h4bTJucDI5MXlpcWg1NDZtcGF0OCZlcD12MV9naWZzX3NlYXJjaCZjdD1n/Znfez0CBOVptG1VV0Z/giphy.gif" width="800" alt="Header Animation" />

<br/>

# 🎯 Kartavya — Job Application Manager

<img src="https://img.shields.io/badge/React-18+-61DAFB?style=for-the-badge&logo=react&logoColor=white" />
<img src="https://img.shields.io/badge/Node.js-Express-339933?style=for-the-badge&logo=node.js&logoColor=white" />
<img src="https://img.shields.io/badge/Database-PostgreSQL-336791?style=for-the-badge&logo=postgresql&logoColor=white" />
<img src="https://img.shields.io/badge/Auth-JWT%20Secured-f59e0b?style=for-the-badge&logo=jsonwebtokens&logoColor=white" />
<img src="https://img.shields.io/badge/Status-Live%20%26%20Deployed-22c55e?style=for-the-badge&logo=vercel&logoColor=white" />

<br/><br/>

> *"Your job search, organised. Every application tracked, every opportunity captured."*

<br/>
</div>

---

## 📘 About This Project

**Kartavya** is a full-stack **Job Application Manager** — a personal productivity tool built to help job seekers track every application they send, monitor their progress, and stay on top of their job search journey.

- 📋 **Track applications** — company, role, status, date, and notes in one place
- 📊 **Analytics dashboard** — visual insights into your application pipeline
- 🔐 **Secure authentication** — JWT-based login with security question recovery
- ☁️ **Cloud deployed** — backend on Render, accessible anywhere
- 🎨 **Branded UI** — custom Kartavya colour palette with a warm, modern design

Built for students, fresh graduates, and anyone navigating a serious job search.

---

## ✨ Key Features

<div align="center">

| Feature | Description |
|---|---|
| 📤 **Application Tracking** | Add, edit, delete job applications with full details |
| 🎯 **Status Pipeline** | Applied → Interview → Offer → Rejected flow |
| 📊 **Analytics** | Donut charts, bar graphs, hiring funnel & KPIs |
| 🔑 **JWT Authentication** | Secure signup, login, and session management |
| 🔐 **Security Questions** | Account recovery without email dependency |
| ⚙️ **Settings Panel** | Change password, manage security Q&A, delete account |
| 📱 **Responsive Design** | Works on desktop, tablet, and mobile |
| 🌿 **Kartavya Branding** | Custom 6-colour palette — Forest, Lime, Gold, Lemon, Flame, Sky |

</div>

---

## 🖼️ Tech Stack

```
Frontend  →  React 18 + Vite + CSS (Poppins + Nunito fonts)
Backend   →  Node.js + Express.js
Database  →  PostgreSQL + Sequelize ORM
Auth      →  JWT (7-day tokens) + bcrypt password hashing
Hosting   →  Render (backend) + Vite build and Netlify (frontend)
```

---

## 🛠️ How to Run Locally

### Step 1 — Clone the repository
```bash
git clone https://github.com/ANUBHAV-03042004/Kartavya.git
cd Kartavya
```

### Step 2 — Set up the backend
```bash
cd server
npm install
```

Create a `.env` file in `/server`:
```env
DATABASE_URL=your_postgresql_connection_string
JWT_SECRET=your_jwt_secret_key
PORT=5000
```

Start the server:
```bash
node index.js
```

### Step 3 — Set up the frontend
```bash
cd client
npm install
```

Create a `.env` file in `/client`:
```env
VITE_API_BASE_URL=http://localhost:5000
```

Start the dev server:
```bash
npm run dev
```

> 📌 Open [http://localhost:5173](http://localhost:5173) in your browser

---

## 📂 Project Structure

```
📦 Kartavya
 ┣ 📁 server
 ┃ ┣ 📜 index.js                   ← Express server entry point
 ┃ ┣ 📁 middleware
 ┃ ┃ ┗ 📜 Auth.js                  ← JWT verification middleware
 ┃ ┣ 📁 models
 ┃ ┃ ┣ 📜 User.js                  ← User model (Sequelize)
 ┃ ┃ ┗ 📜 JobApplication.js        ← Job application model
 ┃ ┗ 📁 routes
 ┃   ┣ 📜 Auth.js                  ← Signup, login, password, security Q
 ┃   ┗ 📜 JobApplication.js        ← CRUD for job applications
 ┣ 📁 client
 ┃ ┣ 📁 public
 ┃ ┃ ┗ 🖼️ kartavya_logo.png        ← Brand logo
 ┃ ┗ 📁 src
 ┃   ┣ 📜 App.jsx                  ← Root component + auth state
 ┃   ┣ 📜 main.jsx                 ← React entry point
 ┃   ┣ 📜 styles.css               ← Full Kartavya design system
 ┃   ┣ 📁 auth
 ┃   ┃ ┗ 📜 AuthPage.jsx           ← Login, signup, forgot password flow
 ┃   ┗ 📁 components
 ┃     ┣ 📜 Dashboard.jsx          ← Shell layout + sidebar + routing
 ┃     ┣ 📜 JobApplicationForm.jsx ← Add / edit application form
 ┃     ┣ 📜 JobApplicationList.jsx ← Filterable card grid of applications
 ┃     ┣ 📜 Analytics.jsx          ← Charts, KPIs, hiring funnel
 ┃     ┗ 📜 Settings.jsx           ← Account management panel
 ┗ 📜 README.md
```

---

## 🔌 API Endpoints

<div align="center">

| Method | Endpoint | Description |
|:---:|---|---|
| `POST` | `/api/auth/signup` | Register a new user |
| `POST` | `/api/auth/login` | Login and receive JWT |
| `GET` | `/api/auth/me` | Get logged-in user profile |
| `PATCH` | `/api/auth/change-password` | Update password |
| `POST` | `/api/auth/forgot-password` | Request reset token |
| `POST` | `/api/auth/reset-password` | Reset with token |
| `PATCH` | `/api/auth/security-question` | Set / update security question |
| `DELETE` | `/api/auth/account` | Permanently delete account |
| `GET` | `/api/job-applications` | Fetch all user applications |
| `POST` | `/api/job-applications` | Create new application |
| `PUT` | `/api/job-applications/:id` | Update an application |
| `DELETE` | `/api/job-applications/:id` | Delete an application |

</div>

---

## 🎨 Design System — Kartavya Palette

<div align="center">

| Colour | Hex | Usage |
|:---:|---|---|
| 🟡 **Sunflower Gold** | `#FBB02D` | Auth sidebar, tabs, highlights |
| 🟢 **Forest Moss** | `#5C8001` | Darkest green, section headers |
| 🌿 **Lime Moss** | `#7CB518` | Sidebar, form headers, primary buttons |
| 💛 **Golden Glow** | `#F3DE2C` | Edit banners, form status headers |
| 🟠 **Blaze Orange** | `#FB6107` | Danger actions, CTA gradients |
| 🔵 **Sky Blue** | `#5BC0EB` | Analytics accents, security section |

</div>

---

## 🧭 Application Flow

```
Landing / Auth Page
       │
       ├── Sign Up  →  Set Security Question  →  Dashboard
       └── Log In   →  Dashboard
                              │
                    ┌─────────┼──────────────┐
                    │         │              │
             My Applications  Analytics   Settings
             (Add / Edit /    (Charts +   (Password /
              Filter /         KPIs +      Security Q&A /
              Delete)          Funnel)     Delete Account)
```

---

## 🧪 Sample API Call

```js
// Add a new job application
const res = await fetch('/api/job-applications', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${token}`
  },
  body: JSON.stringify({
    companyName:     'Google',
    jobTitle:        'Frontend Engineer',
    status:          'Applied',
    applicationDate: '2025-03-01',
    jobLink:         'https://careers.google.com/...',
    notes:           'Applied via referral from LinkedIn.'
  })
});
```

**Response:**
```json
{
  "id": 42,
  "companyName": "Google",
  "jobTitle": "Frontend Engineer",
  "status": "Applied",
  "applicationDate": "2025-03-01"
}
```

---

## 📊 GitHub Contribution Graph

<div align="center">

<img src="https://github-readme-activity-graph.vercel.app/graph?username=ANUBHAV-03042004&theme=react-dark&hide_border=true&area=true&bg_color=0d1117&color=22c55e&line=fbb02d" />

</div>

## 📊 GitHub Stats

<div align="center">
  
<img height="170" src="https://github-readme-streak-stats.herokuapp.com/?user=ANUBHAV-03042004&theme=radical&hide_border=true&background=0d1117&ring=fbb02d&fire=fbb02d&currStreakLabel=22c55e" />

</div>

## 💻 Skills & Technologies Used

<div align="center">

![React](https://img.shields.io/badge/-React-61DAFB?style=for-the-badge&logo=react&logoColor=black)
![Node.js](https://img.shields.io/badge/-Node.js-339933?style=for-the-badge&logo=node.js&logoColor=white)
![Express](https://img.shields.io/badge/-Express.js-000000?style=for-the-badge&logo=express&logoColor=white)
![PostgreSQL](https://img.shields.io/badge/-PostgreSQL-336791?style=for-the-badge&logo=postgresql&logoColor=white)
![Sequelize](https://img.shields.io/badge/-Sequelize-52B0E7?style=for-the-badge&logo=sequelize&logoColor=white)
![JWT](https://img.shields.io/badge/-JWT-f59e0b?style=for-the-badge&logo=jsonwebtokens&logoColor=white)
![Vite](https://img.shields.io/badge/-Vite-646CFF?style=for-the-badge&logo=vite&logoColor=white)
![CSS3](https://img.shields.io/badge/-CSS3-1572B6?style=for-the-badge&logo=css3&logoColor=white)

</div>

---

## 🤝 Contribution Guidelines

Contributions are welcome! 🎉

```bash
# 1. Fork the repository
# 2. Create your branch
git checkout -b feature/your-feature-name

# 3. Make your changes with clear comments
# 4. Commit with a descriptive message
git commit -m "feat: add <feature-description>"

# 5. Push and open a Pull Request
git push origin feature/your-feature-name
```

**Ways to contribute:**

- ➕ Add new features (e.g. reminders, export to PDF)
- 🧹 Improve code structure and readability
- 💬 Add inline comments and documentation
- 🚀 Optimise API performance or state management
- 🎨 Refine UI/UX and mobile responsiveness
- 🐛 Report or fix bugs

> 📌 All skill levels welcome — even small improvements matter.

---

## 🎯 Roadmap

> Features planned for future versions:

- [ ] 📁 Export applications to CSV / PDF
- [ ] 🔔 Follow-up reminders and deadline alerts
- [ ] 📅 Calendar view for interview dates
- [ ] 🏷️ Custom tags and categories per application
- [ ] 📱 Progressive Web App (PWA) support

---

## 🎯 Motivation

> *"Your job search, organised. Every application tracked, every opportunity captured."*

Kartavya helps you move from chaos to clarity:

<div align="center">

| Without Kartavya | With Kartavya |
|---|---|
| 😵 Lost track of applications | ✅ Every app logged and visible |
| 📧 Digging through emails | ✅ One-click status filter |
| 🤷 No idea what's working | ✅ Analytics show your patterns |
| 😰 Missed follow-ups | ✅ Notes and dates per application |
| 📊 No sense of progress | ✅ Hiring funnel at a glance |

</div>

---

## 👨‍💻 Author

<div align="center">

**Anubhav Kumar Srivastava**

[![GitHub](https://img.shields.io/badge/GitHub-ANUBHAV--03042004-181717?style=for-the-badge&logo=github&logoColor=white)](https://github.com/ANUBHAV-03042004)

*Building full-stack products, one feature at a time.* 🚀

</div>

---

<div align="center">

**Happy Job Hunting with Kartavya 🎯❤️**

*Track smart • Apply focused • Land your dream role 🚀*

<br/>

<img src="https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExOXdkaXA1aHluaGxndWc5eTc5a3h4bTJucDI5MXlpcWg1NDZtcGF0OCZlcD12MV9naWZzX3NlYXJjaCZjdD1n/XeQ5g2yEomEHiv2AfO/giphy.gif" width="400" alt="Footer Animation" />

<br/><br/>

<img src="https://img.shields.io/badge/Made%20with-❤️%20by%20Anubhav-5C8001?style=for-the-badge&logo=github&logoColor=white" />
<img src="https://img.shields.io/badge/Powered%20by-React%20%26%20Node.js-61DAFB?style=for-the-badge&logo=react&logoColor=white" />

</div>
