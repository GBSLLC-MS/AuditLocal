import 'dotenv/config';
import express from 'express';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import OpenAI from 'openai';
import Database from 'better-sqlite3';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const app = express();
const dirname = path.dirname(fileURLToPath(import.meta.url));
const db = new Database(path.join(dirname, 'concierge.sqlite'));
db.pragma('journal_mode = WAL');
db.exec(`CREATE TABLE IF NOT EXISTS leads (
 id INTEGER PRIMARY KEY AUTOINCREMENT,
 name TEXT NOT NULL,
 email TEXT,
 phone TEXT,
 question TEXT,
 created_at TEXT NOT NULL DEFAULT (datetime('now'))
);`);
const allowedOrigins = (process.env.ALLOWED_ORIGINS || 'http://localhost:3000').split(',').map(s => s.trim());
app.disable('x-powered-by');
app.use(helmet({contentSecurityPolicy: false}));
app.use(express.json({limit:'16kb'}));
app.use(express.static(path.join(dirname,'public')));
app.use('/api', rateLimit({windowMs:15*60*1000, limit:45, standardHeaders:'draft-7', legacyHeaders:false}));
const business = Object.freeze({
 name:'AuditLocal Demo Business',
 services:'Website auditing, local online visibility reviews, and AI concierge demonstrations.',
 hours:'Business hours have not been provided.',
 booking:'Appointments are requested through the contact form; scheduling is not connected.',
 pricing:'Pricing is provided after a consultation.',
 serviceArea:'Please ask the team to confirm service availability.'
});
app.get('/api/config',(req,res)=>res.json({name:business.name,voiceSupported:true}));
app.post('/api/chat',async(req,res)=>{
 const question=typeof req.body?.message==='string'?req.body.message.trim():'';
 if(!question || question.length>900) return res.status(400).json({error:'Enter a question up to 900 characters.'});
 if(!process.env.OPENAI_API_KEY) return res.status(503).json({error:'AI is not configured. Please contact the site administrator.'});
 try{
  const client = new OpenAI({apiKey:process.env.OPENAI_API_KEY});
  const result = await client.chat.completions.create({
   model:process.env.OPENAI_MODEL||'gpt-4o-mini',
   temperature:0.2,
   max_tokens:220,
   messages:[
    {role:'system',content:`You are an AI assistant, not a human. Only answer from this approved business data: ${JSON.stringify(business)}. If the answer is unknown, say you do not have verified information and suggest leaving a contact request. Do not invent hours, availability, prices, policies, bookings or guarantees. Never ask for sensitive information.`},
    {role:'user',content:question}
   ]
  });
  res.json({reply:result.choices[0]?.message?.content||'Please leave your contact information for a team response.'});
 }catch(e){console.error('Chat provider error:',e?.status||'unknown');res.status(502).json({error:'The assistant is temporarily unavailable. Please leave a contact request.'});}
});
app.post('/api/leads',(req,res)=>{
 const {name,email,phone,question}=req.body||{};
 if(typeof name!=='string'||name.trim().length<2||name.length>100) return res.status(400).json({error:'Please enter your name.'});
 if(typeof email!=='string'||typeof phone!=='string'||(!email.trim()&&!phone.trim())||email.length>180||phone.length>40||!(!email.trim()||/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim()))) return res.status(400).json({error:'Provide a valid email or telephone number.'});
 if(question!=null&&(typeof question!=='string'||question.length>1200)) return res.status(400).json({error:'Message is too long.'});
 db.prepare('INSERT INTO leads (name,email,phone,question) VALUES (?,?,?,?)').run(name.trim(),email.trim(),phone.trim(),(question||'').trim());
 res.status(201).json({success:true,message:'Your request has been received.'});
});
app.get('/api/health',(req,res)=>res.json({ok:true,aiConfigured:!!process.env.OPENAI_API_KEY}));
if(process.env.NODE_ENV !== 'test') app.listen(Number(process.env.PORT)||3000,()=>console.log('AuditLocal concierge listening'));
export {app};
