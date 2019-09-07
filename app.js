var express = require('express');
const fileUpload = require('express-fileupload');
var app = express();

var parseSVG = require('svg-path-parser');
var d='M93.799,36.732c0,2.347-1.903,4.252-4.251,4.252H78.207c-2.347,0-4.252-1.905-4.252-4.252l0,0c0-2.348,1.905-4.251,4.252-4.251h11.341C91.896,32.471,93.799,34.374,93.799,36.723L93.799,36.723z'

const PORT = 3000;

app.use(fileUpload());

app.use('/form', express.static(__dirname + '/index.html'));

app.get('/', function(req, res) {
  // do something here.
  console.log('got here');
  res.send('pong');
});

app.post('/parse', function(req, res) {

  console.log('got to parse block');

});

app.post('/upload', function(req, res) {

   let sampleFile;
   let uploadPath;

   if (Object.keys(req.files).length == 0) {
     res.status(400).send('No files were uploaded.');
     return;
   }

   console.log('req.files >>>', req.files); // eslint-disable-line

   sampleFile = req.files.sampleFile;

   uploadPath = __dirname + '/uploads/' + sampleFile.name;

   sampleFile.mv(uploadPath, function(err) {
     if (err) {
       return res.status(500).send(err);
     }

     res.send('File uploaded to ' + uploadPath);
   });

});


app.listen(PORT, function () {
  console.log('Example app listening on port ', PORT);
});
