const db = require('../config/db');

class PlanModel {
  static async findAll() {
    const [rows] = await db.execute('SELECT * FROM pricing_plans');
    return rows;
  }

  static async findByName(name) {
    const [rows] = await db.execute('SELECT * FROM pricing_plans WHERE name = ?', [name]);
    return rows[0];
  }

  static async create(data) {
    const query = `
      INSERT INTO pricing_plans (name, course_limit, price, features, is_recommended) 
      VALUES (?, ?, ?, ?, ?)`;
    const [result] = await db.execute(query, [
      data.name, 
      data.course_limit, 
      data.price, 
      data.features, 
      data.is_recommended
    ]);
    return result;
  }
}

module.exports = PlanModel;