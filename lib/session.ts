import 'server-only';
import { cookies } from 'next/headers';
import { randomBytes } from 'node:crypto';
export const cookieName='mexicana_session';
export async function getSession() {const v=(await cookies()).get(cookieName)?.value;return v && /^[a-f0-9]{64}$/.test(v) ? v : null;}
export async function establishSession(req:Request){
 let session=await getSession();
 // HTTP loopback supports local QA. All deployed/embedded sessions retain
 // Secure, SameSite=None and Partitioned; never downgrade remote origins.
 const url=new URL(req.url);
 const localHttp=url.protocol==='http:'&&['localhost','127.0.0.1','[::1]','0.0.0.0'].includes(url.hostname);
 if(!session){session=randomBytes(32).toString('hex');(await cookies()).set(cookieName,session,{httpOnly:true,secure:!localHttp,sameSite:localHttp?'lax':'none',partitioned:!localHttp,path:'/',maxAge:60*60*24*30});}
 return session;
}
export function validOrigin(req:Request){
 const origins=new Set<string>();
 for(const value of (process.env.ALLOWED_ORIGINS || '').split(',').filter(Boolean))try{origins.add(new URL(value.trim()).origin);}catch{}
 for(const value of [process.env.NEXT_PUBLIC_SITE_URL,process.env.VERCEL_URL&&`https://${process.env.VERCEL_URL}`,process.env.VERCEL_PROJECT_PRODUCTION_URL&&`https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`])if(value)try{origins.add(new URL(value).origin);}catch{}
 // Same origin of the deployed application is explicitly allowed; cross site origins require configuration.
 const requestUrl=new URL(req.url);
 origins.add(requestUrl.origin);
 // Next's local server may normalize req.url to localhost even when the
 // browser uses 127.0.0.1. Allow only explicit loopback aliases on its port.
 if(requestUrl.protocol==='http:'&&['localhost','127.0.0.1','[::1]','0.0.0.0'].includes(requestUrl.hostname)) {
  for(const hostname of ['localhost','127.0.0.1','[::1]'])origins.add(`http://${hostname}${requestUrl.port?`:${requestUrl.port}`:''}`);
 }
 return origins.has(req.headers.get('origin') || '');
}
export const privateHeaders={'Cache-Control':'private, no-store, max-age=0'};
