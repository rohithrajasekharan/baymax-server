const express = require('express');
const router = express.Router();
const Product = require('../models/product');
const PharmaHome = require('../models/pharmahome');
const Cart = require('../models/cart-model')

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

router.post('/home/:category',(req, res)=> {
    PharmaHome.find({category: req.body.category}).populate('banner primarylist secondarylist highlighted rest').then((products)=>{
      res.json(products)
    });
});

router.get('/products',(req, res)=> {
  Product.find({}, (err,products)=>{
    res.json(products);
  })
});
router.post('/addquantity',(req,res)=>{
  Cart.findOneAndUpdate({userId: req.body.userId, productId: req.body.productId}, {$set: {quantity: req.body.quantity}} ).then(()=>{
    res.send("quantity updated")
  })
})
router.get('/:id',(req, res)=> {
  Product.findById(req.params.id, (err,products)=>{
    res.json(products);
  })
});
router.post('/checkcart',(req,res)=>{
Cart.find({'userId': req.body.userid, 'productId': req.body.productid},(err,resp)=>{
  if (err) {
    res.send(false);
  }else {
    res.send(true);
  }
})
})
router.post('/cart', (req,res)=>{
    let userid = req.body.userid;
   Cart.find({'userId': userid}).populate('productId').then((resp)=>{
     res.json(resp);
   });
})

router.post('/myorders', (req,res)=>{
  Order.find({userId:req.body.userId}).populate('productId').then((resp)=>{
    res.json(resp);
  })

})


router.post('/addtocart', (req,res)=>{
  let cart = new Cart({
    userId : req.body.userId,
    productId : req.body.productId,
    quantity: 1
  });
  cart.save().then((resp)=>{
  res.send("added to cart");
}
)
})

router.post('/checkout', (req,res)=>{
  let userId = req.body.userId;
  Cart.find({userId: userId}).then((resp)=>{
    resp.map((cart)=>{
      let order = new Order({
        userId: userId,
        productId: cart.productId,
        quantity: cart.quantity,
        status: "Awaiting Confirmation"
      })
      order.save();
    })
      resp.remove().then(()=>{
        res.send("Added to orders")
      })
  })
})

router.post('/removefromcart',(req,res)=>{
  var userid=req.body.userid;
  var productid=req.body.productid;
  Cart.find({userId:userid, productId: productid}, (err, product)=>{
    if (err) {
      res.send("product not deleted");
    }else{
      res.send("product removed");
    }
  })
})

router.post('/address',(req, res)=> {
  Address.find({userId:req.body.id},(err,address)=>{
    console.log(err+address)
    res.json(address);
  })
});

router.post('/addAddress',(req, res)=> {
  let newAddress= new Address({
    userId:req.body.id,
    addr:req.body.addr,
    pincode:req.body.pincode
  })
  newAddress.save().then((address)=>{
    res.json(address)
  })
});

router.post('/removeAddress',(req, res)=> {
  Address.findById(req.body.id).then((address)=>{
    address.remove().then(()=>{
      res.send('address removed')
    })
  })
});

module.exports = router;
