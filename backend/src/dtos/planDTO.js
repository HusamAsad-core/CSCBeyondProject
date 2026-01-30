class PlanDTO {
  constructor(plan) {
    this.id = plan.id;
    this.name = plan.name;
    this.courseLimit = plan.course_limit;
    this.price = plan.price;
    // We can add logic here to determine features based on the plan name
    this.features = this.getFeatures(plan.name);
  }

  getFeatures(name) {
    const featureMap = {
      'College Program': ['5 Basic Courses', 'Email Support', 'Certificate of Completion'],
      'Employee Program': ['10 Advanced Courses', 'Priority Support', 'Live Q&A Sessions'],
      'Complete Program': ['All Courses Unlimited', '24/7 Premium Support', '1-on-1 Mentorship']
    };
    return featureMap[name] || ['Standard Course Access'];
  }

  static isValid(data) {
    return data.name && 
           data.course_limit >= 0 && 
           data.price >= 5 && 
           data.price <= 50;
  }
}

module.exports = PlanDTO;