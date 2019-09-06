var parseSVG = require('svg-path-parser');

var d='M93.799,36.732c0,2.347-1.903,4.252-4.251,4.252H78.207c-2.347,0-4.252-1.905-4.252-4.252l0,0c0-2.348,1.905-4.251,4.252-4.251h11.341C91.896,32.471,93.799,34.374,93.799,36.723L93.799,36.723z'

var express = require('express');
var app = express();

app.get('/', function (req, res) {

    var obj = parseSVG(d);

    for (var item in obj)
    {
        for (var attr in obj[item])
        {
            if(typeof obj[item][attr] == 'number')
                obj[item][attr] = .25 * obj[item][attr];
        }
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
            {
              new_d += ",";
            }
            ind++;
        }

    }

    //console.log(svgson.stringify(JSON.stringify(obj)));
    res.send(new_d);

});

app.listen(3000, function () {
  console.log('Example app listening on port 3000!');
});
