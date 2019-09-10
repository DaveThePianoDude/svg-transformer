var express = require('express');
var bodyParser = require('body-parser');
var app = express();

const PORT = 3000;
const fs = require('fs');

var parserXml2Json = require('xml2json');

const xml2js = require('xml2js');
const parser = new xml2js.Parser({ attrkey: "ATTR" });


const fileUpload = require('express-fileupload');

var parseSVG = require('svg-path-parser');
var d='M93.799,36.732c0,2.347-1.903,4.252-4.251,4.252H78.207c-2.347,0-4.252-1.905-4.252-4.252l0,0c0-2.348,1.905-4.251,4.252-4.251h11.341C91.896,32.471,93.799,34.374,93.799,36.723L93.799,36.723z'

// Declare endpoints:
app.use(fileUpload());

app.use(bodyParser());

app.use('/form', express.static(__dirname + '/index.html'));

app.get('/', function(req, res) {
  // do something here.
  console.log('got here');
  res.send('pong');
});

function transform(sf, d) {

  console.log('d='+d);

  // Transform the SVG data: d --> new_d.
  var obj = parseSVG(d);

  for (var item in obj)
      for (var attr in obj[item])
          if(typeof obj[item][attr] == 'number')
          {
            var num = Number(sf) * obj[item][attr];
            obj[item][attr] = Number(parseFloat(num).toFixed(3));
          }

  var new_d = "";

  for (var item in obj)
  {
      var ind = 0;
      var attr_count = Object.keys(obj[item]).length;

      for (var attr in obj[item])
      {
          var attr = obj[item][attr];

          if(typeof attr == 'number' || (typeof attr == 'string' && attr.length == 1))
            new_d += attr;

          if(typeof attr == 'number' && ind < attr_count-1)
            new_d += ",";

          ind++;
      }
  }
  console.log('new_d='+new_d)

  return new_d;
}

app.post('/parse', function(req, res, next) {

  console.log('scaleFactor'+req.body.scaleFactor);

  // you can read the file asynchronously also
  let xml_string = fs.readFileSync(__dirname + '/uploads/data.svg', "utf8");

  fs.readFile(__dirname + '/uploads/data.svg', function(error, xml_string) {
    var json = JSON.parse(parserXml2Json.toJson(xml_string, {reversible: true}));

    if(error === null) {
        console.log("D=" + json['svg']['path']['d']);
        // Parse the SVG xml file and save it for later:
        var new_d = transform(req.body.scaleFactor, json['svg']['path']['d']);
        console.log(new_d);
        json['svg']['path']['d'] = new_d;

        var stringified = JSON.stringify(json);
        var xml = parserXml2Json.toXml(stringified);
        fs.writeFile('new-data.svg', xml, function(err, data) {
          if (err) {
            console.log(err);
          }
          else {
            console.log('updated!');
          }
        });
    }
    else {
        console.log(error);
    }
  });

  parser.parseString(xml_string, function(error, result) {
      //if(error === null) {
          // Parse the SVG xml file and save it for later:
      //    var new_d = transform(req.body.scaleFactor, result['svg']['path'][0]['ATTR']['d']);
      //    console.log(new_d);
      //}
      //else {
      //    console.log(error);
      //}
  });
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
