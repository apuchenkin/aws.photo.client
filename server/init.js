var fs = require('fs');
var gm = require('gm');
var srcs = fs.readdirSync('app/images/gallery');
var size = 75;

srcs.map(function(item){
  var thumb = gm(fs.createReadStream('app/images/gallery/' + item));
  thumb.resize(size * 4, size * 4);
  thumb.write('app/images/min/' + item, function (err) {
    if (!err) console.log('done');
  });
});
