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
      let level = 1;
      let xpRequiredForNextLevel = 250;

      while(this.xp >= xpRequiredForNextLevel) {
        level++;
        this.xp -= xpRequiredForNextLevel;
        xpRequiredForNextLevel += 250;
      }

      return level;
    }

    calculateXpRequiredForNextLevel() {
      return 250 * this.level;
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
  