const mongoose = require("mongoose");
mongoose.connect('mongodb://localhost:27017/employee',{useNewUrlParser:true},{ useUnifiedTopology: true })
const conn = mongoose.connection;

const employeeSchema = mongoose.Schema({
    name: String,
    email: String,
    etype: String,
    hourlyrate: Number,
    hours: Number,
    total: Number
});

const employeemodel = mongoose.model("employee",employeeSchema);
module.exports = employeemodel;
