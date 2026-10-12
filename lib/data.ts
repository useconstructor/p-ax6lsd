import 'server-only';
import {getDb} from './db';
import type { MenuItem, Order, Slot } from './types';
import {DEMO_WINDOW_DAYS} from './demo-config';
const samples = [
 ['pollo','Tacos','Tacos de pollo','Tortilla de maíz, pollo y un toque de limón.','Tortilla de maíz, pollo, cebolla, cilantro, limón.','/images/tacos-detail.jpg'],
 ['champi','Tacos','Tacos de champiñones','Champiñones salteados dentro de una tortilla de maíz.','Tortilla de maíz, champiñones, cebolla, cilantro.', '/images/tacos.jpg'],
 ['quesadilla','Antojitos','Quesadilla de queso','Tortilla dorada con un relleno de queso fundido.','Tortilla de maíz, queso.',null],
 ['guacamole','Acompañamientos','Guacamole y totopos','Aguacate con limón y totopos crujientes para compartir.','Aguacate, tomate, cebolla, limón, maíz.',null],
 ['elote','Antojitos','Elote','Maíz con queso, limón y un toque de chile.','Maíz, queso, crema, limón, chile.',null],
 ['jamaica','Bebidas','Agua de jamaica','Una bebida de ejemplo con infusión de flor de jamaica.','Agua, flor de jamaica, azúcar.',null],
];
let initialization: Promise<void> | undefined;
export function initialize() {
 if (!initialization) initialization = setup().catch(e=>{initialization=undefined; throw e;});
 return initialization;
}
async function setup() {
 const db=getDb();
 await db.execute('PRAGMA foreign_keys = ON');
 const tx=await db.transaction('write');
 try {
 const schema=[
 `CREATE TABLE IF NOT EXISTS app_initialization (key TEXT PRIMARY KEY)`,
 `CREATE TABLE IF NOT EXISTS menu_items (id TEXT PRIMARY KEY, category TEXT NOT NULL, name TEXT NOT NULL, description TEXT NOT NULL, ingredients TEXT NOT NULL, image TEXT, available INTEGER NOT NULL DEFAULT 1 CHECK(available IN(0,1)))`,
 `CREATE TABLE IF NOT EXISTS pickup_slots (id TEXT PRIMARY KEY, start TEXT NOT NULL UNIQUE, end TEXT NOT NULL, capacity INTEGER NOT NULL CHECK(capacity>0), UNIQUE(start,end))`,
 `CREATE TABLE IF NOT EXISTS orders (id TEXT PRIMARY KEY, reference TEXT NOT NULL UNIQUE, session TEXT NOT NULL, name TEXT NOT NULL, slot_id TEXT NOT NULL REFERENCES pickup_slots(id), status TEXT NOT NULL CHECK(status='saved'), created TEXT NOT NULL, idempotency_key TEXT NOT NULL UNIQUE, payload TEXT NOT NULL)`,
 `CREATE TABLE IF NOT EXISTS order_items (id TEXT PRIMARY KEY, order_id TEXT NOT NULL REFERENCES orders(id), menu_item_id TEXT NOT NULL REFERENCES menu_items(id), quantity INTEGER NOT NULL CHECK(quantity BETWEEN 1 AND 20), frozen_name TEXT NOT NULL, UNIQUE(order_id,menu_item_id))`,
 `CREATE INDEX IF NOT EXISTS orders_session ON orders(session,created)`,
 `CREATE INDEX IF NOT EXISTS orders_capacity ON orders(slot_id,status)`];
 for(const sql of schema) await tx.execute(sql);
 const marker=await tx.execute("SELECT key FROM app_initialization WHERE key='catalog-v1'");
 if(!marker.rows.length){
 for(const item of samples) await tx.execute({sql:'INSERT INTO menu_items (id,category,name,description,ingredients,image) VALUES (?,?,?,?,?,?)',args:item});
 await tx.execute("INSERT INTO app_initialization(key) VALUES('catalog-v1')");
 }
 await tx.commit();
 }catch(e){await tx.rollback();throw e;}finally{tx.close();}
}
export async function menu(): Promise<MenuItem[]> {
 await initialize();
 const db=getDb();
 const {rows}=await db.execute('SELECT * FROM menu_items ORDER BY rowid');
 return rows.map(r=>({id:String(r.id),category:String(r.category),name:String(r.name),description:String(r.description),ingredients:String(r.ingredients),image:r.image ? String(r.image):null,available:Boolean(r.available)}));
}
export async function slots(): Promise<Slot[]> {
 await initialize();
 const db=getDb();
 // Explicit demo window: 12:00–15:00 UTC for a rolling, explicitly labelled 28-day demonstration window.
 const tx=await db.transaction('write');
 try{
 const midnight=new Date();midnight.setUTCHours(0,0,0,0);
 for(let d=0;d<DEMO_WINDOW_DAYS;d++)for(let h=24;h<30;h++){
 const start=new Date(midnight.getTime()+d*86400000+h*1800000).toISOString();
 const end=new Date(new Date(start).getTime()+1800000).toISOString();
 await tx.execute({sql:'INSERT OR IGNORE INTO pickup_slots(id,start,end,capacity) VALUES(?,?,?,5)',args:[start,start,end]});
 }
 await tx.commit();
 }catch(e){await tx.rollback();throw e;}finally{tx.close();}
 const now=new Date().toISOString();
 const end=new Date();end.setUTCHours(0,0,0,0);end.setUTCDate(end.getUTCDate()+DEMO_WINDOW_DAYS);
 const {rows}=await db.execute({sql:`SELECT s.*, s.capacity-(SELECT COUNT(*) FROM orders o WHERE o.slot_id=s.id AND o.status='saved') AS remaining FROM pickup_slots s WHERE s.start>? AND s.start<? ORDER BY s.start`,args:[now,end.toISOString()]});
 return rows.map(r=>({id:String(r.id),start:String(r.start),end:String(r.end),remaining:Number(r.remaining)}));
}
export async function sessionOrders(session: string): Promise<Order[]> {
 await initialize();
 const db=getDb();
 const {rows}=await db.execute({sql:'SELECT o.*,s.start,s.end FROM orders o JOIN pickup_slots s ON s.id=o.slot_id WHERE o.session=? ORDER BY o.created DESC',args:[session]});
 return Promise.all(rows.map(async r=>{
 const items=await db.execute({sql:'SELECT frozen_name,quantity FROM order_items WHERE order_id=? ORDER BY rowid',args:[r.id]});
 return {reference:String(r.reference),name:String(r.name),start:String(r.start),end:String(r.end),created:String(r.created),items:items.rows.map(i=>({name:String(i.frozen_name),quantity:Number(i.quantity)}))};
 }));
}
