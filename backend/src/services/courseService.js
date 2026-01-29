const db = require('../config/db');

class CourseService {
    static async createCourse(teacherId, courseData) {
        const query = `
            INSERT INTO courses (teacher_id, category_id, title, description, logo_path, status) 
            VALUES (?, ?, ?, ?, ?, 'active')
        `;
        const values = [
            teacherId, 
            courseData.categoryId, 
            courseData.title, 
            courseData.description, 
            courseData.imagePath
        ];
        
        return await db.execute(query, values);
    }
}

module.exports = CourseService;