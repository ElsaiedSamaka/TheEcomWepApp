// product router
const router = require("express").Router();
const Product = require("../models/product");
const Category = require("../models/category");
const moment = require("moment");

router.get( "/", async ( req, res ) => {
  const successMsg = req.flash("success")[0];
  const errorMsg = req.flash("error")[0];
  // 6 docmunts per page
  const perPage = 6;
  let page = parseInt(req.query.page) || 1;
  try {
    const products = await Product.find()
      .sort( { createdAt: -1 } )
      .skip( ( page - 1 ) * perPage )
      .limit( perPage )
      .populate( "category" );
    const count = await Product.count();
    res.json( {
      pageName: "All Products",
      products,
      successMsg,
      errorMsg,
      current: page,
      home: "/products/?",
      pages: Math.ceil(count / perPage),
    } );
  } catch (error) {
    console.log(`error: ${error.message}`);
    res.status(500).json({ message: error.message });
  }
});


router.get("/category", async (req, res) => {
  const category = await Category.find();
  res.json(category);
});



router.get( "/single-product/:id", async ( req, res ) => {
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

// get a certain category by its slug (this is used for the categories navbar)
router.get( "/:slug", async ( req, res ) => {
  const successMsg = req.flash("success")[0];
  const errorMsg = req.flash("error")[0];
  try {
    const foundCategory = await Category.findOne({ slug: req.params.slug });
    const allProducts = await Product.find({ category: foundCategory.id })
      .sort("-createdAt")
      .populate("category");

    res.json( {
      pageName: foundCategory.title,
      currentCategory: foundCategory,
      products: allProducts,
      successMsg,
      errorMsg,
      home: "/products/" + req.params.slug.toString() + "/?",
    });
  } catch (error) {
    console.log( `error: ${ error.message }` );
    res.status( 500 ).json( { message: error.message } );
  }
} );
router.get( "/:slug/:id", async ( req, res ) => {
  const successMsg = req.flash("success")[0];
  const errorMsg = req.flash("error")[0];
  try {
    const product = await Product.findById(req.params.id).populate("category");
    res.json( {
      pageName: product.title,
      product,
      successMsg,
      errorMsg,
      moment: moment,
    } );
  } catch (error) {
    console.log( `error: ${ error.message }` );
    res.status( 500 ).json( { message: error.message } );
  }
});
module.exports = router;
