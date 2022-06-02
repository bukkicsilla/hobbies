const express = require('express');
const mongodb = require('mongodb')
const db = require('../data/database')
const ObjectId = mongodb.ObjectId;
const router = express.Router();

router.get('/', function(req, res) {
  res.redirect('/hobbies');
});

router.get('/hobbies', async function(req, res) {
  const hobbies = await db.getDB().collection('recreation').find({}).project({hobby: 1, 'user.name': 1, outdoor: 1}).toArray()
  res.render('list', {hobbies: hobbies});
});

router.get('/new-hobby', async function(req, res) {
  const users = await db.getDB().collection('users').find().toArray();
  res.render('create', {users: users});
});

router.post('/hobbies', async function(req, res){
    const userId = new ObjectId(req.body.user)
    const where = req.body.outdoorindoor
    const outdoor = where === 'outdoor' ? true: false
    const user = await db.getDB().collection('users').findOne({_id: userId})
  
    const newHobby = {
      hobby: req.body.hobby,
      content: req.body.content,
      outdoor: outdoor,
      user: {
        id: userId,
        name: user.name,
        country: user.country
        }
      }
    const r = await db.getDB().collection('recreation').insertOne(newHobby)
    res.redirect('/hobbies')
})
router.get('/new-user', function(req, res){
  res.render('create-user')
})
router.post('/users', async function(req, res){
  const newUser = {
    name: req.body.username,
    country: req.body.country
  }
  const u = await db.getDB().collection('users').insertOne(newUser)
  res.redirect('hobbies')
})
router.get('/hobbies/:id', async function(req, res, next){
   let hobbyId = req.params.id;
   try{
     hobbyId = new ObjectId(hobbyId)
   } catch(err){
     return res.status(404).render('fourofour')
     //return next(err)
   }
   const hobby = await db.getDB().collection('recreation').findOne({_id: hobbyId}, {summary: 0});
  if (!hobby){
    return res.status(404).render('fourofour')
  }
  res.render('detail', {hobby: hobby})
})


router.get('/hobbies/:id/edit', async function(req, res){
  const hobbyId = req.params.id;
  const hobby = await db.getDB().collection('recreation').findOne({_id: new ObjectId(hobbyId)}, {hobby: 1, content: 1, outdoor: 1});
  if (!hobby){
   return res.status(404).render('fourofour')
  }
    res.render('update', {hobby: hobby})
})

router.post('/hobbies/:id/edit', async function(req, res){
    const hobbyId = new ObjectId(req.params.id)
    const where = req.body.outdoorindoor
    const outdoor = where === 'outdoor' ? true: false
    const r =  await db.getDB().collection('recreation').updateOne({ _id: hobbyId}, { $set: {
      hobby: req.body.hobby,
      content: req.body.content,
      outdoor: outdoor
    }})
    res.redirect('/hobbies')
})

router.post('/hobbies/:id/delete', async function(req, res){
  const hobbyId = new ObjectId(req.params.id)
  const r = await db.getDB().collection('recreation').deleteOne({_id: hobbyId})
  res.redirect('/hobbies')
})

module.exports = router;
