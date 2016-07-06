# treeadapter-mapper

## Use parse5-compatible TreeAdapters to map between different DOM structures

See [TreeAdapter at parse5 documentation](https://github.com/inikulin/parse5/wiki/Documentation#TreeAdapter)

## Install

`npm install treeadapter-mapper`

### Usage

```javascript
const parse5 = require( 'parse5' )
const Mapper = require( 'treeadapter-mapper' )

const parse5TreeAdapter = parse5.treeAdapters.default
const htmlparser2Adapter = parse5.treeAdapters.htmlparser2

// create the mapper instance by passing the source and target adapters
const mapper = Mapper( parse5TreeAdapter, htmlparser2Adapter )

const parse5Tree = parse5.parse( '<div></div>' )

const htmlparser2Tree = mapper( parse5Tree )

```
