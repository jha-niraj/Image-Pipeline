# Image Inpainting Project

An image inpainting widget that allows users to upload an image, draw a mask, and export both the original and mask images.

## Project Overview

### Front-End (React + Vite)
- **Image Upload:** Supports JPEG/PNG formats.
- **Mask Drawing:** Users can draw masks using a brush tool.
- **Export Mask:** Masks can be exported as separate images.
- **Side-by-Side Display:** Original and mask images are shown together.

### Back-End (Node.js + TypeScript + PostgreSQL)
- **Image Storage:** Uploads and stores images.
- **Metadata Management:** Saves image metadata in PostgreSQL.
- **API Access:** Provides endpoints for fetching images and masks.

## How to Run the Project Locally

1. **Clone the Repository:**
git clone https://github.com/jha-niraj/Image-Pipeline.git


2. **Install Dependencies:**
- Front-End:
  ```
  cd client
  npm install
  ```
- Back-End:
  ```
  cd ../server
  npm install
  ```

3. **Set Up the Database:**
- Create a PostgreSQL database.
- Update `.env` in the server folder:
  ```
  DATABASE_URL=postgres://username:password@localhost:5432/your-database
  ```
- Run migrations:
  ```
  cd server
  npx prisma migrate
  ```

4. **Start the Application:**
- Back-End:
  ```
  cd server
  npm run dev
  ```
- Front-End:
  ```
  cd client
  npm run dev
  ```

## Features

- **Image Upload** and Mask Drawing.
- **Brush Size Control** for masks.
- **Export Functionality** for masks.

## Libraries Used

- **Front-End:** `react`, `vite`, `react-canvas-draw`
- **Back-End:** `express`, `typescript`, `postgres`, `dotenv`, `typeorm`

## Live Demo

Try out the live demo [here](https://image-pipeline-lhel.vercel.app).
