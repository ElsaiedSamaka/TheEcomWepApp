var express = require( "express" );
const Product = require("../models/product");
const Category = require("../models/category");

var router = express.Router();

/* GET home page. */
router.get( "/", async ( req, res ) => {
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
    res.json( { products , count } );
  } catch (error) {
    console.log(`error: ${error.message}`);
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
