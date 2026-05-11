import jwt from "jsonwebtoken";

export const auth = (req, res, next) => {
  const token = req.header("Authorization")?.replace("Bearer ", "");

  if (!token) return res.status(401).json("No token");

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    res.status(401).json("Invalid token");
  }
};

export const adminAuth = (req, res, next) => {
  if (req.user.role !== "admin") return res.status(403).json("Admin only");
  next();
};

export const employeeAuth = (req, res, next) => {
  if (req.user.role !== "employee")
    return res.status(403).json("Employee only");
  next();
};
