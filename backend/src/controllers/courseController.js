const promisePool = require('../config/db');

class CourseController {
  /**
   * Create a new course with description, objectives, and curriculum
   */
  static async createCourse(req, res, next) {
    try {
      const { 
        title, 
        description, 
        objectives, 
        curriculum, 
        instructor_id,
        category_id,
        logo_path 
      } = req.body;

      const [result] = await promisePool.query(
        `INSERT INTO courses 
        (title, description, objectives, curriculum, instructor_id, category_id, logo_path) 
        VALUES (?, ?, ?, ?, ?, ?, ?)`,
        [
          title, 
          description, 
          objectives, 
          JSON.stringify(curriculum), // Stores the array as a JSON string
          instructor_id, 
          category_id, 
          logo_path
        ]
      );

      res.status(201).json({
        success: true,
        message: 'Course content saved successfully!',
        courseId: result.insertId
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Get a single course by ID (including Instructor name and Bio)
   */
  static async getCourse(req, res, next) {
    try {
      const [rows] = await promisePool.query(
        `SELECT c.*, u.username as instructor_name, u.bio as instructor_bio 
         FROM courses c 
         LEFT JOIN users u ON c.instructor_id = u.id 
         WHERE c.id = ?`,
        [req.params.id]
      );

      if (rows.length === 0) {
        return res.status(404).json({ message: "Course not found" });
      }

      const course = rows[0];

      // Important: Convert curriculum string back to an actual list/array for the frontend
      if (course.curriculum && typeof course.curriculum === 'string') {
        try {
          course.curriculum = JSON.parse(course.curriculum);
        } catch (e) {
          course.curriculum = []; // Fallback if JSON is malformed
        }
      }

      res.json({ success: true, data: course });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Get all courses (used for the course listing/cards page)
   */
  static async getAllCourses(req, res, next) {
    try {
      const [courses] = await promisePool.query(
        `SELECT c.id, c.title, c.description, c.logo_path, u.username as instructor_name 
         FROM courses c 
         LEFT JOIN users u ON c.instructor_id = u.id`
      );
      
      res.json({ success: true, data: courses });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = CourseController;