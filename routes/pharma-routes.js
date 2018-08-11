const express = require('express');
const router = express.Router();
const PharmaHome = require('../models/pharmahome');
const Cart = require('../models/cart-model');
const Address = require('../models/address-model');
const Order = require('../models/orders-model');
const Product = require('../models/product');

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

router.post('/home',(req, res)=> {
    PharmaHome.find({category: req.body.category}).populate({path :'products',select: 'name price image'}).then((products)=>{
      res.json(products)
    });
});

router.get('/products',(req, res)=> {
  Product.find({}, (err,products)=>{
    res.json(products);
  })
});
router.post('/addquantity',(req,res)=>{
  var quantity = parseInt(req.body.quantity)
  Cart.findOneAndUpdate({"userId": req.body.userid, "productId": req.body.productid}, {$set: {quantity: req.body.quantity}},{new:true} ).then((resp)=>{
    if (resp.quantity==quantity) {
      res.send("quantity updated")
    }else{
      res.send("cannot update quantity")
    }
  })
})
router.get('/:id',(req, res)=> {
  Product.findById(req.params.id, (err,products)=>{
    res.json(products);
  })
});
router.post('/checkcart',(req,res)=>{
  var userid=req.body.userid;
  var productid=req.body.productid;
  Cart.find({userId:userid, productId: productid}, (err, product)=>{
    if (product.length==0) {
      res.send(false);
    }else{
      res.send(true);
    }
  })
})

router.post('/cart', (req,res)=>{
    let userid = req.body.userid;
   Cart.find({'userId': userid}).populate({path:'productId',select:'name price brand image'}).then((resp)=>{
     res.json(resp);
   });
})

router.post('/myorders', (req,res)=>{
  Order.find({userId:req.body.userid}).populate({path:'productId',select:'name price brand image'}).then((resp)=>{
    res.json(resp);
  })

})
router.post('/getneworders',(req,res)=>{
  Order.find({status:"Awaiting confirmation"}).populate({path:'productId',select:'name price brand image'}).then((resp)=>{
    console.log(resp);
    res.json(resp)
  })
})
router.post('/confirmorder',(req,res)=>{
  Cart.findOneAndUpdate({"_id": req.body.orderid}, {$set: {status: "Order Confirmed"}},{new:true} ).then((resp)=>{
    if (resp.status=="Order Confirmed") {
      res.send("Order Confirmed")
    }else{
      res.send("Error confirming order")
    }
  })
})
router.post('/rejectorder',(req,res)=>{
  Cart.findOneAndUpdate({"_id": req.body.orderid}, {$set: {status: "Order Rejected"}},{new:true} ).then((resp)=>{
    if (resp.status=="Order Confirmed") {
      res.send("Order Rejected")
    }else{
      res.send("Error rejecting order")
    }
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
      resp.remove().then(()=>{
        order.save().then(()=>{
          res.send("Added to orders")
        })
      })
    })
  })
})

router.post('/removefromcart',(req,res)=>{
  var userid=req.body.userid;
  var productid=req.body.productid;
  Cart.deleteOne({userId:userid, productId: productid}, (err, product)=>{
    if (err) {
      res.send("product not deleted");
    }else{
      res.send("product removed");
    }
  })
})

router.post('/address',(req, res)=> {
  Address.find({userId:req.body.id},(err,address)=>{
    console.log(err+address);
    res.json(address);
  }).populate({path:"userId",select:"name"})
});

router.post('/addAddress',(req, res)=> {
  let newAddress= new Address({
    userId:req.body.id,
    addr: req.body.addr,
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
