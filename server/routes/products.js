// product router
const router = require("express").Router();
const Product = require("../models/product");
const Category = require("../models/category");
const moment = require("moment");

router.get("/", async (req, res) => {
  try {
    const products = await Product.find()
      .sort({ createdAt: -1 })
      .populate("category");
    res.json(products);
  } catch (error) {
    console.log(`error: ${error.message}`);
    res.status(500).json({ message: error.message });
  }
});


router.get("/category", async (req, res) => {
  const category = await Category.find();
  res.json(category);
});



router.get( "/:id", async ( req, res ) => {
  try {
  const product = await Product.findById(req.params.id);
    res.json( product );
  } catch ( error ) {
    console.log( `error: ${ error.message }` );
    res.status( 500 ).json( { message: error.message } );
  }
});

router.get("/category/:id", async (req, res) => {
  const category = await Category.findById(req.params.id);
  res.json(category);
});

router.get("/category/:id/products", async (req, res) => {
  const category = await Category.findById(req.params.id);
  const products = await Product.find({ category: category._id });
  res.json(products);
} );

router.get("/:slug/:id", async (req, res) => {
  try {
    const product = await Product.findById(req.params.id).populate("category");
    res.json(product,moment().format("YYYY-MM-DD"));
  } catch (error) {
    console.log( `error: ${ error.message }` );
    res.status( 500 ).json( { message: error.message } );
  }
});


router.get("/category/:id/products/:page", async (req, res) => {
  const category = await Category.findById(req.params.id);
  const products = await Product.find({ category: category._id })
    .skip((req.params.page - 1) * 10)
    .limit(10);
  res.json(products);
});

router.get("/category/:id/products/:page/:limit", async (req, res) => {
  const category = await Category.findById(req.params.id);
  const products = await Product.find({ category: category._id })
    .skip((req.params.page - 1) * req.params.limit)
    .limit(req.params.limit);
  res.json(products);
});

router.get("/category/:id/products/:page/:limit/:sort", async (req, res) => {
  const category = await Category.findById(req.params.id);
  const products = await Product.find({ category: category._id })
    .sort(req.params.sort)
    .skip((req.params.page - 1) * req.params.limit)
    .limit(req.params.limit);
  res.json(products);
});

router.get(
  "/category/:id/products/:page/:limit/:sort/:order",
  async (req, res) => {
    const category = await Category.findById(req.params.id);
    const products = await Product.find({ category: category._id })
      .sort(req.params.sort)
      .skip((req.params.page - 1) * req.params.limit)
      .limit(req.params.limit)
      .sort({ [req.params.sort]: req.params.order });
    res.json(products);
  }
);

router.get(
  "/category/:id/products/:page/:limit/:sort/:order/:search",
  async (req, res) => {
    const category = await Category.findById(req.params.id);
    const products = await Product.find({
      category: category._id,
      title: { $regex: req.params.search, $options: "i" },
    })
      .sort(req.params.sort)
      .skip((req.params.page - 1) * req.params.limit)
      .limit(req.params.limit)
      .sort({ [req.params.sort]: req.params.order });
    res.json(products);
  }
);

module.exports = router;
