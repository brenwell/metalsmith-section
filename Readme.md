# metalsmith-subsections

A metalsmith plugin which parses html content into named sections.

## Installation

    $ npm install metalsmith-subsections

## Usage

```js
var Metalsmith = require('metalsmith');
var sections = require('metalsmith-subsections');

Metalsmith(__dirname)
  .use(sections())
  .build();
```

## Options

Pass an options object

```js
const options = {
    pattern: "**/*.html",
    delimiter: "my-section:::",
    removeFromContents: false,
    metaDataKey: 'list'
}
```

### pattern

default is `*`

### delimiter

default is `"section:::"`

### removeFromContents

default is `true`

###metaDataKey

default is `"section"`

## Example

**Javascript**
```js
var Metalsmith = require('metalsmith');
var sections = require('metalsmith-subsections');
var layouts = require('metalsmith-layouts');
var markdown = require('metalsmith-markdown');

Metalsmith(__dirname)
    .source('./resources')
    .destination('./build')
    .use(markdown())
    .use(layouts({
        engine: 'handlebars',
        pattern: "**/*.html"
    }))
    .use(sections({
        pattern: "**/*.html",    // default is "*"
        delimiter: "section:::", // default
        removeFromContents: true,// default
        metaDataKey: 'sections', // default
    }));
```

**Markdown**
```
# Welcome to my awesome site

I do stuff

---
section:::about
---

## About me

I am human
```

**Handlebars template**
```html
<!doctype html>
<html>
<body>
    {{{contents}}}
    <hr/>
    {{{sections.about}}}
</body>
</html>

```

**Built html**
```html
<!doctype html>
<html>
<body>
    <h1>Hello World!</h1>
    <p>This is my page contents</p>
    <hr>
    <h2>About me</h2>
    <p>I am human</p>
</body>
</html>
```