# Chief Minister's Works Management System (CM-WMS)

A web-based project monitoring and management platform developed for the Government of Rajasthan to monitor infrastructure projects, budget announcements, project progress, and implementation across various government departments.

## 📌 Project Overview

The **Chief Minister's Works Management System (CM-WMS)** is designed to provide a centralized platform for tracking and monitoring government infrastructure projects in Rajasthan.

The system facilitates the management of budget announcements, Mega Projects, constituency-wise development progress, project implementation, and monitoring reports.

It helps government authorities maintain transparency, monitor project execution, identify implementation delays, and make informed decisions through centralized data management and reporting.

## 🎯 Key Objectives

- Centralize infrastructure project information across government departments.
- Monitor the physical and financial progress of ongoing projects.
- Track budget announcements and their implementation status.
- Monitor Mega Projects with a project cost of ₹100 crore or above.
- Identify project delays and implementation-related issues.
- Generate reports and dashboards for effective decision-making.
- Improve coordination and transparency in project monitoring.

## ✨ Key Modules

### 1. Budget Announcement
- Manage and track government budget announcements.
- Monitor the implementation status of announced works.
- Track financial allocations and project progress.

### 2. Mega Projects Dashboard
- Monitor infrastructure projects with a project cost of ₹100 crore or above.
- View project-wise details and implementation progress.
- Track physical and financial performance.

### 3. Constituency Progress
- Monitor development works across assembly constituencies.
- View constituency-wise project information and progress.

### 4. Red Flag Reports
- Identify projects facing implementation challenges.
- Monitor issues such as budget overruns, delayed work commencement, and contractor-related problems.
- Support timely intervention through issue tracking.

### 5. User Management
- Manage system users and their access.
- Support role-based access and authentication.

### 6. MIS Reports
- Generate management information reports.
- Provide consolidated project data for monitoring and analysis.

### 7. Mobile Application
- Support project monitoring and access to relevant project information through a mobile interface.

## 🛠️ Technology Stack

| Layer | Technologies |
|---|---|
| Frontend | React.js, Vite, JavaScript |
| Backend | Node.js, Express.js |
| Database | Microsoft SQL Server |
| Database Connectivity | `mssql` |
| API Communication | REST APIs |
| Authentication | SSO Integration |

## 🏗️ System Architecture

CM-WMS follows a client-server architecture.

```text
          Frontend (React + Vite)
                    |
                    |
              REST APIs
                    |
                    |
          Backend (Node.js)
                    |
               Express.js
                    |
                    |
          Microsoft SQL Server
```

**Frontend:** Provides the user interface, dashboards, forms, project information, and reporting functionality.

**Backend:** Handles business logic, API requests, data processing, and communication with the database.

**Database:** Stores project details, budget information, department records, user information, monitoring data, and related records.

## 📂 Project Structure

```text
CM-WMS/
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── assets/
│   │   └── ...
│   ├── public/
│   └── package.json
│
├── backend/
│   ├── routes/
│   ├── controllers/
│   ├── db/
│   ├── middleware/
│   ├── ...
│   └── package.json
│
└── README.md
```

*Note: The structure above represents the main application organization. Individual files and folders may vary depending on the implementation.*

## ⚙️ Installation and Setup

### Prerequisites

Ensure that the following tools are installed:

- Node.js and npm
- Microsoft SQL Server
- SQL Server Management Studio (SSMS)
- Git

### 1. Clone the Repository

```bash
git clone <repository-url>
cd CM-WMS
```

### 2. Setup the Backend

```bash
cd backend
npm install
```

Configure the database connection using your local SQL Server credentials and the project's environment configuration.

Start the backend using the development script configured in `backend/package.json`.

### 3. Setup the Frontend

Open a new terminal:

```bash
cd frontend
npm install
```

Start the React development server using the script configured in `frontend/package.json`.

### 4. Access the Application

Once both servers are running, access the frontend through:

```text
http://localhost:5173
```

The backend API runs on the configured server port.

## 🔐 Environment Configuration

Configure the necessary environment variables for the backend, including:

- SQL Server host and port
- Database name
- Database username
- Database password
- Authentication and SSO configuration
- Backend server port

**Important:** Never commit database credentials, authentication secrets, or other sensitive configuration details to the repository.

## 🚀 Key Functionalities

- Centralized project onboarding and management.
- Department-wise and constituency-wise project monitoring.
- Physical and financial progress tracking.
- Budget and project cost monitoring.
- Project issue and red-flag tracking.
- Project-specific reporting and monitoring.
- Integration with Microsoft SQL Server.
- RESTful API-based frontend-backend communication.

## 🔮 Future Enhancements

- Enhanced analytical dashboards and visualizations.
- Advanced project performance monitoring.
- Improved automated alerts for delayed projects.
- Expanded mobile application capabilities.
- Further integration with government digital services.

## 👩‍💻 Development

This project was developed as part of an internship project associated with the Department of Information Technology (DoIT), Government of Rajasthan.

The system focuses on improving the monitoring, management, and reporting of government infrastructure projects through a centralized web-based platform.

---

**Project:** Chief Minister's Works Management System (CM-WMS)  
**Organization:** Department of Information Technology (DoIT), Government of Rajasthan  
**Technology:** React.js | Node.js | Express.js | Microsoft SQL Server
