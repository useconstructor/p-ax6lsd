import fs from 'node:fs';
export function constructorRouteConfig(config) {
 const wrap = value => {
  const oldRewrites=value.rewrites,oldRedirects=value.redirects;
  const read=()=>JSON.parse(fs.readFileSync(new URL('./public/constructor-routes.json',import.meta.url),'utf8')).routes;
  return {...value, async redirects(){const routes=read();return [...(oldRedirects?await oldRedirects.call(value):[]),...Object.entries(routes).filter(([path,source])=>path!==source&&!Object.hasOwn(routes,source)).map(([path,source])=>({source,destination:path,permanent:false}))]},
   async rewrites(){const routes=Object.entries(read()).filter(([path,source])=>path!==source).map(([source,destination])=>({source,destination}));const existing=oldRewrites?await oldRewrites.call(value):[];return Array.isArray(existing)?{beforeFiles:routes,afterFiles:existing,fallback:[]}:{...existing,beforeFiles:[...routes,...(existing.beforeFiles||[])]}}};
 };
 return typeof config==='function'?async(...args)=>wrap(await config(...args)):wrap(config);
}
