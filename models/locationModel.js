var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var locationSchema = new Schema({
  city: {type: String, required: true},
  state: {type: String, required: true},
  weather: Boolean,
  transit: Boolean
});

var Location = mongoose.model('Location', locationSchema);

module.exports = Location;
