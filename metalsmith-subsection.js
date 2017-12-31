const debug = require('debug')('metalsmith:subsection');
const multimatch = require('multimatch');
const extname = require('path').extname;

// Expose `plugin`.
module.exports = plugin;


function plugin(opts){

    opts = opts || {};
    opts.pattern = opts.pattern || ['*'];
    opts.delimiter = opts.delimiter || 'section:::';
    opts.removeFromContents = opts.removeFromContents || true;
    opts.metaDataKey = opts.metaDataKey || 'sections'

    debug('myplugin options: %s', JSON.stringify(opts));

    return function (files, metalsmith, done){

        setImmediate(done);

        Object.keys(files).forEach(function(file){

            if(isHTML(file) && multimatch(file, opts.pattern).length) {

                var data = files[file];

                debug('converting file: %s', file);

                const re = new RegExp(`<.*>${opts.delimiter}`,"g");

                var strings = data.contents.toString().split(re);

                if (strings.length > 1) {


                    data[opts.metaDataKey] = {}

                    if (opts.removeFromContents)
                    {
                        debug('remaining content:',strings[0])
                        files[file].contents = new Buffer(strings[0])
                    }

                    for (var i = 1; i + 1 <= strings.length; i++) {
                        const string = strings[i]
                        const name = string.match(/^(.*?)<\/.*>/)[1].trim()
                        const content = string.replace(/^(.*?)<\/.*>/,'').trim()
                        debug(name, content)

                        data[opts.metaDataKey][name] = content;
                    }
                }

            }
        });
    };
}


function isHTML(file){
  return /\.html|\.htm/.test(extname(file));
}