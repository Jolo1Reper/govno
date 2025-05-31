const Router = require('express');
const router = new Router();
const commentController = require('../controllers/commentController');
const authMiddleware = require('../middleware/authMiddleware');

// Log middleware for comment routes
router.use((req, res, next) => {
  console.log('Comment Router - Method:', req.method);
  console.log('Comment Router - Path:', req.path);
  next();
});

router.post('/', authMiddleware, commentController.create);
router.get('/', commentController.getByDevice);
router.delete('/:id', authMiddleware, commentController.delete);

module.exports = router; 