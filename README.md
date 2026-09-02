# Nurse in Your Pocket

> **An AI-powered women's health companion that helps young women make informed healthcare decisions through trusted health guidance, symptom support, period tracking, appointment management, and clinic preparation.**

## 🌍 Overview

Nurse in Your Pocket is an AI-powered mobile-first healthcare application built to improve access to reliable health information for young women, particularly those who rely on public healthcare services.

Many young women feel intimidated when seeking reproductive and general healthcare because of fear of judgment, long clinic queues, or limited access to trustworthy medical information. Nurse in Your Pocket provides a safe, private space where users can learn about common health concerns, prepare for clinic visits, keep track of their health, and receive AI-assisted guidance while encouraging professional medical care whenever necessary.

> **Nurse in Your Pocket does not replace healthcare professionals. It is designed to educate, support, and encourage users to seek medical attention when appropriate.**

---

# 🚨 Problem Statement

In many South African communities, especially among young women and teenagers, access to healthcare is often accompanied by several challenges:

- Fear of judgment when seeking reproductive healthcare.
- Long waiting times at public clinics.
- Limited access to trustworthy health information.
- Difficulty remembering appointments and personal health history.
- Lack of a single platform that combines education, organisation, and AI-assisted healthcare support.

These barriers often delay people from seeking the care they need.

---

# 💡 Our Solution

Nurse in Your Pocket is designed to bridge this gap by providing an intelligent healthcare companion that enables users to:

- Learn about common health concerns.
- Prepare for clinic visits.
- Track menstrual cycles.
- Organise healthcare appointments.
- Store basic health information securely.
- Receive AI-assisted symptom guidance with built-in safety escalation.
- Access trusted healthcare education in one place.

The application focuses on supporting—not replacing—professional medical advice.

---

# ✨ Features

## 🤖 Nompilo AI Assistant

An AI-powered healthcare companion that:

- Answers general health questions.
- Helps users understand common symptoms.
- Encourages professional medical care.
- Detects emergency situations and immediately advises users to seek urgent medical assistance.

---

## ❤️ Symptom Checker

Users can describe their symptoms and receive:

- Educational guidance.
- Possible health explanations.
- Self-care recommendations where appropriate.
- Safety-first escalation for severe symptoms.

---

## 🌸 Period Tracker

- Track menstrual cycles.
- Record period start and end dates.
- View estimated upcoming periods.

---

## 📅 Appointment Management

Users can:

- Record clinic appointments.
- View upcoming appointments.
- Keep track of their healthcare schedule.

---

## 👤 Health Profile

Store important personal healthcare information such as:

- Allergies
- Medications
- Existing medical conditions
- Emergency information

---

## 📚 Health Library

A curated educational library containing trusted information on:

- Women's health
- Sexual and reproductive health
- General wellness
- Preventive healthcare

---

## 🔐 Secure Authentication

- Email sign up
- Email login
- Password reset
- Google Authentication
- Protected routes using Supabase Authentication

---

# 🏗 Tech Stack

## Frontend

- React
- Vite
- TypeScript
- Tailwind CSS

## Backend

- FastAPI
- Python

## Database

- Supabase PostgreSQL

## Authentication

- Supabase Authentication

## AI

- OpenAI API

---

# 📂 Project Structure

```
frontend/
├── src/
├── components/
├── pages/
├── lib/

backend/
├── app/
├── api/
├── services/
├── schemas/

supabase/
└── migrations/
```

---

# ⚙ Installation

## Clone the repository

```bash
git clone https://github.com/LatoyaMatai633k/nurse-in-your-pocket.git

cd nurse-in-your-pocket
```

---

## Frontend

```bash
cd frontend

cp .env.example .env

npm install

npm run dev
```

---

## Backend

```bash
cd backend

python -m venv .venv

source .venv/Scripts/activate

pip install -r requirements.txt

uvicorn app.main:app --reload
```

---

# 📸 Screenshots

> Screenshots will be added after deployment.

---

# 🚀 Future Enhancements

- Multilingual support (English, isiZulu, isiXhosa, Sesotho)
- Offline mode for low-connectivity communities
- Push notifications and appointment reminders
- Voice conversations with Nompilo
- Medication reminders
- Nearby clinic locator
- Health record export
- Wearable device integration

---

# 🩺 Medical Disclaimer

Nurse in Your Pocket is intended for educational and informational purposes only.

It does **not** diagnose, treat, cure, or replace qualified healthcare professionals.

Users experiencing severe symptoms or medical emergencies should immediately contact their nearest healthcare facility or emergency services.

---

# 📄 License

This project is licensed under the MIT License.