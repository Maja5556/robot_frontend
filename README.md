# Robot Management System

This is the frontend application for managing robot blueprints and instances, built with **Angular 21**.

## 🏗️ Architectural Overview

The application is designed with a clear separation between data management and graphical drawing:

- **Robot Types**: Used to define blueprints, including names, dimensions, and visual sketches.
- **Robots**: Used to manage specific instances of robots linked to a chosen Robot Type.
- **Sketch Component**: A reusable module powered by **Paper.js** that allows users to draw vector paths directly on a canvas.
- **API Service**: A centralized service that handles all communication with the backend REST API.

---

## ⚙️ Setup & Installation

### 1. Prerequisites
- **Node.js**: Version 20 or higher.
- **npm**: Version 10 or higher.
- **Angular CLI**: Install globally using `npm install -g @angular/cli`.

### 2. Installation
Navigate to the project directory and install the required dependencies:
```bash
npm install
```

### 3. Backend Configuration
Before running the app, ensure it is pointing to your backend server. Open `src/app/api.service.ts` and update the following line if necessary:
```typescript
baseUrl = 'http://localhost:5000';
```

---

## 🚀 Running the Application

### Development Server
To start the application locally, run:
```bash
npm start
```
Once started, navigate to `http://localhost:4200` in your browser.

### Building for Production
To create a production-ready build in the `dist/` folder, run:
```bash
npm run build
```

### Running Tests
To execute unit tests using the Vitest runner, run:
```bash
npm test
```

---
*Generated for the Robot Management Project.*
