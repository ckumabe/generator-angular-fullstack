'use strict';
var util = require('util');
var path = require('path');
var ScriptBase = require('../script-base.js');


var Generator = module.exports = function Generator() {
  ScriptBase.apply(this, arguments);

  if (this.name && this.name.toLowerCase() !== 'mod' && this.name.substr(-3).toLowerCase() === 'mod') {
    this.name = this.name.slice(0, -3);
  }


  if (typeof this.env.options.jade === 'undefined') {
    this.option('jade', {
      desc: 'Generate views using Jade templates'
    });

    // attempt to detect if user is using jade or not
    // if cml arg provided, use that; else look for the existence of cs
    if (!this.options.jade &&
      this.expandFiles(path.join(this.env.options.appPath, '/views/**/*.jade'), {}).length > 0) {
      this.options.jade = true;
    }

    this.env.options.jade = this.options.jade;
  }

  this.viewSuffix = '.html';
  if (this.env.options.jade) {
    this.viewSuffix = '.jade';
  }

};

util.inherits(Generator, ScriptBase);

Generator.prototype.createControllerFiles = function createControllerFiles() {
  this.generateSourceAndTest(
    'module/module',
    'spec/module',
    'modules/'+this.name,
    this.options['skip-add'] || false
  );
  this.generateSourceAndTest(
    'module/module-service',
    'spec/module-service',
    'modules/'+this.name +'/services',
    this.options['skip-add'] || false,
    this.name+'-srvc'
  );
  this.addModuleToApp(this.classedName+'Mod');
  this.sourceRoot(path.join(__dirname, '../templates'));
  var templatePath = this.env.options.jade ? 'jade' : 'html';
  this.template(path.join(
                  'views',
                  templatePath,
                  'view' + this.viewSuffix),
                path.join(
                  this.env.options.appPath,
                  'scripts',
                  'modules',
                  this.name,
                  'templates',
                   this.slugName + '.tmpl' + this.viewSuffix));
};
