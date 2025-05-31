const { Comment, User } = require('../models/models');
const ApiError = require('../error/ApiError');

class CommentController {
  async create(req, res, next) {
    console.log('Comment Controller - Create Method');
    console.log('Request Body:', req.body);
    console.log('User:', req.user);
    
    try {
      const { deviceId, text, rating } = req.body;
      const userId = req.user.id;

      // Проверяем существование пользователя
      const user = await User.findByPk(userId);
      if (!user) {
        return next(ApiError.badRequest('Пользователь не найден'));
      }

      // Convert deviceId and rating to integers
      const comment = await Comment.create({
        deviceId: Number(deviceId),
        userId: Number(userId),
        text,
        rating: Number(rating)
      });

      const commentWithUser = await Comment.findOne({
        where: { id: comment.id },
        include: [{ model: User, attributes: ['email'] }]
      });

      return res.json(commentWithUser);
    } catch (e) {
      console.log('Comment Controller - Error:', e.message);
      console.log('Full error:', e);
      next(ApiError.badRequest(e.message));
    }
  }

  async getByDevice(req, res, next) {
    try {
      const { deviceId } = req.query;
      
      if (!deviceId) {
        return next(ApiError.badRequest('deviceId is required'));
      }

      const comments = await Comment.findAll({
        where: { deviceId: Number(deviceId) },
        include: [{ model: User, attributes: ['email'] }],
        order: [['createdAt', 'DESC']]
      });
      
      return res.json(comments);
    } catch (e) {
      next(ApiError.badRequest(e.message));
    }
  }

  async delete(req, res, next) {
    try {
      const { id } = req.params;
      const comment = await Comment.findOne({ where: { id } });

      if (!comment) {
        return next(ApiError.badRequest('Comment not found'));
      }

      // Allow deletion only for comment owner or admin
      if (comment.userId !== req.user.id && req.user.role !== 'ADMIN') {
        return next(ApiError.forbidden('No permission to delete this comment'));
      }

      await Comment.destroy({ where: { id } });
      return res.json({ message: 'Comment deleted' });
    } catch (e) {
      next(ApiError.badRequest(e.message));
    }
  }
}

module.exports = new CommentController();