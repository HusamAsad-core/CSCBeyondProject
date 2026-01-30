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

static async delete(id) {
  const [result] = await promisePool.query('DELETE FROM pricing_plans WHERE id = ?', [id]);
  return result;
}

// Ensure update also handles the correct fields
static async update(id, data) {
  const { name, course_limit, price, features, is_recommended } = data;
  return await promisePool.query(
    'UPDATE pricing_plans SET name=?, course_limit=?, price=?, features=?, is_recommended=? WHERE id=?',
    [name, course_limit, price, features, is_recommended, id]
  );
}
}

module.exports = PlanModel;