// Voz sintética para ElGatoMista: Google Chirp 3 HD, Gemini TTS e Inworld TTS-2.
// Uso:
//   node voz/generar.mjs --proveedor chirp|gemini|inworld --voz <id> --texto <fichero.txt | "texto"> --salida <wav>
//   node voz/generar.mjs --proveedor <p> --listar            (voces es-ES disponibles)
//   añadir --simular para probar el circuito sin red ni claves (genera un tono con FFmpeg)
//   --estilo "<indicación>": solo Gemini; indicación de estilo de habla (speech_metadata), p. ej. ritmo ágil
// Las claves se leen de <RUNTIME_DIR>/claves/.env o .env.txt, en UTF-8 o UTF-16 (GOOGLE_CLOUD_TTS_API_KEY, GEMINI_API_KEY,
// INWORLD_API_KEY). Para Chirp, si no hay clave de API, se usa la credencial de gcloud
// (<RUNTIME_DIR>/claves/application_default_credentials.json) con OAuth. Nada de esto se imprime ni se escribe. Caché por huella (proveedor, modelo, voz, texto) en
// <RUNTIME_DIR>/cache/voz/: no se paga dos veces la misma frase. Salida WAV PCM 16 bits mono; si el proveedor da marcas
// de tiempo por palabra, se guardan junto al WAV como <salida>.marcas.json.
import { execFileSync } from "node:child_process";
import { createHash, createSign } from "node:crypto";
import { copyFileSync, existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join, resolve } from "node:path";

const arg = (n, por) => { const i = process.argv.indexOf(`--${n}`); return i >= 0 ? process.argv[i + 1] : por; };
const bandera = (n) => process.argv.includes(`--${n}`);
const proveedor = arg("proveedor");
const RUNTIME = process.env.RUNTIME_DIR || "C:/Users/mario/proyectos/canal-videos/.runtime";
const MODELOS = { chirp: "chirp3-hd", gemini: arg("modelo", "gemini-3.8-flash-tts"), inworld: arg("modelo", "inworld-tts-2") };
const simular = bandera("simular");
const estilo = arg("estilo", "");
if (!MODELOS[proveedor]) { console.error("--proveedor chirp|gemini|inworld"); process.exit(2); }

// Texto de un fichero en UTF-8 o UTF-16 (el Bloc de notas guarda «Unicode» como UTF-16 LE con BOM).
function leerTexto(fichero) {
  const b = readFileSync(fichero);
  let texto;
  if (b[0] === 0xff && b[1] === 0xfe) texto = b.subarray(2).toString("utf16le");
  else if (b[0] === 0xfe && b[1] === 0xff) texto = Buffer.from(b.subarray(2)).swap16().toString("utf16le");
  else if (b.length > 4 && b[1] === 0 && b[3] === 0) texto = b.toString("utf16le");
  else texto = b.toString("utf8");
  return texto.replace(/^\uFEFF/, "");
}

function clave(nombre, { opcional = false } = {}) {
  if (simular) return "simulada";
  // El Bloc de notas de Windows suele guardar «.env» como «.env.txt»: se aceptan los dos nombres.
  const fichero = [".env", ".env.txt"].map((n) => join(RUNTIME, "claves", n)).find((f) => existsSync(f));
  if (!fichero) {
    if (opcional) return "";
    throw new Error(`Falta ${join(RUNTIME, "claves", ".env")} (ver .env.example)`);
  }
  // Tolera BOM, «export », espacios alrededor de «=» y comillas. Nunca se imprime un valor.
  const pares = leerTexto(fichero).split(/\r?\n/)
    .map((l) => l.trim().replace(/^export\s+/, "").match(/^([A-Za-z_][A-Za-z0-9_]*)\s*[=:]\s*(.*)$/))
    .filter(Boolean).map(([, k, v]) => [k, v.trim().replace(/^["']|["']$/g, "")]);
  const valor = (pares.find(([k]) => k === nombre) || [])[1] || "";
  if (!valor && opcional) return "";
  if (!valor) {
    const nombres = pares.map(([k, v]) => `${k}${v ? "" : " (vacía)"}`).join(", ") || "ninguna con formato NOMBRE=valor";
    throw new Error(`La variable ${nombre} está vacía o no existe en ${fichero}. Variables encontradas (solo nombres): ${nombres}`);
  }
  return valor;
}

// Google Cloud TTS: clave de API si existe; si no, OAuth con la credencial de gcloud (authorized_user o service_account).
// Devuelve { sufijo, cabeceras } para la URL y la petición. El token nunca se imprime.
let googleCache = null;
async function authGoogle() {
  if (simular) return { sufijo: "", cabeceras: {} };
  if (googleCache) return googleCache;
  const k = clave("GOOGLE_CLOUD_TTS_API_KEY", { opcional: true });
  if (k) return (googleCache = { sufijo: `key=${k}`, cabeceras: {}, tipo: "clave de API" });
  const fichero = join(RUNTIME, "claves", "application_default_credentials.json");
  if (!existsSync(fichero)) throw new Error("Chirp: no hay GOOGLE_CLOUD_TTS_API_KEY ni application_default_credentials.json en .runtime/claves/");
  const c = JSON.parse(leerTexto(fichero));
  let cuerpo;
  if (c.type === "authorized_user") {
    cuerpo = new URLSearchParams({ grant_type: "refresh_token", client_id: c.client_id, client_secret: c.client_secret, refresh_token: c.refresh_token });
  } else if (c.type === "service_account") {
    const b64 = (o) => Buffer.from(JSON.stringify(o)).toString("base64url");
    const ahora = Math.floor(Date.now() / 1000);
    const sinFirma = `${b64({ alg: "RS256", typ: "JWT" })}.${b64({ iss: c.client_email, scope: "https://www.googleapis.com/auth/cloud-platform", aud: c.token_uri || "https://oauth2.googleapis.com/token", iat: ahora, exp: ahora + 3600 })}`;
    const firma = createSign("RSA-SHA256").update(sinFirma).sign(c.private_key).toString("base64url");
    cuerpo = new URLSearchParams({ grant_type: "urn:ietf:params:oauth:grant-type:jwt-bearer", assertion: `${sinFirma}.${firma}` });
  } else {
    throw new Error(`Chirp: tipo de credencial no admitido (${c.type}); se esperaba authorized_user o service_account`);
  }
  const r = await fetch("https://oauth2.googleapis.com/token", { method: "POST", body: cuerpo });
  const j = await r.json().catch(() => ({}));
  if (!r.ok || !j.access_token) throw new Error(`Chirp: no se pudo obtener el token OAuth (HTTP ${r.status}: ${j.error || ""} ${j.error_description || ""})`);
  const proyecto = c.quota_project_id || c.project_id || clave("GOOGLE_CLOUD_PROJECT", { opcional: true });
  const cabeceras = { Authorization: `Bearer ${j.access_token}` };
  if (proyecto) cabeceras["x-goog-user-project"] = proyecto;
  return (googleCache = { sufijo: "", cabeceras, tipo: c.type, conProyecto: Boolean(proyecto) });
}

async function pedir(url, opciones) {
  const r = await fetch(url, opciones);
  const cuerpo = await r.text();
  // El mensaje de error puede citar la URL: se quita cualquier ?key=... antes de mostrarlo.
  if (!r.ok) throw new Error(`HTTP ${r.status} en ${url.replace(/key=[^&]+/, "key=***")}: ${cuerpo.slice(0, 400)}`);
  return JSON.parse(cuerpo);
}

// ---------- listar voces ----------
async function listar() {
  if (proveedor === "chirp") {
    const g = await authGoogle();
    const j = await pedir(`https://texttospeech.googleapis.com/v1/voices?languageCode=es-ES${g.sufijo ? "&" + g.sufijo : ""}`, { headers: g.cabeceras });
    return j.voices.filter((v) => v.name.includes("Chirp3-HD") && v.ssmlGender === "MALE").map((v) => ({ voz: v.name, genero: v.ssmlGender }));
  }
  if (proveedor === "inworld") {
    const q = new URLSearchParams({ filter: 'lang_code = "es-ES"', pageSize: "50" });
    const j = await pedir(`https://api.inworld.ai/voices/v1/voices?${q}`, { headers: { Authorization: `Basic ${clave("INWORLD_API_KEY")}` } });
    return (j.voices || []).map((v) => ({ voz: v.voiceId, nombre: v.displayName, genero: v.gender, idioma: v.languageCode, etiquetas: v.tags }));
  }
  // Gemini: voces precompiladas (la doc no marca género; el idioma se detecta del texto)
  return ["Charon", "Orus", "Iapetus", "Algenib", "Alnilam", "Sadaltager", "Rasalgethi", "Schedar"].map((v) => ({ voz: v }));
}

// ---------- sintetizar ----------
async function sintetizar(texto, voz) {
  if (simular) return { wav: null, marcas: null };
  if (proveedor === "chirp") {
    const g = await authGoogle();
    const j = await pedir(`https://texttospeech.googleapis.com/v1/text:synthesize${g.sufijo ? "?" + g.sufijo : ""}`, {
      method: "POST", headers: { "Content-Type": "application/json", ...g.cabeceras },
      body: JSON.stringify({ input: { text: texto }, voice: { languageCode: "es-ES", name: voz },
        audioConfig: { audioEncoding: "LINEAR16", sampleRateHertz: 48000 } }),
    });
    return { wav: Buffer.from(j.audioContent, "base64"), marcas: null };
  }
  if (proveedor === "gemini") {
    const j = await pedir("https://generativelanguage.googleapis.com/v1beta/interactions", {
      method: "POST", headers: { "Content-Type": "application/json", "x-goog-api-key": clave("GEMINI_API_KEY") },
      body: JSON.stringify({ model: MODELOS.gemini, input: [{ type: "user_input", content: [{ type: "text", text: texto,
          ...(estilo ? { annotations: [{ type: "speech_metadata", style: estilo }] } : {}) }] }],
        response_format: { type: "audio" }, generation_config: { speech_config: [{ voice: voz }] } }),
    });
    const audio = (j.steps || []).filter((s) => s.type === "model_output").flatMap((s) => s.content || []).find((c) => c.type === "audio");
    if (!audio) throw new Error("Gemini no devolvió audio: " + JSON.stringify(j).slice(0, 300));
    return { wav: Buffer.from(audio.data, "base64"), marcas: null };
  }
  const j = await pedir("https://api.inworld.ai/tts/v1/voice", {
    method: "POST", headers: { "Content-Type": "application/json", Authorization: `Basic ${clave("INWORLD_API_KEY")}` },
    body: JSON.stringify({ text: texto, voiceId: voz, modelId: MODELOS.inworld, language: "es-ES", timestampType: "WORD",
      audioConfig: { audioEncoding: "LINEAR16", sampleRateHertz: 48000 } }),
  });
  const w = j.timestampInfo?.wordAlignment;
  const marcas = w ? w.words.map((p, i) => ({ p, i: w.wordStartTimeSeconds[i], f: w.wordEndTimeSeconds[i] })) : null;
  return { wav: Buffer.from(j.audioContent, "base64"), marcas, caracteres: j.usage?.processedCharactersCount };
}

// ---------- principal ----------
if (bandera("listar")) {
  console.log(JSON.stringify(simular ? [{ voz: "simulada" }] : await listar(), null, 2));
  process.exit(0);
}
const voz = arg("voz");
const entrada = arg("texto");
const salida = arg("salida") && resolve(arg("salida"));
if (!voz || !entrada || !salida) { console.error("Uso: --proveedor <p> --voz <id> --texto <fichero|texto> --salida <wav> [--simular]"); process.exit(2); }
const texto = existsSync(entrada) ? readFileSync(entrada, "utf8").trim() : entrada;
const huella = createHash("sha256").update([proveedor, MODELOS[proveedor], voz, texto, simular ? "simulada" : "", estilo].join("\0")).digest("hex").slice(0, 20);
const cache = join(RUNTIME, "cache", "voz", `${proveedor}-${huella}.wav`);
mkdirSync(dirname(cache), { recursive: true });
mkdirSync(dirname(salida), { recursive: true });

let enCache = existsSync(cache);
if (!enCache) {
  const r = await sintetizar(texto, voz);
  if (simular) {
    const seg = Math.max(1, texto.length / 15).toFixed(2); // ~15 caracteres por segundo
    execFileSync("ffmpeg", ["-v", "error", "-y", "-f", "lavfi", "-i", `sine=frequency=220:duration=${seg}`, "-ar", "48000", "-ac", "1", "-c:a", "pcm_s16le", cache]);
  } else {
    // Normaliza el contenedor a WAV PCM 16 bits mono (Gemini da 24 kHz; Chirp e Inworld, 48 kHz)
    const crudo = cache + ".crudo";
    writeFileSync(crudo, r.wav);
    execFileSync("ffmpeg", ["-v", "error", "-y", "-i", crudo, "-ac", "1", "-c:a", "pcm_s16le", cache]);
  }
  if (r.marcas) writeFileSync(cache + ".marcas.json", JSON.stringify(r.marcas));
  writeFileSync(cache + ".meta.json", JSON.stringify({ proveedor, modelo: MODELOS[proveedor], voz, estilo, caracteres: r.caracteres ?? texto.length, fecha: new Date().toISOString() }));
}
copyFileSync(cache, salida);
if (existsSync(cache + ".marcas.json")) copyFileSync(cache + ".marcas.json", salida + ".marcas.json");
const dur = Number(execFileSync("ffprobe", ["-v", "error", "-show_entries", "format=duration", "-of", "csv=p=0", salida], { encoding: "utf8" }));
console.log(JSON.stringify({ proveedor, modelo: MODELOS[proveedor], voz, estilo: estilo || undefined, salida, caracteres: texto.length, duracion_s: Number(dur.toFixed(2)), desde_cache: enCache, marcas: existsSync(salida + ".marcas.json") }));
