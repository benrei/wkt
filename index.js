let numberRegexp = /[-+]?([0-9]*\.[0-9]+|[0-9]+)([eE][-+]?[0-9]+)?/;
// Matches sequences like '100 100' or '100 100 100'.
let coordFormat = new RegExp('^' + numberRegexp.source + '(\\s' + numberRegexp.source + '){1,}');

/**
 * Parse WKT and return GeoJSON.
 * @param wkt
 * @return {?Object} A GeoJSON geometry object
 */
const parse = (wkt)=> {
  let parts = wkt.split(';');
  let _ = parts.pop();
  let srid = (parts.shift() || '').split('=').pop();

  let i = 0;

  function $ (re) {
    let match = _.substring(i).match(re);
    if (!match) return null;
    else {
      i += match[0].length;
      return match[0];
    }
  }

  function crs (obj) {
    if (obj && srid.match(/\d+/)) {
      obj.crs = {
        type: 'name',
        properties: {
          name: 'urn:ogc:def:crs:EPSG::' + srid
        }
      };
    }

    return obj;
  }

  function white () { $(/^\s*/); }

  function multicoords () {
    white();
    let depth = 0;
    let rings = [];
    let stack = [rings];
    let pointer = rings;
    let elem;

    while (elem =
      $(/^(\()/) ||
      $(/^(\))/) ||
      $(/^(,)/) ||
      $(coordFormat)) {
      if (elem === '(') {
        stack.push(pointer);
        pointer = [];
        stack[stack.length - 1].push(pointer);
        depth++;
      } else if (elem === ')') {
        // For the case: Polygon(), ...
        if (pointer.length === 0) return null;

        pointer = stack.pop();
        // the stack was empty, input was malformed
        if (!pointer) return null;
        depth--;
        if (depth === 0) break;
      } else if (elem === ',') {
        pointer = [];
        stack[stack.length - 1].push(pointer);
      } else if (!elem.split(/\s/g).some(isNaN)) {
        Array.prototype.push.apply(pointer, elem.split(/\s/g).map(parseFloat));
      } else {
        return null;
      }
      white();
    }

    if (depth !== 0) return null;

    return rings;
  }

  function coords () {
    let list = [];
    let item;
    let pt;
    while (pt =
      $(coordFormat) ||
      $(/^(,)/)) {
      if (pt === ',') {
        list.push(item);
        item = [];
      } else if (!pt.split(/\s/g).some(isNaN)) {
        if (!item) item = [];
        Array.prototype.push.apply(item, pt.split(/\s/g).map(parseFloat));
      }
      white();
    }

    if (item) list.push(item);
    else return null;

    return list.length ? list : null;
  }

  function point () {
    if (!$(/^(point(\sz)?)/i)) return null;
    white();
    if (!$(/^(\()/)) return null;
    let c = coords();
    if (!c) return null;
    white();
    if (!$(/^(\))/)) return null;
    return {
      type: 'Point',
      coordinates: c[0]
    };
  }

  function multipoint () {
    if (!$(/^(multipoint(\sz)?)/i)) return null;
    white();
    let newCoordsFormat = _
      .substring(_.indexOf('(') + 1, _.length - 1)
      .replace(/\(/g, '')
      .replace(/\)/g, '');
    _ = 'MULTIPOINT (' + newCoordsFormat + ')';
    let c = multicoords();
    if (!c) return null;
    white();
    return {
      type: 'MultiPoint',
      coordinates: c
    };
  }

  function multilinestring () {
    if (!$(/^(multilinestring(\sz)?)/i)) return null;
    white();
    let c = multicoords();
    if (!c) return null;
    white();
    return {
      type: 'MultiLineString',
      coordinates: c
    };
  }

  function linestring () {
    if (!$(/^(linestring(\sz)?)/i)) return null;
    white();
    if (!$(/^(\()/)) return null;
    let c = coords();
    if (!c) return null;
    if (!$(/^(\))/)) return null;
    return {
      type: 'LineString',
      coordinates: c
    };
  }

  function polygon () {
    if (!$(/^(polygon(\sz)?)/i)) return null;
    white();
    let c = multicoords();
    if (!c) return null;
    return {
      type: 'Polygon',
      coordinates: c
    };
  }

  function multipolygon () {
    if (!$(/^(multipolygon(\sz)?)/i)) return null;
    white();
    let c = multicoords();
    if (!c) return null;
    return {
      type: 'MultiPolygon',
      coordinates: c
    };
  }

  function geometrycollection () {
    let geometries = [];
    let geometry;

    if (!$(/^(geometrycollection)/i)) return null;
    white();

    if (!$(/^(\()/)) return null;
    while (geometry = root()) {
      geometries.push(geometry);
      white();
      $(/^(,)/);
      white();
    }
    if (!$(/^(\))/)) return null;

    return {
      type: 'GeometryCollection',
      geometries: geometries
    };
  }

  function root () {
    return point() ||
      linestring() ||
      polygon() ||
      multipoint() ||
      multilinestring() ||
      multipolygon() ||
      geometrycollection();
  }

  return crs(root());
};

/**
 * Stringifies a GeoJSON object into WKT
 */
const stringify = (geoJSON)=> {
  if (geoJSON.type === 'Feature') {
    geoJSON = geoJSON.geometry;
  }

  function pairWKT (c) {
    return c.join(' ');
  }

  function ringWKT (r) {
    return r.map(pairWKT).join(', ');
  }

  function ringsWKT (r) {
    return r.map(ringWKT).map(wrapParens).join(', ');
  }

  function multiRingsWKT (r) {
    return r.map(ringsWKT).map(wrapParens).join(', ');
  }

  function wrapParens (s) { return '(' + s + ')'; }

  let gJ = geoJSON;
  switch (gJ.type) {
    case 'Point':
      if(gJ.coordinates && gJ.coordinates.length === 3)
        return 'POINT Z (' + pairWKT(gJ.coordinates) + ')';
      else return 'POINT (' + pairWKT(gJ.coordinates) + ')';

    case 'LineString':
      if(gJ.coordinates && gJ.coordinates[0] && gJ.coordinates[0].length === 3)
        return 'LINESTRING Z (' + ringWKT(gJ.coordinates) + ')';
      else return 'LINESTRING (' + ringWKT(gJ.coordinates) + ')';

    case 'Polygon':
      if(gJ.coordinates && gJ.coordinates[0] && gJ.coordinates[0][0] && gJ.coordinates[0][0].length === 3)
        return 'POLYGON Z (' + ringsWKT(gJ.coordinates) + ')';
      else return 'POLYGON (' + ringsWKT(gJ.coordinates) + ')';

    case 'MultiPoint':
      if(gJ.coordinates && gJ.coordinates[0] && gJ.coordinates[0].length === 3)
        return 'MULTIPOINT Z (' + ringWKT(gJ.coordinates) + ')';
      else return 'MULTIPOINT (' + ringWKT(gJ.coordinates) + ')';

    case 'MultiLineString':
      if(gJ.coordinates && gJ.coordinates[0] && gJ.coordinates[0][0] && gJ.coordinates[0][0].length === 3)
        return 'MULTILINESTRING Z (' + ringsWKT(gJ.coordinates) + ')';
      else return 'MULTILINESTRING (' + ringsWKT(gJ.coordinates) + ')';

    case 'MultiPolygon':
      if(gJ.coordinates && gJ.coordinates[0] && gJ.coordinates[0][0] && gJ.coordinates[0][0] && gJ.coordinates[0][0][0].length === 3)
        return 'MULTIPOLYGON Z (' + multiRingsWKT(gJ.coordinates) + ')';
      else return 'MULTIPOLYGON (' + multiRingsWKT(gJ.coordinates) + ')';


    case 'GeometryCollection':
      return 'GEOMETRYCOLLECTION (' + gJ.geometries.map(stringify).join(', ') + ')';

    default:
      throw new Error('stringify requires a valid GeoJSON Feature or geometry object as input');
  }
};

module.exports = {
  parse,
  stringify
};