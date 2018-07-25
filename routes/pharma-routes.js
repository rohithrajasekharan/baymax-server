const express = require('express');
const router = express.Router();
const Product = require('../models/product');
const PharmaHome = require('../models/pharmahome');

router.get('/search',(req,res)=>{
  if (req.query.category=="") {
    Product.find({$text: {$search: req.query.keyword}}, {score: {$meta: "textScore"}}).sort({score:{$meta:"textScore"}}).then((response)=>{
      res.json(response);
    })
  }else{
    Product.find({category:req.query.category, $text: {$search: req.query.keyword}}, {score: {$meta: "textScore"}}).sort({score:{$meta:"textScore"}}).then((response)=>{
      res.json(response);
    })
  }

})

router.get('/home/:category',(req, res)=> {
    PharmaHome.find({category: req.body.category}).populate('banner primarylist secondarylist highlighted rest').then((products)=>{
      res.json(products)
    });
});

router.get('/products',(req, res)=> {
  Product.find({}, (err,products)=>{
    res.json(products);
  })
});

router.get('/:id',(req, res)=> {
  Product.findById(req.params.id, (err,products)=>{
    res.json(products);
  })
});

module.exports = router;
