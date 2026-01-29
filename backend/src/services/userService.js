const db = require('../config/db'); // Kept as database per your request
const bcrypt = require('bcryptjs');

class UserService {
    static async createTeacher(teacherData) {
        const hashedPassword = await bcrypt.hash(teacherData.password, 10);
        const query = `INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)`;
        return await db.execute(query, [teacherData.name, teacherData.email, hashedPassword, teacherData.role]);
    }

    static async selectPlan(userId, planId) {
        const [planData] = await db.execute('SELECT course_limit FROM pricing_plans WHERE id = ?', [planId]);
        if (planData.length === 0) throw new Error("Plan not found");
        
        const limit = planData[0].course_limit;
        return await db.execute(
            'UPDATE users SET plan_id = ?, course_credits = ? WHERE id = ?',
            [planId, limit, userId]
        );
    }
}
module.exports = UserService;