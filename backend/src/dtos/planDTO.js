// src/dtos/planDTO.js
class PlanDTO {
    constructor(data) { // Make sure 'data' is defined here as an argument
        if (!data) {
            throw new Error("No data provided to PlanDTO");
        }
        // This maps the JSON body to a clean object
        this.planId = data.planId || data.planID;
    }
}

module.exports = PlanDTO;