const express = require('express');
const router = express.Router();
const PharmaHome = require('../models/pharmahome');
const Cart = require('../models/cart-model')
const Order = require('../models/orders-model')
const Address = require('../models/address-model');
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
router.get('/order/count',(req,res)=>{
  Order.find().count().then((resp)=>{
    res.json(resp)
  })
})
router.get('/acceptedorder/count',(req,res)=>{
  Order.find({status: "Order Accepted"}).count().then((resp)=>{
    res.json(resp)
  })
})
router.get('/rejectedorder/count',(req,res)=>{
  Order.find({status: "Order Rejected"}).count().then((resp)=>{
    res.json(resp)
  })
})
router.get('/neworder/count',(req,res)=>{
  Order.find({status: "Awaiting confirmation"}).count().then((resp)=>{
    res.json(resp)
  })
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
router.post('/orders',(req,res)=>{
  console.log("all");
  Order.find().populate({path:'productId',select:'name price brand image'}).then((resp)=>{
    console.log(resp);
    res.json(resp)

  })
})
router.post('/rejectedorders',(req,res)=>{
  Order.find({status: "Order Rejected"}).populate({path:'productId',select:'name price brand image'}).sort({"_id":-1}).limit(40).then((resp)=>{
    console.log("Reject");
    res.json(resp)
  })
})
router.post('/acceptedorders',(req,res)=>{
  Order.find({status: "Order Accepted"}).populate({path:'productId',select:'name price brand image'}).sort({"_id":-1}).limit(40).then((resp)=>{
    console.log("Accept");
    res.json(resp)
  })
})
router.post('/getneworders',(req,res)=>{
  Order.find({status:"Awaiting confirmation"}).populate({path:'productId',select:'name price brand image'}).sort({"_id":-1}).limit(40).then((resp)=>{
    console.log("New");
    res.json(resp)
  })
})
router.get('/confirmorder/:orderid',(req,res)=>{
  Order.findOneAndUpdate({"_id": req.params.orderid}, {$set: {status: "Order Accepted"}},{new:true} ).then((resp)=>{
    if (resp.status=="Order Accepted") {
      res.send("Order Accepted")
    }else{
      res.send("Error confirming order")
    }
  })
})
router.get('/cancelorder/:orderid',(req,res)=>{
  Order.findOneAndUpdate({"_id": req.params.orderid}, {$set: {status: "Order Cancelled"}},{new:true} ).then((resp)=>{
    if (resp.status=="Order Cancelled") {
      res.send("Order Cancelled")
    }else{
      res.send("Error confirming order")
    }
  })
})
router.get('/rejectorder/:orderid',(req,res)=>{
  Order.findOneAndUpdate({"_id": req.params.orderid}, {$set: {status: "Order Rejected"}},{new:true} ).then((resp)=>{
    if (resp.status=="Order Rejected") {
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
        status: "Awaiting confirmation",
        addressId: req.body.addressId
      })
      order.save();
    })
  }).then(()=>{
    Cart.remove({userId:userId},(err,resp)=>{
        res.send("Added to Orders")
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
    addr: ObjectId(req.body.addr),
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
