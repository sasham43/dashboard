var express = require('express');
var path = require('path');

var router = express.Router();


router.get('/', function(req, res){
  res.sendFile(path.join(__dirname, '../public/views/index.html'));
});

router.get('/*', function(req, res){
  console.log('/* wildcard matched, serving default route.');
  res.sendFile(path.join(__dirname, '../public/views/index.html'));
});

module.exports = router;
