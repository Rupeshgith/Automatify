const express= require('express');
const multer= require('multer')
const tesseract = require("node-tesseract-ocr")
const path= require('path');
var hbs = require('hbs');
const fileUpload = require("express-fileupload");
const pdfParse = require("pdf-parse");
const app= express();

app.use(express.static(path.join(__dirname + '/uploads')));
app.set('view engine', 'hbs');

///////////  multer is having same code always 
//////////// and used for uploading the file
var storage= multer.diskStorage({
  destination: function(req,file,cb){
    cb(null,"uploads")
  },
  filename: function(req,file,cb){
    cb(null, file.fieldname + "-" + Date.now() + path.extname(file.originalname));
  },
});
const upload= multer({storage:storage});
////////////// mutler code upto here always same

app.get('/', (req,res)=>{
  res.render('index');
})

app.post("/extracttextfromimage", upload.single('file'),(req,res)=>{
  console.log(req.file.path);

  const config = {
    lang: "eng",
    oem: 1,
    psm: 3,
  }
  
  tesseract
    .recognize(req.file.path, config)
    .then((text) => {
      console.log("Result:", text)
      res.render("index",{data:text})
    })
    .catch((error) => {
      console.log(error.message)
    })
})

//// extract text from pdf
app.use(fileUpload());

app.post("/extract-text", (req, res) => {
    if (!req.files && !req.files.pdfFile) {
        res.status(400);
        res.end();
    }

    pdfParse(req.files.pdfFile).then(result => {
      res.send(result.text);
    });
});

app.listen(5000,()=>{
  console.log("port is running at 5000");
})