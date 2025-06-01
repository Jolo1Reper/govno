const Router = require('express');
const router = new Router();
const orderController = require('../controllers/orderController');
const authMiddleware = require('../middleware/authMiddleware');
const checkRole = require('../middleware/checkRoleMiddleware');

router.post('/', authMiddleware, orderController.create);
router.get('/', checkRole('ADMIN'), orderController.getAll);
router.get('/user', authMiddleware, orderController.getUserOrders);
router.put('/:id/complete', checkRole('ADMIN'), orderController.complete);
router.delete('/:id', checkRole('ADMIN'), orderController.delete);

module.exports = router; 