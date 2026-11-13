# AuditLocal AI Concierge — first build

This is a **standalone staging prototype**. It has NOT been installed on the existing AuditLocal production or staging sites.

## Capabilities
- AI chat using an OpenAI server-side key and one approved demo knowledge base.
- Browser microphone speech-to-text (when supported by browser).
- Browser text-to-speech replies (when toggled on).
- Lead capture saved to a **local SQLite database** with confirmation after a successful write.
- Error handling and basic request rate limiting.

## Running locally
1. Install Node.js 20+ and `npm install` in this directory.
2. Copy `.env.example` to `.env`, configure `OPENAI_API_KEY`, keep the key server-side and set `ALLOWED_ORIGINS` appropriately.
3. Run `npm start` and visit http://localhost:3000.
4. Run `npm test` for basic route checks.

## Limitations and pre-launch requirements
- No production deployment, no embeddable cross-domain widget, and no tenant account system yet.
- No client admin/dashboard access or export; do not collect real leads in this demo until private auth, encryption, retention and access controls are added.
- The initial FAQ facts are placeholders and must be reviewed per client.
- Speech is native browser speech, **not** ElevenLabs or a live bidirectional real-time voice provider; functionality varies by browser.
- Protect data and backups and define consent/retention before publishing.
- Do not upload .env, API keys or SQLite databases to the public repository.
- Add authentication, secure multi-tenant storage, HTTPS reverse proxy, monitoring, audio consent and integration tests before real customer use.
- Confirm source/export from the ChatGPT builder before integrating with the real AuditLocal site.
