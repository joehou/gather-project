const router = require('express').Router();

const Item = require('../models/item');

router.get('/', async (req, res, next) => {
  const items = await Item.find({});
  res.render('index', {items});
});

// Add additional routes below:



router.get('/items/create', (req, res, next)=>{
  res.render('create')
})


router.post('/items/create', async (req, res, next)=>{
  const{title, description,imageUrl}=req.body
  const newItem= new Item({title,description,imageUrl})
  newItem.validateSync()

  if (!newItem.errors){
    await Item.create(newItem)
    res.status(302).redirect('/')
  }else{
    res.status(400).render('create',{newItem:newItem})
  }
})


router.get('/items/:id',async(req,res,next)=>{
  const item= await Item.findById(req.params.id).exec()
  res.render('item',{item:item})
})

module.exports = router;

