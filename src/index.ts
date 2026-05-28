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
function normalize(raw: string,source: string): { timestamp: string; source: string; src_ip: string; dst_ip: string; user: string; event_type: string; severity: string; raw: string; tags: string; flagged: number; metadata: string } {
    // timestamp logic
	const parts = raw.split(" ");
	const timestamp = parts[0] + " " + parts[1] + " " + parts[2];
	const fromIndex = parts.indexOf("from");
	const user = fromIndex !== -1 ? parts[fromIndex - 1] : "unknown";	
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
	if (source === "cloudflare_waf") {
    const parsed = JSON.parse(raw);
    return {
        timestamp: parsed.EdgeStartTimestamp ?? "unknown",
        source,
        src_ip: parsed.ClientIP ?? "unknown",
        dst_ip: parsed.ClientRequestHost ?? "unknown",
        user: "unknown",
        event_type: parsed.Action ?? "unknown",
        severity: "low",
        raw,
        tags: "[]",
        flagged: 0,
        metadata: JSON.stringify(parsed.Metadata ?? {})
    };
}

	return {
		timestamp,
		source,
		src_ip: ip ?? "unknown",
		dst_ip: "unknown",
		user: user ?? "unknown",
		event_type,
		severity: "low",
		raw,
		tags: "[]",
		flagged: 0,
		metadata: "{}"
	};
	
}

export default {
	async fetch(request, env, ctx): Promise<Response> {
		const url = new URL(request.url);
		const path = url.pathname;
		const source = url.searchParams.get("source");
		const src_ip = url.searchParams.get("src_ip");
		const from = url.searchParams.get("from");
		const to = url.searchParams.get("to");
		if (request.method === "GET" && path === "/events")
			{ 
				let query = "SELECT * FROM events";
				const params: any[] = [];
				const conditions: string[] = [];

				if (source) {
					conditions.push("source = ?");
					params.push(source);
				}
				if (src_ip) {
					conditions.push("src_ip = ?");
					params.push(src_ip);
				}
				if (from && to) {
				conditions.push("timestamp >= ? AND timestamp <= ?");
				params.push(from, to);
				}
				if (conditions.length > 0) {
					query += " WHERE " + conditions.join(" AND ");
				}
				const stmt = env.DB.prepare(query);
				const result = params.length > 0 
				? await stmt.bind(...params).all()
				: await stmt.all();
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
				await env.DB.prepare("INSERT INTO events (timestamp, source, src_ip, dst_ip, user, event_type, severity, raw, tags, flagged, metadata) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)").bind(event.timestamp, event.source, event.src_ip, event.dst_ip, event.user, event.event_type, event.severity, event.raw, event.tags, event.flagged, event.metadata).run();
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
