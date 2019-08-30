const router = require('express').Router();
const mongoose = require('mongoose');
const Razorpay = require("razorpay");
const Orders = require("../models/orders-model");
const crypto = require("crypto")
const status = require("./status_constants")
const notifier = require("./helper_functions/notification_helper")

const razor_secret = '9waPse2uLlKKIlgPO7DnYXEX'
const razor_id = 'rzp_test_4GizPbimACR58G'


var instance = new Razorpay({
    key_id: razor_id,
    key_secret: razor_secret
})

//orderid=>larkcs orderid
//order_id=>payment gateway orderid
//(orderId)
router.post("/", (req, res) => {
    var orderid = req.body.orderId
    Orders.find({ _id: orderid, userId: req.userId }).populate({ path: 'product', select: 'name price brand image' }).then((order) => {
        console.log(order)
        if (order[0].products.length > 0) {
            var sum = 0
            for (var product of order[0].products) {
                sum += product.product.price
            }
            if (sum > 0) {
                var today = new Date()
                var month = today.getMonth() + 1; //months from 1-12
                var day = today.getDate();
                var year = today.getFullYear();
                instance.orders.create({
                    amount: sum * 100,
                    currency: "INR",
                    receipt: req.userId + "-" + day + "-" + month + "-" + year,
                    payment_capture: 1,
                }).then((response) => {
                    order.update({
                        order_id: response.id
                    }, (err, resp) => {
                        if (err) res.status(500).send("error")
                        res.status(200).json({ order_id: response.id })
                    })
                }).catch((error) => {
                    console.log(error)
                    res.status(500).send("server error")
                })
            }
        }
        else {
            res.send("no items in cart")
        }
    })
})



//(order_id,payment_id,payment_signature)
router.post("/verifypayment", (req, res) => {
    const order_id = req.body.order_id
    const payment_id = req.body.payment_id
    const payment_signature = req.body.payment_signature
    var gen_signature = crypto.createHmac(
        "SHA256",
        razor_secret
    ).update(order_id + "|" + payment_id)
        .digest("hex")
    
    //check if payment signature is verified
    if (gen_signature == payment_signature) {
        //update status of order
        Orders.updateOne({ order_id: order_id, userId: req.userId }, {
            status: payment_recieved,
            payment_id: payment_id,
            payment_signature: payment_signature
        }, (err, resp) => {
            //send a notification to user about sucessfull payment
            if (err) res.status(500).send("error")
            notifier.notify(
                "Payment Sucessfull",
                "We have recieved your payment for order:#" + order_id + "you can track your orders by going to Orders option",
                "",
                "https://scontent.fcok1-1.fna.fbcdn.net/v/t1.0-9/27973914_920426974784040_9138489774688341309_n.jpg?_nc_cat=103&_nc_oc=AQlHN5x4cQIKX0681dqmj7WdxcdYCooclw71J2AlESo0StnPcfW1euEHYi-OzaTUdbis5vzw5cvga-ceWKL6Wwe2&_nc_ht=scontent.fcok1-1.fna&oh=477de50ec5f3a8f3962815b493c833f5&oe=5DA2C4C9",
                (error)=>{
                    if(error){
                        console.log(error)
                    }
                    res.status(200).json({
                        payment_status: "sucessfull"
                    })
                })
        })
    }
})

module.exports = router;


