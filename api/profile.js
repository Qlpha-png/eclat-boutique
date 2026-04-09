const { verifyAuth, getProfile } = require('./_middleware/auth');

module.exports = async function handler(req, res) {
    if (req.method !== 'GET') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    const user = await verifyAuth(req);
    if (!user) {
        return res.status(401).json({ error: 'Non authentifié' });
    }

    const profile = await getProfile(user.userId);
    if (!profile) {
        return res.status(404).json({ error: 'Profil introuvable' });
    }

    return res.status(200).json(profile);
};
