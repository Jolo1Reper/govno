require('multer');
const ApiError = require('../error/ApiError');
const { Op } = require('sequelize');
const uuid = require('uuid');
const path = require('path');
const fs = require('fs');
const { Device, DeviceInfo, DevicePhoto, Type, Brand } = require('../models/models');

const includeArr = [
  { model: DevicePhoto, as: 'photos' },
  { model: Type, as: 'type' },
  { model: Brand, as: 'brand' },
];

class DeviceController {
  async create(req, res, next) {
    try {
      let { name, price, brandId, typeId, info, description } = req.body;
      const { img } = req.files;
      let fileName = '';

      if (Array.isArray(img)) {
        fileName = `${uuid.v4()}.jpg`;
        img[0].mv(path.resolve(__dirname, '..', 'static', fileName));
      } else {
        fileName = `${uuid.v4()}.jpg`;
        img.mv(path.resolve(__dirname, '..', 'static', fileName));
      }

      const device = await Device.create({
        name,
        price,
        brandId,
        typeId,
        description,
      });

      if (Array.isArray(img)) {
        img.forEach(async (i) => {
          const photoName = `${uuid.v4()}.jpg`;
          i.mv(path.resolve(__dirname, '..', 'static', photoName));
          await DevicePhoto.create({
            url: photoName,
            deviceId: device.id,
          });
        });
      } else {
        await DevicePhoto.create({
          url: fileName,
          deviceId: device.id,
        });
      }

      if (info) {
        info = JSON.parse(info);
        if (info.properties.length > 0) {
          info.properties.forEach((i) => {
            DeviceInfo.create({
              title: i.title,
              description: i.description,
              deviceId: device.id,
            });
          });
        }
      }

      return res.json(device);
    } catch (e) {
      next(ApiError.badRequest(e.message));
    }
  }

  async getAll(req, res) {
    let { brandId, typeId, limit, page, search, sort, order } = req.query;
    page = page || 1;
    limit = limit || 9;
    let offset = page * limit - limit;
    search = search || '';
    let devices;
    let count;

    if (!brandId && !typeId && !search) {
      devices = await Device.findAll({
        order: [[sort, order]],
        include: includeArr,
        limit,
        offset,
      });

      count = await Device.count();
    }

    if (!brandId && !typeId && search) {
      devices = await Device.findAll({
        where: { name: { [Op.iRegexp]: search } },
        order: [[sort, order]],
        include: includeArr,
        limit,
        offset,
      });

      count = await Device.count({
        where: { name: { [Op.iRegexp]: search } },
      });
    }

    if (brandId && !typeId && !search) {
      devices = await Device.findAll({
        where: { brandId },
        order: [[sort, order]],
        include: includeArr,
        limit,
        offset,
      });

      count = await Device.count({
        where: { brandId },
      });
    }

    if (brandId && !typeId && search) {
      devices = await Device.findAll({
        where: { brandId, name: { [Op.iRegexp]: search } },
        order: [[sort, order]],
        include: includeArr,
        limit,
        offset,
      });

      count = await Device.count({
        where: { brandId, name: { [Op.iRegexp]: search } },
      });
    }

    if (!brandId && typeId && !search) {
      devices = await Device.findAll({
        where: { typeId },
        order: [[sort, order]],
        include: includeArr,
        limit,
        offset,
      });

      count = await Device.count({
        where: { typeId },
      });
    }

    if (!brandId && typeId && search) {
      devices = await Device.findAll({
        where: { typeId, name: { [Op.iRegexp]: search } },
        order: [[sort, order]],
        include: includeArr,
        limit,
        offset,
      });

      count = await Device.count({
        where: { typeId, name: { [Op.iRegexp]: search } },
      });
    }

    if (brandId && typeId && !search) {
      devices = await Device.findAll({
        where: { typeId, brandId },
        order: [[sort, order]],
        include: includeArr,
        limit,
        offset,
      });

      count = await Device.count({
        where: { typeId, brandId },
      });
    }

    if (brandId && typeId && search) {
      devices = await Device.findAll({
        where: { typeId, brandId, name: { [Op.iRegexp]: search } },
        order: [[sort, order]],
        include: includeArr,
        limit,
        offset,
      });

      count = await Device.count({
        where: { typeId, brandId, name: { [Op.iRegexp]: search } },
      });
    }

    return res.json({ rows: devices, count });
  }

  async getOne(req, res) {
    const { id } = req.params;
    const device = await Device.findOne({
      where: { id },
      include: [
        { model: DeviceInfo, as: 'info' },
        { model: DevicePhoto, as: 'photos' },
      ],
    });

    return res.json(device);
  }

  async delete(req, res, next) {
    try {
      const { id } = req.query;
      const device = await Device.findOne({
        where: { id },
        include: [{ model: DevicePhoto, as: 'photos' }],
      });

      if (!device) {
        return next(ApiError.badRequest('Device not found'));
      }

      if (device.photos.length > 0) {
        device.photos.forEach((photo) => {
          fs.unlink(path.resolve(__dirname, '..', 'static', photo.url), (err) => {
            err && console.log(err);
          });
        });
      }

      await Device.destroy({ where: { id } });

      return res.json('device deleted');
    } catch (e) {
      next(ApiError.badRequest(e.message));
    }
  }

  async update(req, res, next) {
    try {
      const { id } = req.params;
      let { name, price, description, info } = req.body;
      
      const device = await Device.findOne({ where: { id } });
      if (!device) {
        return next(ApiError.badRequest('Device not found'));
      }

      await device.update({ name, price, description });

      if (info) {
        info = JSON.parse(info);
        await DeviceInfo.destroy({ where: { deviceId: id } });
        
        info.forEach(i => {
          DeviceInfo.create({
            title: i.title,
            description: i.description,
            deviceId: id
          });
        });
      }

      const updatedDevice = await Device.findOne({
        where: { id },
        include: [
          { model: DeviceInfo, as: 'info' },
          { model: DevicePhoto, as: 'photos' }
        ]
      });

      return res.json(updatedDevice);
    } catch (e) {
      next(ApiError.badRequest(e.message));
    }
  }
}

module.exports = new DeviceController();
