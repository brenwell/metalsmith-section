const debug = require("debug")("metalsmith:section");
const multimatch = require("multimatch");
const { extname } = require("path");

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
function plugin(opts)
{

    opts = opts || {};
    opts.pattern = opts.pattern || ["*"];
    opts.delimiter = opts.delimiter || "section:::";
    opts.removeFromContents = opts.removeFromContents || true;
    opts.metaDataKey = opts.metaDataKey || "sections"

    debug("myplugin options: %s", JSON.stringify(opts));

    return function parse(files, metalsmith, done)
    {

        setImmediate(done);

        Object.keys(files).forEach((file) =>
        {

            if (isHTML(file) && multimatch(file, opts.pattern).length)
            {

                const data = files[file];

                debug("converting file: %s", file, opts.delimiter);

                const re = new RegExp(`<.*>${opts.delimiter}`,"g");

                debug("re:" , re)

                const dataString = data.contents.toString()

                debug("string:" , dataString)

                const strings = dataString.split(re);

                debug("strings:" ,strings.length)

                if (strings.length <= 1) return

                data[opts.metaDataKey] = {}

                if (opts.removeFromContents)
                {
                    debug("remaining content:",strings[0])
                    files[file].contents = Buffer.from(strings[0])
                }

                for (let i = 1; i + 1 <= strings.length; i += 1)
                {
                    const string = strings[i]
                    const name = string.match(/^(.*?)<\/.*>/)[1].trim()
                    const section = string.replace(/^(.*?)<\/.*>/,"").trim()

                    // if we already have something for that key
                    if (data[opts.metaDataKey][name])
                    {
                        const currentValue = data[opts.metaDataKey][name]

                        // if its a string, stick it in an array
                        if (typeof currentValue === "string")
                        {
                            data[opts.metaDataKey][name] = [
                                currentValue,
                                section
                            ]
                        }

                        // if its an array append the new value
                        else if (Array.isArray(currentValue))
                        {
                            data[opts.metaDataKey][name].push(section)
                        }

                    }

                    // if this is new
                    else
                    {
                        data[opts.metaDataKey][name] = section;
                    }

                    debug(name, section)
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
function isHTML(file)
{
    return (/\.html|\.htm/).test(extname(file));
}
