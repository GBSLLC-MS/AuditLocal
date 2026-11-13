import {test} from 'node:test';
import assert from 'node:assert/strict';
import {app} from '../server.js';

test('health, validation and lead capture routes', async () => {
 const server=app.listen(0);
 try {
  const root='http://127.0.0.1:'+server.address().port;
  const health=await fetch(root+'/api/health');
  assert.equal(health.status,200);
  assert.equal((await health.json()).ok,true);
  const invalid=await fetch(root+'/api/leads',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({name:'A',email:'bad',phone:''})});
  assert.equal(invalid.status,400);
  const valid=await fetch(root+'/api/leads',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({name:'Demo Test',email:'demo@example.com',phone:'',question:'Test lead'})});
  assert.equal(valid.status,201);
  assert.equal((await valid.json()).success,true);
  const chat=await fetch(root+'/api/chat',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({message:''})});
  assert.equal(chat.status,400);
 } finally { await new Promise((resolve,reject)=>server.close(e=>e?reject(e):resolve())); }
});
