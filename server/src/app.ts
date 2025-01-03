import express from 'express';
import cors from 'cors';
import rateLimit from 'express-rate-limit';
import 'dotenv/config';
import imageRoutes from './routes/imageRoutes';
import { errorHandler } from './middleware/errorHandler';
import path from 'path';
import { upload } from './config/storage';

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per windowMs
});
app.use(limiter);

const isProduction = process.env.NODE_ENV === "production";
const uploadPath = isProduction
  ? '/opt/render/project/src/uploads'
  : path.join(__dirname, '../uploads');

app.use('/uploads', express.static(uploadPath));

app.get("/", (req, res) => {
    res.json({
        msg: "Hello, server is working..."
    })
})
app.use('/api/images', imageRoutes);

// app.use(errorHandler);

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
