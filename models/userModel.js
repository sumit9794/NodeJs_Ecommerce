const db = require("../db");
const bcrypt = require("bcryptjs");

class User {
  constructor(name, email, mobile, password) {
    this.name = name;
    this.email = email;
    this.mobile = mobile;
    this.password = password;
  }

  // Create a new user
  async save() {
    const hashedPassword = await bcrypt.hash(this.password, 10);
    const [result] = await db.query(
      "INSERT INTO users (name, email, mobile, password) VALUES (?, ?, ?, ?)",
      [this.name, this.email, this.mobile, hashedPassword]
    );
    return result;
  }

  // Find a user by email
  static async findByEmail(email) {
    const [rows] = await db.query("SELECT * FROM users WHERE email = ?", [email]);
    return rows[0];
  }

  static async findById(id) {
    const [rows] = await db.query("SELECT * FROM users WHERE id = ?", [id]);
    return rows[0]; // Return the first matching row
  }
}

module.exports = User;
