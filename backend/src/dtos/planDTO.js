class PlanDTO {
  constructor(plan) {
  this.id = plan.id;
  this.name = plan.name;
  this.courseLimit = plan.course_limit;
  this.price = plan.price;
  // Use the features from the request if they exist, otherwise use the map
  this.features = plan.features || this.getFeatures(plan.name);
}

  // getFeatures(name) {
  //   const featureMap = {
  //     'College Program': ['5 Basic Courses', 'Email Support', 'Certificate of Completion'],
  //     'Employee Program': ['10 Advanced Courses', 'Priority Support', 'Live Q&A Sessions'],
  //     'Complete Program': ['All Courses Unlimited', '24/7 Premium Support', '1-on-1 Mentorship']
  //   };
  //   return featureMap[name] || ['Standard Course Access'];
  // }

  static isValid(data) {
  return data.name && 
         data.course_limit >= 0 && 
         data.price >= 0; // Removed the <= 50 limit and lowered min to 0
}
}

module.exports = PlanDTO;