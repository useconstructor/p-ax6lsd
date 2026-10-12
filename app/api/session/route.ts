import {getSession, establishSession, privateHeaders,validOrigin} from '@/lib/session';
export async function POST(req:Request){if(!validOrigin(req))return Response.json({error:'Origen no permitido.'},{status:403});await establishSession(req);return Response.json({ready:true},{headers:privateHeaders});}

export async function GET(){return Response.json({ready:!!await getSession()},{headers:privateHeaders});}
