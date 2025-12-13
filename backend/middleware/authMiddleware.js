const jwt = require('jsonwebtoken');

// Verify token
exports.authenticate = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ error: "No token provided" });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // id, role, branchId
    next();
  } catch (err) {
    res.status(401).json({ error: "Invalid token" });
  }
};

// Role-based authorization
exports.authorize = (roles) => (req, res, next) => {
  if (!roles.includes(req.user.role)) return res.status(403).json({ error: "Access denied" });
  next();
};

// Branch-level access for managers
exports.authorizeBranch = (roles) => (req, res, next) => {
  const { role, branchId } = req.user;

  if (!roles.includes(role)) return res.status(403).json({ error: "Access denied" });

  if (role === 'manager') {
    const paramBranchId = parseInt(req.params.branchId || req.body.branchId);
    if (paramBranchId !== branchId) return res.status(403).json({ error: "Branch access denied" });
  }
  next();
};
