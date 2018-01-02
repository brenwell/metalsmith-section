const Metalsmith  = require('metalsmith');
const markdown    = require('metalsmith-markdownit');
const layouts     = require('metalsmith-layouts');
const watch       = require('metalsmith-watch');
const debug       = require('metalsmith-debug');
const subsection  = require('../dist/metalsmith-section')

const source = './src'
const destination = './build'

Metalsmith(__dirname)
    .metadata({
        title: "Brendon Blackwell - Freelance Web & iOS Software Developer",
        description: "It's about saying »Hello« to the World.",
        assets: "/assets"
    })
    .source(source)
    .destination(destination)
    .clean(true)
    .use(markdown())
    .use(subsection())
    .use(layouts({
        engine: 'handlebars'
    }))
    .use(debug())
    .build(function(err, files) {
        if (err) { throw err; }
    });
