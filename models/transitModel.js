var mongoose = require('mongoose');
var Schema = mongoose.Schema;

// note: find a way to make these entire documents unique

var transitSchema = new Schema({
  name: {type: String, required: true},
  value: {type: String, required: true},
  route: {type: String, required: true},
  direction: {type: String, required: true}
});

transitSchema.index({name: 1, value: 1, direction: 1},{unique: true});

var Stop = mongoose.model('Stop', transitSchema);

module.exports = Stop;
