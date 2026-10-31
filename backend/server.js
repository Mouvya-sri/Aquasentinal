import express from 'express';
import cors from 'cors';
import multer from 'multer';
import sharp from 'sharp';
import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import crypto from 'node:crypto';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const app = express();
const PORT = Number(process.env.PORT || 4000);
const dataDir = path.join(__dirname, 'data');
const uploadDir = path.join(__dirname, 'uploads');
const dbFile = path.join(dataDir, 'analyses.json');
await fs.mkdir(dataDir, { recursive: true });
await fs.mkdir(uploadDir, { recursive: true });

app.use(cors({ origin: process.env.CLIENT_ORIGIN || 'http://localhost:5173' }));
app.use(express.json({ limit: '1mb' }));
app.use('/uploads', express.static(uploadDir));

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, uploadDir),
  filename: (_req, file, cb) => cb(null, `${Date.now()}-${crypto.randomUUID()}${path.extname(file.originalname).toLowerCase()}`)
});
const upload = multer({
  storage,
  limits: { fileSize: 100 * 1024 * 1024 },
  fileFilter: (_req, file, cb) => {
    const ok = file.mimetype.startsWith('image/') || file.mimetype.startsWith('video/');
    cb(ok ? null : new Error('Only image and video uploads are supported.'), ok);
  }
});

async function readAnalyses() {
  try { return JSON.parse(await fs.readFile(dbFile, 'utf8')); }
  catch { return []; }
}
async function writeAnalyses(rows) {
  const tmp = `${dbFile}.tmp`;
  await fs.writeFile(tmp, JSON.stringify(rows, null, 2));
  await fs.rename(tmp, dbFile);
}

app.get('/api/health', (_req, res) => res.json({ status: 'ok', service: 'AquaSentinel API', time: new Date().toISOString() }));
app.get('/api/analyses', async (_req, res, next) => {
  try { res.json({ analyses: await readAnalyses() }); } catch (e) { next(e); }
});
app.get('/api/analyses/:id', async (req, res, next) => {
  try {
    const item = (await readAnalyses()).find(a => a.id === req.params.id);
    if (!item) return res.status(404).json({ error: 'Analysis not found.' });
    res.json({ analysis: item });
  } catch (e) { next(e); }
});
app.post('/api/analyze', upload.single('media'), async (req, res, next) => {
  try {
    if (!req.file) return res.status(400).json({ error: 'Choose an image or video first.' });
    const kind = req.body.kind === 'Video' || req.file.mimetype.startsWith('video/') ? 'Video' : 'Image';
    const id = `AS-${Date.now().toString().slice(-6)}`;
    let enhancedUrl = null;
    let enhancement = 'not_applicable';
    if (kind === 'Image') {
      try {
        const outputName = `${path.parse(req.file.filename).name}-enhanced.jpg`;
        await sharp(req.file.path).rotate().normalize().modulate({ saturation: 1.08 }).sharpen({ sigma: 0.7 }).jpeg({ quality: 90 }).toFile(path.join(uploadDir, outputName));
        enhancedUrl = `/uploads/${outputName}`;
        enhancement = 'processed';
      } catch {
        enhancement = 'unsupported_or_failed';
      }
    }
    const analysis = {
      id, name: req.file.originalname, kind,
      date: new Date().toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' }),
      status: kind === 'Image' && enhancement === 'processed' ? 'Enhanced · review' : 'Uploaded · review',
      objects: 0, quality: enhancement === 'processed' ? 'Enhanced' : '—',
      originalUrl: `/uploads/${req.file.filename}`, enhancedUrl,
      fileSize: req.file.size, mimeType: req.file.mimetype,
      enhancement, detectionStatus: 'model_not_configured',
      note: 'Image enhancement uses a deterministic image-processing pipeline. Object detection is not enabled; no objects or confidence scores are claimed.'
    };
    const rows = await readAnalyses();
    rows.unshift(analysis);
    await writeAnalyses(rows.slice(0, 500));
    res.status(201).json({ analysis, message: enhancement === 'processed' ? 'Image enhancement complete and scan saved. Object detection still needs a trained model.' : 'Upload saved. No detection model is configured yet.' });
  } catch (e) { next(e); }
});
app.delete('/api/analyses/:id', async (req, res, next) => {
  try {
    const rows = await readAnalyses();
    const item = rows.find(a => a.id === req.params.id);
    if (!item) return res.status(404).json({ error: 'Analysis not found.' });
    for (const url of [item.originalUrl, item.enhancedUrl]) {
      if (url) await fs.rm(path.join(uploadDir, path.basename(url)), { force: true });
    }
    await writeAnalyses(rows.filter(a => a.id !== req.params.id));
    res.json({ deleted: true, id: req.params.id });
  } catch (e) { next(e); }
});
app.get('/api/analyses/:id/report', async (req, res, next) => {
  try {
    const item = (await readAnalyses()).find(a => a.id === req.params.id);
    if (!item) return res.status(404).json({ error: 'Analysis not found.' });
    res.json({ report: { title: 'AquaSentinel Field Report', generatedAt: new Date().toISOString(), ...item } });
  } catch (e) { next(e); }
});
app.use((err, _req, res, _next) => {
  console.error(err.message);
  const status = err instanceof multer.MulterError ? 400 : 500;
  res.status(status).json({ error: err.message || 'Unexpected server error.' });
});
app.listen(PORT, () => console.log(`AquaSentinel API listening at http://localhost:${PORT}`));
