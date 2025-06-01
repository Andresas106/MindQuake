class Achievement {
    constructor({ id, name, icon, unlockedAt }) {
        this.id = id;
        this.name = name;
        this.icon = icon;
        this.unlockedAt = unlockedAt || null;
    }

    isUnlocked() {
        return this.unlockedAt !== null;
    }

    formatUnlockedDate() {
        return this.unlockedAt ? new Date(this.unlockedAt).toLocaleDateString() : 'Not unlocked yet';
    }
}

export default Achievement;
