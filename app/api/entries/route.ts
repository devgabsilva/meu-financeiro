import { env } from 'cloudflare:workers';
import {validateEntry,summarize,monthRange} from '../../../lib/finance.mjs';
export async function GET(request:Request){
 let range;try{range=monthRange(new URL(request.url).searchParams.get('month')||'')}catch(e){return Response.json({error:(e as Error).message},{status:400})}
 try{if(!env.DB)throw Error('Banco indisponível');const {results}=await env.DB.prepare('SELECT * FROM entries WHERE date >= ? AND date <= ? ORDER BY date DESC, id DESC').bind(...range).all();return Response.json({entries:results,summary:summarize(results)},{headers:{'Cache-Control':'no-store'}})}catch{return Response.json({error:'Não foi possível carregar os lançamentos.'},{status:500})}
}
export async function POST(request:Request){
 let entry;try{entry=validateEntry(await request.json())}catch(e){return Response.json({error:(e as Error).message},{status:400})}
 try{if(!env.DB)throw Error('Banco indisponível');await env.DB.prepare('INSERT INTO entries (type,description,cents,category,date) VALUES (?,?,?,?,?)').bind(entry.type,entry.description,entry.cents,entry.category,entry.date).run();return Response.json({ok:true},{status:201})}catch{return Response.json({error:'Não foi possível salvar. Tente novamente.'},{status:500})}
}

