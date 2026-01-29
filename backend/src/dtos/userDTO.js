class UserDTO {
  constructor(user) {
    this.id = user.id;
    this.name = user.username || user.name; 
    this.email = user.email;
    this.role = user.role;
    this.createdAt = user.created_at;
  }
}

module.exports = UserDTO;