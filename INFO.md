# SplitWise Expense Tracker - Docker Setup and Deployment

## Project Overview
This is a React-based expense tracking web app inspired by SplitWise. The app allows users to create groups, add expenses, split costs evenly among group members, and view settlements.

## Docker Containerization

The app is containerized using Docker to simplify deployment and ensure consistent environments.

### Dockerfile Highlights

- Uses a **multi-stage build** to produce an optimized production build inside a Node.js environment (`node:18-alpine`).
- Serves the built static files using a lightweight NGINX server (`nginx:stable-alpine`).
- Exposes port `80` for web traffic.
- Minimizes image size and increases security by using unprivileged NGINX user.

### How to Build and Run Locally

1. Build the Docker image:

docker build -t splitwise-expense-tracker .


3. Access the app via [http://localhost:3000](http://localhost:3000)

### Notes

- The container serves the React app from NGINX for high performance.
- Docker ensures that all dependencies and configurations are packaged together.

## Alternative Deployment (Without Docker)

You can also deploy the app by running:

npm run build


which generates a static production build in the `build/` folder.  
This folder can be hosted on any static web server such as NGINX, Apache, Netlify, or Firebase Hosting.

---

## Firebase Setup & Firestore Index Configuration

- The app uses Firebase Authentication and Firestore database.
- A composite Firestore index on `expenses` for `groupId` (ascending) and `date` (descending) is required for efficient querying.
- Make sure this index is created in Firebase Console under Firestore > Indexes for the app to run successfully.

## Development

- React 18 with Hooks
- Firebase SDK v9 modular imports
- Material-UI (MUI) v5 with MUI X Date and Time Pickers v6

## How to Run Locally Without Docker

1. Clone the repo:

git clone <repo-url>
cd splitwise-expense-tracker


2. Install dependencies:

npm install

3. Start the development server:

npm start

text

---

Feel free to open issues or contribute via pull requests.

---

*This project was bootstrapped with Create React App and containerized using Docker.*
