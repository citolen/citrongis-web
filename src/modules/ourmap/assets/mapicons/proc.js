var fs = require('fs');

fs.readdir('./', function (err, files) {
   var output = [];
   for (var i = 0; i < files.length; ++i) {
        output.push('ui/mapicons/' + files[i]);
   }
   fs.writeFile('./icons.json', JSON.stringify(output), function () {

   });
});
