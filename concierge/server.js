import 'dotenv/config';
import express from 'express';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import OpenAI from 'openai';
import Database from 'better-sqlite3';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const dirname = path.dirname(fileURLToPath(import.meta.url));
const DEFAULT_ORIGINS = ['http://localhost:3000', 'http://127.0.0.1:3000'];

const business = Object.freeze({
  name: 'AuditLocal Demo Business',
  services: 'Website auditing, local online visibility reviews, and AI concierge demonstrations.',
  hours: 'Business hours have not been provided.',
  booking: 'Appointments are requested through the contact form; scheduling is not connected.',
  pricing: 'Pricing is provided after a consultation.',
  serviceArea: 'Please ask the team to confirm service availability.'
});

function readAllowedOrigins(override) {
  if (Array.isArray(override)) {
    return override.map((origin) => String(origin).trim()).filter(Boolean);
  }
  const configured = (process.env.ALLOWED_ORIGINS || DEFAULT_ORIGINS.join(','))
    .split(',')
    .map((origin) => origin.trim())
    .filter(Boolean);
  return configured.length > 0 ? configured : DEFAULT_ORIGINS;
}

function publicAgentId(value) {
  const id = typeof value === 'string' ? value.trim() : '';
  return /^[A-Za-z0-9_-]{10,128}$/.test(id) ? id : '';
}

function enforceOrigin(allowedOrigins) {
  const allowed = new Set(allowedOrigins);
  return function originGuard(req, res, next) {
    const origin = req.get('origin');
    if (origin && !allowed.has(origin)) {
      return res.status(403).json({ error: 'Origin not allowed.' });
    }
    if (origin) {
      res.setHeader('Access-Control-Allow-Origin', origin);
      res.setHeader('Vary', 'Origin');
      res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
      res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    }
    if (req.method === 'OPTIONS') return res.sendStatus(204);
    return next();
  };
}

export function createApp(options = {}) {
  const dbPath = options.dbPath ?? process.env.DATABASE_PATH ?? path.join(dirname, 'concierge.sqlite');
  const db = new Database(dbPath);
  if (dbPath !== ':memory:') db.pragma('journal_mode = WAL');
  db.exec(`CREATE TABLE IF NOT EXISTS leads (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    email TEXT,
    phone TEXT,
    question TEXT,
    created_at TEXT NOT NULL DEFAULT (datetime('now'))
  );`);

  const allowedOrigins = readAllowedOrigins(options.allowedOrigins);
  const agentId = publicAgentId(options.elevenlabsAgentId ?? process.env.ELEVENLABS_AGENT_ID);
  const requestLimit = Number.isInteger(options.rateLimitMax) && options.rateLimitMax > 0
    ? options.rateLimitMax
    : 45;

  const app = express();
  app.disable('x-powered-by');
  app.locals.db = db;
  app.use(helmet({ contentSecurityPolicy: false }));
  app.use(express.json({ limit: '16kb' }));
  app.use(express.static(path.join(dirname, 'public')));

  app.use('/api', rateLimit({
    windowMs: 15 * 60 * 1000,
    limit: requestLimit,
    standardHeaders: 'draft-7',
    legacyHeaders: false,
    message: { error: 'Too many requests. Please wait and try again.' }
  }));
  app.use('/api', enforceOrigin(allowedOrigins));

  app.get('/api/config', (req, res) => {
    res.json({
      name: business.name,
      assistant: 'ai',
      voiceSupported: Boolean(agentId),
      elevenlabsAgentId: agentId || null
    });
  });

  app.post('/api/chat', async (req, res) => {
    const question = typeof req.body?.message === 'string' ? req.body.message.trim() : '';
    if (!question || question.length > 900) {
      return res.status(400).json({ error: 'Enter a question up to 900 characters.' });
    }
    if (!process.env.OPENAI_API_KEY) {
      return res.status(503).json({ error: 'AI is not configured. Please contact the site administrator.' });
    }
    try {
      const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
      const result = await client.chat.completions.create({
        model: process.env.OPENAI_MODEL || 'gpt-4o-mini',
        temperature: 0.2,
        max_tokens: 220,
        messages: [
          {
            role: 'system',
            content: `You are an AI assistant, not a human. Only answer from this approved business data: ${JSON.stringify(business)}. If the answer is unknown, say you do not have verified information and suggest leaving a contact request. Do not invent hours, availability, prices, policies, bookings or guarantees. Never ask for sensitive information.`
          },
          { role: 'user', content: question }
        ]
      });
      res.json({
        reply: result.choices[0]?.message?.content || 'Please leave your contact information for a team response.'
      });
    } catch (error) {
      console.error('Chat provider error:', error?.status || 'unknown');
      res.status(502).json({ error: 'The assistant is temporarily unavailable. Please leave a contact request.' });
    }
  });

  // Leads are insert-only. There is no HTTP route to list, read, or export them.
  app.post('/api/leads', (req, res) => {
    const body = req.body || {};
    const name = body.name;
    const email = body.email;
    const phone = body.phone;
    const question = body.question;
    if (typeof name !== 'string' || name.trim().length < 2 || name.length > 100) {
      return res.status(400).json({ error: 'Please enter your name.' });
    }
    if (typeof email !== 'string' || typeof phone !== 'string' || email.length > 180 || phone.length > 40) {
      return res.status(400).json({ error: 'Provide a valid email or telephone number.' });
    }
    const emailTrimmed = email.trim();
    const phoneTrimmed = phone.trim();
    if ((!emailTrimmed && !phoneTrimmed) || (emailTrimmed && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailTrimmed))) {
      return res.status(400).json({ error: 'Provide a valid email or telephone number.' });
    }
    if (question != null && (typeof question !== 'string' || question.length > 1200)) {
      return res.status(400).json({ error: 'Message is too long.' });
    }
    db.prepare('INSERT INTO leads (name, email, phone, question) VALUES (?, ?, ?, ?)').run(
      name.trim(),
      emailTrimmed,
      phoneTrimmed,
      (typeof question === 'string' ? question : '').trim()
    );
    res.status(201).json({ success: true, message: 'Your request has been received.' });
  });

  app.get('/api/health', (req, res) => {
    res.json({ ok: true, aiConfigured: Boolean(process.env.OPENAI_API_KEY) });
  });

  return app;
}

function isDirectRun() {
  const entry = process.argv[1];
  if (!entry) return false;
  return import.meta.url === pathToFileURL(path.resolve(entry)).href;
}

if (isDirectRun()) {
  const port = Number(process.env.PORT) || 3000;
  const app = createApp();
  app.listen(port, () => {
    console.log(`AuditLocal concierge listening on port ${port}`);
  });
}
