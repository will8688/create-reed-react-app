var COMPONENT_NAME =  process.argv.slice(2)[0];
var path = require('path');
var copy = require('copy-files');
var fs = require('fs');

var fileName = path.resolve('./webpack.directories.json');
var DIRECTORIES = require(fileName);
COMPONENT_RENDER_PAGE = '';
var found = DIRECTORIES.filter(function(directory) {
  return directory.COMPONENT_NAME === COMPONENT_NAME
});
if(found.length > 0){
  return console.log('App Already Exists');
}
DIRECTORIES.push({
  "COMPONENT_NAME": COMPONENT_NAME,
  "COMPONENT_FOLDER": "./Scripts/components/"+COMPONENT_NAME+"/",
  "PUBLIC_IMAGE_PATH": "/recruiter/scripts/components/"+COMPONENT_NAME+"/compiled/images/",
  "COMPONENT_RENDER_PAGE": COMPONENT_RENDER_PAGE
});

fs.writeFile(fileName, JSON.stringify(DIRECTORIES), function (err) {
  if (err) return console.log(err);
});

copy({
  files: {
    'client.js': __dirname + '/lib/reed-react-app/client.js',
    'routes.js': __dirname + '/lib/reed-react-app/routes.js',
    'server.js': __dirname + '/lib/reed-react-app/server.js'
  },
  dest: './Scripts/components/'+COMPONENT_NAME+'/',
  overwrite : true
}, function (err) {
  if(err){
    console.log(err);
  }else{
    copy({
      files: {
        'index.js': __dirname + '/lib/reed-react-app/src/components/index.js'
      },
      dest: './Scripts/components/'+COMPONENT_NAME+'/src/components/',
      overwrite : true
    }, function (err) {
      if(err){
        console.log(err);
      }else{
        console.log('Reed App '+COMPONENT_NAME+' Created');
      }
    });
    
  }
});
