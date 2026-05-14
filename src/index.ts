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
				return new Response("TODO") 
			} 
		else 
			{
				return new Response(JSON.stringify({ status: "online", service : "threat-pipeline"}), {
				headers: { "Content-Type": "application/json" }
			});
		
		}
	},
} satisfies ExportedHandler<Env>;
