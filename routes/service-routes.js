const router = require('express').Router();
const mongoose = require('mongoose');
const Servicereq = require('../models/service-model');
const Notif = require('../models/notification-model');



router.post('/new', (req, res) => {

    //setup a new request
    let newServiceRequest = new Servicereq(
        {
            status: "new",
            service: req.body.service,
            Name: req.body.name,
            phone: req.body.phone,
            place: req.body.place,
            hospital: req.body.hospital,
            additional: req.body.additional,
            by:req.userId
        }
    )


    //also publish an acknowledgement notification for users
    let newNotification=new Notif({
        userId:req.userId,//to be corrected after auth is implmented
	    title:"Request recieved",
	    description:"Your req for "+req.body.service+" has been recieved, we will contact you soon",
        url:"",
        seen:false,
        date:Date.now(),
	    image:"https://scontent.fcok1-1.fna.fbcdn.net/v/t1.0-9/27973914_920426974784040_9138489774688341309_n.jpg?_nc_cat=103&_nc_oc=AQlHN5x4cQIKX0681dqmj7WdxcdYCooclw71J2AlESo0StnPcfW1euEHYi-OzaTUdbis5vzw5cvga-ceWKL6Wwe2&_nc_ht=scontent.fcok1-1.fna&oh=477de50ec5f3a8f3962815b493c833f5&oe=5DA2C4C9"
    })

    newServiceRequest.save().then((serviceRequest)=>{
        newNotification.save().then(()=>{
            res.json(serviceRequest)
        })
    })
});


module.exports = router;