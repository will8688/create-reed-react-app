var fs = require('fs');
var path = require('path');

var packageNPM = require('./package.json');
var packageProjectPath = path.resolve('../../package.json');
var packageProject = require(packageProjectPath);
packageProject.scripts['create-reed-react-app'] = packageNPM.scripts['create-reed-react-app'];
packageProject.scripts['build-reed-react-app'] = packageNPM.scripts['build-reed-react-app'];
packageProject.scripts['build-all-reed-react-app'] = packageNPM.scripts['build-all-reed-react-app'];
fs.writeFile(packageProjectPath, JSON.stringify(packageProject), function (err) {
  if (err) return console.log(err);
  console.log('Package Updated.');
});
var copy = require('copy-files');
var rootPath = path.resolve('../../');
copy({
  files: {
    '.babelrc': __dirname + '/lib/.babelrc',
    '.eslintrc': __dirname + '/lib/.eslintrc'
  },
  dest: rootPath,
  overwrite : true
}, function (err) {
  if(err){
    console.log(err);
  }else{
    console.log('Create Reed React App Updated.');
  }
});