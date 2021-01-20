var express = require('express');
var empModel = require('../module/employee');
const path = require('path');
const multer = require('multer');
const jwt = require('jsonwebtoken');
var router = express.Router();
const employee = empModel.find({});
router.use(express.static(__dirname+'./public/'))
const upload_model = require('../module/upload')
const imagedata = upload_model.find({});
if (typeof localStorage === "undefined" || localStorage === null) {
  var LocalStorage = require('node-localstorage').LocalStorage;
  localStorage = new LocalStorage('./scratch');
}
/* GET home page. */

function checkLogin(req, res, next){
  const myToken = localStorage.getItem('myToken')
  try {
    jwt.verify(myToken,'loginToken')
  } catch (error) {
    res.send("Please Login first to access this page")
  }
  next()
}

router.get('/', checkLogin , function(req, res, next) {
  employee.exec(function(err,data){
      if(err) throw err;
      res.render('index', { title: 'Employee Records', records:data, success:''});
    });  
 });
 router.post('/', function(req, res, next){
  const empdetails = new empModel({
    name: req.body.uname,
    email: req.body.email,
    etype: req.body.emptype,
    hourlyrate: req.body.hrlyrate,
    hours: req.body.ttlhr,
    total: parseInt(req.body.hrlyrate) * parseInt(req.body.ttlhr)
  });
  empdetails.save(function(err,res1){
    if(err) throw err
    employee.exec(function(err,data){
      if(err) throw err;
      res.render('index', { title: 'Employee Records', records:data, success:'Record Inserted Successful...!!!!'});
    });  
  });
 });
 router.post('/search/',function(req,res,next){
  var fltrName = req.body.fltrname;
  var fltrEmail = req.body.fltremail;
  var fltremptype = req.body.fltremptype;
  if(fltrName !='' && fltrEmail !='' && fltremptype !=''){
    var flterparams={ $and:[{name:fltrName},
      {$and:[{email:fltrEmail},{etype:fltremptype}]}
    ]
    }
  }else if(fltrName !='' && fltrEmail =='' && fltremptype !=''){
    var flterparams = { $and:[{name:fltrName},{etype:fltremptype}]
    }
  }else if(fltrName =='' && fltrEmail !='' && fltremptype !=''){
    var flterparams = { $and:[{email:fltrEmail},{etype:fltremptype}]
    }
  }else if(fltrName =='' && fltrEmail =='' && fltremptype !=''){
    var flterparams = {etype:fltremptype}
  }else{
    var flterparams = {}
  }
  var empfilter = empModel.find(flterparams)
  
  empfilter.exec(function(err,data){
    if(err) throw err;
    res.render('index',{title: 'Employee Records', records:data});
  });
});
router.get('/delete/:id',function(req, res, next){
  var id = req.params.id;
  var del = empModel.findByIdAndDelete(id);
  del.exec(function(err,data){
    if(err) throw err;
    employee.exec(function(err,data){
      if(err) throw err;
      res.render('index', { title: 'Employee Records', records:data, success:'Record Deleted Successful...!!!!'});
    });  
  });
});
router.get('/edit/:id',function(req, res, next){
  var id = req.params.id;
  var edit = empModel.findById(id);
  edit.exec(function(err,data){
    if(err) throw err;
    res.render('edit',{title: 'Employee Edit Records', records:data});
  })
  
})
router.post('/update/',function(req, res, next){
  
  var update = empModel.findByIdAndUpdate(req.body.id,{
    name: req.body.uname,
    email: req.body.email,
    etype: req.body.emptype,
    hourlyrate: req.body.hrlyrate,
    hours: req.body.ttlhr,
    total: parseInt(req.body.hrlyrate) * parseInt(req.body.ttlhr)
  });
  update.exec(function(err,data){
    if(err) throw err;
    employee.exec(function(err,data){
      if(err) throw err;
      res.render('index', { title: 'Employee Records', records:data, success:'Record Updated Successful...!!!!'});
    });  
  })
  
})
router.get('/upload/', checkLogin ,function(req, res, next){
  imagedata.exec(function(err,data){
    if(err) throw err;
    res.render('upload',{title:'Upload image', records:data, success:''})
  });
});

var storage = multer.diskStorage({
  destination:"./public/uploads/",
  filename:(req,file,cb)=>{
    cb(null,file.fieldname+"-"+Date.now()+path.extname(file.originalname))
  }
});
  var upload = multer({
  storage:storage
  }).single('file')
router.post('/upload/',upload,function(req, res, next){
  const imageFile = req.file.filename;
  const success = 'File Upload successful....!!!'
  const imageDetails = new upload_model({
    image:imageFile
  })

  imageDetails.save(function(err,doc){
    if(err) throw err;
    imagedata.exec(function(err,data){
      if(err) throw err;
      res.render('upload',{title:"Upload a Image..!!!" , records:data ,success:success})
    })
    
  });  
});
router.get('/login',function(req ,res, next){
  const token = jwt.sign({foo:'bar'},'loginToken')
  localStorage.setItem('myToken',token);
  res.send('Login Successfully..!!!')
});
router.get('/logout',function(req ,res, next){
  localStorage.removeItem('myToken')
  res.send('Logout Successfully..!!!')
});
module.exports = router;
