const Product = require("../models/product.model");

// CREATE
const createProduct = async (req, res) => {
  const newProduct = new Product(req.body);
  try {
    const savedProduct = await newProduct.save();
    res.status(200).json(savedProduct);
  } catch (err) {
    res.status(500).json(err);
  }
};

// UPDATE
const updateProduct = async (req, res) => {
  try {
    const updatedProduct = await Product.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true }
    );
    res.status(200).json(updatedProduct);
  } catch (err) {
    res.status(500).json(err);
  }
};

// DELETE
const deleteProduct = async (req, res) => {
  try {
    await Product.findByIdAndDelete(req.params.id);
    res.status(200).json("Product has been deleted...");
  } catch (err) {
    res.status(500).json(err);
  }
};

// GET PRODUCT
const getProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    res.status(200).json(product);
  } catch (err) {
    res.status(500).json(err);
  }
};

// GET ALL PRODUCTS
const getAllProducts = async (req, res) => {
  const qNew = req.query.new;
  const qCategory = req.query.category;
  const qColor = req.query.color;
  const qSize = req.query.size;
  const qSort = req.query.sort;
  const qLimit = req.query.limit;
  const qSearch = req.query.search;

  try {
    let query = {};
    if (qCategory) {
      query.categories = { $in: [qCategory] };
    }
    if (qColor) {
      query.color = { $in: [qColor] };
    }
    if (qSize) {
      query.size = { $in: [qSize] };
    }
    if (qSearch) {
      query.title = { $regex: qSearch, $options: "i" };
    }

    if (req.query.minPrice || req.query.maxPrice) {
      query.price = {};
      if (req.query.minPrice && !isNaN(parseInt(req.query.minPrice))) {
        query.price.$gte = parseInt(req.query.minPrice);
      }
      if (req.query.maxPrice && !isNaN(parseInt(req.query.maxPrice))) {
        query.price.$lte = parseInt(req.query.maxPrice);
      }
      if (Object.keys(query.price).length === 0) delete query.price;
    }

    let products;
    if (qNew) {
      products = await Product.find().sort({ createdAt: -1 }).limit(1);
    } else {
      let findQuery = Product.find(query);
      
      if (qSort === "newest") {
        findQuery = findQuery.sort({ createdAt: -1 });
      } else if (qSort === "asc") {
        findQuery = findQuery.sort({ price: 1 });
      } else if (qSort === "desc") {
        findQuery = findQuery.sort({ price: -1 });
      }

      if (qLimit) {
        findQuery = findQuery.limit(parseInt(qLimit));
      }

      products = await findQuery;
    }
    res.status(200).json(products);
  } catch (err) {
    res.status(500).json(err);
  }
};

// GET PRODUCT STATS (UNIQUE CATEGORIES, COLORS, SIZES)
const getProductStats = async (req, res) => {
  try {
    const products = await Product.find();
    
    const categories = [...new Set(products.flatMap(p => Array.isArray(p.categories) ? p.categories : []))];
    const colors = [...new Set(products.flatMap(p => Array.isArray(p.color) ? p.color : []))];
    const sizes = [...new Set(products.flatMap(p => Array.isArray(p.size) ? p.size : []))];
    const totalProducts = products.length;

    res.status(200).json({ categories, colors, sizes, totalProducts });
  } catch (err) {
    console.error("Stats Error:", err);
    res.status(500).json(err);
  }
};

module.exports = {
  createProduct,
  updateProduct,
  deleteProduct,
  getProduct,
  getAllProducts,
  getProductStats,
};
