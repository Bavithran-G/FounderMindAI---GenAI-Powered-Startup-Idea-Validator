# Deployment TODO (Vercel frontend + Render backend)

- [x] Update frontend to use env var `VITE_API_BASE_URL` instead of hardcoded `/api/analyze`.

- [x] Ensure SSE parsing still works with the absolute backend URL.

- [ ] Deploy backend to Render (Web Service using `server/main.py` + uvicorn).

- [ ] Capture Render backend URL.
- [ ] Deploy frontend to Vercel with build command `npm run build`.
- [ ] Set Vercel env var `VITE_API_BASE_URL` to Render backend base URL.
- [ ] Verify end-to-end streaming: submit idea → pipeline updates.

