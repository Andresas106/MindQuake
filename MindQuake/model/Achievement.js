class Achievement {
    constructor({ id, name, icon, unlockedAt }) {
        this.id = id;
        this.name = name;
        this.icon = icon;
        this.unlockedAt = unlockedAt || null; // Opcional, puede ser null si no está desbloqueado
    }

    isUnlocked() {
        return this.unlockedAt !== null;
    }

    formatUnlockedDate() {
        return this.unlockedAt ? new Date(this.unlockedAt).toLocaleDateString() : 'Not unlocked yet';
    }
}
