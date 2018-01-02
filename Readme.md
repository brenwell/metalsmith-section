# metalsmith-section

A metalsmith plugin which will section your html content into metadata properties. Its ideal for single page sites with multiple content blocks.
It can strip out sections of html from `contents` and make them accessible in your templates via their name. Additionally Iit can produce arrays of sections for iteration

## Installation

    $ npm install metalsmith-section

## Usage

Use `section` after `markdown`.

```js
var Metalsmith = require('metalsmith');
var markdown = require('metalsmith-markdown');
var section = require('metalsmith-section');

Metalsmith(__dirname)
    .use(markdown())
    .use(section())
    .build();
```

## Make a named section

You can make sections by adding a line with the name of your section e.g. `section:::mySection`. You will find you section in the metaData under `sections.mySection` if you haven't changed any of the options. See example below or example folder for more details.

## Make a list/array of sections

You can make arrays of sections by simply giving 1 or more sections the same name. If metalsmith-section encounters multiple sections with the same name it will compile them in to a `list`. A list is simply an array of sections which can later be iterated. See example below or example folder for more details.

## Options

Pass an options object

```js
const options = {
    pattern: "*",
    prefix: "section:::",
    removeFromContents: false,
    metaDataKey: 'list'
}
```

### pattern

The file path pattern to match agains

default is `**/*.html`

### prefix

The section name prefix used to split the sections, this will be removed from the html

default is `"section:::"`

### removeFromContents

Should the sections be removed from the `metaData.contents`

default is `true`

### metaDataKey

The name of the metaData property that the sections will be stored in

default is `"sections"`

## Example

**Javascript**
```js
var Metalsmith = require('metalsmith');
var section = require('metalsmith-section');
var layouts = require('metalsmith-layouts');
var markdown = require('metalsmith-markdown');

Metalsmith(__dirname)
    .source('./resources')
    .destination('./build')
    .use(markdown())
    .use(section())
    .use(layouts({
        engine: 'handlebars',
        pattern: "**/*.html"
    }))
```

**Markdown**

You can make sections by adding a line with the name of your section e.g. `section:::mySection`. You will find you section in the metaData under `sections.mySection` if you haven't changed any of the options. If metalsmith-section encounters multiple sections with the same name it will compile them in to a `list`. A list is simply an array of sections which can later be iterated.

```md
---
layout: index.hbs
---

# Hello World!

This is my page contents


section:::about
---

## About me

I am human

section:::list
---

red

section:::list
---

green

section:::list
---

blue

```

**Handlebars template**
```html
<!doctype html>
<html>
<head>
    <title>{{title}}</title>
</head>
<body>
    {{{contents}}}

    <hr/>

    {{{sections.about}}}
    <h2>Colors I like</h2>

    <ul>
    {{#each sections.list}}
        <li>{{{this}}}</li>
    {{/each}}
    </ul>

</body>
</html>

```

**Built html**
```html
<!doctype html>
<html>
<head>
  <title>metalsmith-section example</title>
</head>
<body>

<h1>Hello World!</h1>
<p>This is my page contents</p>


<hr/>

<h2>About me</h2>
<p>I am human</p>
<h2>Colors I like</h2>

<ul>
    <li><p>red</p></li>
    <li><p>green</p></li>
    <li><p>blue</p></li>
</ul>

</body>
</html>
```