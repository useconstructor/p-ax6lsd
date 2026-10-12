import {menu} from '@/lib/data';
export const dynamic='force-dynamic';
export async function GET(){return Response.json(await menu(),{headers:{'Cache-Control':'no-store'}});}
