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
  
   /* // Método para actualizar la foto de perfil
    updateProfilePicture(newUrl) {
      this.profile_picture = newUrl;
    }
  
    // Método para aumentar la XP y nivel
    addXp(amount) {
      this.xp += amount;
      this.checkLevelUp();
    }
  
    // Método para verificar si sube de nivel
    checkLevelUp() {
      const requiredXp = this.level * 100; // Ejemplo: cada nivel requiere 100 * nivel XP
      while (this.xp >= requiredXp) {
        this.xp -= requiredXp;
        this.level++;
      }
    }*/
  
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
  