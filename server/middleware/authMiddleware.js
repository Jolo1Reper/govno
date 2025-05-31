const jwt = require('jsonwebtoken');

module.exports = function (req, res, next) {
  console.log('Auth Middleware - Method:', req.method);
  console.log('Auth Middleware - Headers:', req.headers);
  
  if (req.method === 'OPTIONS') {
    return next();
  }
  try {
    const token = req.headers.authorization.split(' ')[1]; // Bearer TOKEN
    if (!token) {
      return res.status(401).json({ message: 'Не авторизован' });
    }
    req.user = jwt.verify(token, process.env.SECRET_KEY);
    next();
  } catch (e) {
    console.log('Auth Middleware - Error:', e.message);
    res.status(401).json({ message: 'Не авторизован' });
  }
};
