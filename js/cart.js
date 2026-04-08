// ============================
// ECLAT - Cart System
// ============================

class Cart {
    constructor() {
        try { this.items = JSON.parse(localStorage.getItem('eclat_cart')) || []; }
        catch { this.items = []; }
        this.listeners = [];
    }

    save() {
        localStorage.setItem('eclat_cart', JSON.stringify(this.items));
        this.notify();
    }

    notify() {
        this.listeners.forEach(fn => fn(this.items));
    }

    onChange(fn) {
        this.listeners.push(fn);
    }

    add(product, qty = 1) {
        const existing = this.items.find(item => item.id === product.id);
        if (existing) {
            existing.qty += qty;
        } else {
            this.items.push({
                id: product.id,
                name: product.name,
                price: product.price,
                image: product.image,
                qty: qty
            });
        }
        this.save();
    }

    remove(productId) {
        this.items = this.items.filter(item => item.id !== productId);
        this.save();
    }

    updateQty(productId, qty) {
        const item = this.items.find(item => item.id === productId);
        if (item) {
            item.qty = Math.max(1, qty);
            this.save();
        }
    }

    getTotal() {
        return this.items.reduce((sum, item) => sum + (item.price * item.qty), 0);
    }

    getCount() {
        return this.items.reduce((sum, item) => sum + item.qty, 0);
    }

    clear() {
        this.items = [];
        this.save();
    }

    isEmpty() {
        return this.items.length === 0;
    }
}

const cart = new Cart();
