
# 🎬 B2W – AI Video Recommendation Assistant

B2W (**Browse to Watch**) is an **AI-powered video recommendation system** built with **TypeScript + Vite + React**. It integrates with the **Google Gemini API** to deliver personalized video suggestions, making content discovery smarter and more engaging.



## 📑 Table of Contents
- [Overview](#overview)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
  - [Environment Setup](#environment-setup)
  - [Run Locally](#run-locally)
- [Usage](#usage)
- [Contributing](#contributing)
- [License](#license)
- [Acknowledgements](#acknowledgements)


## 🌍 Overview
B2W helps users **find the right video at the right time**. Instead of endlessly scrolling, the assistant uses AI to recommend videos tailored to your preferences. This project is ideal for:
- Hackathon prototypes
- Content platforms
- Personalized entertainment apps
- AI-driven recommendation research


## ✨ Features
- 🔹 **AI Recommendations**: Uses Gemini API for intelligent video suggestions.  
- 🔹 **Interactive UI**: Built with React + TypeScript for modular components.  
- 🔹 **Fast Development**: Powered by Vite for instant builds and hot reload.  
- 🔹 **Customizable Services**: Extendable architecture with `components/` and `services/`.  
- 🔹 **Developer Friendly**: Easy setup with npm and clear configuration.  


## 🛠 Tech Stack
- **Frontend**: React + TypeScript  
- **Bundler**: Vite  
- **API Integration**: Google Gemini API  
- **Languages**: TypeScript (98%), HTML (2%)  


## 📂 Project Structure
```
b2w/
│── components/        # Reusable UI components
│── services/          # API and business logic
│── App.tsx            # Main application entry
│── index.tsx          # React DOM rendering
│── index.html         # Root HTML file
│── constants.ts       # Global constants
│── types.ts           # TypeScript type definitions
│── package.json       # Dependencies and scripts
│── vite.config.ts     # Vite configuration
│── tsconfig.json      # TypeScript configuration
│── metadata.json      # Project metadata
│── .gitignore         # Git ignore rules
```


## 🚀 Getting Started

### ✅ Prerequisites
- **Node.js** (v18+ recommended)  
- **npm** (v9+ recommended)  
- A valid **Gemini API key**  

### 📦 Installation
```bash
git clone https://github.com/MadhuTiwari-345/b2w.git
cd b2w
npm install
```

### 🔑 Environment Setup
Create a `.env.local` file in the root directory:
```bash
GEMINI_API_KEY=your_api_key_here
```

### ▶️ Run Locally
```bash
npm run dev
```
Visit **http://localhost:5173** to view the app.



## 🌐 Deployment
You can deploy B2W easily on:
- **Vercel**
- **Netlify**
- **GitHub Pages**



## 📖 Usage
- Input your **preferences or search query**.  
- The app fetches **video recommendations** using Gemini API.  
- Browse results in an interactive UI.  
- Extend services to integrate with external video platforms (YouTube, Vimeo, etc.).  



## 🤝 Contributing
Contributions are welcome!  
1. Fork the repo  
2. Create a feature branch (`git checkout -b feature-name`)  
3. Commit changes (`git commit -m "Add feature"`)  
4. Push (`git push origin feature-name`)  
5. Open a Pull Request  



## 🙏 Acknowledgements
- [Google Gemini API](https://ai.google.dev/)  
- [Vite](https://vitejs.dev/)  
- [React](https://react.dev/)  
- Inspiration from hackathons and AI-driven content discovery projects.  

