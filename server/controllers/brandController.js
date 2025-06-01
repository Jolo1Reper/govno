const { Brand, TypeBrand, Type } = require('../models/models');
const ApiError = require('../error/ApiError');

class BrandController {
  async create(req, res, next) {
    try {
      const { name, typeIds } = req.body;
      let brand = await Brand.findOne({ where: { name } });
      if (!brand) {
        brand = await Brand.create({ name });
      }
      if (typeIds && typeIds.length) {
        // Получаем уже существующие связи
        const existingLinks = await TypeBrand.findAll({
          where: { brandId: brand.id },
          attributes: ['typeId']
        });
        const existingTypeIds = existingLinks.map(link => link.typeId);
        // Добавляем только новые связи
        const newTypeIds = typeIds.filter(typeId => !existingTypeIds.includes(typeId));
        if (newTypeIds.length) {
        await TypeBrand.bulkCreate(
            newTypeIds.map(typeId => ({
            brandId: brand.id,
            typeId: typeId
          }))
        );
      }
      }
      return res.json(brand);
    } catch (e) {
      next(ApiError.badRequest(e.message));
    }
  }

  async getAll(req, res) {
    try {
      const { typeId } = req.query;
      let brands;

      if (typeId) {
        // Получаем ID брендов, связанных с данным типом
        const typeBrands = await TypeBrand.findAll({
          where: { typeId },
          attributes: ['brandId']
        });
        
        const brandIds = typeBrands.map(tb => tb.brandId);
        
        // Получаем бренды по полученным ID
        brands = await Brand.findAll({
          where: { id: brandIds }
        });
      } else {
        // Если typeId не указан, возвращаем все бренды
        brands = await Brand.findAll();
      }

      return res.json(brands);
    } catch (e) {
      return res.status(500).json({ message: e.message });
    }
  }

  async delete(req, res, next) {
    try {
      const { id } = req.query;
      await Brand.destroy({ where: { id } });
      return res.json('brand deleted');
    } catch (e) {
      next(ApiError.badRequest(e.message));
    }
  }
}

module.exports = new BrandController();
