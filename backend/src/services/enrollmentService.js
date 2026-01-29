const db = require('../config/db');

class EnrollmentService {
  static async pickCourse(userId, courseId) {
    const connection = await db.getConnection();
    try {
      await connection.beginTransaction();

      // 1. Check current credits
      const [user] = await connection.execute(
        'SELECT course_credits FROM users WHERE id = ?', 
        [userId]
      );

      if (user[0].course_credits <= 0) {
        throw new Error("No credits remaining. Please upgrade your plan.");
      }

      // 2. Attempt to enroll (The UNIQUE constraint in SQL prevents duplicates here)
      // If the user already has the course, this will throw an error automatically
      await connection.execute(
        'INSERT INTO enrollments (user_id, course_id) VALUES (?, ?)',
        [userId, courseId]
      );

      // 3. Deduct one credit
      await connection.execute(
        'UPDATE users SET course_credits = course_credits - 1 WHERE id = ?',
        [userId]
      );

      await connection.commit();
      return { success: true };

    } catch (error) {
      await connection.rollback();
      // Handle the duplicate course error from MySQL
      if (error.code === 'ER_DUP_ENTRY') {
        throw new Error("You are already enrolled in this course.");
      }
      throw error;
    } finally {
      connection.release();
    }
  }
}