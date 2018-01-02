var debug = require("debug")("metalsmith:section");

var multimatch = require("multimatch");

var _require = require("path"),
    extname = _require.extname;
/* eslint-disable id-length */
// Expose `plugin`.


module.exports = plugin;
/**
 * Metalsmith plugin to section html into named chunks
 *
 * @param {Object} opts - Options to pass to the plugin.
 * @param {string} opts.pattern - The pattern used to match to the file paths.
 * @param {string} opts.delimiter - The token to split the html into sections by.
 * @param {boolean} opts.removeFromContents - Whether or not to remove sections from the content metaData.
 * @param {string} opts.metaDataKey - What property to store result in the metadata.
 * @return {function}  The plugin function
 */

function plugin(opts) {
  opts = opts || {};
  opts.pattern = opts.pattern || ["*"];
  opts.delimiter = opts.delimiter || "section:::";
  opts.removeFromContents = opts.removeFromContents || true;
  opts.metaDataKey = opts.metaDataKey || "sections";
  debug("myplugin options: %s", JSON.stringify(opts));
  return function parse(files, metalsmith, done) {
    setImmediate(done);
    Object.keys(files).forEach(function (file) {
      if (isHTML(file) && multimatch(file, opts.pattern).length) {
        var data = files[file];
        debug("converting file: %s", file, opts.delimiter);
        var re = new RegExp("<.*>".concat(opts.delimiter), "g");
        debug("re:", re);
        var dataString = data.contents.toString();
        debug("string:", dataString);
        var strings = dataString.split(re);
        debug("strings:", strings.length);
        if (strings.length <= 1) return;
        data[opts.metaDataKey] = {};

        if (opts.removeFromContents) {
          debug("remaining content:", strings[0]);
          files[file].contents = Buffer.from(strings[0]);
        }

        for (var i = 1; i + 1 <= strings.length; i += 1) {
          var string = strings[i];
          var name = string.match(/^(.*?)<\/.*>/)[1].trim();
          var section = string.replace(/^(.*?)<\/.*>/, "").trim(); // if we already have something for that key

          if (data[opts.metaDataKey][name]) {
            var currentValue = data[opts.metaDataKey][name]; // if its a string, stick it in an array

            if (typeof currentValue === "string") {
              data[opts.metaDataKey][name] = [currentValue, section];
            } // if its an array append the new value
            else if (Array.isArray(currentValue)) {
                data[opts.metaDataKey][name].push(section);
              }
          } // if this is new
          else {
              data[opts.metaDataKey][name] = section;
            }

          debug(name, section);
        }
      }
    });
  };
}
/**
 * Determines if html.
 *
 * @param  {<type>}   file  The file path
 * @return {boolean}  True if html, False otherwise.
 */


function isHTML(file) {
  return /\.html|\.htm/.test(extname(file));
}

//# sourceMappingURL=metalsmith-section.js.map