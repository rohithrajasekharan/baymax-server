const router = require('express').Router();
const Hospital = require('../models/hospital-model');
const Doctor = require('../models/doctor-model');

router.get('/:id',(req,res)=>{
  Hospital.findById(req.params.id).then((data)=>{
    res.json(data);
  });
})
router.get('doctor/:id',(req,res)=>{
  Doctor.findById(req.params.id).then((data)=>{
    res.json(data);
  });
})

router.get('/search/:keyword',(req,res)=>{
    Hospital.find({$text: {$search: req.params.keyword}}, {score: {$meta: "textScore"}}).sort({score:{$meta:"textScore"}}).then((response)=>{
      res.json(response);
    })
})

module.exports = router;
