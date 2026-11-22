// Mercan: llama-server uyumlu sim (Ollama'ya yonlendirir)
//  - /props taklidi (dusunme destekli sablon bildirir)
//  - enable_thinking -> reasoning_effort eslemesi
//  - Ollama "reasoning" alanini "reasoning_content" olarak yeniden adlandirir
//  - web_search: Vikipedi aramasi yapip sonuclari istege ekler, yanit sonuna kaynaklari ekler
import http from 'node:http';
import { StringDecoder } from 'node:string_decoder';

const PORT = 8033;
const OLLAMA = { host: '127.0.0.1', port: 11434 };
const MODEL = process.env.MERCAN_MODEL || 'qwen3.5:0.8b';

const props = {
	default_generation_settings: {
		id: 0, id_task: -1, n_ctx: 8192, speculative: false, is_processing: false,
		params: {
			n_predict: -1, seed: -1, temperature: 0.7, dynatemp_range: 0, dynatemp_exponent: 1,
			top_k: 40, top_p: 0.95, min_p: 0.05, top_n_sigma: -1, xtc_probability: 0, xtc_threshold: 0.1,
			typ_p: 1, repeat_last_n: 64, repeat_penalty: 1, presence_penalty: 0, frequency_penalty: 0,
			dry_multiplier: 0, dry_base: 1.75, dry_allowed_length: 2, dry_penalty_last_n: -1,
			dry_sequence_breakers: [], mirostat: 0, mirostat_tau: 5, mirostat_eta: 0.1, stop: [],
			max_tokens: -1, n_keep: 0, n_discard: 0, ignore_eos: false, stream: true, logit_bias: [],
			n_probs: 0, min_keep: 0, grammar: '', grammar_lazy: false, grammar_triggers: [],
			preserved_tokens: [], chat_format: '', reasoning_format: 'auto', reasoning_in_content: false,
			generation_prompt: '', samplers: [], backend_sampling: false, 'speculative.n_max': 0,
			'speculative.n_min': 0, 'speculative.p_min': 0, timings_per_token: false,
			post_sampling_probs: false, lora: []
		},
		prompt: '',
		next_token: { has_next_token: true, has_new_line: false, n_remain: -1, n_decoded: 0, stopping_word: '' }
	},
	total_slots: 1,
	model_path: MODEL,
	role: 'model',
	modalities: { vision: false, audio: false, video: false },
	// Arayuz, dusunme destegini sablondaki enable_thinking degiskeninden anlar
	chat_template: '{% if enable_thinking %}<think>{% endif %}',
	bos_token: '', eos_token: '', build_info: 'mercan-ollama-shim'
};

const cors = {
	'Access-Control-Allow-Origin': '*',
	'Access-Control-Allow-Headers': '*',
	'Access-Control-Allow-Methods': '*'
};

const strip = (h) => h.replace(/<[^>]+>/g, '').replace(/&quot;/g, '"').replace(/&#039;/g, "'").replace(/&amp;/g, '&');

const STOP = new Set(
	('kaç nedir kimdir nasıl ne kim hangi neden niçin nerede nereye nereden mi mı mu mü midir mıdır ' +
		'kısa yanıtla yanıt cevapla cevap söyle anlat açıkla bana bir ve ile için hakkında bilgi ver ' +
		'lütfen şu bu o da de ki gibi what is are who how why the a an of in on tell me about please').split(' ')
);

// Soruyu anahtar kelimelere indirger: "Ankara nüfusu kaç? Kısa yanıtla." -> "ankara nüfusu"
function toKeywords(text) {
	const words = text
		.toLocaleLowerCase('tr')
		.replace(/[^\p{L}\p{N}\s'-]/gu, ' ')
		.split(/\s+/)
		.filter((w) => w && !STOP.has(w));
	return words.slice(0, 6).join(' ');
}

async function webSearch(query) {
	const q = toKeywords(query) || query.trim().slice(0, 120);
	for (const lang of ['tr', 'en']) {
		try {
			const url =
				`https://${lang}.wikipedia.org/w/api.php?action=query&generator=search&gsrsearch=${encodeURIComponent(q)}` +
				`&gsrlimit=3&prop=extracts%7Cinfo&inprop=url&exintro=1&explaintext=1&exchars=1400&format=json&redirects=1`;
			const r = await fetch(url, { signal: AbortSignal.timeout(7000), headers: { 'user-agent': 'MercanChat/1.0' } });
			const j = await r.json();
			const pages = Object.values(j?.query?.pages ?? {}).sort((a, b) => a.index - b.index);
			const out = pages
				.filter((p) => p.extract)
				.map((p) => ({ title: p.title, url: p.fullurl, text: p.extract.trim() }));
			if (out.length) return out;
		} catch (e) {
			console.log('arama hatasi', lang, e.message);
		}
	}
	return [];
}

function lastUserText(messages = []) {
	for (let i = messages.length - 1; i >= 0; i--) {
		const m = messages[i];
		if (m.role !== 'user') continue;
		if (typeof m.content === 'string') return m.content;
		if (Array.isArray(m.content)) return m.content.filter((p) => p.type === 'text').map((p) => p.text).join(' ');
	}
	return '';
}

function sourcesMarkdown(results) {
	return '\n\n---\n**Kaynaklar**\n' + results.map((r, i) => `${i + 1}. [${r.title}](${r.url})`).join('\n');
}

http.createServer((req, res) => {
	if (req.method === 'OPTIONS') { res.writeHead(204, cors); return res.end(); }
	const path = req.url.split('?')[0];
	if (path === '/props') {
		res.writeHead(200, { ...cors, 'content-type': 'application/json' });
		return res.end(JSON.stringify(props));
	}
	if (path === '/health') {
		res.writeHead(200, { ...cors, 'content-type': 'application/json' });
		return res.end('{"status":"ok"}');
	}
	if (path === '/slots' || path.startsWith('/tools') || path.startsWith('/models/')) {
		res.writeHead(404, { ...cors, 'content-type': 'application/json' });
		return res.end('{"error":"not supported"}');
	}

	const forward = (body, sources) => {
		const headers = { ...req.headers, host: '127.0.0.1:11434' };
		if (body !== undefined) headers['content-length'] = Buffer.byteLength(body);
		const up = http.request({ ...OLLAMA, path: req.url, method: req.method, headers }, (r) => {
			const ct = String(r.headers['content-type'] || '');
			const isChat = path === '/v1/chat/completions';
			if (isChat && ct.includes('text/event-stream')) {
				res.writeHead(r.statusCode, { ...r.headers, ...cors });
				const dec = new StringDecoder('utf8');
				r.on('data', (c) => {
					let s = dec.write(c).replaceAll('"reasoning":', '"reasoning_content":');
					if (sources && s.includes('data: [DONE]')) {
						const extra = JSON.stringify({ choices: [{ index: 0, delta: { content: sourcesMarkdown(sources) } }] });
						s = s.replace('data: [DONE]', `data: ${extra}\n\ndata: [DONE]`);
					}
					res.write(s);
				});
				r.on('end', () => res.end());
			} else if (isChat && ct.includes('application/json')) {
				const chunks = [];
				r.on('data', (c) => chunks.push(c));
				r.on('end', () => {
					let s = Buffer.concat(chunks).toString().replaceAll('"reasoning":', '"reasoning_content":');
					const h = { ...r.headers, ...cors };
					delete h['content-length'];
					res.writeHead(r.statusCode, h);
					res.end(s);
				});
			} else {
				res.writeHead(r.statusCode, { ...r.headers, ...cors });
				r.pipe(res);
			}
		});
		up.on('error', (e) => { res.writeHead(502, cors); res.end(String(e)); });
		if (body !== undefined) up.end(body); else req.pipe(up);
	};

	if (req.method === 'POST' && path === '/v1/chat/completions') {
		const chunks = [];
		req.on('data', (c) => chunks.push(c));
		req.on('end', async () => {
			let body = Buffer.concat(chunks).toString();
			let sources = null;
			try {
				const j = JSON.parse(body);
				if (!j.model) j.model = MODEL;

				// dusunme ac/kapat
				const et = j.chat_template_kwargs?.enable_thinking;
				if (et === false) j.reasoning_effort = 'none';
				else if (et === true && !j.reasoning_effort) j.reasoning_effort = 'medium';

				// web arama
				if (j.web_search) {
					const results = await webSearch(lastUserText(j.messages));
					if (results.length) {
						sources = results;
						const ctx = results.map((r, i) => `[${i + 1}] ${r.title} (${r.url})\n${r.text}`).join('\n\n');
						// Kucuk modeller baglami kullanici turunda daha iyi izler
						for (let i = j.messages.length - 1; i >= 0; i--) {
							const m = j.messages[i];
							if (m.role !== 'user') continue;
							const wrap = (q) =>
								'Aşağıdaki web arama sonuçlarına dayanarak soruyu yanıtla. Bilgi sonuçlarda yoksa bunu söyle, uydurma. ' +
								'Kaynak numarasını [1], [2] gibi belirt.\n\nSONUÇLAR:\n' + ctx + '\n\nSORU: ' + q;
							if (typeof m.content === 'string') m.content = wrap(m.content);
							else if (Array.isArray(m.content)) {
								const t = m.content.find((p) => p.type === 'text');
								if (t) t.text = wrap(t.text);
							}
							break;
						}
					}
				}

				for (const k of ['tools', 'tool_choice', 'web_search', 'chat_template_kwargs', 'thinking_budget_tokens', 'reasoning_control', 'reasoning_format', 'return_progress', 'sse_ping_interval'])
					delete j[k];
				body = JSON.stringify(j);
			} catch (e) {
				console.log('istek hatasi', e.message);
			}
			forward(body, sources);
		});
		return;
	}
	forward(undefined, null);
}).listen(PORT, '127.0.0.1', () => console.log('Mercan shim on', PORT, '->', MODEL));
