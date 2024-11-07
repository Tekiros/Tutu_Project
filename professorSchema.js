var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var professorSchema = new Schema({
    name: String,
    apelido: String,
    perfilSecretaria: { type: Boolean, default: false },
    materia: String,
    email: String,
    password: String,
    createdAt: { type: Date, default: Date.now },
    status: { type: Boolean, default: true },
    loginAttemps: { type: Number, default: 0 },
    lasLoginAttempt: { type: Date, default: null },
});


var Professor = mongoose.model('Professor', professorSchema)

module.exports = Professor;