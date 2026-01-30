const db = require('../config/db'); // Kept as database per your request
const bcrypt = require('bcryptjs');

class UserService {
    static async createTeacher(teacherData) {
        const hashedPassword = await bcrypt.hash(teacherData.password, 10);
        const query = `INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)`;
        return await db.execute(query, [teacherData.name, teacherData.email, hashedPassword, teacherData.role]);
    }

    static async selectPlan(userId, planId) {
    // Ensure you get the 'rows' specifically
    const [rows] = await db.execute('SELECT course_limit FROM pricing_plans WHERE id = ?', [planId]);
    
    if (!rows || rows.length === 0) throw new Error("Plan not found");
    
    const limit = rows[0].course_limit;

    // If userId or limit are undefined here, MySQL throws the 'Bind parameters' error
    return await db.execute(
        'UPDATE users SET plan_id = ?, course_credits = ? WHERE id = ?',
        [planId, limit, userId]
    );
}

static async enrollInCourse(userId, course_id) {
    // 1. Get the limit and the current count in one query
    const [stats] = await db.execute(
        `SELECT 
            u.course_credits as total_allowed, 
            (SELECT COUNT(*) FROM user_courses WHERE user_id = u.id) as currently_used
         FROM users u 
         WHERE u.id = ?`, 
        [userId]
    );

    if (stats.length === 0) throw new Error("User not found");

    const { total_allowed, currently_used } = stats[0];

    // 2. Logic check: Is there room?
    if (currently_used >= total_allowed) {
        throw new Error(`You have used all ${total_allowed} course slots in your plan. Please upgrade for more.`);
    }

    try {
        // 3. Insert the link (SQL UNIQUE constraint prevents double-picking)
        await db.execute(
            'INSERT INTO user_courses (user_id, course_id) VALUES (?, ?)',
            [userId, course_id]
        );

        return {
            remaining: total_allowed - (currently_used + 1),
            total: total_allowed
        };
    } catch (error) {
        if (error.code === 'ER_DUP_ENTRY') {
            throw new Error("You are already enrolled in this course.");
        }
        throw error;
    }
}

static async finishCourse(userId, courseId) {
    // 1. Check if the enrollment exists
    const [enrollment] = await db.execute(
        'SELECT id, status FROM user_courses WHERE user_id = ? AND course_id = ?',
        [userId, courseId]
    );

    if (enrollment.length === 0) {
        throw new Error("You are not enrolled in this course.");
    }

    if (enrollment[0].status === 'Completed') {
        throw new Error("Course is already marked as completed.");
    }

    return await db.execute(
        'UPDATE user_courses SET status = "Completed" WHERE user_id = ? AND course_id = ?',
        [userId, courseId]
    );
}
}
module.exports = UserService;