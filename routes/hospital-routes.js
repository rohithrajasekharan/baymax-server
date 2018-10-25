const router = require('express').Router();
const Hospital = require('../models/hospital-model');

router.get('/:id',(req,res)=>{
  Hospital.findById(req.params.id).then((data)=>{
    res.json(data);
  });
})

router.get('/searchhospital',(req,res)=>{
    Hospital.find({$text: {$search: req.query.keyword}}, {score: {$meta: "textScore"}}).sort({score:{$meta:"textScore"}}).then((response)=>{
      res.json(response);
    })
})

module.exports = router;
