/**
 * Welcome to Cloudflare Workers! This is your first worker.
 *
 * - Run `npm run dev` in your terminal to start a development server
 * - Open a browser tab at http://localhost:8787/ to see your worker in action
 * - Run `npm run deploy` to publish your worker
 *
 * Bind resources to your worker in `wrangler.jsonc`. After adding bindings, a type definition for the
 * `Env` object can be regenerated with `npm run cf-typegen`.
 *
 * Learn more at https://developers.cloudflare.com/workers/
 */

//import { request } from "https";
//import { env } from "process";

export default {
	async fetch(request, env, ctx): Promise<Response> {
		const url = new URL(request.url);
		const path = url.pathname;
		if (request.method === "GET" && path === "/events")
			{ 
				return new Response("TODO")
				
		
			} 
		else if (request.method  === "POST" && path === "/event") 
			{ 
				//return new Response("TODO") 
				const body = await request.json() as {
					timestamp: string;
					source: string;
					src_ip: string;
					user: string;
					event_type: string;
					raw: string;
					tags: string;
					flagged: number;
				};
				await env.DB.prepare("INSERT INTO events (timestamp, source, src_ip, user, event_type, raw, tags, flagged) VALUES (?, ?, ?, ?, ?, ?, ?, ?)").bind(body.timestamp, body.source, body.src_ip, body.user, body.event_type, body.raw, body.tags, body.flagged).run();
				return new Response(JSON.stringify({ success: true }), {
    			headers: { "Content-Type": "application/json" }
			});	
			} 
		else 
			{
				return new Response(JSON.stringify({ status: "online", service : "threat-pipeline"}), {
				headers: { "Content-Type": "application/json" }
			});
		}
		
	},
} satisfies ExportedHandler<Env>;
