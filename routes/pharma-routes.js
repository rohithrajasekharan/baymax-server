const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();
const Product = require('../models/product');
const PharmaHome = require('../models/pharmahome');
const Cart = require('../models/cart-model');
const ObjectId = mongoose.Types.ObjectId;

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
router.get('/checkcart/:userid/:productid',(req,res)=>{
Cart.find({userId: req.params.userid, productId: {$elemMatch : {$all: { [ObjectId(req.params.productid)]}}}},(err,resp)=>{
  if (err) {
    res.send(false);
  }else {
    res.send(true);
  }
})
})
router.get('/cart/:userid', (req,res)=>{
    let userid = req.params.userid;
   Cart.find({'userId': userid}).populate('productId').then((resp)=>{
     res.json(resp);
   });
})

router.get('/myorders/:username', (req,res)=>{
    let username = req.params.username;
   User.find({'name': username},(err,user)=>{
   var array = [];
   var quantityArray = [];
user[0].orders.map((order)=>{
  array.push(order.productId);
  quantityArray.push(order.quantity);
})
Product.find( { _id : { $in: array } },{ name: 1, price: 1, image: 1, quantity: 1, status: 1 } ).then((resp)=>{
 for(i=0; i<array.length; i++){
   console.log(resp[i]);
  resp[i].quantity=quantityArray[i];
  resp[i].status= "awaiting confirmation"
 }
 res.json(resp);

})
    })

})


router.post('/addtocart', (req,res)=>{
  let cart = new Cart({
    userId : req.body.userId,
    productId : req.body.productId
  });
  cart.save().then((resp)=>{
  res.send("added to cart");
}
)
})

router.post('/checkout/:username', (req,res)=>{
  let username = req.params.username;
  let data = JSON.parse(req.body.data);
  var array = [];
  data.map((product)=>{
    let productId = product.productId;
    let quantity = product.quantity;
    let status = 'awaiting confirmation'
    User.update({'name':username},
  {
   $push : {
      orders :  {
               "productId": productId,
               "quantity": quantity,
               "status": status
             }
    }
  }).then(()=>{
    Product.find( { _id : { $in: [productId] } },{ name: 1, price: 1} ).then((resp)=>{
      resp.quantity=quantity;

        req.app.io.sockets.emit("notification", {"data": resp,"quantity": quantity});
    });

  })
  res.end('success');
});

})

router.get('/removefromcart',(req,res)=>{
  var userid=req.query.userid;
  var Productid=req.query.productid;
  Cart.find({userId:userid, productId: productid}, (err, product)=>{
    if (err) {
      res.send("product not deleted");
    }else{
      res.send("product removed");
    }
  })
})

module.exports = router;
