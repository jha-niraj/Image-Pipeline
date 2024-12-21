import { Router } from 'express';
import { uploadOriginal, uploadMask, getImagePair, getAllImagePairs } from '../controllers/imageControllers';
import { upload } from '../config/storage';

const router = Router();

router.post('/upload', upload.single('image'), uploadOriginal);
router.post('/:id/mask', upload.single('image'), uploadMask);
router.get('/:id', getImagePair);
router.get('/', getAllImagePairs);

export default router;