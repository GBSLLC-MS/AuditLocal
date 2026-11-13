# AuditLocal AI Concierge

Standalone staging prototype for a text chat, an optional ElevenLabs voice assistant, and local lead capture. This directory is **not** the live AuditLocal site, and it has not been installed on the production or staging sites.

Requires **Node.js 20, 22, or 24** (see `engines` in `package.json`).

## Run

```bash
cd concierge
npm install
cp .env.example .env
npm start
```

Open http://localhost:3000.

`OPENAI_API_KEY` stays on the server. Without it, chat replies with a clear "not configured" response and the contact form still works. Set `ELEVENLABS_AGENT_ID` to show the voice widget on this page. Leave it unset to keep text chat only.

`better-sqlite3` is pinned to **12.9.0** because that release ships prebuilt binaries for Node 20, 22, and 24. The 11.x line has no Node 24 build (install then falls through to `node-gyp` and fails), and 12.10+ drops the Node 20 prebuild.

## Test

```bash
npm test
```

No environment variables are required. Importing `server.js` does not listen on a port and does not open the real leads file. Tests use an in-memory database.

## Voice demo page

`demo/index.html` is one static file: HTML and CSS, no build. Host that file on any static host (GitHub Pages, Netlify, S3, or similar).

The page embeds the public ElevenLabs agent **Jack John**. The browser does not need an API key. To point the page at a different agent, change the single `ELEVENLABS_AGENT_ID` constant near the bottom of `demo/index.html`.

Preview locally:

```bash
npx --yes serve demo
```

The agent only starts a conversation on domains in its ElevenLabs allowlist. After you deploy the demo, add that host (for example `https://demo.example.com`) in the agent's security settings. `file://` and any host that is not on the allowlist will load the page, but the assistant will not connect until the owner adds the origin.

The widget on the concierge app (`npm start`) uses the same allowlist. Add `http://localhost:3000` there if you want to talk to the agent while developing.

## Lead access

`POST /api/leads` stores a name, email and/or phone, and an optional message. There is **no HTTP route** to list, read, or export leads, and the database file is not in the public web root.

Leads are written to `concierge.sqlite` in this directory (or `DATABASE_PATH` if you set it), using SQLite WAL mode. Review them on the machine that runs the server, with an authorized SQLite client:

```bash
sqlite3 concierge.sqlite "SELECT created_at, name, email, phone, question FROM leads ORDER BY id;"
```

Do not commit the database, its `-wal` / `-shm` files, or `.env`. Add authentication and a retention policy before collecting real customer leads. This prototype is not that system.

## API notes

- `ALLOWED_ORIGINS` is a comma-separated list of browser origins allowed to call `/api/*`. The default is `http://localhost:3000,http://127.0.0.1:3000`. A request that sends a different `Origin` is rejected with `403`. Tools that send no `Origin` (for example `curl` on the server) are still accepted; this is not a login.
- `/api/*` is rate limited (45 requests per 15 minutes per client).
- Chat answers only from the small placeholder business profile in `server.js`. Replace that profile before using this with a real client, and do not put private operating material in this public repository.

## Before real customer use

- Keep secrets, lead databases, and private business material out of this public repo.
- Put the app behind HTTPS, restrict who can read the SQLite file, and add authentication before anyone relies on the leads.
- Confirm the ElevenLabs allowlist includes the real demo host.
