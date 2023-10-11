var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var professorSchema = new Schema({
    name:String,
    apelido:String,
    materia:String,
    email:String,
    password:String,
});

var Professor = mongoose.model('Professor', professorSchema)

module.exports = Professor;