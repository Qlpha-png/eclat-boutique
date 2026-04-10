// ECLAT - Push Config API (public VAPID key)
module.exports = async (req, res) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Cache-Control', 'public, max-age=86400');
    if (req.method === 'OPTIONS') return res.status(200).end();
    
    var vapidPublicKey = process.env.VAPID_PUBLIC_KEY || '';
    if (!vapidPublicKey) {
        return res.status(200).json({ enabled: false });
    }
    return res.status(200).json({ enabled: true, publicKey: vapidPublicKey });
};
