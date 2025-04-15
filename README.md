# 🚀 Next.js Full Stack Project

This is a Next.js project bootstrapped with create-next-app, designed for scalability, performance, and full-stack development using Vercel for frontend deployment and Render for server/backend deployment.

## 🧑‍💻 Getting Started (Development)

Run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Then open [http://localhost:3000](http://localhost:3000) in your browser to view your app.

Start editing by modifying `app/page.tsx`. The page auto-updates as you save changes.

💡 This project uses `next/font` to optimize font loading and features Geist, Vercel's modern font family.

## 📦 Deployment Setup

### 🌐 Frontend (Next.js) - Vercel

The frontend is deployed using Vercel, providing seamless CI/CD, preview deployments, and edge-optimized performance.

Steps to deploy:

1. Push your code to GitHub.
2. Visit [vercel.com/new](https://vercel.com/new).
3. Import your GitHub repo.
4. Set the framework as Next.js (Vercel auto-detects it).
5. Configure environment variables under Project Settings > Environment Variables.
6. Click Deploy.

🔗 Frontend URL: https://your-frontend-project.vercel.app

### ⚙️ Backend (Node/Express or any server) - Render

Your server is deployed on Render, a great platform for backend services and APIs.

Steps to deploy:

1. Push your server code to a separate GitHub repository (or folder if monorepo).
2. Go to [render.com](https://render.com).
3. Click on "New Web Service".
4. Connect your GitHub repo and choose the backend folder/repo.
5. Define:
   - Build Command: `npm install` (or equivalent)
   - Start Command: `npm start` or your entry file (`node server.js`)
   - Environment Variables: Set your secrets/tokens
6. Click Create Web Service and let Render build and deploy your backend.

🔗 Backend URL: https://your-backend-service.onrender.com

## 🌍 Environment Variables

Be sure to configure these in both Vercel and Render:

```env
# Common examples:
NEXT_PUBLIC_API_BASE_URL=https://your-backend-service.onrender.com
JWT_SECRET=your_jwt_secret
DATABASE_URL=your_database_url
```

## 📚 Learn More

- 📘 [Next.js Documentation](https://nextjs.org/docs) - Full feature breakdown.
- 🎓 [Learn Next.js](https://nextjs.org/learn) - Hands-on tutorial.
- 💻 [GitHub - Next.js](https://github.com/vercel/next.js/) - Contribute or explore the source.

## ✨ Tech Stack

- ✅ Next.js 14+ (App Router)
- 🎨 Tailwind CSS
- 🧠 TypeScript
- ⚙️ Render (Node.js Backend/API)
- 🚀 Vercel (Frontend Deployment)
- 📡 RESTful APIs / MongoDB / JWT

## 🛠️ Project Structure (App Directory)

```bash
app/
  ├── page.tsx         # Home route
  ├── layout.tsx       # Global layout
  ├── components/      # Shared UI
  ├── lib/             # Helpers & utils
  └── styles/          # Tailwind + custom CSS
```

## ✅ Production-Ready & Scalable

This project is designed with deployment scalability and performance in mind. From optimized fonts and image loading to backend integration and deployment-ready configuration, it's built to go live with confidence.