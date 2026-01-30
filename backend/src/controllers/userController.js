const UserService = require('../services/userService');
// If your DTO exports a class or a function, import it here
const PlanDTO = require('../dtos/planDTO'); 

class UserController {
    // src/controllers/userController.js
static async updateUserPlan(req, res) {
    try {
        const userId = req.user.id; 
        const { planId } = req.body; // Direct extraction from the request body

        // Check if planId actually exists before sending to service
        if (!planId) {
            return res.status(400).json({ success: false, error: "planId is required in request body" });
        }

        await UserService.selectPlan(userId, planId);
        
        res.status(200).json({ success: true, message: "Plan updated!" });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
}
static async selectCourse(req, res) {
    try {
        const result = await UserService.enrollInCourse(req.user.id, req.body.course_id);
        
        res.status(200).json({ 
            success: true, 
            message: "Successfully enrolled!",
            remainingSlots: result.remaining 
        });
    } catch (error) {
        res.status(400).json({ success: false, error: error.message });
    }
}

static async completeCourse(req, res) {
    try {
        const userId = req.user.id;
        const { courseId } = req.body;

        await UserService.finishCourse(userId, courseId);
        
        res.status(200).json({ 
            success: true, 
            message: "Congratulations! Course marked as completed." 
        });
    } catch (error) {
        res.status(400).json({ success: false, error: error.message });
    }
}
}

module.exports = UserController;