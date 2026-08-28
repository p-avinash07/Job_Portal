# 🚀 Job Portal

**🌍 Live Demo:** [Check out the live app here!](https://job-portal-nine-coral-93.vercel.app/login)

Hey there! Welcome to the repo for my Job Portal. 

I built this project to make the whole job search and recruitment process a lot smoother by throwing some really cool AI features into the mix. Instead of just being another job board, this app acts as a smart matchmaker between job seekers and recruiters.

It's split into two sides: one for **Job Seekers** and one for **Recruiters**.

## What's inside?

### For the Job Seekers:
* **Upload your Resume:** You can upload your PDF/Word resumes easily.
* **AI Resume Scanning:** See how well your resume actually matches the job description (so you don't get filtered out by standard ATS software).
* **Mock Interviews:** My favorite feature. You can do a practice round of interview questions with our AI to get immediate feedback.
* **Clean UI:** I put a lot of effort into making it look like a premium, modern SaaS app. Registration, login, and browsing jobs should all feel super snappy.

### For the Recruiters:
* **Dashboard:** A clean table and dashboard view to see all your active job postings.
* **Applicant Review:** You can click into any job and easily download or read through applicant resumes.
* **AI Insights:** Quick stats on how well an applicant matched the job requirements.

## Tech Stack 🛠️

I wanted to keep things pretty modern and fast, so here's what I used:
* **Frontend:** React 19 + Vite (it's ridiculously fast).
* **Styling:** Tailwind CSS (with some custom CSS in `index.css` for glassmorphism and animations).
* **Icons:** Lucide React.
* **Routing:** Standard React Router.
* **Backend Hookup:** It's hooked up to a Spring Boot backend, mostly using `axios` for fetching.
* **Backend Framework:** Spring Boot 4.0.3 with Spring Security, JPA/Hibernate, and MySQL.
* **Database:** MySQL with Hibernate ORM.

## A quick note on the design

I'm a big fan of good UI, so you'll notice a lot of custom color palettes, hover micro-animations, and a nice split-screen login. It uses Tailwind, but I relied pretty heavily on standard CSS properties to get the glassmorphism effect and smooth animations working just right.

## How to run it locally

### Prerequisites

- **Node.js** (v16 or higher) and **npm** for the frontend
- **Java 17** for the backend
- **Maven** for building the Spring Boot backend
- **MySQL 8.0** or higher for the database

### Backend Setup (Spring Boot)

1. **Navigate to the backend directory**
   ```bash
   cd UserRegisterSPT/Jobportal
   ```

2. **Configure the database connection**
   - Create a `.env` file in the root of the backend directory with your MySQL credentials:
   ```env
   url=jdbc:mysql://localhost:3306/jobportal
   username=root
   password=your_mysql_password
   mail=your_email@gmail.com
   mailpassword=your_app_password
   ```

   - Alternatively, update `src/main/resources/application.properties` directly:
   ```properties
   spring.datasource.url=jdbc:mysql://localhost:3306/jobportal
   spring.datasource.username=root
   spring.datasource.password=your_mysql_password
   ```

3. **Create the MySQL database**
   ```bash
   mysql -u root -p
   CREATE DATABASE jobportal;
   EXIT;
   ```

4. **Build the backend with Maven**
   ```bash
   mvn clean install
   ```

5. **Run the Spring Boot server**
   ```bash
   mvn spring-boot:run
   ```
   - The backend will start on `http://localhost:8080`

### Frontend Setup (React + Vite)

1. **Navigate to the frontend directory**
   ```bash
   cd Frontend/JobPortal
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Run the development server**
   ```bash
   npm run dev
   ```
   - The frontend will be available at `http://localhost:5173`

4. **(Optional) Build for production**
   ```bash
   npm run build
   ```
   - This creates an optimized build in the `dist` folder

### Verify Everything is Running

- **Backend API:** Visit `http://localhost:8080` (you should see Spring Boot running)
- **Frontend App:** Visit `http://localhost:5173` (React dev server)
- **Database:** Ensure MySQL is running and the `jobportal` database is created

Now you're all set! The frontend will communicate with the backend via the configured API endpoints.
