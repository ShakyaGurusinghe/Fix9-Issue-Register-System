# Fix9 Issue Register System

A comprehensive system to track and manage issues related to different projects, built using **Angular** and **Node.js**.

## 🎨 Design

The user interface and user experience design for this project were created in Figma. 

[👉 View the Figma Design File Here](https://www.figma.com/design/dX43f7M0SvvYOh1H7ex4uY/Issue_Tracking?node-id=0-1&p=f&t=hgGqOXYK3f4hSSzw-0) 

## 🚀 Tech Stack

### Frontend
- **Angular 21** - Frontend framework
- **Bootstrap 5 & Bootstrap Icons** - UI component library and icons
- **RxJS** - Reactive programming 
- **TypeScript** - Strongly typed programming language

### Backend
- **Node.js & Express.js 5** - Server environment and web framework
- **MySQL** - Relational database (using `mysql2`)
- **JWT (JSON Web Tokens)** - Secure authentication and authorization
- **bcryptjs** - Password hashing

## ⚙️ Prerequisites
- [Node.js](https://nodejs.org/) (v18 or higher recommended)
- [Angular CLI](https://angular.io/cli)
- [MySQL Server](https://dev.mysql.com/downloads/mysql/)

## 🛠️ Installation & Setup

### 1. Clone the repository
```bash
git clone https://github.com/ShakyaGurusinghe/Fix9-Issue-Register-System.git
cd Fix9-Issue-Register-System
```

### 2. Backend Setup
Open a terminal and navigate to the backend directory:
```bash
cd backend
npm install
```
*Note: Make sure to set up your `.env` file with your MySQL database credentials and JWT secret before starting the server.*

Start the backend server in development mode:
```bash
npm run dev
```

### 3. Frontend Setup
Open a second terminal and navigate to the frontend directory:
```bash
cd frontend
npm install
```

Start the Angular development server:
```bash
npm start
```

Navigate to `http://localhost:4200/` in your browser to view the application.

## 📂 Project Structure
- `/frontend` - Contains the Angular client application, components, and services.
- `/backend` - Contains the Express.js REST API, database configuration, and authentication logic.
