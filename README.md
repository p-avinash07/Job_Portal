# 🚀 Job Portal

**🌍 Live Demo:** [Check out the live app here!] (https://job-portal-nine-coral-93.vercel.app/login)

Hey there! Welcome to the repo for my Job Portal. 

I built this project to make the whole job search and recruitment process a lot smoother by throwing some really cool AI features into the mix. Instead of just being another job board, this app actually scans resumes like an ATS and even includes an AI mock interview feature so candidates can practice before the real thing.

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
* **Routing:** standard React Router.
* **Backend Hookup:** It's hooked up to a Spring Boot backend, mostly using `axios` for fetching.

## A quick note on the design
I'm a big fan of good UI, so you'll notice a lot of custom color palettes, hover micro-animations, and a nice split-screen login. It uses Tailwind, but I relied pretty heavily on standard CSS properties where it made sense for things like custom gradients.


