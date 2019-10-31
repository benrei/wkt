# wkt
[![NPM version](https://img.shields.io/npm/v/wkt.svg)](https://www.npmjs.com/package/wkt)

- Parse WKT ([Well-known text](https://en.wikipedia.org/wiki/Well-known_text_representation_of_geometry)) 
into GeoJSON
- Stringify [GeoJSON](https://geojson.org/) into WKT

Supports

* Point + MultiPoint
* LineString + MultiLineString
* Polygon + MultiPolygon
* WKT's containing "Z"

## Install

    npm install wkt

## Usage

```js
const wkt = require('wkt'); //  =>  wkt.parse wkt.stringify.
const { parse, stringify } = require('wkt');

//  Parse
wkt.parse('POINT(1 2)');  //  => { type: 'Point', coordinates: [ 1, 2 ] }

const point = "POINT Z (58.51466818909509 8.629797415591964 61.77237)";
parse(point);       // => { type: 'Point', coordinates: [ 58.51466818909509, 8.629797415591964, 61.77237 ] }

const lineString = "LINESTRING (30 10, 10 30, 40 40)";
parse(lineString);  // => { type: 'LineString', coordinates: [ [ 30, 10 ], [ 10, 30 ], [ 40, 40 ] ] }

const polygon = "POLYGON ((30 10, 40 40, 20 40, 10 20, 30 10))";
parse(polygon);     // => { type: 'Polygon', coordinates: [[[30,10], [40,40], [20,40], [10,20], [30,10]]] }

//  Stringify
const geometry = {
  type: "Point",
  coordinates: [125.6, 10.1, 54.2]
};
stringify(geometry);  //  => "POINT Z (125.6 10.1 54.2)"
```


## Docs

### `parse(wkt)`
Parse [Well-known text](https://en.wikipedia.org/wiki/Well-known_text_representation_of_geometry) string into [GeoJSON](https://geojson.org/)

### `stringify(geojson)`

Stringifies a [GeoJSON](https://geojson.org/) geometry object or Feature object into [Well-known text](https://en.wikipedia.org/wiki/Well-known_text_representation_of_geometry) string

Throws an error if given a `FeatureCollection` or unknown input.

