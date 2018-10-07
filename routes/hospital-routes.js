const router = require('express').Router();
const Hospital = require('../models/hospital-model');

router.get('/:id',(req,res)=>{
  Hospital.findById(req.params.id).then((data)=>{
    res.json(data);
  });
})
module.exports = router;
