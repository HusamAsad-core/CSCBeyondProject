const promisePool = require('../config/db');

class CourseController {
  static async createCourse(req, res, next) {
    try {
      const {
        title,
        description,
        about_text,
        objectives,
        curriculum,
        instructor_id,
        category_id,
        logo_path,
        status,

        // NEW
        objectives_json,
        content_json,
        projects_json,
        tools_json,
        demo_url,
        curriculum_url
      } = req.body;

      const [result] = await promisePool.query(
        `INSERT INTO courses 
          (title, description, about_text, objectives, curriculum,
           instructor_id, category_id, logo_path, status,
           objectives_json, content_json, projects_json, tools_json, demo_url, curriculum_url)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          title,
          description || '',
          about_text || '',
          objectives || '',
          JSON.stringify(curriculum || []),

          instructor_id,
          category_id,
          logo_path || '',
          status || 'active',

          JSON.stringify(objectives_json || []),
          JSON.stringify(content_json || []),
          JSON.stringify(projects_json || []),
          JSON.stringify(tools_json || []),
          demo_url || '',
          curriculum_url || ''
        ]
      );

      res.status(201).json({
        success: true,
        message: 'Course saved to database!',
        courseId: result.insertId
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * ✅ PUBLIC COURSES PAGE
   */
  static async getPublicCourses(req, res, next) {
    try {
      const filter = String(req.query.filter || 'all').toLowerCase();

      let whereClause = '';
      const params = [];

      if (filter === 'opened') {
        whereClause = `WHERE c.status IN ('active','popular')`;
      } else if (filter === 'coming_soon') {
        whereClause = `WHERE c.status = 'coming_soon'`;
      } else {
        whereClause = '';
      }

      const [courses] = await promisePool.query(
        `SELECT c.*, cat.name as category_name, u.username as instructor_name
         FROM courses c
         LEFT JOIN categories cat ON c.category_id = cat.id
         LEFT JOIN users u ON c.instructor_id = u.id
         ${whereClause}
         ORDER BY c.id DESC`,
        params
      );

      res.json({ success: true, data: courses });
    } catch (error) {
      next(error);
    }
  }

  static async getDashboardCourses(req, res, next) {
    try {
      const userId = req.user.id;
      const role = req.user.role;

      let query = `
        SELECT c.*, cat.name as category_name, u.username as instructor_name
        FROM courses c
        LEFT JOIN categories cat ON c.category_id = cat.id
        LEFT JOIN users u ON c.instructor_id = u.id
      `;
      const params = [];

      if (role === 'instructor') {
        query += ` WHERE c.instructor_id = ? `;
        params.push(userId);
      }

      query += ` ORDER BY c.id DESC `;

      const [courses] = await promisePool.query(query, params);
      res.json({ success: true, data: courses });
    } catch (error) {
      next(error);
    }
  }

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

      const course = rows[0];

      if (req.user.role === 'instructor' && course.instructor_id !== req.user.id) {
        return res.status(403).json({ success: false, message: "Not allowed to access this course" });
      }

      res.json({ success: true, data: course });
    } catch (error) {
      next(error);
    }
  }

  static async updateCourse(req, res, next) {
    try {
      const { id } = req.params;

      const [existing] = await promisePool.query(
        `SELECT instructor_id FROM courses WHERE id = ?`,
        [id]
      );

      if (existing.length === 0) {
        return res.status(404).json({ success: false, message: "Course not found" });
      }

      const ownerId = existing[0].instructor_id;
      if (req.user.role === 'instructor' && ownerId !== req.user.id) {
        return res.status(403).json({ success: false, message: "Not allowed to edit this course" });
      }

      const {
        title,
        description,
        about_text,
        objectives,
        curriculum,
        category_id,
        logo_path,
        status,

        // NEW
        objectives_json,
        content_json,
        projects_json,
        tools_json,
        demo_url,
        curriculum_url
      } = req.body;

      await promisePool.query(
        `UPDATE courses
         SET title = ?, description = ?, about_text = ?, objectives = ?, curriculum = ?,
             category_id = ?, logo_path = ?, status = ?,
             objectives_json = ?, content_json = ?, projects_json = ?, tools_json = ?,
             demo_url = ?, curriculum_url = ?
         WHERE id = ?`,
        [
          title,
          description || '',
          about_text || '',
          objectives || '',
          JSON.stringify(curriculum || []),

          category_id,
          logo_path || '',
          status || 'active',

          JSON.stringify(objectives_json || []),
          JSON.stringify(content_json || []),
          JSON.stringify(projects_json || []),
          JSON.stringify(tools_json || []),

          demo_url || '',
          curriculum_url || '',
          id
        ]
      );

      res.json({ success: true, message: "Course updated successfully" });
    } catch (error) {
      next(error);
    }
  }

  static async updateCourseInstructor(req, res, next) {
    try {
      const { id } = req.params;
      const { instructor_id } = req.body;

      if (!instructor_id || Number.isNaN(Number(instructor_id))) {
        return res.status(400).json({ success: false, message: "instructor_id must be a valid number" });
      }

      const [users] = await promisePool.query(
        `SELECT id, role FROM users WHERE id = ?`,
        [instructor_id]
      );

      if (users.length === 0) {
        return res.status(404).json({ success: false, message: "Instructor user not found" });
      }

      if (users[0].role !== 'instructor') {
        return res.status(400).json({ success: false, message: "User is not an instructor" });
      }

      const [courses] = await promisePool.query(
        `SELECT id FROM courses WHERE id = ?`,
        [id]
      );
      if (courses.length === 0) {
        return res.status(404).json({ success: false, message: "Course not found" });
      }

      await promisePool.query(
        `UPDATE courses SET instructor_id = ? WHERE id = ?`,
        [instructor_id, id]
      );

      res.json({ success: true, message: "Instructor updated successfully" });
    } catch (error) {
      next(error);
    }
  }

  static async deleteCourse(req, res, next) {
    try {
      const { id } = req.params;

      const [existing] = await promisePool.query(
        `SELECT instructor_id FROM courses WHERE id = ?`,
        [id]
      );

      if (existing.length === 0) {
        return res.status(404).json({ success: false, message: "Course not found" });
      }

      const ownerId = existing[0].instructor_id;
      if (req.user.role === 'instructor' && ownerId !== req.user.id) {
        return res.status(403).json({ success: false, message: "Not allowed to delete this course" });
      }

      await promisePool.query(`DELETE FROM courses WHERE id = ?`, [id]);

      res.json({ success: true, message: "Course deleted successfully" });
    } catch (error) {
      next(error);
    }
  }

  static async getPublicCourseById(req, res, next) {
    try {
      const [rows] = await promisePool.query(
        `SELECT c.*, cat.name as category_name,
                u.username as instructor_name
         FROM courses c
         LEFT JOIN categories cat ON c.category_id = cat.id
         LEFT JOIN users u ON c.instructor_id = u.id
         WHERE c.id = ?`,
        [req.params.id]
      );

      if (!rows.length) {
        return res.status(404).json({
          success: false,
          message: "Course not found"
        });
      }

      res.json({
        success: true,
        data: rows[0]
      });

    } catch (error) {
      next(error);
    }
  }
}

module.exports = CourseController;
