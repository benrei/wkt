const {parse, stringify} = require('./index');

const wktPoint = 'POINT Z (58.51466818909509 8.629797415591964 61.77237)';
const wktLineString = 'LINESTRING (30 10, 10 30, 40 40)';
const wktPolygon = 'POLYGON ((30 10, 40 40, 20 40, 10 20, 30 10))';
const wktPolygon2 = 'POLYGON ((35 10, 45 45, 15 40, 10 20, 35 10),(20 30, 35 35, 30 20, 20 30))';
const wktMultiPoint = 'MULTIPOINT ((10 40), (40 30), (20 20), (30 10))';
const wktMultiPoint2 = 'MULTIPOINT (10 40, 40 30, 20 20, 30 10)';
const wktMultiLineString = 'MULTILINESTRING ((10 10, 20 20, 10 40),(40 40, 30 30, 40 20, 30 10))';
const wktMultiPolygon = 'MULTIPOLYGON (((30 20, 45 40, 10 40, 30 20)),((15 5, 40 10, 10 20, 5 10, 15 5)))';
const wktMultiPolygon2 = 'MULTIPOLYGON (((40 40, 20 45, 45 30, 40 40)),((20 35, 10 30, 10 10, 30 5, 45 20, 20 35),(30 20, 20 15, 20 25, 30 20)))';
const wktGeometryCollection = 'GEOMETRYCOLLECTION (POINT (40 10),LINESTRING (10 10, 20 20, 10 40),POLYGON ((40 40, 20 45, 45 30, 40 40)))';

const point = {
  type: "Point",
  coordinates: [125.6, 10.1, 10]
};

const lineString = {
  type: "Point",
  coordinates: [125.6, 10.1, 10]
};

console.log(parse(wktLineString))
console.log(stringify(parse(wktLineString)))