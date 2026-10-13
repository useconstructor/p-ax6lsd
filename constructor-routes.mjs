import fs from 'node:fs';
export function constructorRouteConfig(config) {
 const wrap = value => {
  const oldRewrites=value.rewrites,oldRedirects=value.redirects;
  const read=()=>JSON.parse(fs.readFileSync(new URL('./public/constructor-routes.json',import.meta.url),'utf8'));
  return {...value, async redirects(){const manifest=read(),routes=manifest.routes;const redirects=manifest.redirects||Object.fromEntries(Object.entries(routes).filter(([path,source])=>path!==source&&!Object.hasOwn(routes,source)).map(([path,source])=>[source,path]));return [...Object.entries(redirects).map(([source,destination])=>({source,destination,permanent:false})),...(oldRedirects?await oldRedirects.call(value):[])]},
   async rewrites(){const routes=Object.entries(read().routes).filter(([path,source])=>path!==source).map(([source,destination])=>({source,destination}));const existing=oldRewrites?await oldRewrites.call(value):[];return Array.isArray(existing)?{beforeFiles:routes,afterFiles:existing,fallback:[]}:{...existing,beforeFiles:[...routes,...(existing.beforeFiles||[])]}}};
 };
 return typeof config==='function'?async(...args)=>wrap(await config(...args)):wrap(config);
}
