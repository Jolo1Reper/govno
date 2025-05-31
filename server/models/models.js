const sequelize = require('../db');
const { DataTypes } = require('sequelize');

const User = sequelize.define('user', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  email: { type: DataTypes.STRING, unique: true },
  password: { type: DataTypes.STRING },
  role: { type: DataTypes.STRING, defaultValue: 'USER' }
});

const Basket = sequelize.define('basket', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  userId: { type: DataTypes.INTEGER, unique: true },
});

const BasketDevice = sequelize.define('basket_device', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  basketId: { type: DataTypes.INTEGER },
  deviceId: { type: DataTypes.INTEGER },
  count: { type: DataTypes.INTEGER, defaultValue: 1 },
});

const Device = sequelize.define('device', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  name: { type: DataTypes.STRING, unique: true, allowNull: false },
  price: { type: DataTypes.INTEGER, allowNull: false },
  rating: { type: DataTypes.FLOAT, defaultValue: 0 },
  description: { type: DataTypes.TEXT },
});

const Type = sequelize.define('type', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  name: { type: DataTypes.STRING, unique: true, allowNull: false },
});

const Brand = sequelize.define('brand', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  name: { type: DataTypes.STRING, unique: true, allowNull: false },
});

const Rating = sequelize.define('rating', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  rate: { type: DataTypes.INTEGER, allowNull: false },
});

const DeviceInfo = sequelize.define('device_info', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  title: { type: DataTypes.STRING, allowNull: false },
  description: { type: DataTypes.STRING, allowNull: false },
  deviceId: { type: DataTypes.INTEGER, allowNull: false },
});

const DevicePhoto = sequelize.define('device_photo', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  url: { type: DataTypes.STRING, allowNull: false },
  deviceId: { type: DataTypes.INTEGER, allowNull: false },
});

const TypeBrand = sequelize.define('type_brand', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
});

const Comment = sequelize.define('comment', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  text: { type: DataTypes.TEXT, allowNull: false },
  rating: { type: DataTypes.FLOAT, allowNull: false },
  deviceId: { type: DataTypes.INTEGER, allowNull: false },
  userId: { type: DataTypes.INTEGER, allowNull: false },
  createdAt: { type: DataTypes.DATE, defaultValue: DataTypes.NOW }
});

User.hasOne(Basket);
Basket.belongsTo(User);

User.hasMany(Rating);
Rating.belongsTo(User);

User.hasMany(Comment);
Comment.belongsTo(User);

Basket.hasMany(BasketDevice);
BasketDevice.belongsTo(Basket);

Type.hasMany(Device);
Device.belongsTo(Type);

Brand.hasMany(Device);
Device.belongsTo(Brand);

Device.hasMany(Rating);
Rating.belongsTo(Device);

Device.hasMany(BasketDevice);
BasketDevice.belongsTo(Device);

Device.hasMany(DeviceInfo, { as: 'info' });
DeviceInfo.belongsTo(Device);

Device.hasMany(DevicePhoto, { as: 'photos' });
DevicePhoto.belongsTo(Device);

Device.hasMany(Comment);
Comment.belongsTo(Device);

Type.belongsToMany(Brand, { through: TypeBrand });
Brand.belongsToMany(Type, { through: TypeBrand });

module.exports = {
  User,
  Basket,
  BasketDevice,
  Device,
  Type,
  Brand,
  Rating,
  TypeBrand,
  DeviceInfo,
  DevicePhoto,
  Comment,
};
