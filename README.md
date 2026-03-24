# 🏥 MediScan: Seamless QR-Based Hospital Management System

[![GitHub Stars](https://img.shields.io/github/stars/abhi963007/mediscan?style=for-the-badge&color=0F6E56)](https://github.com/abhi963007/mediscan/stargazers)
[![License: MIT](https://img.shields.io/badge/License-MIT-0F6E56?style=for-the-badge)](https://opensource.org/licenses/MIT)
[![Vite](https://img.shields.io/badge/Vite-8A2BE2?style=for-the-badge&logo=vite&logoColor=white)](https://vitejs.dev/)
[![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)](https://reactjs.org/)
[![Django](https://img.shields.io/badge/Django-092E20?style=for-the-badge&logo=django&logoColor=white)](https://www.djangoproject.com/)

**MediScan** is a modern, full-stack Hospital Management System (HMS) designed to revolutionize patient care through secure QR technology. It streamlines patient registration, medical history access, and prescription management into a seamless, paperless workflow.

---

## ✨ Key Features

- **🚀 Instant QR Registration**: Generate unique medical QR codes for patients within seconds.
- **🛡️ Secure Data Protection**: Role-based access control (Patient, Doctor, Staff) ensures sensitive data is only seen by authorized personnel.
- **📖 Centralized Medical Records**: Instant access to patient history, current medications, and past consultations via a simple scan.
- **⚡ Streamlined Prescriptions**: Digitize and store prescriptions directly linked to the patient's identity.
- **📊 Interactive Dashboard**: Real-time analytics for hospital admins tracking scans, registrations, and consultations.
- **🎨 Premium UI/UX**: Fast, responsive, and animated user interface built with Framer Motion and Tailwind CSS.

---

## 🛠️ Tech Stack

### Frontend
- **Framework**: React 19 + TypeScript
- **Bundler**: Vite
- **Styling**: Tailwind CSS + Custom Design System
- **Animations**: Framer Motion
- **Icons**: Lucide React
- **Networking**: Axios + React Router

### Backend
- **Framework**: Django REST Framework
- **Language**: Python 3.x
- **Database**: SQLite3 (Development) / PostgreSQL (Optional Support)
- **Auth**: JWT-based Authentication
- **Media**: Secure Image Handling for Patient Documents

---

## 🚀 Getting Started

### Prerequisites
- [Node.js](https://nodejs.org/) (v18 or higher)
- [Python](https://www.python.org/) (v3.10 or higher)
- [Git](https://git-scm.com/)

### Installation

1. **Clone the Repository**
   ```bash
   git clone https://github.com/abhi963007/mediscan.git
   cd mediscan
   ```

2. **Setup Frontend**
   ```bash
   # Install dependencies
   npm install
   
   # Start the development server
   npm run dev
   ```

3. **Setup Backend**
   ```bash
   # Create a virtual environment
   python -m venv venv
   
   # Activate it (Windows)
   .\venv\Scripts\activate
   
   # Activate it (macOS/Linux)
   source venv/bin/activate
   
   # Install Django & dependencies (if requirements.txt exists)
   pip install django djangorestframework django-cors-headers
   
   # Run migrations
   python manage.py makemigrations
   python manage.py migrate
   
   # Start the Django server
   python manage.py runserver
   ```

---

## 📸 Project Screenshots

> *Coming soon! (Add your own screenshots here)*

---

## 👥 Roles & Access Control

| Role | Access Level |
| :--- | :--- |
| **Patient** | View own QR code, history, and prescriptions. |
| **Doctor** | Scan patient QRs, add/edit history, and write prescriptions. |
| **Staff** | Register new patients, manage appointments, and issue ID cards. |
| **Admin** | Full system oversight, user management, and analytics. |

---

## 🤝 Contributing

Contributions are what make the open-source community such an amazing place to learn, inspire, and create. Any contributions you make are **greatly appreciated**.

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📄 License

Distributed under the MIT License. See `LICENSE` for more information.

---

## 📧 Support & Contact

- **Maintained by**: [Abhimanyu](https://github.com/abhi963007)
- **Project Link**: [https://github.com/abhi963007/mediscan](https://github.com/abhi963007/mediscan)

Built with ❤️ for Healthcare Providers.
