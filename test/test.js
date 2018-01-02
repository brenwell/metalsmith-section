const fs = require('fs');
const sinon = require('sinon')
const assert = require('chai').assert
const section = require('../dist/metalsmith-section')
const MarkdownIt = require('markdown-it')
const markdown = new MarkdownIt();

describe('Creation', () => {

    const htmlName = 'test.html'
    const md = fs.readFileSync(__dirname+'/mocks/test.md', 'utf8')
    const html = markdown.render(md)

    const files = {}
    files[htmlName] = {
        contents:
        {
            toString: () => { return html}
        }
    }

    const plugin = section()

    it('Plugin initialize', () => {
        assert.exists(plugin)
        const done = sinon.spy()
        plugin(files,null,done)
        assert.exists(files[htmlName].sections)
        const sections = files[htmlName].sections
        assert.exists(sections.about)
        assert.isString(sections.about)
        assert.exists(sections.list)
        assert.isArray(sections.list)
        assert.equal(sections.list.length,3)
    });
});

