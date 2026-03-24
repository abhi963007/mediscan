 QR-Based Hospital Management System
Project Title: QR-Based Hospital Management System
Domain: Healthcare Information Technology
Tech Stack: React · Django · SQLite · Django REST Framework · JWT

Overview
A web-based hospital management system where every patient is issued a unique QR code upon registration. This QR code acts as a portable key to their complete medical history — consultations, prescriptions, lab reports, and billing — accessible instantly at any branch visit via a simple scan at reception.

Technology Stack
The system is built on a clean, decoupled architecture. The frontend is a React 18 single-page application built with Vite, using React Router for navigation, Axios for API communication, qrcode.react for generating QR codes client-side, and react-qr-reader for scanning. Styling is handled with Tailwind CSS.
The backend is a Django 4.x application exposing a RESTful API through Django REST Framework (DRF). Authentication is token-based using djangorestframework-simplejwt. The Python qrcode library with Pillow handles server-side QR generation and encoding. django-cors-headers manages cross-origin access between the React frontend and Django backend.
The database is SQLite, managed entirely through Django's ORM and migrations — requiring zero configuration for single-branch deployment. The architecture is designed so that migrating to PostgreSQL in the future requires only a one-line settings change, with no model or API modifications needed.

Module Breakdown
Module 1 — Patient Registration: Collects demographic data, assigns a Unique Health ID (UHID), and triggers QR code generation via the Django qrcode service. The QR is stored and also delivered digitally (SMS/email).
Module 2 — QR Code Engine: Core of the system. Django generates a signed QR payload linked to the UHID. The React frontend renders it for print or digital delivery, and react-qr-reader handles webcam-based scanning at reception desks.
Module 3 — Doctor Consultation & EMR: Doctors access a React-based EMR form. Data (diagnosis, vitals, prescriptions, notes) is submitted via Axios to a DRF ViewSet and persisted as a new Consultation record in SQLite, timestamped and linked to the patient's UHID.
Module 4 — Centralised Record Management: All patient records live in SQLite, structured across Django models (Patient, Consultation, Prescription, LabReport, Invoice). Every new visit appends to — never overwrites — the existing history.
Module 5 — Return Visit & History Access: On QR scan, the React frontend sends the decoded UHID to the Django API, which queries SQLite and returns the full consultation history. The doctor sees all past visits before the appointment begins.
Module 6 — Appointment Management: A React calendar interface backed by Django Appointment models. Supports booking, rescheduling, and cancellation with email/SMS notifications via Django signals.
Module 7 — Pharmacy Module: Pharmacists scan the patient QR to retrieve active digital prescriptions. The module tracks drug inventory and dispensed items via dedicated Django models, and flags drug interaction warnings.
Module 8 — Laboratory & Diagnostics: Doctors raise lab orders through the React interface; lab staff upload results (PDF/image via Pillow) linked to the patient record. Historical result trends are surfaced in the patient timeline view.
Module 9 — Billing & Payments: Auto-generates invoices from consultation, lab, and pharmacy charges — all fetched from SQLite via DRF. Supports insurance claim status tracking and downloadable PDF receipts.
Module 10 — Admin Dashboard: A React dashboard giving administrators real-time views of bed occupancy, staff schedules, department load, and revenue — powered by DRF aggregation endpoints over SQLite.
Module 11 — Role-Based Access Control & Audit: JWT-based authentication with role assignments (Patient, Receptionist, Doctor, Pharmacist, Lab Tech, Admin). Every record access and modification is written to an immutable AuditLog table in SQLite.