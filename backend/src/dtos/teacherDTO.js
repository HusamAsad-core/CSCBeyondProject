class TeacherDTO {
    constructor(data) {
        if (!data.name || !data.email || !data.password) {
            throw new Error("Missing required fields: name, email, or password");
        }
        this.name = data.name;
        this.email = data.email;
        this.password = data.password;
        this.role = 'teacher';
    }
}
module.exports = TeacherDTO;