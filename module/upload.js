const mongoose = require('mongoose');
const { modelName } = require('./employee');
mongoose.connect('mongodb://localhost:27017/employee',{useNewUrlParser:true},{useUnifiedTopology:true})
const conn = mongoose.Collection;

const uploadSchema = mongoose.Schema({
    image:String
});

const uploadmodel = mongoose.model('upload_images',uploadSchema);

module.exports = uploadmodel;
