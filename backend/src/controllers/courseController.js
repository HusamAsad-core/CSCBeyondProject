const promisePool = require('../config/db');

class CourseController {
  /**
   * Create a new course
   */
  static async createCourse(req, res, next) {
    try {
      console.log("--- NEW COURSE SUBMISSION ---");
      console.log("Full Body received:", req.body);

      const { 
        title, 
        description, 
        objectives, 
        curriculum, 
        instructor_id,
        category_id,
        logo_path,
        status 
      } = req.body;

      console.log("Status picked from body:", status);

      const [result] = await promisePool.query(
        `INSERT INTO courses 
        (title, description, objectives, curriculum, instructor_id, category_id, logo_path, status) 
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          title, 
          description, 
          objectives || '', 
          JSON.stringify(curriculum || []), 
          instructor_id, 
          category_id, 
          logo_path,
          status || 'active' 
        ]
      );

      res.status(201).json({
        success: true,
        message: 'Course saved to database!',
        courseId: result.insertId,
        savedStatus: status
      });
    } catch (error) {
      console.error("INSERT ERROR:", error.message);
      next(error);
    }
  }

  /**
   * Get all courses for the list view
   */
  static async getAllCourses(req, res, next) {
    try {
      const [courses] = await promisePool.query(
        `SELECT c.*, cat.name as category_name, u.username as instructor_name 
         FROM courses c 
         LEFT JOIN categories cat ON c.category_id = cat.id
         LEFT JOIN users u ON c.instructor_id = u.id
         ORDER BY c.id DESC` 
      );
      res.json({ success: true, data: courses });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Get a single course by ID (REQUIRED by your routes file)
   */
  static async getCourse(req, res, next) {
    try {
      const [rows] = await promisePool.query(
        `SELECT c.*, cat.name as category_name, u.username as instructor_name 
         FROM courses c 
         LEFT JOIN categories cat ON c.category_id = cat.id
         LEFT JOIN users u ON c.instructor_id = u.id 
         WHERE c.id = ?`,
        [req.params.id]
      );

      if (rows.length === 0) {
        return res.status(404).json({ success: false, message: "Course not found" });
      }

      res.json({ success: true, data: rows[0] });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = CourseController;