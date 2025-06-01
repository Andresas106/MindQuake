class User {
    constructor({
      id,
      full_name,
      email,
      profile_picture = '',
      xp = 0,
      level = 1,
      created_at = new Date().toISOString()
    }) {
      this.id = id;
      this.full_name = full_name;
      this.email = email;
      this.profile_picture = profile_picture;
      this.xp = xp;
      this.level = level;
      this.created_at = created_at;
    }
  
    calculateLevel() {
      let xp = this.xp;
      let level = 1;
      let xpRequired = 250;
  
      while (xp >= xpRequired) {
        xp -= xpRequired;
        level++;
        xpRequired += 250;
      }
  
      return level;
    }
  
    calculateXpRequiredForNextLevel() {
      const level = this.calculateLevel();
      return 250 + (level - 1) * 250;
    }
  
    getCurrentXpInLevel() {
      let xp = this.xp;
      let xpRequired = 250;
      let level = 1;
  
      while (xp >= xpRequired) {
        xp -= xpRequired;
        level++;
        xpRequired += 250;
      }
  
      return xp; 
    }
  
    updateXp(newXp) {
      this.xp = newXp;
      this.level = this.calculateLevel();
    }
  
    // Método para obtener los datos del usuario en formato JSON
    toJSON() {
      return {
        id: this.id,
        full_name: this.full_name,
        email: this.email,
        profile_picture: this.profile_picture,
        xp: this.xp,
        level: this.level,
        created_at: this.created_at
      };
    }
  }
  
  export default User;
  