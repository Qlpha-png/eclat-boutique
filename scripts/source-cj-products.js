/**
 * source-cj-products.js
 *
 * Adds 15 products to the CJ Dropshipping "My Products" list
 * using the CJ API v2.0 endpoint: POST /product/addToMyProduct
 *
 * Auth flow:
 *   1. POST /authentication/getAccessToken with { apiKey }
 *   2. Use returned accessToken as CJ-Access-Token header
 *
 * Rate limiting:
 *   - Free tier: 1 req/s, Plus: 2 req/s, Prime: 4 req/s, Advanced: 6 req/s
 *   - Daily limit for unverified accounts: 1,000 calls/day
 *   - This script uses 1 req/s (safe for all tiers) with retry on failure
 *
 * Usage:
 *   CJ_API_KEY=your_key node scripts/source-cj-products.js
 *   or set CJ_API_KEY in a .env file at project root
 *
 * API docs: https://developers.cjdropshipping.cn/en/api/api2/api/product.html
 */

const https = require('https');
const path = require('path');

// ---------------------------------------------------------------------------
// Load .env if present (no external dependency required)
// ---------------------------------------------------------------------------
function loadEnv() {
  try {
    const fs = require('fs');
    const envPath = path.resolve(__dirname, '..', '.env');
    const contents = fs.readFileSync(envPath, 'utf-8');
    for (const line of contents.split('\n')) {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith('#')) continue;
      const eqIndex = trimmed.indexOf('=');
      if (eqIndex === -1) continue;
      const key = trimmed.slice(0, eqIndex).trim();
      let value = trimmed.slice(eqIndex + 1).trim();
      // Strip surrounding quotes
      if ((value.startsWith('"') && value.endsWith('"')) ||
          (value.startsWith("'") && value.endsWith("'"))) {
        value = value.slice(1, -1);
      }
      if (!process.env[key]) {
        process.env[key] = value;
      }
    }
  } catch {
    // No .env file -- that is fine, we rely on process.env
  }
}
loadEnv();

// ---------------------------------------------------------------------------
// Configuration
// ---------------------------------------------------------------------------
const CJ_API_KEY = process.env.CJ_API_KEY;
if (!CJ_API_KEY) {
  console.error('[FATAL] CJ_API_KEY is not set. Provide it via environment variable or .env file.');
  process.exit(1);
}

const BASE_URL = 'https://developers.cjdropshipping.com/api2.0/v1';
const DELAY_MS = 1200; // 1.2 s between requests (safe for free tier at 1 req/s)
const MAX_RETRIES = 3;
const RETRY_DELAY_MS = 3000; // wait 3 s before retrying a failed request

// ---------------------------------------------------------------------------
// The 15 products to source
// ---------------------------------------------------------------------------
const PRODUCTS = [
  { name: 'Masque LED Pro 7 Couleurs',         pid: '2512020745411613700', vid: '2512020745411614100' },
  { name: 'Gua Sha Quartz Rose Cristal',       pid: '2602120829411639000', vid: '2602120829411639400' },
  { name: 'Scrubber Ultrasonique Visage',       pid: '1900541186889875458', vid: '1900541187347054594' },
  { name: 'Brosse Nettoyante Sonic',            pid: '1990665069449302017', vid: '1990665069533188098' },
  { name: 'Ice Roller Cryo Visage',             pid: '2508010604181617000', vid: '2508010604181617800' },
  { name: 'V-Line Roller Sculptant EMS',        pid: '2601270627311614800', vid: '2601270627311615200' },
  { name: 'Facial Steamer Nano-Ion',            pid: '2039619420008083458', vid: '2039619420209410049' },
  { name: 'Serum Eclat Vitamine C 20%',         pid: '2603300928441600800', vid: '2603300928441601200' },
  { name: 'Patchs Yeux Collagene',              pid: '2603301345481600700', vid: '2603301345481601100' },
  { name: 'Masque Collagene Lifting',            pid: '2604060437251602800', vid: '2604060437251603100' },
  { name: 'Huile Precieuse Rose Musquee',       pid: '2503141112311610800', vid: '2503141112311611000' },
  { name: 'Stickers Anti-Rides Micro-Crystal',  pid: '2603080834381636900', vid: '2603080834381637200' },
  { name: 'Masque Yeux Vapeur SPA',             pid: '2507200553561614700', vid: '2507200553561616300' },
  { name: 'Diffuseur Arome Ultrasonique',       pid: '2602270733571636700', vid: '2602270733571637400' },
  { name: 'Kit Boucles Sans Chaleur',           pid: '1481815597737185280', vid: '1481815597804294144' },
];

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

/** Simple promise-based delay */
function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * Make an HTTPS request (JSON in, JSON out). Zero external dependencies.
 * Returns { statusCode, body (parsed JSON) }.
 */
function request(method, urlString, body, headers) {
  return new Promise((resolve, reject) => {
    const url = new URL(urlString);
    const payload = body ? JSON.stringify(body) : null;

    const options = {
      hostname: url.hostname,
      port: 443,
      path: url.pathname + url.search,
      method,
      headers: {
        'Content-Type': 'application/json',
        ...headers,
        ...(payload ? { 'Content-Length': Buffer.byteLength(payload) } : {}),
      },
    };

    const req = https.request(options, (res) => {
      let data = '';
      res.on('data', (chunk) => { data += chunk; });
      res.on('end', () => {
        try {
          resolve({ statusCode: res.statusCode, body: JSON.parse(data) });
        } catch {
          reject(new Error(`Non-JSON response (HTTP ${res.statusCode}): ${data.slice(0, 300)}`));
        }
      });
    });

    req.on('error', reject);
    req.setTimeout(15000, () => { req.destroy(new Error('Request timeout (15 s)')); });

    if (payload) req.write(payload);
    req.end();
  });
}

// ---------------------------------------------------------------------------
// CJ API calls
// ---------------------------------------------------------------------------

/**
 * Authenticate and return an access token.
 * POST /authentication/getAccessToken  { apiKey }
 */
async function getAccessToken() {
  console.log('[AUTH] Requesting access token ...');
  const url = `${BASE_URL}/authentication/getAccessToken`;
  const { statusCode, body } = await request('POST', url, { apiKey: CJ_API_KEY });

  if (statusCode !== 200 || !body.data || !body.data.accessToken) {
    throw new Error(
      `Failed to obtain access token. HTTP ${statusCode} - ` +
      `code=${body.code}, message="${body.message}"`
    );
  }

  const { accessToken, accessTokenExpiryDate } = body.data;
  console.log(`[AUTH] Token obtained. Expires: ${accessTokenExpiryDate}`);
  return accessToken;
}

/**
 * Add a single product to "My Products" with retry logic.
 * POST /product/addToMyProduct  { productId }
 *
 * Success body:  { code: 200, data: true }
 * Already added: { code: 1600000, message: "The product has been added to My Products." }
 */
async function addToMyProduct(token, productId, productName) {
  const url = `${BASE_URL}/product/addToMyProduct`;
  const headers = { 'CJ-Access-Token': token };

  for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {
    try {
      const { statusCode, body } = await request('POST', url, { productId }, headers);

      // Success
      if (body.code === 200 && body.data === true) {
        return { status: 'added', message: body.message || 'Success' };
      }

      // Already in My Products -- not an error
      if (body.code === 1600000) {
        return { status: 'already_added', message: body.message };
      }

      // Rate limited or server error -- retry
      if (statusCode === 429 || statusCode >= 500) {
        console.warn(
          `  [RETRY] HTTP ${statusCode} for "${productName}" (attempt ${attempt}/${MAX_RETRIES}). ` +
          `Waiting ${RETRY_DELAY_MS / 1000}s ...`
        );
        await sleep(RETRY_DELAY_MS);
        continue;
      }

      // Other API error -- do not retry
      return {
        status: 'error',
        message: `code=${body.code}, message="${body.message}"`,
      };
    } catch (err) {
      if (attempt < MAX_RETRIES) {
        console.warn(
          `  [RETRY] Network error for "${productName}" (attempt ${attempt}/${MAX_RETRIES}): ${err.message}. ` +
          `Waiting ${RETRY_DELAY_MS / 1000}s ...`
        );
        await sleep(RETRY_DELAY_MS);
      } else {
        return { status: 'error', message: err.message };
      }
    }
  }

  return { status: 'error', message: `Failed after ${MAX_RETRIES} attempts` };
}

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------
async function main() {
  console.log('='.repeat(60));
  console.log('CJ Dropshipping -- Source 15 Products to My Products');
  console.log('='.repeat(60));
  console.log(`Products to add: ${PRODUCTS.length}`);
  console.log(`Rate limit delay: ${DELAY_MS} ms between requests`);
  console.log('');

  // 1. Authenticate
  const token = await getAccessToken();
  console.log('');

  // 2. Add each product sequentially, respecting rate limit
  const results = [];

  for (let i = 0; i < PRODUCTS.length; i++) {
    const product = PRODUCTS[i];
    const index = `[${i + 1}/${PRODUCTS.length}]`;

    process.stdout.write(`${index} Adding "${product.name}" (pid: ${product.pid}) ... `);
    const result = await addToMyProduct(token, product.pid, product.name);
    results.push({ ...product, ...result });

    // Color-coded status
    switch (result.status) {
      case 'added':
        console.log(`OK (added)`);
        break;
      case 'already_added':
        console.log(`SKIP (already in My Products)`);
        break;
      default:
        console.log(`FAIL (${result.message})`);
    }

    // Rate limit pause (skip after last item)
    if (i < PRODUCTS.length - 1) {
      await sleep(DELAY_MS);
    }
  }

  // 3. Summary
  console.log('');
  console.log('='.repeat(60));
  console.log('SUMMARY');
  console.log('='.repeat(60));

  const added = results.filter((r) => r.status === 'added');
  const skipped = results.filter((r) => r.status === 'already_added');
  const failed = results.filter((r) => r.status === 'error');

  console.log(`  Added:          ${added.length}`);
  console.log(`  Already existed: ${skipped.length}`);
  console.log(`  Failed:          ${failed.length}`);

  if (failed.length > 0) {
    console.log('');
    console.log('Failed products:');
    for (const f of failed) {
      console.log(`  - ${f.name} (pid: ${f.pid}): ${f.message}`);
    }
  }

  console.log('');
  console.log('Done.');

  // Exit with error code if any failures
  if (failed.length > 0) {
    process.exit(1);
  }
}

main().catch((err) => {
  console.error(`[FATAL] ${err.message}`);
  process.exit(1);
});
