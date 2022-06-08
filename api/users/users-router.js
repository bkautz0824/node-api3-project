const express = require('express');
const {logger, validatePost, validateUser, validateUserId} = require('../middleware/middleware')
// You will need `users-model.js` and `posts-model.js` both
// The middleware functions also need to be required
const Users = require('./users-model')
const Post = require('../posts/posts-model')

const router = express.Router();

router.get('/', (req, res, next) => {
  Users.get()
  .then(users => {
    res.status(200).json(users)
    return
  })
  .catch(next)
  // RETURN AN ARRAY WITH ALL THE USERS
});

router.get('/:id', validateUserId, (req, res) => {
  // RETURN THE USER OBJECT
  res.status(200).json(req.user)
  // this needs a middleware to verify user id
});

router.post('/', validateUser, (req, res, next) => {
  // RETURN THE NEWLY CREATED USER OBJECT
  Users.insert( {name:req.name} )
  .then(newUser => {
    res.status(201).json(newUser)
  })
  .catch(next)
  // this needs a middleware to check that the request body is valid
});

router.put('/:id', validateUserId, validateUser, (req, res, next) => {
  // RETURN THE FRESHLY UPDATED USER OBJECT
  Users.update(req.params.id, { name: req.name})
  .then(() => {
    return Users.getById(req.params.id)
  })
  .then(user=> {
    res.json(user)
  })
  .catch(next)
  // this needs a middleware to verify user id
  // and another middleware to check that the request body is valid
});

router.delete('/:id', validateUserId, async (req, res, next) => {
  // RETURN THE FRESHLY DELETED USER OBJECT
  try {
    await Users.remove(req.params.id)
    res.json(req.user)
  }catch (err){
    next(err)
  }
  // this needs a middleware to verify user id
});

router.get('/:id/posts', validateUserId, async (req, res, next) => {
  // RETURN THE ARRAY OF USER POSTS
  // this needs a middleware to verify user id
  try {
    const result = await Users.getUserPosts(req.params.id)
    res.json(result)
  } catch (err){
    next(err)
  }
});

router.post('/:id/posts', validateUserId, validatePost, (req, res) => {
  // RETURN THE NEWLY CREATED USER POST
  // this needs a middleware to verify user id
  // and another middleware to check that the request body is valid
});

router.use((err, req, res, next) => {
  res.status(err.status || 500).json({customMessage:'it didnt work brother',
  message: err.message})
})


// do not forget to export the router
module.exports = router