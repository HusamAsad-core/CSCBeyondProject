const UserService = require('../services/userService');
// If your DTO exports a class or a function, import it here
const PlanDTO = require('../dtos/planDTO'); 

class UserController {
    // src/controllers/userController.js
static async updateUserPlan(req, res) {
    try {
        // We pass req.body here, which becomes 'data' inside the DTO
        const planData = new PlanDTO(req.body); 
        
        const userId = req.user.id; 

        await UserService.selectPlan(userId, planData.planId);
        
        res.status(200).json({ success: true, message: "Plan updated!" });
    } catch (error) {
        // If the DTO fails, it catches the error here
        res.status(500).json({ success: false, error: error.message });
    }
}
}

module.exports = UserController;