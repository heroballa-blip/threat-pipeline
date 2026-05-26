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
function normalize(raw: string,source: string): { timestamp: string; source: string; src_ip: string; user: string; event_type: string; raw: string; tags: string; flagged: number } {
    // timestamp logic
	const parts = raw.split(" ");
	const timestamp = parts[0] + " " + parts[1] + " " + parts[2];
	const forIndex = parts.indexOf("for");
	const user = forIndex !== -1 ? parts[forIndex + 1] : null;
	
	// ip logic
	const match = raw.match(/\d+\.\d+\.\d+\.\d+/);
	const ip = match ? match[0] : null;

	// event type logic
	let event_type: string;
	if (raw.includes("Failed password")) {
    	event_type = "failed_login"
	} else if (raw.includes("Accepted password")) {
		event_type = "successful_login"
	} else if (raw.includes("sudo")) {
		event_type = "sudo_command"
	} else {
		event_type = "unknown"
	}
	return {
		timestamp,
		source,
		src_ip: ip ?? "unknown",
		user: user ?? "unknown",
		event_type,
		raw,
		tags: "[]",
		flagged: 0
	};
}

export default {
	async fetch(request, env, ctx): Promise<Response> {
		const url = new URL(request.url);
		const path = url.pathname;
		if (request.method === "GET" && path === "/events")
			{ 
				//return new Response("TODO")
				const result = await env.DB.prepare("SELECT * FROM events").all();
				return new Response(JSON.stringify(result.results), {
    			headers: { "Content-Type": "application/json" }
});
		
			} 
		else if (request.method  === "POST" && path === "/event") 
			{ 
				const body = await request.json() as {
					source: string;
					raw: string;				
				};
				const event = normalize(body.raw, body.source);
				await env.DB.prepare("INSERT INTO events (timestamp, source, src_ip, user, event_type, raw, tags, flagged) VALUES (?, ?, ?, ?, ?, ?, ?, ?)").bind(event.timestamp, event.source, event.src_ip, event.user, event.event_type, event.raw, event.tags, event.flagged).run();
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
