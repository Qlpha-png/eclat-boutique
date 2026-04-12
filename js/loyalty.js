// ============================
// ÉCLAT - Programme de Fidélité & Parrainage
// ============================

class LoyaltyProgram {
    constructor() {
        this.data = JSON.parse(localStorage.getItem('eclat_loyalty')) || {
            points: 0,
            totalSpent: 0,
            ordersCount: 0,
            tier: 'eclat',
            joinDate: new Date().toISOString(),
            referralCode: this.generateReferralCode(),
            referrals: 0,
            rewards: []
        };
        this.save();
    }

    // --- Tiers (basé sur Éclats — doit correspondre à loyalty-bar.js) ---
    static TIERS = {
        eclat:     { name: 'Éclat',     min: 0,    multiplier: 1,   icon: '✨', perks: ['1 Éclat par € dépensé', 'Coffre du jour', 'Badges à collectionner'] },
        lumiere:   { name: 'Lumière',   min: 300,  multiplier: 1.3, icon: '💡', perks: ['x1.3 Éclats', 'IA beauté', 'Livraison offerte dès 39€', 'Roue de la fortune'] },
        prestige:  { name: 'Prestige',  min: 750,  multiplier: 1.6, icon: '👑', perks: ['x1.6 Éclats', 'IA experte + 50 msg', 'Accès avant-premières', 'Cadeau trimestriel'] },
        diamant:   { name: 'Diamant',   min: 1500, multiplier: 2,   icon: '💎', perks: ['x2 Éclats', 'IA illimitée + VIP', '-10% permanent', 'Événements exclusifs'] }
    };

    // --- Récompenses disponibles ---
    static REWARDS = [
        { id: 'discount5',  name: '-5€ sur votre commande',   points: 50,  type: 'discount', value: 5 },
        { id: 'discount10', name: '-10€ sur votre commande',  points: 90,  type: 'discount', value: 10 },
        { id: 'discount20', name: '-20€ sur votre commande',  points: 170, type: 'discount', value: 20 },
        { id: 'freeship',   name: 'Livraison express offerte', points: 40,  type: 'shipping', value: 0 },
        { id: 'gift',       name: 'Cadeau surprise',          points: 120, type: 'gift',     value: 0 }
    ];

    save() {
        localStorage.setItem('eclat_loyalty', JSON.stringify(this.data));
    }

    generateReferralCode() {
        return 'ECLAT-' + Math.random().toString(36).substring(2, 8).toUpperCase();
    }

    // Ajouter des points après achat
    addPoints(amountSpent) {
        const tier = LoyaltyProgram.TIERS[this.data.tier];
        const points = Math.floor(amountSpent * tier.multiplier);
        this.data.points += points;
        this.data.totalSpent += amountSpent;
        this.data.ordersCount += 1;
        this.updateTier();
        this.save();
        return points;
    }

    // Parrainage : +100 points parrain, +50 points filleul
    addReferral() {
        this.data.points += 100;
        this.data.referrals += 1;
        this.save();
    }

    applyReferralBonus() {
        this.data.points += 50;
        this.save();
    }

    // Mettre à jour le tier (basé sur Éclats, pas totalSpent)
    updateTier() {
        const points = this.data.points;
        if (points >= 1500) this.data.tier = 'diamant';
        else if (points >= 750) this.data.tier = 'prestige';
        else if (points >= 300) this.data.tier = 'lumiere';
        else this.data.tier = 'eclat';
        this.save();
    }

    // Échanger des points
    redeemReward(rewardId) {
        const reward = LoyaltyProgram.REWARDS.find(r => r.id === rewardId);
        if (!reward) return { success: false, message: 'Récompense introuvable.' };
        if (this.data.points < reward.points) {
            return { success: false, message: `Il vous manque ${reward.points - this.data.points} points.` };
        }
        this.data.points -= reward.points;
        this.data.rewards.push({ ...reward, redeemedAt: new Date().toISOString() });
        this.save();
        return { success: true, message: `${reward.name} activé ! 🎉`, reward };
    }

    getTier() {
        return LoyaltyProgram.TIERS[this.data.tier];
    }

    getNextTier() {
        const tiers = Object.keys(LoyaltyProgram.TIERS);
        const currentIndex = tiers.indexOf(this.data.tier);
        if (currentIndex < tiers.length - 1) {
            const nextKey = tiers[currentIndex + 1];
            return { key: nextKey, ...LoyaltyProgram.TIERS[nextKey] };
        }
        return null;
    }

    getProgressToNextTier() {
        const next = this.getNextTier();
        if (!next) return 100;
        const current = LoyaltyProgram.TIERS[this.data.tier];
        const progress = ((this.data.points - current.min) / (next.min - current.min)) * 100;
        return Math.min(100, Math.max(0, progress));
    }
}

const loyalty = new LoyaltyProgram();
