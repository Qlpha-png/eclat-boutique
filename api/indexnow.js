// IndexNow API — Notifie Bing/Yandex/etc. des URLs modifiées
// POST /api/indexnow — body: { urls: ["https://maison-eclat.shop/..."] }
// GET  /api/indexnow — soumet automatiquement toutes les URLs du sitemap

const INDEXNOW_KEY = '7f16bb5869c0455f9d86ac0e7406bdde';
const HOST = 'maison-eclat.shop';
const KEY_LOCATION = `https://${HOST}/${INDEXNOW_KEY}.txt`;
const SITEMAP_URL = `https://${HOST}/sitemap.xml`;

async function fetchSitemapUrls() {
    const res = await fetch(SITEMAP_URL);
    if (!res.ok) throw new Error(`Sitemap fetch failed: ${res.status}`);
    const xml = await res.text();
    // Extract all <loc> URLs
    const urls = [];
    const regex = /<loc>(https:\/\/maison-eclat\.shop[^<]+)<\/loc>/g;
    let match;
    while ((match = regex.exec(xml)) !== null) {
        urls.push(match[1]);
    }
    return urls;
}

async function submitToIndexNow(urls) {
    if (!urls || urls.length === 0) {
        return { success: false, error: 'Aucune URL a soumettre' };
    }

    const payload = {
        host: HOST,
        key: INDEXNOW_KEY,
        keyLocation: KEY_LOCATION,
        urlList: urls
    };

    const response = await fetch('https://api.indexnow.org/IndexNow', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json; charset=utf-8' },
        body: JSON.stringify(payload)
    });

    return {
        status: response.status,
        statusText: response.statusText,
        submitted: urls.length,
        urls: urls
    };
}

export default async function handler(req, res) {
    // CORS
    res.setHeader('Access-Control-Allow-Origin', `https://${HOST}`);
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') {
        return res.status(204).end();
    }

    try {
        let urls;

        if (req.method === 'POST') {
            // POST : soumettre des URLs specifiques
            const body = typeof req.body === 'string' ? JSON.parse(req.body) : req.body;
            urls = body?.urls;

            if (!Array.isArray(urls) || urls.length === 0) {
                return res.status(400).json({
                    error: 'Body doit contenir { urls: ["https://maison-eclat.shop/..."] }'
                });
            }

            // Valider que les URLs sont du bon domaine
            const invalidUrls = urls.filter(u => !u.startsWith(`https://${HOST}`));
            if (invalidUrls.length > 0) {
                return res.status(400).json({
                    error: `URLs invalides (domaine incorrect) : ${invalidUrls.join(', ')}`
                });
            }

        } else if (req.method === 'GET') {
            // GET : soumettre toutes les URLs du sitemap
            urls = await fetchSitemapUrls();

            if (urls.length === 0) {
                return res.status(500).json({ error: 'Aucune URL trouvee dans le sitemap' });
            }

        } else {
            return res.status(405).json({ error: 'Methode non autorisee. Utiliser GET ou POST.' });
        }

        // IndexNow limite a 10000 URLs par requete
        const BATCH_SIZE = 10000;
        const results = [];

        for (let i = 0; i < urls.length; i += BATCH_SIZE) {
            const batch = urls.slice(i, i + BATCH_SIZE);
            const result = await submitToIndexNow(batch);
            results.push(result);
        }

        return res.status(200).json({
            success: true,
            method: req.method,
            totalUrls: urls.length,
            batches: results.length,
            results,
            timestamp: new Date().toISOString()
        });

    } catch (err) {
        console.error('IndexNow error:', err);
        return res.status(500).json({
            error: 'Erreur interne IndexNow',
            message: err.message
        });
    }
}
