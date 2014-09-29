'use strict';
var util = require('util');
var path = require('path');
var yeoman = require('yeoman-generator');
var angularUtils = require('./util.js');

var Generator = module.exports = function Generator() {
  yeoman.generators.NamedBase.apply(this, arguments);

  try {
    this.appname = require(path.join(process.cwd(), 'bower.json')).name;
  } catch (e) {
    this.appname = path.basename(process.cwd());
  }
  this.appname = this._.slugify(this._.humanize(this.appname));
  this.scriptAppName = this._.camelize(this.appname) + angularUtils.appName(this);

  this.cameledName = this._.camelize(this.name);
  this.classedName = this._.classify(this.name);
  this.slugName = this._.slugify(this.name);

  this.filters = this.config.get('filters');
  this.sourceRoot(path.join(__dirname, '/templates'));
};

util.inherits(Generator, yeoman.generators.NamedBase);

Generator.prototype.addScriptToIndex = function (script) {
  try {
    var appPath = this.env.options.appPath;
    var fullPath = path.join(appPath, 'views', 'index' + this.viewSuffix);
    angularUtils.rewriteFile({
      file: fullPath,
      needle: '<!-- endbuild -->',
      splicable: [
        '<script src="scripts/' + script.replace('\\', '/') + '.js"></script>'
      ]
    });
  } catch (e) {
    console.log('\nUnable to find '.yellow + fullPath + '. Reference to '.yellow + script + '.js ' + 'not added.\n'.yellow);
  }
};

Generator.prototype.addModuleToApp = function(moduleName) {
  try {
    var appPath = this.env.options.appPath;
    var fullPath = path.join(appPath, 'scripts', 'app' + this.scriptSuffix);
    angularUtils.rewriteFile({
      file: fullPath,
      needle: '/// <end angularModules>',
      splicable: [
        ',\'' + moduleName + '\''
      ]
    });
  } catch (e) {
    console.log('\nUnable to find '.yellow + fullPath + '. Reference to '.yellow + script + '.js ' + 'not added.\n'.yellow);
  }
};

Generator.prototype.generateSourceAndTest = function (appTemplate, testTemplate, targetDirectory, skipAdd, filename) {
  // Services use classified names
  if (this.generatorName.toLowerCase() === 'service') {
    this.cameledName = this.classedName;
  }
  filename = filename ? filename : this.name;
  this.appTemplate(appTemplate, path.join('scripts', targetDirectory, filename));
  this.testTemplate(testTemplate, path.join(targetDirectory, filename));
  if (!skipAdd) {
    this.addScriptToIndex(path.join(targetDirectory, filename));
  }
};
