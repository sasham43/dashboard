var fs = require('fs');
var csv = require('csv-parser');

var stopArray = [];

// fs.createReadStream('stops.csv').pipe(csv()).on('data', function(data){
//   // console.log('row', data);
//   stopArray.push(data);
// }).on('end', function(){
//   //console.log('StopArray', stopArray);
// });

module.exports = stopArray;
