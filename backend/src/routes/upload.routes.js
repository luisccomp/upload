const { Router } = require('express');
const multer = require('multer');
const crypto = require('crypto');
const multerS3 = require('multer-s3');
const multerConfig = require('../config/multer');
const Post = require('../models/Post');

const router = Router();

router.get('/', (req, res) => {
  return res.json({
    message: 'Hello World!'
  });
});

router.get('/posts', (req, res, next) => {
  Post.find().then(posts => {
    res.json(posts);
  })
  .catch(error => next(error));
});

router.get('/posts/:id', (req, res, next) => {
  const { id } = req.params;

  Post.findById(id).then(post => {
    if (post) {
      return res.json(post);
    } else {
      return res.status(404).json({
        message: 'Post not found'
      });
    }
  });
});

// Criando um endpoint rest que realiza upload de apenas um arquivo por vez
router.post('/posts', multer(multerConfig).single('file'), (req, res, next) => {
  const { originalname: name, size, key, location: url = '' } = req.file;

  Post.create({
    name,
    size,
    key,
    url
  }).then(post => {
    res.json(post);
  })
  .catch(error => {
    next(error);
  });
});

router.delete('/posts/:id', (req, res) => {
  const { id } = req.params;

  Post.findById(id).then(post => {
    if (post) {
      post.remove();

      res.status(204).json();
    } else {
      res.status(404).json({
        message: 'Post not found'
      });
    }
  })
  .catch(err => next(err));
});

module.exports = router;