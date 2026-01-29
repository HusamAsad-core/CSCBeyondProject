const jwt = require('jsonwebtoken');

const protect = async (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) return res.status(401).json({ message: "Access denied." });

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your_secret_key');
        
        req.user = decoded; 

        console.log("User from token:", req.user);

        next();
    } catch (err) {
        res.status(401).json({ message: "Invalid token." });
    }
};
const restrictTo = (...roles) => {
  return (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: `Role (${req.user ? req.user.role : 'undefined'}) is not authorized to do this.`
      });
    }
    next();
  };
};

// 3. Export them correctly in ONE block
module.exports = {
  protect,
  restrictTo
};