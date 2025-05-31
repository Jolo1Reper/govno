const Router = require('express');
const router = new Router();
const userRouter = require('./userRouter');
const deviceRouter = require('./deviceRouter');
const brandRouter = require('./brandRouter');
const typeRouter = require('./typeRouter');
const basketRouter = require('./basketRouter');
const ratingRouter = require('./ratingRouter');
const commentRouter = require('./commentRouter');

// Log middleware for all routes
router.use((req, res, next) => {
  console.log('Main Router - Method:', req.method);
  console.log('Main Router - Path:', req.path);
  next();
});

router.use('/user', userRouter);
router.use('/type', typeRouter);
router.use('/brand', brandRouter);
router.use('/device', deviceRouter);
router.use('/basket', basketRouter);
router.use('/rating', ratingRouter);
router.use('/comment', commentRouter);

module.exports = router;
