const express = require('express');
const router = express.Router();
const PharmaHome = require('../models/pharmahome');
const Cart = require('../models/cart-model')
const Order = require('../models/orders-model')
const Address = require('../models/address-model');
const Product = require('../models/product');
const Retailer = require('../models/retailer-model');
const Geodata = require('../models/geodata');
const RetailerCat = require('../models/retailer-catalogue');

router.post('/search', (req, res) => {
  var keyword = req.body.keyword;
  keyword = keyword.replace(/[^a-zA-Z0-9 ]/g, "");
  Product.find({ name: { $regex: keyword, $options: "i" } }).limit(20).then((response) => {
    res.json(response);
  })
})



router.post('/home', (req, res) => {
  PharmaHome.find({ community: req.body.category }).populate({ path: 'products', select: 'name price image' }).then((products) => {
    res.json(products)
  });
});

//get product details
router.post('/product', (req, res) => {
  Product.findById(req.body.productId, (err, product) => {
    res.json(product);
  })
});

//update quantity inside cart of a user
router.post('/addquantity', (req, res) => {
  var quantity = parseInt(req.body.quantity)
  Cart.findOneAndUpdate({ "userId": req.userId, "productId": req.body.productid }, { $set: { quantity: req.body.quantity } }, { new: true }).then((resp) => {
    if (resp.quantity == quantity) {
      res.send("quantity updated")
    } else {
      res.send("cannot update quantity")
    }
  })
})
//check if product is already in cart
router.post('/checkcart', (req, res) => {
  var userid = req.userId;
  var productid = req.body.productid;
  Cart.find({ userId: userid, productId: productid }, (err, product) => {
    if (product.length == 0) {
      res.send(false);
    } else {
      res.send(true);
    }
  })
})
//load cart for a user
router.post('/cart', (req, res) => {
  let userid = req.userId;
  Cart.find({ 'userId': userid }).populate({ path: 'productId', select: 'name price brand image' }).then((resp) => {
    res.json(resp);
  });
})
//load existing orders for a user
router.post('/myorders', (req, res) => {
  Order.find({ userId: req.userId }).populate({ path: 'productId', select: 'name price brand image' }).then((resp) => {
    res.json(resp);
  })
})


//internal tools
router.post('/orders', (req, res) => {
  console.log("all");
  Order.find().populate({ path: 'productId', select: 'name price brand image' }).then((resp) => {
    console.log(resp);
    res.json(resp)
  })
})
router.post('/rejectedorders', (req, res) => {
  Order.find({ status: "Order Rejected" }).populate({ path: 'productId', select: 'name price brand image' }).sort({ "_id": -1 }).limit(40).then((resp) => {
    console.log("Reject");
    res.json(resp)
  })
})
router.post('/acceptedorders', (req, res) => {
  Order.find({ status: "Order Accepted" }).populate({ path: 'productId', select: 'name price brand image' }).sort({ "_id": -1 }).limit(40).then((resp) => {
    console.log("Accept");
    res.json(resp)
  })
})
router.post('/getneworders', (req, res) => {
  Order.find({ status: "Awaiting confirmation" }).populate({ path: 'productId', select: 'name price brand image' }).sort({ "_id": -1 }).limit(40).then((resp) => {
    console.log("New");
    res.json(resp)
  })
})
router.post('/confirmorder', (req, res) => {
  Order.findOneAndUpdate({ "_id": req.body.orderid }, { $set: { status: "Order Accepted" } }, { new: true }).then((resp) => {
    console.log(resp);
    if (resp.status == "Order Accepted") {
      res.send("Order Accepted")
    } else {
      res.send("Error confirming order")
    }
  })
})

router.post('/rejectorder', (req, res) => {
  Order.findOneAndUpdate({ "_id": req.body.orderid }, { $set: { status: "Order Rejected", statusmsg: req.body.msg } }, { new: true }).then((resp) => {
    console.log(resp);
    if (resp.status == "Order Rejected") {
      res.send("Order Rejected")
    } else {
      res.send("Error rejecting order")
    }
  })
})




router.post('/cancelorder', (req, res) => {
  Order.findOneAndUpdate({ "_id": req.body.orderid }, { $set: { status: "Order Cancelled", statusmsg: req.body.msg } }, { new: true }).then((resp) => {
    console.log(resp);
    if (resp.status == "Order Cancelled") {
      res.send("Order Cancelled")
    } else {
      res.send("Error confirming order")
    }
  })
})

router.post('/addtocart', (req, res) => {
  let cart = new Cart({
    userId: req.userId,
    productId: req.body.productId,
    quantity: 1
  });
  cart.save().then((resp) => {
    res.send("added to cart");
  }
  )
})

router.post('/removefromcart', (req, res) => {
  var userid = req.userId;
  var productid = req.body.productid;
  Cart.deleteOne({ userId: userid, productId: productid }, (err, product) => {
    if (err) {
      res.send("product not deleted");
    } else {
      res.send("product removed");
    }
  })
})

//(addres)
router.post('/checkout', (req, res) => {
  let userId = req.userId;
  Cart.find({ userId: userId }).then((resp) => {
    var pdcts = []
    if (resp.length > 0){
      for (var cartitem of resp) {
        pdcts.push({
          product:cartitem.productId,
          quantity:cartitem.quantity
        })
      }

      let order = new Order({
        userId: userId,
        products: pdcts,
        status: "Awaiting payment",
        addressId: req.body.addressId
      })

      order.save((err,order)=>{
        if(err)res.status(500).send("error")
        Cart.deleteMany({ userId: userId }, (err, resp) => {
          if (err) res.status(500).send("error")
          res.status(200).send("Added to Orders")
        })
      })
    }
    else{
      res.status(200).send("Cart is empty")
    }
  })
})


//address management
router.post('/address', (req, res) => {
  Address.find({ userId: req.body.id }, (err, address) => {
    console.log(err + address);
    res.json(address);
  }).populate({ path: "userId", select: "name" })
});

router.post('/addAddress', (req, res) => {
  let newAddress = new Address({
    userId: req.userId,
    addr: req.body.addr,
    pincode: req.body.pincode
  })
  newAddress.save().then((address) => {
    res.json(address)
  })
});

router.post('/removeAddress', (req, res) => {
  Address.findById(req.body.id).then((address) => {
    address.remove().then(() => {
      res.send('address removed')
    })
  })
});


module.exports = router;
