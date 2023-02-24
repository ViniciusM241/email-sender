function verifyToken (req, res, next) {
  const token = req.headers["x-authorization"];

  if (token === process.env.TOKEN) {
    next();
  }
  else {
    return res.status(401).json({ message: 'Invalid token' });
  }
}

module.exports = verifyToken;
