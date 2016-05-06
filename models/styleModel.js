var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var styleSchema = new Schema({
  background: String,
  borderColor: String,
  color: String,
  useAPOD: Boolean
});

var Style = mongoose.model('Style', styleSchema);

module.exports = Style;
