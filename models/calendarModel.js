var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var calendarSchema = new Schema({
  title: {type: String, required: true},
  start: {type: Date, required: true},
  end: {type: Date, required: true}
});

var calendarModel = mongoose.model('Event', calendarSchema);

module.exports = calendarModel;
