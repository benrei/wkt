# wkt
[![NPM version](https://img.shields.io/npm/v/wkt.svg)](https://www.npmjs.com/package/wkt)

- Parse WKT ([Well-known text](https://en.wikipedia.org/wiki/Well-known_text_representation_of_geometry)) 
into GeoJSON
- Stringify [GeoJSON](https://geojson.org/) into WKT

## Install

    npm install wkt

## Usage

### Parse
```js
const wkt = require('wkt');
const { parse } = require('wkt');

//  See return values in output section
wkt.parse('POINT(1 2)');
parse("POINT Z (58.51466818909509 8.629797415591964 61.77237)");
parse("LINESTRING (30 10, 10 30, 40 40)");
parse("POLYGON ((30 10, 40 40, 20 40, 10 20, 30 10))");
```
#### Output from `parse()`
```
{ type: 'Point', coordinates: [ 1, 2 ] }
{ type: 'Point', coordinates: [ 58.51466818909509, 8.629797415591964, 61.77237 ] }
{ type: 'LineString', coordinates: [ [ 30, 10 ], [ 10, 30 ], [ 40, 40 ] ] }
{ type: 'Polygon', coordinates: [[[30,10], [40,40], [20,40], [10,20], [30,10]]] }
```
### Stringify
```javascript
const { stringify } = require('wkt');

const geometry = {
  type: "Point",
  coordinates: [125.6, 10.1, 54.2]
};
const geometry2 = { 
  type: 'LineString',
  coordinates: [ [ 30, 10 ], [ 10, 30 ], [ 40, 40 ] ] 
};

//  See return values in output section
stringify(geometry);
stringify(geometry2);
```
#### Output from `stringify()`
```
"POINT Z (125.6 10.1 54.2)"
"LINESTRING (30 10, 10 30, 40 40)"
```

## Docs

### `parse(wkt)`
Parse [Well-known text](https://en.wikipedia.org/wiki/Well-known_text_representation_of_geometry) string into GeoJSON

### `stringify(geojson)`

Stringifies a [GeoJSON](https://geojson.org/) `geometry` object or Feature object into a WKT (Well-known text) string.
Throws an error if given a `FeatureCollection` or unknown input.

### Supported types
* Point + MultiPoint
* LineString + MultiLineString
* Polygon + MultiPolygon
* GeometryCollection
* WKT's containing "Z"


