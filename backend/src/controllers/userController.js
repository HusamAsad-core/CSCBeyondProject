const UserService = require('../services/userService');

class UserController {
  /* ---------- Plan selection ---------- */
  static async updateUserPlan(req, res) {
    try {
      const userId = req.user.id;
      const { planId } = req.body;

      if (!planId) {
        return res.status(400).json({ success: false, error: "planId is required" });
      }

      await UserService.selectPlan(userId, planId);

      return res.status(200).json({ success: true, message: "Plan updated!" });
    } catch (error) {
      return res.status(500).json({ success: false, error: error.message });
    }
  }

  /* ---------- Enroll in course ---------- */
  static async selectCourse(req, res) {
    try {
      const { course_id } = req.body;

      if (!course_id) {
        return res.status(400).json({ success: false, error: "course_id is required" });
      }

      const result = await UserService.enrollInCourse(req.user.id, course_id);

      return res.status(200).json({
        success: true,
        message: "Successfully enrolled!",
        remainingSlots: result?.remaining ?? null
      });
    } catch (error) {
      return res.status(400).json({ success: false, error: error.message });
    }
  }

  /* ---------- Fetch enrollments ---------- */
  static async getMyEnrollments(req, res) {
    try {
      const courses = await UserService.getMyEnrollments(req.user.id);
      return res.status(200).json({ success: true, data: courses });
    } catch (error) {
      return res.status(500).json({ success: false, error: error.message });
    }
  }

  /* ---------- Complete course ---------- */
  static async completeCourse(req, res) {
    try {
      const userId = req.user.id;
      const { courseId } = req.body;

      if (!courseId) {
        return res.status(400).json({ success: false, error: "courseId is required" });
      }

      await UserService.finishCourse(userId, courseId);

      return res.status(200).json({ success: true, message: "Course marked as completed." });
    } catch (error) {
      return res.status(400).json({ success: false, error: error.message });
    }
  }
  static async getInstructors(req, res) {
    try {
      const instructors = await UserService.getInstructors();
      return res.status(200).json({ success: true, data: instructors });
    } catch (error) {
      return res.status(500).json({ success: false, error: error.message });
    }
  }
}

module.exports = UserController;
