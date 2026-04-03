const User = require("../models/user.model");
const Product = require("../models/product.model");
const Order = require("../models/order.model");

const getStats = async (req, res) => {
  try {
    const userCount = await User.countDocuments();
    const productCount = await Product.countDocuments();
    const orderCount = await Order.countDocuments();
    
    const income = await Order.aggregate([
      {
        $group: {
          _id: null,
          total: { $sum: "$amount" },
        },
      },
    ]);

    res.status(200).json({
      users: userCount,
      products: productCount,
      orders: orderCount,
      totalRevenue: income[0]?.total || 0,
    });
  } catch (err) {
    res.status(500).json(err);
  }
};

module.exports = { getStats };
