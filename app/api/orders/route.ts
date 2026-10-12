import {initialize,sessionOrders} from '@/lib/data';
import {getDb} from '@/lib/db';
import {getSession,privateHeaders,validOrigin} from '@/lib/session';
import {randomUUID, randomBytes} from 'node:crypto';
export const dynamic='force-dynamic';
function reply(data:unknown,status=200){return Response.json(data,{status,headers:privateHeaders});}
export async function GET(){const session=await getSession();return reply(session? await sessionOrders(session):[]);}
export async function POST(req:Request){
 if(!validOrigin(req))return reply({error:'Origen no permitido.'},403);
 const session=await getSession();if(!session)return reply({error:'No se ha podido iniciar la sesión. Recarga la página e inténtalo de nuevo.'},401);
 let body;try{body=await req.json();}catch{return reply({error:'Solicitud inválida.'},400);}
 if(!body || typeof body!=='object')return reply({error:'Solicitud inválida.'},400);
 const errors:Record<string,string>={};
 const name=typeof body.name==='string'?body.name.trim():'';
 if(name.length<2||name.length>80)errors.name='Escribe un nombre de entre 2 y 80 caracteres.';
 if(typeof body.slotId!=='string'||!body.slotId)errors.slotId='Selecciona una franja disponible.';
 if(typeof body.idempotencyKey!=='string'||! /^[a-f0-9-]{36}$/.test(body.idempotencyKey))errors.form='El intento no es válido. Recarga la página.';
 const lines=new Map<string,number>();
 if(!Array.isArray(body.items)||!body.items.length||body.items.length>100)errors.items='Añade al menos un plato al pedido.';
 else for(const line of body.items){
 if(!line||typeof line.id!=='string'||!Number.isInteger(line.quantity)||line.quantity<1||line.quantity>20){errors.items='Cada plato debe tener una cantidad entera de 1 a 20.';break;}
 lines.set(line.id,(lines.get(line.id)||0)+line.quantity);
 }
 if([...lines.values()].some(q=>q>20))errors.items='El máximo es de 20 unidades por plato.';
 if(Object.keys(errors).length)return reply({error:'Revisa los campos del pedido.',fields:errors},422);
 const items=[...lines].sort(([a],[b])=>a.localeCompare(b));
 const payload=JSON.stringify({name,slotId:body.slotId,items});
 await initialize();const tx=await getDb().transaction('write');
 try{
 const existing=await tx.execute({sql:'SELECT * FROM orders WHERE idempotency_key=?',args:[body.idempotencyKey]});
 if(existing.rows.length){const o=existing.rows[0];await tx.rollback();return o.session===session&&o.payload===payload?reply({reference:o.reference,replayed:true}):reply({error:'Esta clave ya corresponde a otro intento. Prepara un nuevo pedido.'},409);}
 const selected=[];
 for(const [id,quantity] of items){const {rows}=await tx.execute({sql:'SELECT name,available FROM menu_items WHERE id=?',args:[id]});
 if(!rows.length){await tx.rollback();return reply({error:'El plato seleccionado no existe.',fields:{items:'Revisa los platos del pedido.'}},422);}
 if(!rows[0].available){await tx.rollback();return reply({error:'Un plato ya no está disponible. Revisa tu selección.',fields:{items:'Retira el plato no disponible.'}},409);}
 selected.push({id,quantity,name:String(rows[0].name)});
 }
 const s=await tx.execute({sql:`SELECT s.*, (SELECT COUNT(*) FROM orders o WHERE o.slot_id=s.id AND o.status='saved') AS occupied FROM pickup_slots s WHERE id=?`,args:[body.slotId]});
 const slot=s.rows[0];
 if(!slot||String(slot.start)<=new Date().toISOString()||Number(slot.occupied)>=Number(slot.capacity)){
 await tx.rollback();return reply({error:'Esta franja ya no está disponible. Elige otra.',fields:{slotId:'Selecciona otra franja futura con plazas.'}},409);}
 const id=randomUUID();const reference='MX'+randomBytes(6).toString('hex').toUpperCase();
 await tx.execute({sql:"INSERT INTO orders(id,reference,session,name,slot_id,status,created,idempotency_key,payload) VALUES(?,?,?,?,?,'saved',?,?,?)",args:[id,reference,session,name,body.slotId,new Date().toISOString(),body.idempotencyKey,payload]});
 for(const item of selected)await tx.execute({sql:'INSERT INTO order_items(id,order_id,menu_item_id,quantity,frozen_name) VALUES(?,?,?,?,?)',args:[randomUUID(),id,item.id,item.quantity,item.name]});
 await tx.commit();return reply({reference},201);
 }catch{await tx.rollback();return reply({error:'No se pudo guardar. Tu selección se conserva; vuelve a intentarlo.'},503);}finally{tx.close();}
}
