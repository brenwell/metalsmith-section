
var basename = require('path').basename;
var debug = require('debug')('metalsmith-markdown');
var dirname = require('path').dirname;
var extname = require('path').extname;
var join = require('path').join;
var markdownIt = require('markdown-it');

/**
 * Expose `plugin`.
 */

module.exports = plugin;

/**
 * Metalsmith plugin to convert markdown files.
 *
 * @param {Object} options (optional)
 * @return {Function}
 */

function plugin(preset, options){
  var markdown = new markdownIt(preset, options),
      envSetter = function(){};

  var plugin = function(files, metalsmith, done){
    setImmediate(done);
    Object.keys(files).forEach(function(file){
      debug('checking file: %s', file);
      if (!is_markdown(file)) return;
      var data = files[file];
      var dir = dirname(file);
      var html = basename(file, extname(file)) + '.html';
      if ('.' != dir) html = join(dir, html);

      debug('converting file: %s', file);
      var env = {};
      if (envSetter) {
        env = envSetter(data, metalsmith.metadata());
      }
      var str = markdown.render(data.contents.toString(), env);
      data.contents = new Buffer(str);

      delete files[file];
      files[html] = data;
    });
  };

  plugin.parser = markdown;

  /* proxy parser methods to return plugin for inline use */

  ['use', 'set', 'enable', 'disable'].forEach(function(fn){
    plugin[fn] = function(){
      var args = Array.prototype.slice.call(arguments);
      markdown[fn].apply(markdown, args);
      return plugin;
    }
  });

  plugin.env = function(setter){
    envSetter = setter;
    return plugin;
  }

  plugin.withParser = function(fn){
    fn(markdown);
    return plugin;
  }

  return plugin;
}

/**
 * Check if a `file` is markdown.
 *
 * @param {String} file
 * @return {Boolean}
 */

function is_markdown(file){
  return /\.md|\.markdown/.test(extname(file));
}
