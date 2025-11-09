
<p align="center">
  <a>
    <img src="https://raw.githubusercontent.com/UxHarshit/CMS/refs/heads/master/public/android-chrome-512x512.png" width="150" alt="CodeContestPro Logo">
  </a>
</p>

<h1 align="center">
CodeContestPro
</h1>

<h2 align="center">Open-source Coding Contest Management Platform</h2>

<div align="center">

[![Node.js](https://img.shields.io/badge/Node.js-v20+-green)](https://nodejs.org/)
[![Docker](https://img.shields.io/badge/Docker-Ready-blue)](https://www.docker.com/)
[![License](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)
[![GitHub Stars](https://img.shields.io/github/stars/UxHarshit/CMS?style=social)](https://github.com/UxHarshit/CMS/stargazers)

</div>

---

<p align="center">
  <img src="/images/image.png" alt="CodeContestPro Screenshot" width="800" style="border-radius: 12px; box-shadow: 0 10px 30px rgba(0,0,0,0.3)">
</p>

> CodeContestPro helps developers, universities, and coding clubs organize programming contests, manage problems, and evaluate code submissions using Judge0.

---

## Overview

CodeContestPro is a full-stack open-source system for running coding competitions.  
It includes an Astro + React frontend, an Express + Sequelize backend, and optional Judge0 and Redis services for code execution and task queues.

- Frontend: Astro + React + TailwindCSS  
- Backend: Express.js + Sequelize (MySQL)  
- Judge0: Code Execution Engine  
- Redis: Job Queue  
- Dockerized for easy deployment

---

## Features

### For Participants
- Secure login and registration (JWT)
- Participate in contests
- Solve problems and run test cases
- View rankings and leaderboards
- Manage profiles and submissions

### For Administrators
- Add, edit, and manage problems and contests
- Manage users and institutions
- Email integration with AWS SES or SMTP
- Monitor logs and contest activity

---

## Tech Stack

| Layer | Technology |
|:--|:--|
| Frontend | Astro, React, TailwindCSS, Radix UI |
| Backend | Express.js, Sequelize ORM, MySQL |
| Auth | JWT, bcrypt |
| Queue | Bull + Redis |
| Code Execution | Judge0 |
| Containerization | Docker, Docker Compose |

---

## Project Structure

```

CMS/
├── backend/            # Express backend
│   ├── config/         # DB & environment configs
│   ├── controllers/    # API logic
│   ├── middlewares/    # Auth & validation
│   ├── models/         # Sequelize models
│   ├── routes/         # API routes
│   ├── utils/          # Helper scripts
│   └── server.js       # Backend entry
├── src/                # Astro + React frontend
│   ├── components/     # React components
│   ├── pages/          # Astro pages
│   ├── layouts/        # Shared layouts
│   └── global.css      # Styles
├── docker-compose.yaml
└── README.md

````

---

## Getting Started (Local)

### 1. Clone the repository
```bash
git clone https://github.com/UxHarshit/CMS.git
cd CMS
````

### 2. Configure environment variables

Create `backend/.env`:

```bash
JWT_SECRET=your-secret-key
DB_USER=your_mysql_user
DB_PASSWORD=your_mysql_password
DB_HOST=localhost
DB_NAME=cms
PORT=5000
SERVER_MAIL=your_email@example.com
SERVER_MAIL_PASSWORD=your_email_password
```

### 3. Install dependencies

Frontend:

```bash
npm install
```

Backend:

```bash
cd backend
npm install
```

### 4. Run locally

Backend:

```bash
npm run dev
```

Frontend:

```bash
npm run dev
```

* Frontend → [http://localhost:4321](http://localhost:4321)
* Backend → [http://localhost:5000](http://localhost:5000)

---

## Docker Deployment

### Run Full Stack (using your existing docker-compose.yaml)

```bash
docker compose up --build
```

Stop services:

```bash
docker compose down
```

Ensure `backend/.env` exists before running.

---

## Run Individual Containers

### Backend (Express + Sequelize)

```bash
cd backend
docker build -t codecontestpro-backend .
docker run -d \
  --name codecontestpro-backend \
  -p 5000:5000 \
  --env-file ./.env \
  codecontestpro-backend
```

### Frontend (Astro + React)

```bash
docker build -t codecontestpro-frontend -f DockerFile .
docker run -d \
  --name codecontestpro-frontend \
  -p 4321:4321 \
  -e REACT_APP_BASE_URL=http://localhost:5000 \
  codecontestpro-frontend
```

### MySQL Database

```bash
docker run -d \
  --name codecontestpro-db \
  -p 3306:3306 \
  -e MYSQL_DATABASE=cms \
  -e MYSQL_USER=your_mysql_user \
  -e MYSQL_PASSWORD=your_mysql_password \
  -e MYSQL_ROOT_PASSWORD=your_mysql_password \
  mysql:8.0
```

### Judge0 API

```bash
docker run -d \
  --name judge0 \
  -p 2358:2358 \
  judge0/judge0:latest
```

---

## API Overview

| Endpoint             | Method  | Description         |
| -------------------- | ------- | ------------------- |
| `/api/auth/register` | POST    | Register a new user |
| `/api/auth/login`    | POST    | Log in              |
| `/api/contest`       | GET     | Fetch all contests  |
| `/api/problems/:id`  | GET     | Get problem details |
| `/api/admin/*`       | Various | Admin operations    |

---

## Contributing

1. Fork the repository
2. Create a branch:

```bash
git checkout -b feature/new-feature
```

3. Commit your changes:

```bash
git commit -m "Add new feature"
```

4. Push and open a Pull Request:

```bash
git push origin feature/new-feature
```

---

## License

This project is licensed under the **MIT License**.

---

## Contact

Maintainer: [@UxHarshit](https://github.com/UxHarshit)
Email: [harshitkatheria7890@gmail.com](mailto:harshitkatheria7890@gmail.com)

<p align="center">
  <sub>Developed and maintained with ❤️ by the <a href="mailto:harshitkatheria7890@gmail.com">Harshit</a>.</sub>
</p>
