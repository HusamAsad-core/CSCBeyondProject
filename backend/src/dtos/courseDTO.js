class CourseDTO {
    constructor(data) {
        this.title = data.title;
        this.description = data.description;
        this.categoryId = data.categoryId;
        this.logoPath = data.logoPath || data.imagePath; // Matches your DB 'logo_path'
    }
}
module.exports = CourseDTO;