const router = require('express').Router();
const Hospital = require('../models/hospital-model');
const Doctor = require('../models/doctor-model');

router.get('/:id',(req,res)=>{
  Hospital.findById(req.params.id).then((data)=>{
    res.json(data);
  });
})
router.get('/doctor/:id',(req,res)=>{
  Doctor.findById(req.params.id).populate({path :'visits',select: '_id name description logo rating integrated'}).then((data)=>{
    res.json(data);
  });
})
router.post('/doctor',(req,res)=>{
  Doctor.find({specialty: req.body.specialty}).then((data)=>{
    res.json(data);
  });
})
router.post('/doctorbyloc',(req,res)=>{
  Doctor.find({location: req.body.location}).then((data)=>{
    res.json(data);
  });
})
router.post('/hospitalbyloc',(req,res)=>{
  Hospital.find({location: req.body.location}).then((data)=>{
    res.json(data);
  });
})
router.get('/search/:keyword',(req,res)=>{
    Hospital.find({$text: {$search: req.params.keyword}}, {score: {$meta: "textScore"}}).sort({score:{$meta:"textScore"}}).then((response)=>{
      res.json(response);
    })
})

module.exports = router;
