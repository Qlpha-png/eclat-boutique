// ============================
// ÉCLAT - Test API CJDropshipping
// GET /api/cj-test : Vérifie la connexion + cherche des produits
// ============================

const https = require('https');

module.exports = async (req, res) => {
    res.setHeader('Access-Control-Allow-Origin', '*');

    const apiKey = process.env.CJ_API_KEY;
    if (!apiKey) {
        return res.status(500).json({ error: 'CJ_API_KEY not configured' });
    }

    // Étape 1 : Obtenir le token
    let accessToken;
    try {
        const authData = await cjPost('/authentication/getAccessToken', '', { apiKey });
        if (!authData.result) {
            return res.status(401).json({ error: 'CJ Auth failed', message: authData.message });
        }
        accessToken = authData.data.accessToken;
    } catch (e) {
        return res.status(500).json({ error: 'CJ Auth error', message: e.message });
    }

    // Étape 2 : Action selon le paramètre
    const action = req.query?.action || 'status';

    try {
        switch (action) {
            case 'status': {
                return res.json({
                    status: 'connected',
                    message: 'API CJDropshipping connectée et fonctionnelle',
                    tokenPreview: accessToken.substring(0, 30) + '...',
                    timestamp: new Date().toISOString()
                });
            }

            case 'search': {
                const query = req.query?.q || 'led mask';
                const category = req.query?.cat || '';
                let url = `/product/list?pageNum=1&pageSize=5&productNameEn=${encodeURIComponent(query)}`;
                if (category) url += `&categoryId=${category}`;

                const data = await cjGet(url, accessToken);
                return res.json({
                    query,
                    total: data.data?.total || 0,
                    products: (data.data?.list || []).map(p => ({
                        pid: p.pid,
                        name: p.productNameEn,
                        price: p.sellPrice,
                        image: p.productImage,
                        variants: (p.variants || []).map(v => ({
                            vid: v.vid,
                            name: v.variantNameEn,
                            price: v.variantSellPrice
                        }))
                    }))
                });
            }

            case 'product': {
                const pid = req.query?.pid;
                if (!pid) return res.status(400).json({ error: 'pid required' });

                const data = await cjGet(`/product/query?pid=${pid}`, accessToken);
                if (!data.result) return res.status(404).json({ error: 'Product not found', message: data.message });

                const p = data.data;
                return res.json({
                    pid: p.pid,
                    name: p.productNameEn,
                    description: p.description,
                    price: p.sellPrice,
                    image: p.productImage,
                    images: p.productImageSet,
                    variants: (p.variants || []).map(v => ({
                        vid: v.vid,
                        name: v.variantNameEn,
                        price: v.variantSellPrice,
                        stock: v.variantVolume
                    })),
                    shipping: p.productUnit,
                    weight: p.productWeight,
                    category: p.categoryName
                });
            }

            case 'categories': {
                const data = await cjGet('/product/getCategory', accessToken);
                const beautyId = '2C7D4A0B-1AB2-41EC-8F9E-13DC31B1C902';
                const beauty = (data.data || []).find(c => c.categoryFirstId === beautyId);
                return res.json({
                    beautyCategories: (beauty?.categoryFirstList || []).map(sub => ({
                        id: sub.categorySecondId,
                        name: sub.categorySecondName
                    })),
                    allCategories: (data.data || []).map(c => ({
                        id: c.categoryFirstId,
                        name: c.categoryFirstName
                    }))
                });
            }

            default:
                return res.status(400).json({ error: 'Unknown action', available: ['status', 'search', 'product', 'categories'] });
        }
    } catch (e) {
        return res.status(500).json({ error: e.message });
    }
};

function cjPost(path, token, body) {
    return new Promise((resolve, reject) => {
        const options = {
            hostname: 'developers.cjdropshipping.com',
            path: '/api2.0/v1' + path,
            method: 'POST',
            headers: { 'Content-Type': 'application/json' }
        };
        if (token) options.headers['CJ-Access-Token'] = token;
        const req = https.request(options, (res) => {
            let data = '';
            res.on('data', c => data += c);
            res.on('end', () => { try { resolve(JSON.parse(data)); } catch (e) { reject(e); } });
        });
        req.on('error', reject);
        req.write(JSON.stringify(body));
        req.end();
    });
}

function cjGet(path, token) {
    return new Promise((resolve, reject) => {
        const options = {
            hostname: 'developers.cjdropshipping.com',
            path: '/api2.0/v1' + path,
            method: 'GET',
            headers: { 'Content-Type': 'application/json', 'CJ-Access-Token': token }
        };
        const req = https.request(options, (res) => {
            let data = '';
            res.on('data', c => data += c);
            res.on('end', () => { try { resolve(JSON.parse(data)); } catch (e) { reject(e); } });
        });
        req.on('error', reject);
        req.end();
    });
}
