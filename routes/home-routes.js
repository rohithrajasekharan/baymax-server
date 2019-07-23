const router = require('express').Router();
const mongoose = require('mongoose');
const Homepage = require('../models/home-model');

//load data for home page
router.post('/load', (req, res) => {
    var targetval = "x"
    if(req.body.pageName=="Baby and Me"){
        // calculateWeek()
        targetval = req.body.pageName+"_week_"+(req.body.week.toString())
    }
    else if(req.body.pageName=="Diabetes"){
        targetval = req.body.pageName+"_week_"+(req.body.type.toString())
    }
    else if(req.body.pageName=="General"){
        targetval = req.body.pageName
    }

    Homepage.find({target: targetval},{_id:0,target:0}).populate({path:'dailyReads',select:'_id title jist imageId'}).populate({path:'recomProducts'}).then(data=>{
        res.json(data);
    })
});

module.exports = router;