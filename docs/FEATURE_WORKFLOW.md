# Feature-by-feature contribution workflow

Use one branch and one focused change at a time. This keeps your GitHub history understandable and makes it easy to explain your own contribution.

## Before coding

1. Pull the latest `main` branch.
2. Create a branch named `feature/short-description`.
3. Read the relevant file from the project map in the root README.
4. Write down the behavior you expect before changing code.

## While coding

- Keep API calls in `src/services/api.js` rather than writing `fetch()` in page components.
- Keep sample data in `src/data/demoData.js` and label it as sample data.
- Keep reusable page/UI components in `src/components/`.
- Keep backend routes and processing in `backend/`.
- Avoid committing `.env`, uploads, local database files, `node_modules`, or build output.

## Before pushing

```bash
npm run build
```

Also run the backend and manually test the changed flow in the browser. Then:

```bash
git add .
git commit -m "feat: short description of change"
git push -u origin feature/short-description
```

Open a Pull Request and describe: what changed, why it changed, how to test it, and any known limitation.
