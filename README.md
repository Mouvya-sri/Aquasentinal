# AquaSentinel — Ocean Field Intelligence

A React + Vite workspace paired with an Express API. The design direction is a field-station console rather than a generic SaaS dashboard: deep-ocean surfaces, expedition/field-station labeling, live API state, and image-processing workflow.

## Run locally

Requires Node.js 18+.

Terminal 1 — backend:
```bash
cd backend
npm install
npm run dev
```

Terminal 2 — frontend (from the project root):
```bash
npm install
npm run dev
```

Open the Vite URL shown in the terminal. Vite proxies `/api` and `/uploads` to `http://localhost:4000`.

## Backend routes
- `GET /api/health` — API status
- `GET /api/analyses` and `GET /api/analyses/:id` — persisted scan history
- `POST /api/analyze` — multipart upload (`media` file and `kind` field), saves record and attempts image enhancement
- `GET /api/analyses/:id/report` — report data
- `DELETE /api/analyses/:id` — delete record and associated uploaded files

Uploaded files are stored in `backend/uploads`; metadata is persisted to `backend/data/analyses.json`. This is a simple local development persistence layer, not a production database. Replace it with PostgreSQL/SQLite before deployment and add authentication/authorization, rate limits, retention policies, and virus scanning.

## Important capability boundary

The API uses Sharp to apply deterministic image normalization, mild saturation and sharpening to supported images. It does **not** perform AI object detection, segmentation, underwater color restoration trained on domain data, or video frame analysis. The API explicitly marks detection as `model_not_configured`; the frontend's sample object overlays are illustrative only. To claim real detection, connect a trained model (for example, a fine-tuned YOLO/Detectron model) and return actual classes, confidence values and bounding boxes. Video uploads are currently stored, not analyzed.
