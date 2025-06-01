const { Order, OrderDevice, Device, User, BasketDevice, Basket } = require('../models/models');
const ApiError = require('../error/ApiError');

class OrderController {
  async create(req, res, next) {
    try {
      const { phone, address } = req.body;
      const userId = req.user.id;

      // Get user's basket
      const basket = await Basket.findOne({ where: { userId } });
      const basketDevices = await BasketDevice.findAll({
        where: { basketId: basket.id },
        include: [{ model: Device }]
      });

      if (!basketDevices.length) {
        return next(ApiError.badRequest('Корзина пуста'));
      }

      // Calculate total price
      let totalPrice = 0;
      basketDevices.forEach(item => {
        totalPrice += item.count * item.device.price;
      });

      // Create order
      const order = await Order.create({
        userId,
        phone,
        address,
        totalPrice
      });

      // Create order devices
      const orderDevices = await Promise.all(
        basketDevices.map(item =>
          OrderDevice.create({
            orderId: order.id,
            deviceId: item.deviceId,
            count: item.count,
            price: item.device.price
          })
        )
      );

      // Clear basket
      await BasketDevice.destroy({ where: { basketId: basket.id } });

      return res.json({ order, orderDevices });
    } catch (e) {
      next(ApiError.badRequest(e.message));
    }
  }

  async getAll(req, res, next) {
    try {
      const orders = await Order.findAll({
        include: [
          {
            model: OrderDevice,
            include: [{ model: Device }]
          },
          { model: User }
        ],
        order: [['createdAt', 'DESC']]
      });
      return res.json(orders);
    } catch (e) {
      next(ApiError.badRequest(e.message));
    }
  }

  async getUserOrders(req, res, next) {
    try {
      const userId = req.user.id;
      const orders = await Order.findAll({
        where: { userId },
        include: [
          {
            model: OrderDevice,
            include: [{ model: Device }]
          }
        ],
        order: [['createdAt', 'DESC']]
      });
      return res.json(orders);
    } catch (e) {
      next(ApiError.badRequest(e.message));
    }
  }

  async complete(req, res, next) {
    try {
      const { id } = req.params;
      const order = await Order.findOne({ where: { id } });
      
      if (!order) {
        return next(ApiError.badRequest('Заказ не найден'));
      }

      await order.update({ status: 'COMPLETED' });
      return res.json(order);
    } catch (e) {
      next(ApiError.badRequest(e.message));
    }
  }

  async delete(req, res, next) {
    try {
      const { id } = req.params;
      const order = await Order.findOne({ where: { id } });
      if (!order) {
        return next(ApiError.badRequest('Заказ не найден'));
      }
      if (order.status !== 'COMPLETED') {
        return next(ApiError.badRequest('Удалять можно только выполненные заказы'));
      }
      await OrderDevice.destroy({ where: { orderId: id } });
      await order.destroy();
      return res.json({ message: 'Заказ удалён' });
    } catch (e) {
      next(ApiError.badRequest(e.message));
    }
  }
}

module.exports = new OrderController(); 