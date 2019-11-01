const {parse, stringify} = require('./index');

let wkt = {};
wkt.Point = 'POINT Z (58.51466818909509 8.629797415591964 61.77237)';
wkt.LineString = 'LINESTRING (30 10, 10 30, 40 40)';
wkt.Polygon = 'POLYGON ((30 10, 40 40, 20 40, 10 20, 30 10))';
wkt.Polygon2 = 'POLYGON ((35 10, 45 45, 15 40, 10 20, 35 10),(20 30, 35 35, 30 20, 20 30))';
wkt.MultiPoint = 'MULTIPOINT ((10 40), (40 30), (20 20), (30 10))';
wkt.MultiPoint2 = 'MULTIPOINT (10 40, 40 30, 20 20, 30 10)';
wkt.MultiLineString = 'MULTILINESTRING ((10 10, 20 20, 10 40),(40 40, 30 30, 40 20, 30 10))';
wkt.MultiPolygon = 'MULTIPOLYGON (((30 20, 45 40, 10 40, 30 20)),((15 5, 40 10, 10 20, 5 10, 15 5)))';
wkt.MultiPolygon2 = 'MULTIPOLYGON (((40 40, 20 45, 45 30, 40 40)),((20 35, 10 30, 10 10, 30 5, 45 20, 20 35),(30 20, 20 15, 20 25, 30 20)))';
wkt.GeometryCollection = 'GEOMETRYCOLLECTION (POINT (40 10),LINESTRING (10 10, 20 20, 10 40),POLYGON ((40 40, 20 45, 45 30, 40 40)))';

const point = {
  type: "Point",
  coordinates: [125.6, 10.1, 10]
};

const lineString = {
  type: "Point",
  coordinates: [125.6, 10.1, 10]
};

const runAll = ()=>{
  for (let key in wkt) {
    if (wkt.hasOwnProperty(key)) {
      let parsed = parse(wkt[key]);
      console.log(parsed);
      console.log(stringify(parsed));
    }
  }
};
runAll();