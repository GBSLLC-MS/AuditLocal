import { describe, test } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import net from 'node:net';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { createApp } from '../server.js';

const dirname = path.dirname(fileURLToPath(import.meta.url));
const realDbPath = path.join(dirname, '..', 'concierge.sqlite');
const allowedOrigins = ['http://localhost:3000', 'http://127.0.0.1:3000'];

function testApp(options = {}) {
  return createApp({
    dbPath: ':memory:',
    allowedOrigins,
    rateLimitMax: 45,
    ...options
  });
}

async function withServer(app, run) {
  const server = app.listen(0, '127.0.0.1');
  await new Promise((resolve, reject) => {
    server.once('error', reject);
    if (server.listening) resolve();
    else server.once('listening', resolve);
  });
  const root = `http://127.0.0.1:${server.address().port}`;
  try {
    await run(root);
  } finally {
    await new Promise((resolve, reject) => server.close((err) => (err ? reject(err) : resolve())));
    app.locals.db.close();
  }
}

describe('concierge API', { concurrency: 1 }, () => {
  test('importing the server does not listen or create the leads database', async () => {
    assert.equal(fs.existsSync(realDbPath), false);
    const probe = net.createServer();
    await new Promise((resolve, reject) => {
      probe.once('error', reject);
      probe.listen(3000, '127.0.0.1', resolve);
    });
    await new Promise((resolve, reject) => probe.close((err) => (err ? reject(err) : resolve())));
  });

  test('health, chat validation, and lead capture', async () => {
    const app = testApp();
    await withServer(app, async (root) => {
      const health = await fetch(`${root}/api/health`);
      assert.equal(health.status, 200);
      assert.equal((await health.json()).ok, true);

      const invalid = await fetch(`${root}/api/leads`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: 'A', email: 'bad', phone: '' })
      });
      assert.equal(invalid.status, 400);

      const valid = await fetch(`${root}/api/leads`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Origin: 'http://localhost:3000' },
        body: JSON.stringify({ name: 'Demo Test', email: 'demo@example.com', phone: '', question: 'Test lead' })
      });
      assert.equal(valid.status, 201);
      assert.equal((await valid.json()).success, true);
      assert.equal(valid.headers.get('access-control-allow-origin'), 'http://localhost:3000');
      const stored = app.locals.db.prepare('SELECT name, email, question FROM leads').get();
      assert.deepEqual(stored, { name: 'Demo Test', email: 'demo@example.com', question: 'Test lead' });

      const chat = await fetch(`${root}/api/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: '' })
      });
      assert.equal(chat.status, 400);
    });
    assert.equal(fs.existsSync(realDbPath), false);
  });

  test('lead validation rejects incomplete requests and accepts either contact method', async () => {
    const app = testApp();
    await withServer(app, async (root) => {
      const post = (body) => fetch(`${root}/api/leads`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
      });

      assert.equal((await post({ name: 'A', email: 'ada@example.com', phone: '' })).status, 400);
      assert.equal((await post({ name: 'Ada Lovelace', email: 'not-an-email', phone: '' })).status, 400);
      assert.equal((await post({ name: 'Ada Lovelace', email: '', phone: '' })).status, 400);
      assert.equal((await post({ name: 'Ada Lovelace', email: 'ada@example.com', phone: '' , question: 'x'.repeat(1201) })).status, 400);
      assert.equal((await post({ email: 'ada@example.com', phone: '' })).status, 400);

      const byPhone = await post({ name: 'Ada Lovelace', email: '', phone: '555-0100', question: 'Call me' });
      assert.equal(byPhone.status, 201);
      const byEmail = await post({ name: 'Grace Hopper', email: 'grace@example.com', phone: '' });
      assert.equal(byEmail.status, 201);

      const rows = app.locals.db.prepare('SELECT name, email, phone FROM leads ORDER BY id').all();
      assert.deepEqual(rows, [
        { name: 'Ada Lovelace', email: '', phone: '555-0100' },
        { name: 'Grace Hopper', email: 'grace@example.com', phone: '' }
      ]);
    });
  });

  test('disallowed origins are rejected and cannot store a lead', async () => {
    const app = testApp();
    await withServer(app, async (root) => {
      const rejected = await fetch(`${root}/api/leads`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Origin: 'https://evil.example'
        },
        body: JSON.stringify({ name: 'Mallory', email: 'mallory@example.com', phone: '' })
      });
      assert.equal(rejected.status, 403);
      assert.equal((await rejected.json()).error, 'Origin not allowed.');
      assert.equal(rejected.headers.get('access-control-allow-origin'), null);
      assert.equal(app.locals.db.prepare('SELECT COUNT(*) AS n FROM leads').get().n, 0);

      const preflight = await fetch(`${root}/api/chat`, {
        method: 'OPTIONS',
        headers: { Origin: 'https://evil.example', 'Access-Control-Request-Method': 'POST' }
      });
      assert.equal(preflight.status, 403);

      const allowedPreflight = await fetch(`${root}/api/chat`, {
        method: 'OPTIONS',
        headers: { Origin: 'http://127.0.0.1:3000', 'Access-Control-Request-Method': 'POST' }
      });
      assert.equal(allowedPreflight.status, 204);
      assert.equal(allowedPreflight.headers.get('access-control-allow-origin'), 'http://127.0.0.1:3000');
    });
  });

  test('chat returns 503 when no API key is configured', async () => {
    const previous = process.env.OPENAI_API_KEY;
    delete process.env.OPENAI_API_KEY;
    const app = testApp();
    try {
      await withServer(app, async (root) => {
        const missing = await fetch(`${root}/api/chat`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ message: 'What do you offer?' })
        });
        assert.equal(missing.status, 503);
        assert.match((await missing.json()).error, /not configured/i);

        const tooLong = await fetch(`${root}/api/chat`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ message: 'a'.repeat(901) })
        });
        assert.equal(tooLong.status, 400);
      });
    } finally {
      if (previous === undefined) delete process.env.OPENAI_API_KEY;
      else process.env.OPENAI_API_KEY = previous;
    }
  });

  test('api rate limit returns 429', async () => {
    const app = testApp({ rateLimitMax: 2 });
    await withServer(app, async (root) => {
      assert.equal((await fetch(`${root}/api/health`)).status, 200);
      assert.equal((await fetch(`${root}/api/health`)).status, 200);
      const limited = await fetch(`${root}/api/health`);
      assert.equal(limited.status, 429);
      assert.match((await limited.json()).error, /too many requests/i);
    });
  });

  test('leads cannot be read back through HTTP', async () => {
    const app = testApp();
    await withServer(app, async (root) => {
      await fetch(`${root}/api/leads`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: 'Hidden Lead', email: 'hidden@example.com', phone: '' })
      });
      for (const path of ['/api/leads', '/api/leads/1', '/concierge.sqlite']) {
        const response = await fetch(`${root}${path}`);
        assert.equal(response.status, 404, path);
        const body = await response.text();
        assert.equal(body.includes('hidden@example.com'), false);
      }
    });
  });

  test('config publishes a voice agent id only when it is set', async () => {
    const withoutVoice = testApp({ elevenlabsAgentId: '' });
    await withServer(withoutVoice, async (root) => {
      const body = await (await fetch(`${root}/api/config`)).json();
      assert.equal(body.assistant, 'ai');
      assert.equal(body.voiceSupported, false);
      assert.equal(body.elevenlabsAgentId, null);
      assert.equal(body.OPENAI_API_KEY, undefined);
    });

    const withVoice = testApp({ elevenlabsAgentId: 'agent_9201m73bzadmf0yr6mxa4q8s98n0' });
    await withServer(withVoice, async (root) => {
      const body = await (await fetch(`${root}/api/config`)).json();
      assert.equal(body.voiceSupported, true);
      assert.equal(body.elevenlabsAgentId, 'agent_9201m73bzadmf0yr6mxa4q8s98n0');
    });
  });
});
