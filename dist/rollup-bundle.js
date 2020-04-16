var LabeledGeoJSONLayerLibrary = (function (exports, core, layers) {
	'use strict';

	var commonjsGlobal = typeof globalThis !== 'undefined' ? globalThis : typeof window !== 'undefined' ? window : typeof global !== 'undefined' ? global : typeof self !== 'undefined' ? self : {};

	function unwrapExports (x) {
		return x && x.__esModule && Object.prototype.hasOwnProperty.call(x, 'default') ? x['default'] : x;
	}

	function createCommonjsModule(fn, module) {
		return module = { exports: {} }, fn(module, module.exports), module.exports;
	}

	var helpers = createCommonjsModule(function (module, exports) {
	Object.defineProperty(exports, "__esModule", { value: true });
	/**
	 * @module helpers
	 */
	/**
	 * Earth Radius used with the Harvesine formula and approximates using a spherical (non-ellipsoid) Earth.
	 *
	 * @memberof helpers
	 * @type {number}
	 */
	exports.earthRadius = 6371008.8;
	/**
	 * Unit of measurement factors using a spherical (non-ellipsoid) earth radius.
	 *
	 * @memberof helpers
	 * @type {Object}
	 */
	exports.factors = {
	    centimeters: exports.earthRadius * 100,
	    centimetres: exports.earthRadius * 100,
	    degrees: exports.earthRadius / 111325,
	    feet: exports.earthRadius * 3.28084,
	    inches: exports.earthRadius * 39.370,
	    kilometers: exports.earthRadius / 1000,
	    kilometres: exports.earthRadius / 1000,
	    meters: exports.earthRadius,
	    metres: exports.earthRadius,
	    miles: exports.earthRadius / 1609.344,
	    millimeters: exports.earthRadius * 1000,
	    millimetres: exports.earthRadius * 1000,
	    nauticalmiles: exports.earthRadius / 1852,
	    radians: 1,
	    yards: exports.earthRadius / 1.0936,
	};
	/**
	 * Units of measurement factors based on 1 meter.
	 *
	 * @memberof helpers
	 * @type {Object}
	 */
	exports.unitsFactors = {
	    centimeters: 100,
	    centimetres: 100,
	    degrees: 1 / 111325,
	    feet: 3.28084,
	    inches: 39.370,
	    kilometers: 1 / 1000,
	    kilometres: 1 / 1000,
	    meters: 1,
	    metres: 1,
	    miles: 1 / 1609.344,
	    millimeters: 1000,
	    millimetres: 1000,
	    nauticalmiles: 1 / 1852,
	    radians: 1 / exports.earthRadius,
	    yards: 1 / 1.0936,
	};
	/**
	 * Area of measurement factors based on 1 square meter.
	 *
	 * @memberof helpers
	 * @type {Object}
	 */
	exports.areaFactors = {
	    acres: 0.000247105,
	    centimeters: 10000,
	    centimetres: 10000,
	    feet: 10.763910417,
	    inches: 1550.003100006,
	    kilometers: 0.000001,
	    kilometres: 0.000001,
	    meters: 1,
	    metres: 1,
	    miles: 3.86e-7,
	    millimeters: 1000000,
	    millimetres: 1000000,
	    yards: 1.195990046,
	};
	/**
	 * Wraps a GeoJSON {@link Geometry} in a GeoJSON {@link Feature}.
	 *
	 * @name feature
	 * @param {Geometry} geometry input geometry
	 * @param {Object} [properties={}] an Object of key-value pairs to add as properties
	 * @param {Object} [options={}] Optional Parameters
	 * @param {Array<number>} [options.bbox] Bounding Box Array [west, south, east, north] associated with the Feature
	 * @param {string|number} [options.id] Identifier associated with the Feature
	 * @returns {Feature} a GeoJSON Feature
	 * @example
	 * var geometry = {
	 *   "type": "Point",
	 *   "coordinates": [110, 50]
	 * };
	 *
	 * var feature = turf.feature(geometry);
	 *
	 * //=feature
	 */
	function feature(geom, properties, options) {
	    if (options === void 0) { options = {}; }
	    var feat = { type: "Feature" };
	    if (options.id === 0 || options.id) {
	        feat.id = options.id;
	    }
	    if (options.bbox) {
	        feat.bbox = options.bbox;
	    }
	    feat.properties = properties || {};
	    feat.geometry = geom;
	    return feat;
	}
	exports.feature = feature;
	/**
	 * Creates a GeoJSON {@link Geometry} from a Geometry string type & coordinates.
	 * For GeometryCollection type use `helpers.geometryCollection`
	 *
	 * @name geometry
	 * @param {string} type Geometry Type
	 * @param {Array<any>} coordinates Coordinates
	 * @param {Object} [options={}] Optional Parameters
	 * @returns {Geometry} a GeoJSON Geometry
	 * @example
	 * var type = "Point";
	 * var coordinates = [110, 50];
	 * var geometry = turf.geometry(type, coordinates);
	 * // => geometry
	 */
	function geometry(type, coordinates, options) {
	    switch (type) {
	        case "Point": return point(coordinates).geometry;
	        case "LineString": return lineString(coordinates).geometry;
	        case "Polygon": return polygon(coordinates).geometry;
	        case "MultiPoint": return multiPoint(coordinates).geometry;
	        case "MultiLineString": return multiLineString(coordinates).geometry;
	        case "MultiPolygon": return multiPolygon(coordinates).geometry;
	        default: throw new Error(type + " is invalid");
	    }
	}
	exports.geometry = geometry;
	/**
	 * Creates a {@link Point} {@link Feature} from a Position.
	 *
	 * @name point
	 * @param {Array<number>} coordinates longitude, latitude position (each in decimal degrees)
	 * @param {Object} [properties={}] an Object of key-value pairs to add as properties
	 * @param {Object} [options={}] Optional Parameters
	 * @param {Array<number>} [options.bbox] Bounding Box Array [west, south, east, north] associated with the Feature
	 * @param {string|number} [options.id] Identifier associated with the Feature
	 * @returns {Feature<Point>} a Point feature
	 * @example
	 * var point = turf.point([-75.343, 39.984]);
	 *
	 * //=point
	 */
	function point(coordinates, properties, options) {
	    if (options === void 0) { options = {}; }
	    var geom = {
	        type: "Point",
	        coordinates: coordinates,
	    };
	    return feature(geom, properties, options);
	}
	exports.point = point;
	/**
	 * Creates a {@link Point} {@link FeatureCollection} from an Array of Point coordinates.
	 *
	 * @name points
	 * @param {Array<Array<number>>} coordinates an array of Points
	 * @param {Object} [properties={}] Translate these properties to each Feature
	 * @param {Object} [options={}] Optional Parameters
	 * @param {Array<number>} [options.bbox] Bounding Box Array [west, south, east, north]
	 * associated with the FeatureCollection
	 * @param {string|number} [options.id] Identifier associated with the FeatureCollection
	 * @returns {FeatureCollection<Point>} Point Feature
	 * @example
	 * var points = turf.points([
	 *   [-75, 39],
	 *   [-80, 45],
	 *   [-78, 50]
	 * ]);
	 *
	 * //=points
	 */
	function points(coordinates, properties, options) {
	    if (options === void 0) { options = {}; }
	    return featureCollection(coordinates.map(function (coords) {
	        return point(coords, properties);
	    }), options);
	}
	exports.points = points;
	/**
	 * Creates a {@link Polygon} {@link Feature} from an Array of LinearRings.
	 *
	 * @name polygon
	 * @param {Array<Array<Array<number>>>} coordinates an array of LinearRings
	 * @param {Object} [properties={}] an Object of key-value pairs to add as properties
	 * @param {Object} [options={}] Optional Parameters
	 * @param {Array<number>} [options.bbox] Bounding Box Array [west, south, east, north] associated with the Feature
	 * @param {string|number} [options.id] Identifier associated with the Feature
	 * @returns {Feature<Polygon>} Polygon Feature
	 * @example
	 * var polygon = turf.polygon([[[-5, 52], [-4, 56], [-2, 51], [-7, 54], [-5, 52]]], { name: 'poly1' });
	 *
	 * //=polygon
	 */
	function polygon(coordinates, properties, options) {
	    if (options === void 0) { options = {}; }
	    for (var _i = 0, coordinates_1 = coordinates; _i < coordinates_1.length; _i++) {
	        var ring = coordinates_1[_i];
	        if (ring.length < 4) {
	            throw new Error("Each LinearRing of a Polygon must have 4 or more Positions.");
	        }
	        for (var j = 0; j < ring[ring.length - 1].length; j++) {
	            // Check if first point of Polygon contains two numbers
	            if (ring[ring.length - 1][j] !== ring[0][j]) {
	                throw new Error("First and last Position are not equivalent.");
	            }
	        }
	    }
	    var geom = {
	        type: "Polygon",
	        coordinates: coordinates,
	    };
	    return feature(geom, properties, options);
	}
	exports.polygon = polygon;
	/**
	 * Creates a {@link Polygon} {@link FeatureCollection} from an Array of Polygon coordinates.
	 *
	 * @name polygons
	 * @param {Array<Array<Array<Array<number>>>>} coordinates an array of Polygon coordinates
	 * @param {Object} [properties={}] an Object of key-value pairs to add as properties
	 * @param {Object} [options={}] Optional Parameters
	 * @param {Array<number>} [options.bbox] Bounding Box Array [west, south, east, north] associated with the Feature
	 * @param {string|number} [options.id] Identifier associated with the FeatureCollection
	 * @returns {FeatureCollection<Polygon>} Polygon FeatureCollection
	 * @example
	 * var polygons = turf.polygons([
	 *   [[[-5, 52], [-4, 56], [-2, 51], [-7, 54], [-5, 52]]],
	 *   [[[-15, 42], [-14, 46], [-12, 41], [-17, 44], [-15, 42]]],
	 * ]);
	 *
	 * //=polygons
	 */
	function polygons(coordinates, properties, options) {
	    if (options === void 0) { options = {}; }
	    return featureCollection(coordinates.map(function (coords) {
	        return polygon(coords, properties);
	    }), options);
	}
	exports.polygons = polygons;
	/**
	 * Creates a {@link LineString} {@link Feature} from an Array of Positions.
	 *
	 * @name lineString
	 * @param {Array<Array<number>>} coordinates an array of Positions
	 * @param {Object} [properties={}] an Object of key-value pairs to add as properties
	 * @param {Object} [options={}] Optional Parameters
	 * @param {Array<number>} [options.bbox] Bounding Box Array [west, south, east, north] associated with the Feature
	 * @param {string|number} [options.id] Identifier associated with the Feature
	 * @returns {Feature<LineString>} LineString Feature
	 * @example
	 * var linestring1 = turf.lineString([[-24, 63], [-23, 60], [-25, 65], [-20, 69]], {name: 'line 1'});
	 * var linestring2 = turf.lineString([[-14, 43], [-13, 40], [-15, 45], [-10, 49]], {name: 'line 2'});
	 *
	 * //=linestring1
	 * //=linestring2
	 */
	function lineString(coordinates, properties, options) {
	    if (options === void 0) { options = {}; }
	    if (coordinates.length < 2) {
	        throw new Error("coordinates must be an array of two or more positions");
	    }
	    var geom = {
	        type: "LineString",
	        coordinates: coordinates,
	    };
	    return feature(geom, properties, options);
	}
	exports.lineString = lineString;
	/**
	 * Creates a {@link LineString} {@link FeatureCollection} from an Array of LineString coordinates.
	 *
	 * @name lineStrings
	 * @param {Array<Array<Array<number>>>} coordinates an array of LinearRings
	 * @param {Object} [properties={}] an Object of key-value pairs to add as properties
	 * @param {Object} [options={}] Optional Parameters
	 * @param {Array<number>} [options.bbox] Bounding Box Array [west, south, east, north]
	 * associated with the FeatureCollection
	 * @param {string|number} [options.id] Identifier associated with the FeatureCollection
	 * @returns {FeatureCollection<LineString>} LineString FeatureCollection
	 * @example
	 * var linestrings = turf.lineStrings([
	 *   [[-24, 63], [-23, 60], [-25, 65], [-20, 69]],
	 *   [[-14, 43], [-13, 40], [-15, 45], [-10, 49]]
	 * ]);
	 *
	 * //=linestrings
	 */
	function lineStrings(coordinates, properties, options) {
	    if (options === void 0) { options = {}; }
	    return featureCollection(coordinates.map(function (coords) {
	        return lineString(coords, properties);
	    }), options);
	}
	exports.lineStrings = lineStrings;
	/**
	 * Takes one or more {@link Feature|Features} and creates a {@link FeatureCollection}.
	 *
	 * @name featureCollection
	 * @param {Feature[]} features input features
	 * @param {Object} [options={}] Optional Parameters
	 * @param {Array<number>} [options.bbox] Bounding Box Array [west, south, east, north] associated with the Feature
	 * @param {string|number} [options.id] Identifier associated with the Feature
	 * @returns {FeatureCollection} FeatureCollection of Features
	 * @example
	 * var locationA = turf.point([-75.343, 39.984], {name: 'Location A'});
	 * var locationB = turf.point([-75.833, 39.284], {name: 'Location B'});
	 * var locationC = turf.point([-75.534, 39.123], {name: 'Location C'});
	 *
	 * var collection = turf.featureCollection([
	 *   locationA,
	 *   locationB,
	 *   locationC
	 * ]);
	 *
	 * //=collection
	 */
	function featureCollection(features, options) {
	    if (options === void 0) { options = {}; }
	    var fc = { type: "FeatureCollection" };
	    if (options.id) {
	        fc.id = options.id;
	    }
	    if (options.bbox) {
	        fc.bbox = options.bbox;
	    }
	    fc.features = features;
	    return fc;
	}
	exports.featureCollection = featureCollection;
	/**
	 * Creates a {@link Feature<MultiLineString>} based on a
	 * coordinate array. Properties can be added optionally.
	 *
	 * @name multiLineString
	 * @param {Array<Array<Array<number>>>} coordinates an array of LineStrings
	 * @param {Object} [properties={}] an Object of key-value pairs to add as properties
	 * @param {Object} [options={}] Optional Parameters
	 * @param {Array<number>} [options.bbox] Bounding Box Array [west, south, east, north] associated with the Feature
	 * @param {string|number} [options.id] Identifier associated with the Feature
	 * @returns {Feature<MultiLineString>} a MultiLineString feature
	 * @throws {Error} if no coordinates are passed
	 * @example
	 * var multiLine = turf.multiLineString([[[0,0],[10,10]]]);
	 *
	 * //=multiLine
	 */
	function multiLineString(coordinates, properties, options) {
	    if (options === void 0) { options = {}; }
	    var geom = {
	        type: "MultiLineString",
	        coordinates: coordinates,
	    };
	    return feature(geom, properties, options);
	}
	exports.multiLineString = multiLineString;
	/**
	 * Creates a {@link Feature<MultiPoint>} based on a
	 * coordinate array. Properties can be added optionally.
	 *
	 * @name multiPoint
	 * @param {Array<Array<number>>} coordinates an array of Positions
	 * @param {Object} [properties={}] an Object of key-value pairs to add as properties
	 * @param {Object} [options={}] Optional Parameters
	 * @param {Array<number>} [options.bbox] Bounding Box Array [west, south, east, north] associated with the Feature
	 * @param {string|number} [options.id] Identifier associated with the Feature
	 * @returns {Feature<MultiPoint>} a MultiPoint feature
	 * @throws {Error} if no coordinates are passed
	 * @example
	 * var multiPt = turf.multiPoint([[0,0],[10,10]]);
	 *
	 * //=multiPt
	 */
	function multiPoint(coordinates, properties, options) {
	    if (options === void 0) { options = {}; }
	    var geom = {
	        type: "MultiPoint",
	        coordinates: coordinates,
	    };
	    return feature(geom, properties, options);
	}
	exports.multiPoint = multiPoint;
	/**
	 * Creates a {@link Feature<MultiPolygon>} based on a
	 * coordinate array. Properties can be added optionally.
	 *
	 * @name multiPolygon
	 * @param {Array<Array<Array<Array<number>>>>} coordinates an array of Polygons
	 * @param {Object} [properties={}] an Object of key-value pairs to add as properties
	 * @param {Object} [options={}] Optional Parameters
	 * @param {Array<number>} [options.bbox] Bounding Box Array [west, south, east, north] associated with the Feature
	 * @param {string|number} [options.id] Identifier associated with the Feature
	 * @returns {Feature<MultiPolygon>} a multipolygon feature
	 * @throws {Error} if no coordinates are passed
	 * @example
	 * var multiPoly = turf.multiPolygon([[[[0,0],[0,10],[10,10],[10,0],[0,0]]]]);
	 *
	 * //=multiPoly
	 *
	 */
	function multiPolygon(coordinates, properties, options) {
	    if (options === void 0) { options = {}; }
	    var geom = {
	        type: "MultiPolygon",
	        coordinates: coordinates,
	    };
	    return feature(geom, properties, options);
	}
	exports.multiPolygon = multiPolygon;
	/**
	 * Creates a {@link Feature<GeometryCollection>} based on a
	 * coordinate array. Properties can be added optionally.
	 *
	 * @name geometryCollection
	 * @param {Array<Geometry>} geometries an array of GeoJSON Geometries
	 * @param {Object} [properties={}] an Object of key-value pairs to add as properties
	 * @param {Object} [options={}] Optional Parameters
	 * @param {Array<number>} [options.bbox] Bounding Box Array [west, south, east, north] associated with the Feature
	 * @param {string|number} [options.id] Identifier associated with the Feature
	 * @returns {Feature<GeometryCollection>} a GeoJSON GeometryCollection Feature
	 * @example
	 * var pt = turf.geometry("Point", [100, 0]);
	 * var line = turf.geometry("LineString", [[101, 0], [102, 1]]);
	 * var collection = turf.geometryCollection([pt, line]);
	 *
	 * // => collection
	 */
	function geometryCollection(geometries, properties, options) {
	    if (options === void 0) { options = {}; }
	    var geom = {
	        type: "GeometryCollection",
	        geometries: geometries,
	    };
	    return feature(geom, properties, options);
	}
	exports.geometryCollection = geometryCollection;
	/**
	 * Round number to precision
	 *
	 * @param {number} num Number
	 * @param {number} [precision=0] Precision
	 * @returns {number} rounded number
	 * @example
	 * turf.round(120.4321)
	 * //=120
	 *
	 * turf.round(120.4321, 2)
	 * //=120.43
	 */
	function round(num, precision) {
	    if (precision === void 0) { precision = 0; }
	    if (precision && !(precision >= 0)) {
	        throw new Error("precision must be a positive number");
	    }
	    var multiplier = Math.pow(10, precision || 0);
	    return Math.round(num * multiplier) / multiplier;
	}
	exports.round = round;
	/**
	 * Convert a distance measurement (assuming a spherical Earth) from radians to a more friendly unit.
	 * Valid units: miles, nauticalmiles, inches, yards, meters, metres, kilometers, centimeters, feet
	 *
	 * @name radiansToLength
	 * @param {number} radians in radians across the sphere
	 * @param {string} [units="kilometers"] can be degrees, radians, miles, or kilometers inches, yards, metres,
	 * meters, kilometres, kilometers.
	 * @returns {number} distance
	 */
	function radiansToLength(radians, units) {
	    if (units === void 0) { units = "kilometers"; }
	    var factor = exports.factors[units];
	    if (!factor) {
	        throw new Error(units + " units is invalid");
	    }
	    return radians * factor;
	}
	exports.radiansToLength = radiansToLength;
	/**
	 * Convert a distance measurement (assuming a spherical Earth) from a real-world unit into radians
	 * Valid units: miles, nauticalmiles, inches, yards, meters, metres, kilometers, centimeters, feet
	 *
	 * @name lengthToRadians
	 * @param {number} distance in real units
	 * @param {string} [units="kilometers"] can be degrees, radians, miles, or kilometers inches, yards, metres,
	 * meters, kilometres, kilometers.
	 * @returns {number} radians
	 */
	function lengthToRadians(distance, units) {
	    if (units === void 0) { units = "kilometers"; }
	    var factor = exports.factors[units];
	    if (!factor) {
	        throw new Error(units + " units is invalid");
	    }
	    return distance / factor;
	}
	exports.lengthToRadians = lengthToRadians;
	/**
	 * Convert a distance measurement (assuming a spherical Earth) from a real-world unit into degrees
	 * Valid units: miles, nauticalmiles, inches, yards, meters, metres, centimeters, kilometres, feet
	 *
	 * @name lengthToDegrees
	 * @param {number} distance in real units
	 * @param {string} [units="kilometers"] can be degrees, radians, miles, or kilometers inches, yards, metres,
	 * meters, kilometres, kilometers.
	 * @returns {number} degrees
	 */
	function lengthToDegrees(distance, units) {
	    return radiansToDegrees(lengthToRadians(distance, units));
	}
	exports.lengthToDegrees = lengthToDegrees;
	/**
	 * Converts any bearing angle from the north line direction (positive clockwise)
	 * and returns an angle between 0-360 degrees (positive clockwise), 0 being the north line
	 *
	 * @name bearingToAzimuth
	 * @param {number} bearing angle, between -180 and +180 degrees
	 * @returns {number} angle between 0 and 360 degrees
	 */
	function bearingToAzimuth(bearing) {
	    var angle = bearing % 360;
	    if (angle < 0) {
	        angle += 360;
	    }
	    return angle;
	}
	exports.bearingToAzimuth = bearingToAzimuth;
	/**
	 * Converts an angle in radians to degrees
	 *
	 * @name radiansToDegrees
	 * @param {number} radians angle in radians
	 * @returns {number} degrees between 0 and 360 degrees
	 */
	function radiansToDegrees(radians) {
	    var degrees = radians % (2 * Math.PI);
	    return degrees * 180 / Math.PI;
	}
	exports.radiansToDegrees = radiansToDegrees;
	/**
	 * Converts an angle in degrees to radians
	 *
	 * @name degreesToRadians
	 * @param {number} degrees angle between 0 and 360 degrees
	 * @returns {number} angle in radians
	 */
	function degreesToRadians(degrees) {
	    var radians = degrees % 360;
	    return radians * Math.PI / 180;
	}
	exports.degreesToRadians = degreesToRadians;
	/**
	 * Converts a length to the requested unit.
	 * Valid units: miles, nauticalmiles, inches, yards, meters, metres, kilometers, centimeters, feet
	 *
	 * @param {number} length to be converted
	 * @param {Units} [originalUnit="kilometers"] of the length
	 * @param {Units} [finalUnit="kilometers"] returned unit
	 * @returns {number} the converted length
	 */
	function convertLength(length, originalUnit, finalUnit) {
	    if (originalUnit === void 0) { originalUnit = "kilometers"; }
	    if (finalUnit === void 0) { finalUnit = "kilometers"; }
	    if (!(length >= 0)) {
	        throw new Error("length must be a positive number");
	    }
	    return radiansToLength(lengthToRadians(length, originalUnit), finalUnit);
	}
	exports.convertLength = convertLength;
	/**
	 * Converts a area to the requested unit.
	 * Valid units: kilometers, kilometres, meters, metres, centimetres, millimeters, acres, miles, yards, feet, inches
	 * @param {number} area to be converted
	 * @param {Units} [originalUnit="meters"] of the distance
	 * @param {Units} [finalUnit="kilometers"] returned unit
	 * @returns {number} the converted distance
	 */
	function convertArea(area, originalUnit, finalUnit) {
	    if (originalUnit === void 0) { originalUnit = "meters"; }
	    if (finalUnit === void 0) { finalUnit = "kilometers"; }
	    if (!(area >= 0)) {
	        throw new Error("area must be a positive number");
	    }
	    var startFactor = exports.areaFactors[originalUnit];
	    if (!startFactor) {
	        throw new Error("invalid original units");
	    }
	    var finalFactor = exports.areaFactors[finalUnit];
	    if (!finalFactor) {
	        throw new Error("invalid final units");
	    }
	    return (area / startFactor) * finalFactor;
	}
	exports.convertArea = convertArea;
	/**
	 * isNumber
	 *
	 * @param {*} num Number to validate
	 * @returns {boolean} true/false
	 * @example
	 * turf.isNumber(123)
	 * //=true
	 * turf.isNumber('foo')
	 * //=false
	 */
	function isNumber(num) {
	    return !isNaN(num) && num !== null && !Array.isArray(num) && !/^\s*$/.test(num);
	}
	exports.isNumber = isNumber;
	/**
	 * isObject
	 *
	 * @param {*} input variable to validate
	 * @returns {boolean} true/false
	 * @example
	 * turf.isObject({elevation: 10})
	 * //=true
	 * turf.isObject('foo')
	 * //=false
	 */
	function isObject(input) {
	    return (!!input) && (input.constructor === Object);
	}
	exports.isObject = isObject;
	/**
	 * Validate BBox
	 *
	 * @private
	 * @param {Array<number>} bbox BBox to validate
	 * @returns {void}
	 * @throws Error if BBox is not valid
	 * @example
	 * validateBBox([-180, -40, 110, 50])
	 * //=OK
	 * validateBBox([-180, -40])
	 * //=Error
	 * validateBBox('Foo')
	 * //=Error
	 * validateBBox(5)
	 * //=Error
	 * validateBBox(null)
	 * //=Error
	 * validateBBox(undefined)
	 * //=Error
	 */
	function validateBBox(bbox) {
	    if (!bbox) {
	        throw new Error("bbox is required");
	    }
	    if (!Array.isArray(bbox)) {
	        throw new Error("bbox must be an Array");
	    }
	    if (bbox.length !== 4 && bbox.length !== 6) {
	        throw new Error("bbox must be an Array of 4 or 6 numbers");
	    }
	    bbox.forEach(function (num) {
	        if (!isNumber(num)) {
	            throw new Error("bbox must only contain numbers");
	        }
	    });
	}
	exports.validateBBox = validateBBox;
	/**
	 * Validate Id
	 *
	 * @private
	 * @param {string|number} id Id to validate
	 * @returns {void}
	 * @throws Error if Id is not valid
	 * @example
	 * validateId([-180, -40, 110, 50])
	 * //=Error
	 * validateId([-180, -40])
	 * //=Error
	 * validateId('Foo')
	 * //=OK
	 * validateId(5)
	 * //=OK
	 * validateId(null)
	 * //=Error
	 * validateId(undefined)
	 * //=Error
	 */
	function validateId(id) {
	    if (!id) {
	        throw new Error("id is required");
	    }
	    if (["string", "number"].indexOf(typeof id) === -1) {
	        throw new Error("id must be a number or a string");
	    }
	}
	exports.validateId = validateId;
	// Deprecated methods
	function radians2degrees() {
	    throw new Error("method has been renamed to `radiansToDegrees`");
	}
	exports.radians2degrees = radians2degrees;
	function degrees2radians() {
	    throw new Error("method has been renamed to `degreesToRadians`");
	}
	exports.degrees2radians = degrees2radians;
	function distanceToDegrees() {
	    throw new Error("method has been renamed to `lengthToDegrees`");
	}
	exports.distanceToDegrees = distanceToDegrees;
	function distanceToRadians() {
	    throw new Error("method has been renamed to `lengthToRadians`");
	}
	exports.distanceToRadians = distanceToRadians;
	function radiansToDistance() {
	    throw new Error("method has been renamed to `radiansToLength`");
	}
	exports.radiansToDistance = radiansToDistance;
	function bearingToAngle() {
	    throw new Error("method has been renamed to `bearingToAzimuth`");
	}
	exports.bearingToAngle = bearingToAngle;
	function convertDistance() {
	    throw new Error("method has been renamed to `convertLength`");
	}
	exports.convertDistance = convertDistance;
	});

	unwrapExports(helpers);
	var helpers_1 = helpers.earthRadius;
	var helpers_2 = helpers.factors;
	var helpers_3 = helpers.unitsFactors;
	var helpers_4 = helpers.areaFactors;
	var helpers_5 = helpers.feature;
	var helpers_6 = helpers.geometry;
	var helpers_7 = helpers.point;
	var helpers_8 = helpers.points;
	var helpers_9 = helpers.polygon;
	var helpers_10 = helpers.polygons;
	var helpers_11 = helpers.lineString;
	var helpers_12 = helpers.lineStrings;
	var helpers_13 = helpers.featureCollection;
	var helpers_14 = helpers.multiLineString;
	var helpers_15 = helpers.multiPoint;
	var helpers_16 = helpers.multiPolygon;
	var helpers_17 = helpers.geometryCollection;
	var helpers_18 = helpers.round;
	var helpers_19 = helpers.radiansToLength;
	var helpers_20 = helpers.lengthToRadians;
	var helpers_21 = helpers.lengthToDegrees;
	var helpers_22 = helpers.bearingToAzimuth;
	var helpers_23 = helpers.radiansToDegrees;
	var helpers_24 = helpers.degreesToRadians;
	var helpers_25 = helpers.convertLength;
	var helpers_26 = helpers.convertArea;
	var helpers_27 = helpers.isNumber;
	var helpers_28 = helpers.isObject;
	var helpers_29 = helpers.validateBBox;
	var helpers_30 = helpers.validateId;
	var helpers_31 = helpers.radians2degrees;
	var helpers_32 = helpers.degrees2radians;
	var helpers_33 = helpers.distanceToDegrees;
	var helpers_34 = helpers.distanceToRadians;
	var helpers_35 = helpers.radiansToDistance;
	var helpers_36 = helpers.bearingToAngle;
	var helpers_37 = helpers.convertDistance;

	var meta = createCommonjsModule(function (module, exports) {

	Object.defineProperty(exports, '__esModule', { value: true });



	/**
	 * Callback for coordEach
	 *
	 * @callback coordEachCallback
	 * @param {Array<number>} currentCoord The current coordinate being processed.
	 * @param {number} coordIndex The current index of the coordinate being processed.
	 * @param {number} featureIndex The current index of the Feature being processed.
	 * @param {number} multiFeatureIndex The current index of the Multi-Feature being processed.
	 * @param {number} geometryIndex The current index of the Geometry being processed.
	 */

	/**
	 * Iterate over coordinates in any GeoJSON object, similar to Array.forEach()
	 *
	 * @name coordEach
	 * @param {FeatureCollection|Feature|Geometry} geojson any GeoJSON object
	 * @param {Function} callback a method that takes (currentCoord, coordIndex, featureIndex, multiFeatureIndex)
	 * @param {boolean} [excludeWrapCoord=false] whether or not to include the final coordinate of LinearRings that wraps the ring in its iteration.
	 * @returns {void}
	 * @example
	 * var features = turf.featureCollection([
	 *   turf.point([26, 37], {"foo": "bar"}),
	 *   turf.point([36, 53], {"hello": "world"})
	 * ]);
	 *
	 * turf.coordEach(features, function (currentCoord, coordIndex, featureIndex, multiFeatureIndex, geometryIndex) {
	 *   //=currentCoord
	 *   //=coordIndex
	 *   //=featureIndex
	 *   //=multiFeatureIndex
	 *   //=geometryIndex
	 * });
	 */
	function coordEach(geojson, callback, excludeWrapCoord) {
	    // Handles null Geometry -- Skips this GeoJSON
	    if (geojson === null) return;
	    var j, k, l, geometry, stopG, coords,
	        geometryMaybeCollection,
	        wrapShrink = 0,
	        coordIndex = 0,
	        isGeometryCollection,
	        type = geojson.type,
	        isFeatureCollection = type === 'FeatureCollection',
	        isFeature = type === 'Feature',
	        stop = isFeatureCollection ? geojson.features.length : 1;

	    // This logic may look a little weird. The reason why it is that way
	    // is because it's trying to be fast. GeoJSON supports multiple kinds
	    // of objects at its root: FeatureCollection, Features, Geometries.
	    // This function has the responsibility of handling all of them, and that
	    // means that some of the `for` loops you see below actually just don't apply
	    // to certain inputs. For instance, if you give this just a
	    // Point geometry, then both loops are short-circuited and all we do
	    // is gradually rename the input until it's called 'geometry'.
	    //
	    // This also aims to allocate as few resources as possible: just a
	    // few numbers and booleans, rather than any temporary arrays as would
	    // be required with the normalization approach.
	    for (var featureIndex = 0; featureIndex < stop; featureIndex++) {
	        geometryMaybeCollection = (isFeatureCollection ? geojson.features[featureIndex].geometry :
	            (isFeature ? geojson.geometry : geojson));
	        isGeometryCollection = (geometryMaybeCollection) ? geometryMaybeCollection.type === 'GeometryCollection' : false;
	        stopG = isGeometryCollection ? geometryMaybeCollection.geometries.length : 1;

	        for (var geomIndex = 0; geomIndex < stopG; geomIndex++) {
	            var multiFeatureIndex = 0;
	            var geometryIndex = 0;
	            geometry = isGeometryCollection ?
	                geometryMaybeCollection.geometries[geomIndex] : geometryMaybeCollection;

	            // Handles null Geometry -- Skips this geometry
	            if (geometry === null) continue;
	            coords = geometry.coordinates;
	            var geomType = geometry.type;

	            wrapShrink = (excludeWrapCoord && (geomType === 'Polygon' || geomType === 'MultiPolygon')) ? 1 : 0;

	            switch (geomType) {
	            case null:
	                break;
	            case 'Point':
	                if (callback(coords, coordIndex, featureIndex, multiFeatureIndex, geometryIndex) === false) return false;
	                coordIndex++;
	                multiFeatureIndex++;
	                break;
	            case 'LineString':
	            case 'MultiPoint':
	                for (j = 0; j < coords.length; j++) {
	                    if (callback(coords[j], coordIndex, featureIndex, multiFeatureIndex, geometryIndex) === false) return false;
	                    coordIndex++;
	                    if (geomType === 'MultiPoint') multiFeatureIndex++;
	                }
	                if (geomType === 'LineString') multiFeatureIndex++;
	                break;
	            case 'Polygon':
	            case 'MultiLineString':
	                for (j = 0; j < coords.length; j++) {
	                    for (k = 0; k < coords[j].length - wrapShrink; k++) {
	                        if (callback(coords[j][k], coordIndex, featureIndex, multiFeatureIndex, geometryIndex) === false) return false;
	                        coordIndex++;
	                    }
	                    if (geomType === 'MultiLineString') multiFeatureIndex++;
	                    if (geomType === 'Polygon') geometryIndex++;
	                }
	                if (geomType === 'Polygon') multiFeatureIndex++;
	                break;
	            case 'MultiPolygon':
	                for (j = 0; j < coords.length; j++) {
	                    geometryIndex = 0;
	                    for (k = 0; k < coords[j].length; k++) {
	                        for (l = 0; l < coords[j][k].length - wrapShrink; l++) {
	                            if (callback(coords[j][k][l], coordIndex, featureIndex, multiFeatureIndex, geometryIndex) === false) return false;
	                            coordIndex++;
	                        }
	                        geometryIndex++;
	                    }
	                    multiFeatureIndex++;
	                }
	                break;
	            case 'GeometryCollection':
	                for (j = 0; j < geometry.geometries.length; j++)
	                    if (coordEach(geometry.geometries[j], callback, excludeWrapCoord) === false) return false;
	                break;
	            default:
	                throw new Error('Unknown Geometry Type');
	            }
	        }
	    }
	}

	/**
	 * Callback for coordReduce
	 *
	 * The first time the callback function is called, the values provided as arguments depend
	 * on whether the reduce method has an initialValue argument.
	 *
	 * If an initialValue is provided to the reduce method:
	 *  - The previousValue argument is initialValue.
	 *  - The currentValue argument is the value of the first element present in the array.
	 *
	 * If an initialValue is not provided:
	 *  - The previousValue argument is the value of the first element present in the array.
	 *  - The currentValue argument is the value of the second element present in the array.
	 *
	 * @callback coordReduceCallback
	 * @param {*} previousValue The accumulated value previously returned in the last invocation
	 * of the callback, or initialValue, if supplied.
	 * @param {Array<number>} currentCoord The current coordinate being processed.
	 * @param {number} coordIndex The current index of the coordinate being processed.
	 * Starts at index 0, if an initialValue is provided, and at index 1 otherwise.
	 * @param {number} featureIndex The current index of the Feature being processed.
	 * @param {number} multiFeatureIndex The current index of the Multi-Feature being processed.
	 * @param {number} geometryIndex The current index of the Geometry being processed.
	 */

	/**
	 * Reduce coordinates in any GeoJSON object, similar to Array.reduce()
	 *
	 * @name coordReduce
	 * @param {FeatureCollection|Geometry|Feature} geojson any GeoJSON object
	 * @param {Function} callback a method that takes (previousValue, currentCoord, coordIndex)
	 * @param {*} [initialValue] Value to use as the first argument to the first call of the callback.
	 * @param {boolean} [excludeWrapCoord=false] whether or not to include the final coordinate of LinearRings that wraps the ring in its iteration.
	 * @returns {*} The value that results from the reduction.
	 * @example
	 * var features = turf.featureCollection([
	 *   turf.point([26, 37], {"foo": "bar"}),
	 *   turf.point([36, 53], {"hello": "world"})
	 * ]);
	 *
	 * turf.coordReduce(features, function (previousValue, currentCoord, coordIndex, featureIndex, multiFeatureIndex, geometryIndex) {
	 *   //=previousValue
	 *   //=currentCoord
	 *   //=coordIndex
	 *   //=featureIndex
	 *   //=multiFeatureIndex
	 *   //=geometryIndex
	 *   return currentCoord;
	 * });
	 */
	function coordReduce(geojson, callback, initialValue, excludeWrapCoord) {
	    var previousValue = initialValue;
	    coordEach(geojson, function (currentCoord, coordIndex, featureIndex, multiFeatureIndex, geometryIndex) {
	        if (coordIndex === 0 && initialValue === undefined) previousValue = currentCoord;
	        else previousValue = callback(previousValue, currentCoord, coordIndex, featureIndex, multiFeatureIndex, geometryIndex);
	    }, excludeWrapCoord);
	    return previousValue;
	}

	/**
	 * Callback for propEach
	 *
	 * @callback propEachCallback
	 * @param {Object} currentProperties The current Properties being processed.
	 * @param {number} featureIndex The current index of the Feature being processed.
	 */

	/**
	 * Iterate over properties in any GeoJSON object, similar to Array.forEach()
	 *
	 * @name propEach
	 * @param {FeatureCollection|Feature} geojson any GeoJSON object
	 * @param {Function} callback a method that takes (currentProperties, featureIndex)
	 * @returns {void}
	 * @example
	 * var features = turf.featureCollection([
	 *     turf.point([26, 37], {foo: 'bar'}),
	 *     turf.point([36, 53], {hello: 'world'})
	 * ]);
	 *
	 * turf.propEach(features, function (currentProperties, featureIndex) {
	 *   //=currentProperties
	 *   //=featureIndex
	 * });
	 */
	function propEach(geojson, callback) {
	    var i;
	    switch (geojson.type) {
	    case 'FeatureCollection':
	        for (i = 0; i < geojson.features.length; i++) {
	            if (callback(geojson.features[i].properties, i) === false) break;
	        }
	        break;
	    case 'Feature':
	        callback(geojson.properties, 0);
	        break;
	    }
	}


	/**
	 * Callback for propReduce
	 *
	 * The first time the callback function is called, the values provided as arguments depend
	 * on whether the reduce method has an initialValue argument.
	 *
	 * If an initialValue is provided to the reduce method:
	 *  - The previousValue argument is initialValue.
	 *  - The currentValue argument is the value of the first element present in the array.
	 *
	 * If an initialValue is not provided:
	 *  - The previousValue argument is the value of the first element present in the array.
	 *  - The currentValue argument is the value of the second element present in the array.
	 *
	 * @callback propReduceCallback
	 * @param {*} previousValue The accumulated value previously returned in the last invocation
	 * of the callback, or initialValue, if supplied.
	 * @param {*} currentProperties The current Properties being processed.
	 * @param {number} featureIndex The current index of the Feature being processed.
	 */

	/**
	 * Reduce properties in any GeoJSON object into a single value,
	 * similar to how Array.reduce works. However, in this case we lazily run
	 * the reduction, so an array of all properties is unnecessary.
	 *
	 * @name propReduce
	 * @param {FeatureCollection|Feature} geojson any GeoJSON object
	 * @param {Function} callback a method that takes (previousValue, currentProperties, featureIndex)
	 * @param {*} [initialValue] Value to use as the first argument to the first call of the callback.
	 * @returns {*} The value that results from the reduction.
	 * @example
	 * var features = turf.featureCollection([
	 *     turf.point([26, 37], {foo: 'bar'}),
	 *     turf.point([36, 53], {hello: 'world'})
	 * ]);
	 *
	 * turf.propReduce(features, function (previousValue, currentProperties, featureIndex) {
	 *   //=previousValue
	 *   //=currentProperties
	 *   //=featureIndex
	 *   return currentProperties
	 * });
	 */
	function propReduce(geojson, callback, initialValue) {
	    var previousValue = initialValue;
	    propEach(geojson, function (currentProperties, featureIndex) {
	        if (featureIndex === 0 && initialValue === undefined) previousValue = currentProperties;
	        else previousValue = callback(previousValue, currentProperties, featureIndex);
	    });
	    return previousValue;
	}

	/**
	 * Callback for featureEach
	 *
	 * @callback featureEachCallback
	 * @param {Feature<any>} currentFeature The current Feature being processed.
	 * @param {number} featureIndex The current index of the Feature being processed.
	 */

	/**
	 * Iterate over features in any GeoJSON object, similar to
	 * Array.forEach.
	 *
	 * @name featureEach
	 * @param {FeatureCollection|Feature|Geometry} geojson any GeoJSON object
	 * @param {Function} callback a method that takes (currentFeature, featureIndex)
	 * @returns {void}
	 * @example
	 * var features = turf.featureCollection([
	 *   turf.point([26, 37], {foo: 'bar'}),
	 *   turf.point([36, 53], {hello: 'world'})
	 * ]);
	 *
	 * turf.featureEach(features, function (currentFeature, featureIndex) {
	 *   //=currentFeature
	 *   //=featureIndex
	 * });
	 */
	function featureEach(geojson, callback) {
	    if (geojson.type === 'Feature') {
	        callback(geojson, 0);
	    } else if (geojson.type === 'FeatureCollection') {
	        for (var i = 0; i < geojson.features.length; i++) {
	            if (callback(geojson.features[i], i) === false) break;
	        }
	    }
	}

	/**
	 * Callback for featureReduce
	 *
	 * The first time the callback function is called, the values provided as arguments depend
	 * on whether the reduce method has an initialValue argument.
	 *
	 * If an initialValue is provided to the reduce method:
	 *  - The previousValue argument is initialValue.
	 *  - The currentValue argument is the value of the first element present in the array.
	 *
	 * If an initialValue is not provided:
	 *  - The previousValue argument is the value of the first element present in the array.
	 *  - The currentValue argument is the value of the second element present in the array.
	 *
	 * @callback featureReduceCallback
	 * @param {*} previousValue The accumulated value previously returned in the last invocation
	 * of the callback, or initialValue, if supplied.
	 * @param {Feature} currentFeature The current Feature being processed.
	 * @param {number} featureIndex The current index of the Feature being processed.
	 */

	/**
	 * Reduce features in any GeoJSON object, similar to Array.reduce().
	 *
	 * @name featureReduce
	 * @param {FeatureCollection|Feature|Geometry} geojson any GeoJSON object
	 * @param {Function} callback a method that takes (previousValue, currentFeature, featureIndex)
	 * @param {*} [initialValue] Value to use as the first argument to the first call of the callback.
	 * @returns {*} The value that results from the reduction.
	 * @example
	 * var features = turf.featureCollection([
	 *   turf.point([26, 37], {"foo": "bar"}),
	 *   turf.point([36, 53], {"hello": "world"})
	 * ]);
	 *
	 * turf.featureReduce(features, function (previousValue, currentFeature, featureIndex) {
	 *   //=previousValue
	 *   //=currentFeature
	 *   //=featureIndex
	 *   return currentFeature
	 * });
	 */
	function featureReduce(geojson, callback, initialValue) {
	    var previousValue = initialValue;
	    featureEach(geojson, function (currentFeature, featureIndex) {
	        if (featureIndex === 0 && initialValue === undefined) previousValue = currentFeature;
	        else previousValue = callback(previousValue, currentFeature, featureIndex);
	    });
	    return previousValue;
	}

	/**
	 * Get all coordinates from any GeoJSON object.
	 *
	 * @name coordAll
	 * @param {FeatureCollection|Feature|Geometry} geojson any GeoJSON object
	 * @returns {Array<Array<number>>} coordinate position array
	 * @example
	 * var features = turf.featureCollection([
	 *   turf.point([26, 37], {foo: 'bar'}),
	 *   turf.point([36, 53], {hello: 'world'})
	 * ]);
	 *
	 * var coords = turf.coordAll(features);
	 * //= [[26, 37], [36, 53]]
	 */
	function coordAll(geojson) {
	    var coords = [];
	    coordEach(geojson, function (coord) {
	        coords.push(coord);
	    });
	    return coords;
	}

	/**
	 * Callback for geomEach
	 *
	 * @callback geomEachCallback
	 * @param {Geometry} currentGeometry The current Geometry being processed.
	 * @param {number} featureIndex The current index of the Feature being processed.
	 * @param {Object} featureProperties The current Feature Properties being processed.
	 * @param {Array<number>} featureBBox The current Feature BBox being processed.
	 * @param {number|string} featureId The current Feature Id being processed.
	 */

	/**
	 * Iterate over each geometry in any GeoJSON object, similar to Array.forEach()
	 *
	 * @name geomEach
	 * @param {FeatureCollection|Feature|Geometry} geojson any GeoJSON object
	 * @param {Function} callback a method that takes (currentGeometry, featureIndex, featureProperties, featureBBox, featureId)
	 * @returns {void}
	 * @example
	 * var features = turf.featureCollection([
	 *     turf.point([26, 37], {foo: 'bar'}),
	 *     turf.point([36, 53], {hello: 'world'})
	 * ]);
	 *
	 * turf.geomEach(features, function (currentGeometry, featureIndex, featureProperties, featureBBox, featureId) {
	 *   //=currentGeometry
	 *   //=featureIndex
	 *   //=featureProperties
	 *   //=featureBBox
	 *   //=featureId
	 * });
	 */
	function geomEach(geojson, callback) {
	    var i, j, g, geometry, stopG,
	        geometryMaybeCollection,
	        isGeometryCollection,
	        featureProperties,
	        featureBBox,
	        featureId,
	        featureIndex = 0,
	        isFeatureCollection = geojson.type === 'FeatureCollection',
	        isFeature = geojson.type === 'Feature',
	        stop = isFeatureCollection ? geojson.features.length : 1;

	    // This logic may look a little weird. The reason why it is that way
	    // is because it's trying to be fast. GeoJSON supports multiple kinds
	    // of objects at its root: FeatureCollection, Features, Geometries.
	    // This function has the responsibility of handling all of them, and that
	    // means that some of the `for` loops you see below actually just don't apply
	    // to certain inputs. For instance, if you give this just a
	    // Point geometry, then both loops are short-circuited and all we do
	    // is gradually rename the input until it's called 'geometry'.
	    //
	    // This also aims to allocate as few resources as possible: just a
	    // few numbers and booleans, rather than any temporary arrays as would
	    // be required with the normalization approach.
	    for (i = 0; i < stop; i++) {

	        geometryMaybeCollection = (isFeatureCollection ? geojson.features[i].geometry :
	            (isFeature ? geojson.geometry : geojson));
	        featureProperties = (isFeatureCollection ? geojson.features[i].properties :
	            (isFeature ? geojson.properties : {}));
	        featureBBox = (isFeatureCollection ? geojson.features[i].bbox :
	            (isFeature ? geojson.bbox : undefined));
	        featureId = (isFeatureCollection ? geojson.features[i].id :
	            (isFeature ? geojson.id : undefined));
	        isGeometryCollection = (geometryMaybeCollection) ? geometryMaybeCollection.type === 'GeometryCollection' : false;
	        stopG = isGeometryCollection ? geometryMaybeCollection.geometries.length : 1;

	        for (g = 0; g < stopG; g++) {
	            geometry = isGeometryCollection ?
	                geometryMaybeCollection.geometries[g] : geometryMaybeCollection;

	            // Handle null Geometry
	            if (geometry === null) {
	                if (callback(null, featureIndex, featureProperties, featureBBox, featureId) === false) return false;
	                continue;
	            }
	            switch (geometry.type) {
	            case 'Point':
	            case 'LineString':
	            case 'MultiPoint':
	            case 'Polygon':
	            case 'MultiLineString':
	            case 'MultiPolygon': {
	                if (callback(geometry, featureIndex, featureProperties, featureBBox, featureId) === false) return false;
	                break;
	            }
	            case 'GeometryCollection': {
	                for (j = 0; j < geometry.geometries.length; j++) {
	                    if (callback(geometry.geometries[j], featureIndex, featureProperties, featureBBox, featureId) === false) return false;
	                }
	                break;
	            }
	            default:
	                throw new Error('Unknown Geometry Type');
	            }
	        }
	        // Only increase `featureIndex` per each feature
	        featureIndex++;
	    }
	}

	/**
	 * Callback for geomReduce
	 *
	 * The first time the callback function is called, the values provided as arguments depend
	 * on whether the reduce method has an initialValue argument.
	 *
	 * If an initialValue is provided to the reduce method:
	 *  - The previousValue argument is initialValue.
	 *  - The currentValue argument is the value of the first element present in the array.
	 *
	 * If an initialValue is not provided:
	 *  - The previousValue argument is the value of the first element present in the array.
	 *  - The currentValue argument is the value of the second element present in the array.
	 *
	 * @callback geomReduceCallback
	 * @param {*} previousValue The accumulated value previously returned in the last invocation
	 * of the callback, or initialValue, if supplied.
	 * @param {Geometry} currentGeometry The current Geometry being processed.
	 * @param {number} featureIndex The current index of the Feature being processed.
	 * @param {Object} featureProperties The current Feature Properties being processed.
	 * @param {Array<number>} featureBBox The current Feature BBox being processed.
	 * @param {number|string} featureId The current Feature Id being processed.
	 */

	/**
	 * Reduce geometry in any GeoJSON object, similar to Array.reduce().
	 *
	 * @name geomReduce
	 * @param {FeatureCollection|Feature|Geometry} geojson any GeoJSON object
	 * @param {Function} callback a method that takes (previousValue, currentGeometry, featureIndex, featureProperties, featureBBox, featureId)
	 * @param {*} [initialValue] Value to use as the first argument to the first call of the callback.
	 * @returns {*} The value that results from the reduction.
	 * @example
	 * var features = turf.featureCollection([
	 *     turf.point([26, 37], {foo: 'bar'}),
	 *     turf.point([36, 53], {hello: 'world'})
	 * ]);
	 *
	 * turf.geomReduce(features, function (previousValue, currentGeometry, featureIndex, featureProperties, featureBBox, featureId) {
	 *   //=previousValue
	 *   //=currentGeometry
	 *   //=featureIndex
	 *   //=featureProperties
	 *   //=featureBBox
	 *   //=featureId
	 *   return currentGeometry
	 * });
	 */
	function geomReduce(geojson, callback, initialValue) {
	    var previousValue = initialValue;
	    geomEach(geojson, function (currentGeometry, featureIndex, featureProperties, featureBBox, featureId) {
	        if (featureIndex === 0 && initialValue === undefined) previousValue = currentGeometry;
	        else previousValue = callback(previousValue, currentGeometry, featureIndex, featureProperties, featureBBox, featureId);
	    });
	    return previousValue;
	}

	/**
	 * Callback for flattenEach
	 *
	 * @callback flattenEachCallback
	 * @param {Feature} currentFeature The current flattened feature being processed.
	 * @param {number} featureIndex The current index of the Feature being processed.
	 * @param {number} multiFeatureIndex The current index of the Multi-Feature being processed.
	 */

	/**
	 * Iterate over flattened features in any GeoJSON object, similar to
	 * Array.forEach.
	 *
	 * @name flattenEach
	 * @param {FeatureCollection|Feature|Geometry} geojson any GeoJSON object
	 * @param {Function} callback a method that takes (currentFeature, featureIndex, multiFeatureIndex)
	 * @example
	 * var features = turf.featureCollection([
	 *     turf.point([26, 37], {foo: 'bar'}),
	 *     turf.multiPoint([[40, 30], [36, 53]], {hello: 'world'})
	 * ]);
	 *
	 * turf.flattenEach(features, function (currentFeature, featureIndex, multiFeatureIndex) {
	 *   //=currentFeature
	 *   //=featureIndex
	 *   //=multiFeatureIndex
	 * });
	 */
	function flattenEach(geojson, callback) {
	    geomEach(geojson, function (geometry, featureIndex, properties, bbox, id) {
	        // Callback for single geometry
	        var type = (geometry === null) ? null : geometry.type;
	        switch (type) {
	        case null:
	        case 'Point':
	        case 'LineString':
	        case 'Polygon':
	            if (callback(helpers.feature(geometry, properties, {bbox: bbox, id: id}), featureIndex, 0) === false) return false;
	            return;
	        }

	        var geomType;

	        // Callback for multi-geometry
	        switch (type) {
	        case 'MultiPoint':
	            geomType = 'Point';
	            break;
	        case 'MultiLineString':
	            geomType = 'LineString';
	            break;
	        case 'MultiPolygon':
	            geomType = 'Polygon';
	            break;
	        }

	        for (var multiFeatureIndex = 0; multiFeatureIndex < geometry.coordinates.length; multiFeatureIndex++) {
	            var coordinate = geometry.coordinates[multiFeatureIndex];
	            var geom = {
	                type: geomType,
	                coordinates: coordinate
	            };
	            if (callback(helpers.feature(geom, properties), featureIndex, multiFeatureIndex) === false) return false;
	        }
	    });
	}

	/**
	 * Callback for flattenReduce
	 *
	 * The first time the callback function is called, the values provided as arguments depend
	 * on whether the reduce method has an initialValue argument.
	 *
	 * If an initialValue is provided to the reduce method:
	 *  - The previousValue argument is initialValue.
	 *  - The currentValue argument is the value of the first element present in the array.
	 *
	 * If an initialValue is not provided:
	 *  - The previousValue argument is the value of the first element present in the array.
	 *  - The currentValue argument is the value of the second element present in the array.
	 *
	 * @callback flattenReduceCallback
	 * @param {*} previousValue The accumulated value previously returned in the last invocation
	 * of the callback, or initialValue, if supplied.
	 * @param {Feature} currentFeature The current Feature being processed.
	 * @param {number} featureIndex The current index of the Feature being processed.
	 * @param {number} multiFeatureIndex The current index of the Multi-Feature being processed.
	 */

	/**
	 * Reduce flattened features in any GeoJSON object, similar to Array.reduce().
	 *
	 * @name flattenReduce
	 * @param {FeatureCollection|Feature|Geometry} geojson any GeoJSON object
	 * @param {Function} callback a method that takes (previousValue, currentFeature, featureIndex, multiFeatureIndex)
	 * @param {*} [initialValue] Value to use as the first argument to the first call of the callback.
	 * @returns {*} The value that results from the reduction.
	 * @example
	 * var features = turf.featureCollection([
	 *     turf.point([26, 37], {foo: 'bar'}),
	 *     turf.multiPoint([[40, 30], [36, 53]], {hello: 'world'})
	 * ]);
	 *
	 * turf.flattenReduce(features, function (previousValue, currentFeature, featureIndex, multiFeatureIndex) {
	 *   //=previousValue
	 *   //=currentFeature
	 *   //=featureIndex
	 *   //=multiFeatureIndex
	 *   return currentFeature
	 * });
	 */
	function flattenReduce(geojson, callback, initialValue) {
	    var previousValue = initialValue;
	    flattenEach(geojson, function (currentFeature, featureIndex, multiFeatureIndex) {
	        if (featureIndex === 0 && multiFeatureIndex === 0 && initialValue === undefined) previousValue = currentFeature;
	        else previousValue = callback(previousValue, currentFeature, featureIndex, multiFeatureIndex);
	    });
	    return previousValue;
	}

	/**
	 * Callback for segmentEach
	 *
	 * @callback segmentEachCallback
	 * @param {Feature<LineString>} currentSegment The current Segment being processed.
	 * @param {number} featureIndex The current index of the Feature being processed.
	 * @param {number} multiFeatureIndex The current index of the Multi-Feature being processed.
	 * @param {number} geometryIndex The current index of the Geometry being processed.
	 * @param {number} segmentIndex The current index of the Segment being processed.
	 * @returns {void}
	 */

	/**
	 * Iterate over 2-vertex line segment in any GeoJSON object, similar to Array.forEach()
	 * (Multi)Point geometries do not contain segments therefore they are ignored during this operation.
	 *
	 * @param {FeatureCollection|Feature|Geometry} geojson any GeoJSON
	 * @param {Function} callback a method that takes (currentSegment, featureIndex, multiFeatureIndex, geometryIndex, segmentIndex)
	 * @returns {void}
	 * @example
	 * var polygon = turf.polygon([[[-50, 5], [-40, -10], [-50, -10], [-40, 5], [-50, 5]]]);
	 *
	 * // Iterate over GeoJSON by 2-vertex segments
	 * turf.segmentEach(polygon, function (currentSegment, featureIndex, multiFeatureIndex, geometryIndex, segmentIndex) {
	 *   //=currentSegment
	 *   //=featureIndex
	 *   //=multiFeatureIndex
	 *   //=geometryIndex
	 *   //=segmentIndex
	 * });
	 *
	 * // Calculate the total number of segments
	 * var total = 0;
	 * turf.segmentEach(polygon, function () {
	 *     total++;
	 * });
	 */
	function segmentEach(geojson, callback) {
	    flattenEach(geojson, function (feature, featureIndex, multiFeatureIndex) {
	        var segmentIndex = 0;

	        // Exclude null Geometries
	        if (!feature.geometry) return;
	        // (Multi)Point geometries do not contain segments therefore they are ignored during this operation.
	        var type = feature.geometry.type;
	        if (type === 'Point' || type === 'MultiPoint') return;

	        // Generate 2-vertex line segments
	        var previousCoords;
	        var previousFeatureIndex = 0;
	        var previousMultiIndex = 0;
	        var prevGeomIndex = 0;
	        if (coordEach(feature, function (currentCoord, coordIndex, featureIndexCoord, multiPartIndexCoord, geometryIndex) {
	            // Simulating a meta.coordReduce() since `reduce` operations cannot be stopped by returning `false`
	            if (previousCoords === undefined || featureIndex > previousFeatureIndex || multiPartIndexCoord > previousMultiIndex || geometryIndex > prevGeomIndex) {
	                previousCoords = currentCoord;
	                previousFeatureIndex = featureIndex;
	                previousMultiIndex = multiPartIndexCoord;
	                prevGeomIndex = geometryIndex;
	                segmentIndex = 0;
	                return;
	            }
	            var currentSegment = helpers.lineString([previousCoords, currentCoord], feature.properties);
	            if (callback(currentSegment, featureIndex, multiFeatureIndex, geometryIndex, segmentIndex) === false) return false;
	            segmentIndex++;
	            previousCoords = currentCoord;
	        }) === false) return false;
	    });
	}

	/**
	 * Callback for segmentReduce
	 *
	 * The first time the callback function is called, the values provided as arguments depend
	 * on whether the reduce method has an initialValue argument.
	 *
	 * If an initialValue is provided to the reduce method:
	 *  - The previousValue argument is initialValue.
	 *  - The currentValue argument is the value of the first element present in the array.
	 *
	 * If an initialValue is not provided:
	 *  - The previousValue argument is the value of the first element present in the array.
	 *  - The currentValue argument is the value of the second element present in the array.
	 *
	 * @callback segmentReduceCallback
	 * @param {*} previousValue The accumulated value previously returned in the last invocation
	 * of the callback, or initialValue, if supplied.
	 * @param {Feature<LineString>} currentSegment The current Segment being processed.
	 * @param {number} featureIndex The current index of the Feature being processed.
	 * @param {number} multiFeatureIndex The current index of the Multi-Feature being processed.
	 * @param {number} geometryIndex The current index of the Geometry being processed.
	 * @param {number} segmentIndex The current index of the Segment being processed.
	 */

	/**
	 * Reduce 2-vertex line segment in any GeoJSON object, similar to Array.reduce()
	 * (Multi)Point geometries do not contain segments therefore they are ignored during this operation.
	 *
	 * @param {FeatureCollection|Feature|Geometry} geojson any GeoJSON
	 * @param {Function} callback a method that takes (previousValue, currentSegment, currentIndex)
	 * @param {*} [initialValue] Value to use as the first argument to the first call of the callback.
	 * @returns {void}
	 * @example
	 * var polygon = turf.polygon([[[-50, 5], [-40, -10], [-50, -10], [-40, 5], [-50, 5]]]);
	 *
	 * // Iterate over GeoJSON by 2-vertex segments
	 * turf.segmentReduce(polygon, function (previousSegment, currentSegment, featureIndex, multiFeatureIndex, geometryIndex, segmentIndex) {
	 *   //= previousSegment
	 *   //= currentSegment
	 *   //= featureIndex
	 *   //= multiFeatureIndex
	 *   //= geometryIndex
	 *   //= segmentInex
	 *   return currentSegment
	 * });
	 *
	 * // Calculate the total number of segments
	 * var initialValue = 0
	 * var total = turf.segmentReduce(polygon, function (previousValue) {
	 *     previousValue++;
	 *     return previousValue;
	 * }, initialValue);
	 */
	function segmentReduce(geojson, callback, initialValue) {
	    var previousValue = initialValue;
	    var started = false;
	    segmentEach(geojson, function (currentSegment, featureIndex, multiFeatureIndex, geometryIndex, segmentIndex) {
	        if (started === false && initialValue === undefined) previousValue = currentSegment;
	        else previousValue = callback(previousValue, currentSegment, featureIndex, multiFeatureIndex, geometryIndex, segmentIndex);
	        started = true;
	    });
	    return previousValue;
	}

	/**
	 * Callback for lineEach
	 *
	 * @callback lineEachCallback
	 * @param {Feature<LineString>} currentLine The current LineString|LinearRing being processed
	 * @param {number} featureIndex The current index of the Feature being processed
	 * @param {number} multiFeatureIndex The current index of the Multi-Feature being processed
	 * @param {number} geometryIndex The current index of the Geometry being processed
	 */

	/**
	 * Iterate over line or ring coordinates in LineString, Polygon, MultiLineString, MultiPolygon Features or Geometries,
	 * similar to Array.forEach.
	 *
	 * @name lineEach
	 * @param {Geometry|Feature<LineString|Polygon|MultiLineString|MultiPolygon>} geojson object
	 * @param {Function} callback a method that takes (currentLine, featureIndex, multiFeatureIndex, geometryIndex)
	 * @example
	 * var multiLine = turf.multiLineString([
	 *   [[26, 37], [35, 45]],
	 *   [[36, 53], [38, 50], [41, 55]]
	 * ]);
	 *
	 * turf.lineEach(multiLine, function (currentLine, featureIndex, multiFeatureIndex, geometryIndex) {
	 *   //=currentLine
	 *   //=featureIndex
	 *   //=multiFeatureIndex
	 *   //=geometryIndex
	 * });
	 */
	function lineEach(geojson, callback) {
	    // validation
	    if (!geojson) throw new Error('geojson is required');

	    flattenEach(geojson, function (feature, featureIndex, multiFeatureIndex) {
	        if (feature.geometry === null) return;
	        var type = feature.geometry.type;
	        var coords = feature.geometry.coordinates;
	        switch (type) {
	        case 'LineString':
	            if (callback(feature, featureIndex, multiFeatureIndex, 0, 0) === false) return false;
	            break;
	        case 'Polygon':
	            for (var geometryIndex = 0; geometryIndex < coords.length; geometryIndex++) {
	                if (callback(helpers.lineString(coords[geometryIndex], feature.properties), featureIndex, multiFeatureIndex, geometryIndex) === false) return false;
	            }
	            break;
	        }
	    });
	}

	/**
	 * Callback for lineReduce
	 *
	 * The first time the callback function is called, the values provided as arguments depend
	 * on whether the reduce method has an initialValue argument.
	 *
	 * If an initialValue is provided to the reduce method:
	 *  - The previousValue argument is initialValue.
	 *  - The currentValue argument is the value of the first element present in the array.
	 *
	 * If an initialValue is not provided:
	 *  - The previousValue argument is the value of the first element present in the array.
	 *  - The currentValue argument is the value of the second element present in the array.
	 *
	 * @callback lineReduceCallback
	 * @param {*} previousValue The accumulated value previously returned in the last invocation
	 * of the callback, or initialValue, if supplied.
	 * @param {Feature<LineString>} currentLine The current LineString|LinearRing being processed.
	 * @param {number} featureIndex The current index of the Feature being processed
	 * @param {number} multiFeatureIndex The current index of the Multi-Feature being processed
	 * @param {number} geometryIndex The current index of the Geometry being processed
	 */

	/**
	 * Reduce features in any GeoJSON object, similar to Array.reduce().
	 *
	 * @name lineReduce
	 * @param {Geometry|Feature<LineString|Polygon|MultiLineString|MultiPolygon>} geojson object
	 * @param {Function} callback a method that takes (previousValue, currentLine, featureIndex, multiFeatureIndex, geometryIndex)
	 * @param {*} [initialValue] Value to use as the first argument to the first call of the callback.
	 * @returns {*} The value that results from the reduction.
	 * @example
	 * var multiPoly = turf.multiPolygon([
	 *   turf.polygon([[[12,48],[2,41],[24,38],[12,48]], [[9,44],[13,41],[13,45],[9,44]]]),
	 *   turf.polygon([[[5, 5], [0, 0], [2, 2], [4, 4], [5, 5]]])
	 * ]);
	 *
	 * turf.lineReduce(multiPoly, function (previousValue, currentLine, featureIndex, multiFeatureIndex, geometryIndex) {
	 *   //=previousValue
	 *   //=currentLine
	 *   //=featureIndex
	 *   //=multiFeatureIndex
	 *   //=geometryIndex
	 *   return currentLine
	 * });
	 */
	function lineReduce(geojson, callback, initialValue) {
	    var previousValue = initialValue;
	    lineEach(geojson, function (currentLine, featureIndex, multiFeatureIndex, geometryIndex) {
	        if (featureIndex === 0 && initialValue === undefined) previousValue = currentLine;
	        else previousValue = callback(previousValue, currentLine, featureIndex, multiFeatureIndex, geometryIndex);
	    });
	    return previousValue;
	}

	/**
	 * Finds a particular 2-vertex LineString Segment from a GeoJSON using `@turf/meta` indexes.
	 *
	 * Negative indexes are permitted.
	 * Point & MultiPoint will always return null.
	 *
	 * @param {FeatureCollection|Feature|Geometry} geojson Any GeoJSON Feature or Geometry
	 * @param {Object} [options={}] Optional parameters
	 * @param {number} [options.featureIndex=0] Feature Index
	 * @param {number} [options.multiFeatureIndex=0] Multi-Feature Index
	 * @param {number} [options.geometryIndex=0] Geometry Index
	 * @param {number} [options.segmentIndex=0] Segment Index
	 * @param {Object} [options.properties={}] Translate Properties to output LineString
	 * @param {BBox} [options.bbox={}] Translate BBox to output LineString
	 * @param {number|string} [options.id={}] Translate Id to output LineString
	 * @returns {Feature<LineString>} 2-vertex GeoJSON Feature LineString
	 * @example
	 * var multiLine = turf.multiLineString([
	 *     [[10, 10], [50, 30], [30, 40]],
	 *     [[-10, -10], [-50, -30], [-30, -40]]
	 * ]);
	 *
	 * // First Segment (defaults are 0)
	 * turf.findSegment(multiLine);
	 * // => Feature<LineString<[[10, 10], [50, 30]]>>
	 *
	 * // First Segment of 2nd Multi Feature
	 * turf.findSegment(multiLine, {multiFeatureIndex: 1});
	 * // => Feature<LineString<[[-10, -10], [-50, -30]]>>
	 *
	 * // Last Segment of Last Multi Feature
	 * turf.findSegment(multiLine, {multiFeatureIndex: -1, segmentIndex: -1});
	 * // => Feature<LineString<[[-50, -30], [-30, -40]]>>
	 */
	function findSegment(geojson, options) {
	    // Optional Parameters
	    options = options || {};
	    if (!helpers.isObject(options)) throw new Error('options is invalid');
	    var featureIndex = options.featureIndex || 0;
	    var multiFeatureIndex = options.multiFeatureIndex || 0;
	    var geometryIndex = options.geometryIndex || 0;
	    var segmentIndex = options.segmentIndex || 0;

	    // Find FeatureIndex
	    var properties = options.properties;
	    var geometry;

	    switch (geojson.type) {
	    case 'FeatureCollection':
	        if (featureIndex < 0) featureIndex = geojson.features.length + featureIndex;
	        properties = properties || geojson.features[featureIndex].properties;
	        geometry = geojson.features[featureIndex].geometry;
	        break;
	    case 'Feature':
	        properties = properties || geojson.properties;
	        geometry = geojson.geometry;
	        break;
	    case 'Point':
	    case 'MultiPoint':
	        return null;
	    case 'LineString':
	    case 'Polygon':
	    case 'MultiLineString':
	    case 'MultiPolygon':
	        geometry = geojson;
	        break;
	    default:
	        throw new Error('geojson is invalid');
	    }

	    // Find SegmentIndex
	    if (geometry === null) return null;
	    var coords = geometry.coordinates;
	    switch (geometry.type) {
	    case 'Point':
	    case 'MultiPoint':
	        return null;
	    case 'LineString':
	        if (segmentIndex < 0) segmentIndex = coords.length + segmentIndex - 1;
	        return helpers.lineString([coords[segmentIndex], coords[segmentIndex + 1]], properties, options);
	    case 'Polygon':
	        if (geometryIndex < 0) geometryIndex = coords.length + geometryIndex;
	        if (segmentIndex < 0) segmentIndex = coords[geometryIndex].length + segmentIndex - 1;
	        return helpers.lineString([coords[geometryIndex][segmentIndex], coords[geometryIndex][segmentIndex + 1]], properties, options);
	    case 'MultiLineString':
	        if (multiFeatureIndex < 0) multiFeatureIndex = coords.length + multiFeatureIndex;
	        if (segmentIndex < 0) segmentIndex = coords[multiFeatureIndex].length + segmentIndex - 1;
	        return helpers.lineString([coords[multiFeatureIndex][segmentIndex], coords[multiFeatureIndex][segmentIndex + 1]], properties, options);
	    case 'MultiPolygon':
	        if (multiFeatureIndex < 0) multiFeatureIndex = coords.length + multiFeatureIndex;
	        if (geometryIndex < 0) geometryIndex = coords[multiFeatureIndex].length + geometryIndex;
	        if (segmentIndex < 0) segmentIndex = coords[multiFeatureIndex][geometryIndex].length - segmentIndex - 1;
	        return helpers.lineString([coords[multiFeatureIndex][geometryIndex][segmentIndex], coords[multiFeatureIndex][geometryIndex][segmentIndex + 1]], properties, options);
	    }
	    throw new Error('geojson is invalid');
	}

	/**
	 * Finds a particular Point from a GeoJSON using `@turf/meta` indexes.
	 *
	 * Negative indexes are permitted.
	 *
	 * @param {FeatureCollection|Feature|Geometry} geojson Any GeoJSON Feature or Geometry
	 * @param {Object} [options={}] Optional parameters
	 * @param {number} [options.featureIndex=0] Feature Index
	 * @param {number} [options.multiFeatureIndex=0] Multi-Feature Index
	 * @param {number} [options.geometryIndex=0] Geometry Index
	 * @param {number} [options.coordIndex=0] Coord Index
	 * @param {Object} [options.properties={}] Translate Properties to output Point
	 * @param {BBox} [options.bbox={}] Translate BBox to output Point
	 * @param {number|string} [options.id={}] Translate Id to output Point
	 * @returns {Feature<Point>} 2-vertex GeoJSON Feature Point
	 * @example
	 * var multiLine = turf.multiLineString([
	 *     [[10, 10], [50, 30], [30, 40]],
	 *     [[-10, -10], [-50, -30], [-30, -40]]
	 * ]);
	 *
	 * // First Segment (defaults are 0)
	 * turf.findPoint(multiLine);
	 * // => Feature<Point<[10, 10]>>
	 *
	 * // First Segment of the 2nd Multi-Feature
	 * turf.findPoint(multiLine, {multiFeatureIndex: 1});
	 * // => Feature<Point<[-10, -10]>>
	 *
	 * // Last Segment of last Multi-Feature
	 * turf.findPoint(multiLine, {multiFeatureIndex: -1, coordIndex: -1});
	 * // => Feature<Point<[-30, -40]>>
	 */
	function findPoint(geojson, options) {
	    // Optional Parameters
	    options = options || {};
	    if (!helpers.isObject(options)) throw new Error('options is invalid');
	    var featureIndex = options.featureIndex || 0;
	    var multiFeatureIndex = options.multiFeatureIndex || 0;
	    var geometryIndex = options.geometryIndex || 0;
	    var coordIndex = options.coordIndex || 0;

	    // Find FeatureIndex
	    var properties = options.properties;
	    var geometry;

	    switch (geojson.type) {
	    case 'FeatureCollection':
	        if (featureIndex < 0) featureIndex = geojson.features.length + featureIndex;
	        properties = properties || geojson.features[featureIndex].properties;
	        geometry = geojson.features[featureIndex].geometry;
	        break;
	    case 'Feature':
	        properties = properties || geojson.properties;
	        geometry = geojson.geometry;
	        break;
	    case 'Point':
	    case 'MultiPoint':
	        return null;
	    case 'LineString':
	    case 'Polygon':
	    case 'MultiLineString':
	    case 'MultiPolygon':
	        geometry = geojson;
	        break;
	    default:
	        throw new Error('geojson is invalid');
	    }

	    // Find Coord Index
	    if (geometry === null) return null;
	    var coords = geometry.coordinates;
	    switch (geometry.type) {
	    case 'Point':
	        return helpers.point(coords, properties, options);
	    case 'MultiPoint':
	        if (multiFeatureIndex < 0) multiFeatureIndex = coords.length + multiFeatureIndex;
	        return helpers.point(coords[multiFeatureIndex], properties, options);
	    case 'LineString':
	        if (coordIndex < 0) coordIndex = coords.length + coordIndex;
	        return helpers.point(coords[coordIndex], properties, options);
	    case 'Polygon':
	        if (geometryIndex < 0) geometryIndex = coords.length + geometryIndex;
	        if (coordIndex < 0) coordIndex = coords[geometryIndex].length + coordIndex;
	        return helpers.point(coords[geometryIndex][coordIndex], properties, options);
	    case 'MultiLineString':
	        if (multiFeatureIndex < 0) multiFeatureIndex = coords.length + multiFeatureIndex;
	        if (coordIndex < 0) coordIndex = coords[multiFeatureIndex].length + coordIndex;
	        return helpers.point(coords[multiFeatureIndex][coordIndex], properties, options);
	    case 'MultiPolygon':
	        if (multiFeatureIndex < 0) multiFeatureIndex = coords.length + multiFeatureIndex;
	        if (geometryIndex < 0) geometryIndex = coords[multiFeatureIndex].length + geometryIndex;
	        if (coordIndex < 0) coordIndex = coords[multiFeatureIndex][geometryIndex].length - coordIndex;
	        return helpers.point(coords[multiFeatureIndex][geometryIndex][coordIndex], properties, options);
	    }
	    throw new Error('geojson is invalid');
	}

	exports.coordEach = coordEach;
	exports.coordReduce = coordReduce;
	exports.propEach = propEach;
	exports.propReduce = propReduce;
	exports.featureEach = featureEach;
	exports.featureReduce = featureReduce;
	exports.coordAll = coordAll;
	exports.geomEach = geomEach;
	exports.geomReduce = geomReduce;
	exports.flattenEach = flattenEach;
	exports.flattenReduce = flattenReduce;
	exports.segmentEach = segmentEach;
	exports.segmentReduce = segmentReduce;
	exports.lineEach = lineEach;
	exports.lineReduce = lineReduce;
	exports.findSegment = findSegment;
	exports.findPoint = findPoint;
	});

	unwrapExports(meta);
	var meta_1 = meta.coordEach;
	var meta_2 = meta.coordReduce;
	var meta_3 = meta.propEach;
	var meta_4 = meta.propReduce;
	var meta_5 = meta.featureEach;
	var meta_6 = meta.featureReduce;
	var meta_7 = meta.coordAll;
	var meta_8 = meta.geomEach;
	var meta_9 = meta.geomReduce;
	var meta_10 = meta.flattenEach;
	var meta_11 = meta.flattenReduce;
	var meta_12 = meta.segmentEach;
	var meta_13 = meta.segmentReduce;
	var meta_14 = meta.lineEach;
	var meta_15 = meta.lineReduce;
	var meta_16 = meta.findSegment;
	var meta_17 = meta.findPoint;

	var quickselect = createCommonjsModule(function (module, exports) {
	(function (global, factory) {
		 module.exports = factory() ;
	}(commonjsGlobal, (function () {
	function quickselect(arr, k, left, right, compare) {
	    quickselectStep(arr, k, left || 0, right || (arr.length - 1), compare || defaultCompare);
	}

	function quickselectStep(arr, k, left, right, compare) {

	    while (right > left) {
	        if (right - left > 600) {
	            var n = right - left + 1;
	            var m = k - left + 1;
	            var z = Math.log(n);
	            var s = 0.5 * Math.exp(2 * z / 3);
	            var sd = 0.5 * Math.sqrt(z * s * (n - s) / n) * (m - n / 2 < 0 ? -1 : 1);
	            var newLeft = Math.max(left, Math.floor(k - m * s / n + sd));
	            var newRight = Math.min(right, Math.floor(k + (n - m) * s / n + sd));
	            quickselectStep(arr, k, newLeft, newRight, compare);
	        }

	        var t = arr[k];
	        var i = left;
	        var j = right;

	        swap(arr, left, k);
	        if (compare(arr[right], t) > 0) swap(arr, left, right);

	        while (i < j) {
	            swap(arr, i, j);
	            i++;
	            j--;
	            while (compare(arr[i], t) < 0) i++;
	            while (compare(arr[j], t) > 0) j--;
	        }

	        if (compare(arr[left], t) === 0) swap(arr, left, j);
	        else {
	            j++;
	            swap(arr, j, right);
	        }

	        if (j <= k) left = j + 1;
	        if (k <= j) right = j - 1;
	    }
	}

	function swap(arr, i, j) {
	    var tmp = arr[i];
	    arr[i] = arr[j];
	    arr[j] = tmp;
	}

	function defaultCompare(a, b) {
	    return a < b ? -1 : a > b ? 1 : 0;
	}

	return quickselect;

	})));
	});

	var rbush_1 = rbush;
	var _default = rbush;



	function rbush(maxEntries, format) {
	    if (!(this instanceof rbush)) return new rbush(maxEntries, format);

	    // max entries in a node is 9 by default; min node fill is 40% for best performance
	    this._maxEntries = Math.max(4, maxEntries || 9);
	    this._minEntries = Math.max(2, Math.ceil(this._maxEntries * 0.4));

	    if (format) {
	        this._initFormat(format);
	    }

	    this.clear();
	}

	rbush.prototype = {

	    all: function () {
	        return this._all(this.data, []);
	    },

	    search: function (bbox) {

	        var node = this.data,
	            result = [],
	            toBBox = this.toBBox;

	        if (!intersects(bbox, node)) return result;

	        var nodesToSearch = [],
	            i, len, child, childBBox;

	        while (node) {
	            for (i = 0, len = node.children.length; i < len; i++) {

	                child = node.children[i];
	                childBBox = node.leaf ? toBBox(child) : child;

	                if (intersects(bbox, childBBox)) {
	                    if (node.leaf) result.push(child);
	                    else if (contains(bbox, childBBox)) this._all(child, result);
	                    else nodesToSearch.push(child);
	                }
	            }
	            node = nodesToSearch.pop();
	        }

	        return result;
	    },

	    collides: function (bbox) {

	        var node = this.data,
	            toBBox = this.toBBox;

	        if (!intersects(bbox, node)) return false;

	        var nodesToSearch = [],
	            i, len, child, childBBox;

	        while (node) {
	            for (i = 0, len = node.children.length; i < len; i++) {

	                child = node.children[i];
	                childBBox = node.leaf ? toBBox(child) : child;

	                if (intersects(bbox, childBBox)) {
	                    if (node.leaf || contains(bbox, childBBox)) return true;
	                    nodesToSearch.push(child);
	                }
	            }
	            node = nodesToSearch.pop();
	        }

	        return false;
	    },

	    load: function (data) {
	        if (!(data && data.length)) return this;

	        if (data.length < this._minEntries) {
	            for (var i = 0, len = data.length; i < len; i++) {
	                this.insert(data[i]);
	            }
	            return this;
	        }

	        // recursively build the tree with the given data from scratch using OMT algorithm
	        var node = this._build(data.slice(), 0, data.length - 1, 0);

	        if (!this.data.children.length) {
	            // save as is if tree is empty
	            this.data = node;

	        } else if (this.data.height === node.height) {
	            // split root if trees have the same height
	            this._splitRoot(this.data, node);

	        } else {
	            if (this.data.height < node.height) {
	                // swap trees if inserted one is bigger
	                var tmpNode = this.data;
	                this.data = node;
	                node = tmpNode;
	            }

	            // insert the small tree into the large tree at appropriate level
	            this._insert(node, this.data.height - node.height - 1, true);
	        }

	        return this;
	    },

	    insert: function (item) {
	        if (item) this._insert(item, this.data.height - 1);
	        return this;
	    },

	    clear: function () {
	        this.data = createNode([]);
	        return this;
	    },

	    remove: function (item, equalsFn) {
	        if (!item) return this;

	        var node = this.data,
	            bbox = this.toBBox(item),
	            path = [],
	            indexes = [],
	            i, parent, index, goingUp;

	        // depth-first iterative tree traversal
	        while (node || path.length) {

	            if (!node) { // go up
	                node = path.pop();
	                parent = path[path.length - 1];
	                i = indexes.pop();
	                goingUp = true;
	            }

	            if (node.leaf) { // check current node
	                index = findItem(item, node.children, equalsFn);

	                if (index !== -1) {
	                    // item found, remove the item and condense tree upwards
	                    node.children.splice(index, 1);
	                    path.push(node);
	                    this._condense(path);
	                    return this;
	                }
	            }

	            if (!goingUp && !node.leaf && contains(node, bbox)) { // go down
	                path.push(node);
	                indexes.push(i);
	                i = 0;
	                parent = node;
	                node = node.children[0];

	            } else if (parent) { // go right
	                i++;
	                node = parent.children[i];
	                goingUp = false;

	            } else node = null; // nothing found
	        }

	        return this;
	    },

	    toBBox: function (item) { return item; },

	    compareMinX: compareNodeMinX,
	    compareMinY: compareNodeMinY,

	    toJSON: function () { return this.data; },

	    fromJSON: function (data) {
	        this.data = data;
	        return this;
	    },

	    _all: function (node, result) {
	        var nodesToSearch = [];
	        while (node) {
	            if (node.leaf) result.push.apply(result, node.children);
	            else nodesToSearch.push.apply(nodesToSearch, node.children);

	            node = nodesToSearch.pop();
	        }
	        return result;
	    },

	    _build: function (items, left, right, height) {

	        var N = right - left + 1,
	            M = this._maxEntries,
	            node;

	        if (N <= M) {
	            // reached leaf level; return leaf
	            node = createNode(items.slice(left, right + 1));
	            calcBBox(node, this.toBBox);
	            return node;
	        }

	        if (!height) {
	            // target height of the bulk-loaded tree
	            height = Math.ceil(Math.log(N) / Math.log(M));

	            // target number of root entries to maximize storage utilization
	            M = Math.ceil(N / Math.pow(M, height - 1));
	        }

	        node = createNode([]);
	        node.leaf = false;
	        node.height = height;

	        // split the items into M mostly square tiles

	        var N2 = Math.ceil(N / M),
	            N1 = N2 * Math.ceil(Math.sqrt(M)),
	            i, j, right2, right3;

	        multiSelect(items, left, right, N1, this.compareMinX);

	        for (i = left; i <= right; i += N1) {

	            right2 = Math.min(i + N1 - 1, right);

	            multiSelect(items, i, right2, N2, this.compareMinY);

	            for (j = i; j <= right2; j += N2) {

	                right3 = Math.min(j + N2 - 1, right2);

	                // pack each entry recursively
	                node.children.push(this._build(items, j, right3, height - 1));
	            }
	        }

	        calcBBox(node, this.toBBox);

	        return node;
	    },

	    _chooseSubtree: function (bbox, node, level, path) {

	        var i, len, child, targetNode, area, enlargement, minArea, minEnlargement;

	        while (true) {
	            path.push(node);

	            if (node.leaf || path.length - 1 === level) break;

	            minArea = minEnlargement = Infinity;

	            for (i = 0, len = node.children.length; i < len; i++) {
	                child = node.children[i];
	                area = bboxArea(child);
	                enlargement = enlargedArea(bbox, child) - area;

	                // choose entry with the least area enlargement
	                if (enlargement < minEnlargement) {
	                    minEnlargement = enlargement;
	                    minArea = area < minArea ? area : minArea;
	                    targetNode = child;

	                } else if (enlargement === minEnlargement) {
	                    // otherwise choose one with the smallest area
	                    if (area < minArea) {
	                        minArea = area;
	                        targetNode = child;
	                    }
	                }
	            }

	            node = targetNode || node.children[0];
	        }

	        return node;
	    },

	    _insert: function (item, level, isNode) {

	        var toBBox = this.toBBox,
	            bbox = isNode ? item : toBBox(item),
	            insertPath = [];

	        // find the best node for accommodating the item, saving all nodes along the path too
	        var node = this._chooseSubtree(bbox, this.data, level, insertPath);

	        // put the item into the node
	        node.children.push(item);
	        extend(node, bbox);

	        // split on node overflow; propagate upwards if necessary
	        while (level >= 0) {
	            if (insertPath[level].children.length > this._maxEntries) {
	                this._split(insertPath, level);
	                level--;
	            } else break;
	        }

	        // adjust bboxes along the insertion path
	        this._adjustParentBBoxes(bbox, insertPath, level);
	    },

	    // split overflowed node into two
	    _split: function (insertPath, level) {

	        var node = insertPath[level],
	            M = node.children.length,
	            m = this._minEntries;

	        this._chooseSplitAxis(node, m, M);

	        var splitIndex = this._chooseSplitIndex(node, m, M);

	        var newNode = createNode(node.children.splice(splitIndex, node.children.length - splitIndex));
	        newNode.height = node.height;
	        newNode.leaf = node.leaf;

	        calcBBox(node, this.toBBox);
	        calcBBox(newNode, this.toBBox);

	        if (level) insertPath[level - 1].children.push(newNode);
	        else this._splitRoot(node, newNode);
	    },

	    _splitRoot: function (node, newNode) {
	        // split root node
	        this.data = createNode([node, newNode]);
	        this.data.height = node.height + 1;
	        this.data.leaf = false;
	        calcBBox(this.data, this.toBBox);
	    },

	    _chooseSplitIndex: function (node, m, M) {

	        var i, bbox1, bbox2, overlap, area, minOverlap, minArea, index;

	        minOverlap = minArea = Infinity;

	        for (i = m; i <= M - m; i++) {
	            bbox1 = distBBox(node, 0, i, this.toBBox);
	            bbox2 = distBBox(node, i, M, this.toBBox);

	            overlap = intersectionArea(bbox1, bbox2);
	            area = bboxArea(bbox1) + bboxArea(bbox2);

	            // choose distribution with minimum overlap
	            if (overlap < minOverlap) {
	                minOverlap = overlap;
	                index = i;

	                minArea = area < minArea ? area : minArea;

	            } else if (overlap === minOverlap) {
	                // otherwise choose distribution with minimum area
	                if (area < minArea) {
	                    minArea = area;
	                    index = i;
	                }
	            }
	        }

	        return index;
	    },

	    // sorts node children by the best axis for split
	    _chooseSplitAxis: function (node, m, M) {

	        var compareMinX = node.leaf ? this.compareMinX : compareNodeMinX,
	            compareMinY = node.leaf ? this.compareMinY : compareNodeMinY,
	            xMargin = this._allDistMargin(node, m, M, compareMinX),
	            yMargin = this._allDistMargin(node, m, M, compareMinY);

	        // if total distributions margin value is minimal for x, sort by minX,
	        // otherwise it's already sorted by minY
	        if (xMargin < yMargin) node.children.sort(compareMinX);
	    },

	    // total margin of all possible split distributions where each node is at least m full
	    _allDistMargin: function (node, m, M, compare) {

	        node.children.sort(compare);

	        var toBBox = this.toBBox,
	            leftBBox = distBBox(node, 0, m, toBBox),
	            rightBBox = distBBox(node, M - m, M, toBBox),
	            margin = bboxMargin(leftBBox) + bboxMargin(rightBBox),
	            i, child;

	        for (i = m; i < M - m; i++) {
	            child = node.children[i];
	            extend(leftBBox, node.leaf ? toBBox(child) : child);
	            margin += bboxMargin(leftBBox);
	        }

	        for (i = M - m - 1; i >= m; i--) {
	            child = node.children[i];
	            extend(rightBBox, node.leaf ? toBBox(child) : child);
	            margin += bboxMargin(rightBBox);
	        }

	        return margin;
	    },

	    _adjustParentBBoxes: function (bbox, path, level) {
	        // adjust bboxes along the given tree path
	        for (var i = level; i >= 0; i--) {
	            extend(path[i], bbox);
	        }
	    },

	    _condense: function (path) {
	        // go through the path, removing empty nodes and updating bboxes
	        for (var i = path.length - 1, siblings; i >= 0; i--) {
	            if (path[i].children.length === 0) {
	                if (i > 0) {
	                    siblings = path[i - 1].children;
	                    siblings.splice(siblings.indexOf(path[i]), 1);

	                } else this.clear();

	            } else calcBBox(path[i], this.toBBox);
	        }
	    },

	    _initFormat: function (format) {
	        // data format (minX, minY, maxX, maxY accessors)

	        // uses eval-type function compilation instead of just accepting a toBBox function
	        // because the algorithms are very sensitive to sorting functions performance,
	        // so they should be dead simple and without inner calls

	        var compareArr = ['return a', ' - b', ';'];

	        this.compareMinX = new Function('a', 'b', compareArr.join(format[0]));
	        this.compareMinY = new Function('a', 'b', compareArr.join(format[1]));

	        this.toBBox = new Function('a',
	            'return {minX: a' + format[0] +
	            ', minY: a' + format[1] +
	            ', maxX: a' + format[2] +
	            ', maxY: a' + format[3] + '};');
	    }
	};

	function findItem(item, items, equalsFn) {
	    if (!equalsFn) return items.indexOf(item);

	    for (var i = 0; i < items.length; i++) {
	        if (equalsFn(item, items[i])) return i;
	    }
	    return -1;
	}

	// calculate node's bbox from bboxes of its children
	function calcBBox(node, toBBox) {
	    distBBox(node, 0, node.children.length, toBBox, node);
	}

	// min bounding rectangle of node children from k to p-1
	function distBBox(node, k, p, toBBox, destNode) {
	    if (!destNode) destNode = createNode(null);
	    destNode.minX = Infinity;
	    destNode.minY = Infinity;
	    destNode.maxX = -Infinity;
	    destNode.maxY = -Infinity;

	    for (var i = k, child; i < p; i++) {
	        child = node.children[i];
	        extend(destNode, node.leaf ? toBBox(child) : child);
	    }

	    return destNode;
	}

	function extend(a, b) {
	    a.minX = Math.min(a.minX, b.minX);
	    a.minY = Math.min(a.minY, b.minY);
	    a.maxX = Math.max(a.maxX, b.maxX);
	    a.maxY = Math.max(a.maxY, b.maxY);
	    return a;
	}

	function compareNodeMinX(a, b) { return a.minX - b.minX; }
	function compareNodeMinY(a, b) { return a.minY - b.minY; }

	function bboxArea(a)   { return (a.maxX - a.minX) * (a.maxY - a.minY); }
	function bboxMargin(a) { return (a.maxX - a.minX) + (a.maxY - a.minY); }

	function enlargedArea(a, b) {
	    return (Math.max(b.maxX, a.maxX) - Math.min(b.minX, a.minX)) *
	           (Math.max(b.maxY, a.maxY) - Math.min(b.minY, a.minY));
	}

	function intersectionArea(a, b) {
	    var minX = Math.max(a.minX, b.minX),
	        minY = Math.max(a.minY, b.minY),
	        maxX = Math.min(a.maxX, b.maxX),
	        maxY = Math.min(a.maxY, b.maxY);

	    return Math.max(0, maxX - minX) *
	           Math.max(0, maxY - minY);
	}

	function contains(a, b) {
	    return a.minX <= b.minX &&
	           a.minY <= b.minY &&
	           b.maxX <= a.maxX &&
	           b.maxY <= a.maxY;
	}

	function intersects(a, b) {
	    return b.minX <= a.maxX &&
	           b.minY <= a.maxY &&
	           b.maxX >= a.minX &&
	           b.maxY >= a.minY;
	}

	function createNode(children) {
	    return {
	        children: children,
	        height: 1,
	        leaf: true,
	        minX: Infinity,
	        minY: Infinity,
	        maxX: -Infinity,
	        maxY: -Infinity
	    };
	}

	// sort an array so that items come in groups of n unsorted items, with groups sorted between each other;
	// combines selection algorithm with binary divide & conquer approach

	function multiSelect(arr, left, right, n, compare) {
	    var stack = [left, right],
	        mid;

	    while (stack.length) {
	        right = stack.pop();
	        left = stack.pop();

	        if (right - left <= n) continue;

	        mid = left + Math.ceil((right - left) / n / 2) * n;
	        quickselect(arr, mid, left, right, compare);

	        stack.push(left, mid, mid, right);
	    }
	}
	rbush_1.default = _default;

	var twoProduct_1 = twoProduct;

	var SPLITTER = +(Math.pow(2, 27) + 1.0);

	function twoProduct(a, b, result) {
	  var x = a * b;

	  var c = SPLITTER * a;
	  var abig = c - a;
	  var ahi = c - abig;
	  var alo = a - ahi;

	  var d = SPLITTER * b;
	  var bbig = d - b;
	  var bhi = d - bbig;
	  var blo = b - bhi;

	  var err1 = x - (ahi * bhi);
	  var err2 = err1 - (alo * bhi);
	  var err3 = err2 - (ahi * blo);

	  var y = alo * blo - err3;

	  if(result) {
	    result[0] = y;
	    result[1] = x;
	    return result
	  }

	  return [ y, x ]
	}

	var robustSum = linearExpansionSum;

	//Easy case: Add two scalars
	function scalarScalar(a, b) {
	  var x = a + b;
	  var bv = x - a;
	  var av = x - bv;
	  var br = b - bv;
	  var ar = a - av;
	  var y = ar + br;
	  if(y) {
	    return [y, x]
	  }
	  return [x]
	}

	function linearExpansionSum(e, f) {
	  var ne = e.length|0;
	  var nf = f.length|0;
	  if(ne === 1 && nf === 1) {
	    return scalarScalar(e[0], f[0])
	  }
	  var n = ne + nf;
	  var g = new Array(n);
	  var count = 0;
	  var eptr = 0;
	  var fptr = 0;
	  var abs = Math.abs;
	  var ei = e[eptr];
	  var ea = abs(ei);
	  var fi = f[fptr];
	  var fa = abs(fi);
	  var a, b;
	  if(ea < fa) {
	    b = ei;
	    eptr += 1;
	    if(eptr < ne) {
	      ei = e[eptr];
	      ea = abs(ei);
	    }
	  } else {
	    b = fi;
	    fptr += 1;
	    if(fptr < nf) {
	      fi = f[fptr];
	      fa = abs(fi);
	    }
	  }
	  if((eptr < ne && ea < fa) || (fptr >= nf)) {
	    a = ei;
	    eptr += 1;
	    if(eptr < ne) {
	      ei = e[eptr];
	      ea = abs(ei);
	    }
	  } else {
	    a = fi;
	    fptr += 1;
	    if(fptr < nf) {
	      fi = f[fptr];
	      fa = abs(fi);
	    }
	  }
	  var x = a + b;
	  var bv = x - a;
	  var y = b - bv;
	  var q0 = y;
	  var q1 = x;
	  var _x, _bv, _av, _br, _ar;
	  while(eptr < ne && fptr < nf) {
	    if(ea < fa) {
	      a = ei;
	      eptr += 1;
	      if(eptr < ne) {
	        ei = e[eptr];
	        ea = abs(ei);
	      }
	    } else {
	      a = fi;
	      fptr += 1;
	      if(fptr < nf) {
	        fi = f[fptr];
	        fa = abs(fi);
	      }
	    }
	    b = q0;
	    x = a + b;
	    bv = x - a;
	    y = b - bv;
	    if(y) {
	      g[count++] = y;
	    }
	    _x = q1 + x;
	    _bv = _x - q1;
	    _av = _x - _bv;
	    _br = x - _bv;
	    _ar = q1 - _av;
	    q0 = _ar + _br;
	    q1 = _x;
	  }
	  while(eptr < ne) {
	    a = ei;
	    b = q0;
	    x = a + b;
	    bv = x - a;
	    y = b - bv;
	    if(y) {
	      g[count++] = y;
	    }
	    _x = q1 + x;
	    _bv = _x - q1;
	    _av = _x - _bv;
	    _br = x - _bv;
	    _ar = q1 - _av;
	    q0 = _ar + _br;
	    q1 = _x;
	    eptr += 1;
	    if(eptr < ne) {
	      ei = e[eptr];
	    }
	  }
	  while(fptr < nf) {
	    a = fi;
	    b = q0;
	    x = a + b;
	    bv = x - a;
	    y = b - bv;
	    if(y) {
	      g[count++] = y;
	    } 
	    _x = q1 + x;
	    _bv = _x - q1;
	    _av = _x - _bv;
	    _br = x - _bv;
	    _ar = q1 - _av;
	    q0 = _ar + _br;
	    q1 = _x;
	    fptr += 1;
	    if(fptr < nf) {
	      fi = f[fptr];
	    }
	  }
	  if(q0) {
	    g[count++] = q0;
	  }
	  if(q1) {
	    g[count++] = q1;
	  }
	  if(!count) {
	    g[count++] = 0.0;  
	  }
	  g.length = count;
	  return g
	}

	var twoSum = fastTwoSum;

	function fastTwoSum(a, b, result) {
		var x = a + b;
		var bv = x - a;
		var av = x - bv;
		var br = b - bv;
		var ar = a - av;
		if(result) {
			result[0] = ar + br;
			result[1] = x;
			return result
		}
		return [ar+br, x]
	}

	var robustScale = scaleLinearExpansion;

	function scaleLinearExpansion(e, scale) {
	  var n = e.length;
	  if(n === 1) {
	    var ts = twoProduct_1(e[0], scale);
	    if(ts[0]) {
	      return ts
	    }
	    return [ ts[1] ]
	  }
	  var g = new Array(2 * n);
	  var q = [0.1, 0.1];
	  var t = [0.1, 0.1];
	  var count = 0;
	  twoProduct_1(e[0], scale, q);
	  if(q[0]) {
	    g[count++] = q[0];
	  }
	  for(var i=1; i<n; ++i) {
	    twoProduct_1(e[i], scale, t);
	    var pq = q[1];
	    twoSum(pq, t[0], q);
	    if(q[0]) {
	      g[count++] = q[0];
	    }
	    var a = t[1];
	    var b = q[1];
	    var x = a + b;
	    var bv = x - a;
	    var y = b - bv;
	    q[1] = x;
	    if(y) {
	      g[count++] = y;
	    }
	  }
	  if(q[1]) {
	    g[count++] = q[1];
	  }
	  if(count === 0) {
	    g[count++] = 0.0;
	  }
	  g.length = count;
	  return g
	}

	var robustDiff = robustSubtract;

	//Easy case: Add two scalars
	function scalarScalar$1(a, b) {
	  var x = a + b;
	  var bv = x - a;
	  var av = x - bv;
	  var br = b - bv;
	  var ar = a - av;
	  var y = ar + br;
	  if(y) {
	    return [y, x]
	  }
	  return [x]
	}

	function robustSubtract(e, f) {
	  var ne = e.length|0;
	  var nf = f.length|0;
	  if(ne === 1 && nf === 1) {
	    return scalarScalar$1(e[0], -f[0])
	  }
	  var n = ne + nf;
	  var g = new Array(n);
	  var count = 0;
	  var eptr = 0;
	  var fptr = 0;
	  var abs = Math.abs;
	  var ei = e[eptr];
	  var ea = abs(ei);
	  var fi = -f[fptr];
	  var fa = abs(fi);
	  var a, b;
	  if(ea < fa) {
	    b = ei;
	    eptr += 1;
	    if(eptr < ne) {
	      ei = e[eptr];
	      ea = abs(ei);
	    }
	  } else {
	    b = fi;
	    fptr += 1;
	    if(fptr < nf) {
	      fi = -f[fptr];
	      fa = abs(fi);
	    }
	  }
	  if((eptr < ne && ea < fa) || (fptr >= nf)) {
	    a = ei;
	    eptr += 1;
	    if(eptr < ne) {
	      ei = e[eptr];
	      ea = abs(ei);
	    }
	  } else {
	    a = fi;
	    fptr += 1;
	    if(fptr < nf) {
	      fi = -f[fptr];
	      fa = abs(fi);
	    }
	  }
	  var x = a + b;
	  var bv = x - a;
	  var y = b - bv;
	  var q0 = y;
	  var q1 = x;
	  var _x, _bv, _av, _br, _ar;
	  while(eptr < ne && fptr < nf) {
	    if(ea < fa) {
	      a = ei;
	      eptr += 1;
	      if(eptr < ne) {
	        ei = e[eptr];
	        ea = abs(ei);
	      }
	    } else {
	      a = fi;
	      fptr += 1;
	      if(fptr < nf) {
	        fi = -f[fptr];
	        fa = abs(fi);
	      }
	    }
	    b = q0;
	    x = a + b;
	    bv = x - a;
	    y = b - bv;
	    if(y) {
	      g[count++] = y;
	    }
	    _x = q1 + x;
	    _bv = _x - q1;
	    _av = _x - _bv;
	    _br = x - _bv;
	    _ar = q1 - _av;
	    q0 = _ar + _br;
	    q1 = _x;
	  }
	  while(eptr < ne) {
	    a = ei;
	    b = q0;
	    x = a + b;
	    bv = x - a;
	    y = b - bv;
	    if(y) {
	      g[count++] = y;
	    }
	    _x = q1 + x;
	    _bv = _x - q1;
	    _av = _x - _bv;
	    _br = x - _bv;
	    _ar = q1 - _av;
	    q0 = _ar + _br;
	    q1 = _x;
	    eptr += 1;
	    if(eptr < ne) {
	      ei = e[eptr];
	    }
	  }
	  while(fptr < nf) {
	    a = fi;
	    b = q0;
	    x = a + b;
	    bv = x - a;
	    y = b - bv;
	    if(y) {
	      g[count++] = y;
	    } 
	    _x = q1 + x;
	    _bv = _x - q1;
	    _av = _x - _bv;
	    _br = x - _bv;
	    _ar = q1 - _av;
	    q0 = _ar + _br;
	    q1 = _x;
	    fptr += 1;
	    if(fptr < nf) {
	      fi = -f[fptr];
	    }
	  }
	  if(q0) {
	    g[count++] = q0;
	  }
	  if(q1) {
	    g[count++] = q1;
	  }
	  if(!count) {
	    g[count++] = 0.0;  
	  }
	  g.length = count;
	  return g
	}

	var orientation_1 = createCommonjsModule(function (module) {






	var NUM_EXPAND = 5;

	var EPSILON     = 1.1102230246251565e-16;
	var ERRBOUND3   = (3.0 + 16.0 * EPSILON) * EPSILON;
	var ERRBOUND4   = (7.0 + 56.0 * EPSILON) * EPSILON;

	function cofactor(m, c) {
	  var result = new Array(m.length-1);
	  for(var i=1; i<m.length; ++i) {
	    var r = result[i-1] = new Array(m.length-1);
	    for(var j=0,k=0; j<m.length; ++j) {
	      if(j === c) {
	        continue
	      }
	      r[k++] = m[i][j];
	    }
	  }
	  return result
	}

	function matrix(n) {
	  var result = new Array(n);
	  for(var i=0; i<n; ++i) {
	    result[i] = new Array(n);
	    for(var j=0; j<n; ++j) {
	      result[i][j] = ["m", j, "[", (n-i-1), "]"].join("");
	    }
	  }
	  return result
	}

	function sign(n) {
	  if(n & 1) {
	    return "-"
	  }
	  return ""
	}

	function generateSum(expr) {
	  if(expr.length === 1) {
	    return expr[0]
	  } else if(expr.length === 2) {
	    return ["sum(", expr[0], ",", expr[1], ")"].join("")
	  } else {
	    var m = expr.length>>1;
	    return ["sum(", generateSum(expr.slice(0, m)), ",", generateSum(expr.slice(m)), ")"].join("")
	  }
	}

	function determinant(m) {
	  if(m.length === 2) {
	    return [["sum(prod(", m[0][0], ",", m[1][1], "),prod(-", m[0][1], ",", m[1][0], "))"].join("")]
	  } else {
	    var expr = [];
	    for(var i=0; i<m.length; ++i) {
	      expr.push(["scale(", generateSum(determinant(cofactor(m, i))), ",", sign(i), m[0][i], ")"].join(""));
	    }
	    return expr
	  }
	}

	function orientation(n) {
	  var pos = [];
	  var neg = [];
	  var m = matrix(n);
	  var args = [];
	  for(var i=0; i<n; ++i) {
	    if((i&1)===0) {
	      pos.push.apply(pos, determinant(cofactor(m, i)));
	    } else {
	      neg.push.apply(neg, determinant(cofactor(m, i)));
	    }
	    args.push("m" + i);
	  }
	  var posExpr = generateSum(pos);
	  var negExpr = generateSum(neg);
	  var funcName = "orientation" + n + "Exact";
	  var code = ["function ", funcName, "(", args.join(), "){var p=", posExpr, ",n=", negExpr, ",d=sub(p,n);\
return d[d.length-1];};return ", funcName].join("");
	  var proc = new Function("sum", "prod", "scale", "sub", code);
	  return proc(robustSum, twoProduct_1, robustScale, robustDiff)
	}

	var orientation3Exact = orientation(3);
	var orientation4Exact = orientation(4);

	var CACHED = [
	  function orientation0() { return 0 },
	  function orientation1() { return 0 },
	  function orientation2(a, b) { 
	    return b[0] - a[0]
	  },
	  function orientation3(a, b, c) {
	    var l = (a[1] - c[1]) * (b[0] - c[0]);
	    var r = (a[0] - c[0]) * (b[1] - c[1]);
	    var det = l - r;
	    var s;
	    if(l > 0) {
	      if(r <= 0) {
	        return det
	      } else {
	        s = l + r;
	      }
	    } else if(l < 0) {
	      if(r >= 0) {
	        return det
	      } else {
	        s = -(l + r);
	      }
	    } else {
	      return det
	    }
	    var tol = ERRBOUND3 * s;
	    if(det >= tol || det <= -tol) {
	      return det
	    }
	    return orientation3Exact(a, b, c)
	  },
	  function orientation4(a,b,c,d) {
	    var adx = a[0] - d[0];
	    var bdx = b[0] - d[0];
	    var cdx = c[0] - d[0];
	    var ady = a[1] - d[1];
	    var bdy = b[1] - d[1];
	    var cdy = c[1] - d[1];
	    var adz = a[2] - d[2];
	    var bdz = b[2] - d[2];
	    var cdz = c[2] - d[2];
	    var bdxcdy = bdx * cdy;
	    var cdxbdy = cdx * bdy;
	    var cdxady = cdx * ady;
	    var adxcdy = adx * cdy;
	    var adxbdy = adx * bdy;
	    var bdxady = bdx * ady;
	    var det = adz * (bdxcdy - cdxbdy) 
	            + bdz * (cdxady - adxcdy)
	            + cdz * (adxbdy - bdxady);
	    var permanent = (Math.abs(bdxcdy) + Math.abs(cdxbdy)) * Math.abs(adz)
	                  + (Math.abs(cdxady) + Math.abs(adxcdy)) * Math.abs(bdz)
	                  + (Math.abs(adxbdy) + Math.abs(bdxady)) * Math.abs(cdz);
	    var tol = ERRBOUND4 * permanent;
	    if ((det > tol) || (-det > tol)) {
	      return det
	    }
	    return orientation4Exact(a,b,c,d)
	  }
	];

	function slowOrient(args) {
	  var proc = CACHED[args.length];
	  if(!proc) {
	    proc = CACHED[args.length] = orientation(args.length);
	  }
	  return proc.apply(undefined, args)
	}

	function generateOrientationProc() {
	  while(CACHED.length <= NUM_EXPAND) {
	    CACHED.push(orientation(CACHED.length));
	  }
	  var args = [];
	  var procArgs = ["slow"];
	  for(var i=0; i<=NUM_EXPAND; ++i) {
	    args.push("a" + i);
	    procArgs.push("o" + i);
	  }
	  var code = [
	    "function getOrientation(", args.join(), "){switch(arguments.length){case 0:case 1:return 0;"
	  ];
	  for(var i=2; i<=NUM_EXPAND; ++i) {
	    code.push("case ", i, ":return o", i, "(", args.slice(0, i).join(), ");");
	  }
	  code.push("}var s=new Array(arguments.length);for(var i=0;i<arguments.length;++i){s[i]=arguments[i]};return slow(s);}return getOrientation");
	  procArgs.push(code.join(""));

	  var proc = Function.apply(undefined, procArgs);
	  module.exports = proc.apply(undefined, [slowOrient].concat(CACHED));
	  for(var i=0; i<=NUM_EXPAND; ++i) {
	    module.exports[i] = CACHED[i];
	  }
	}

	generateOrientationProc();
	});

	var monotoneConvexHull2d = monotoneConvexHull2D;

	var orient = orientation_1[3];

	function monotoneConvexHull2D(points) {
	  var n = points.length;

	  if(n < 3) {
	    var result = new Array(n);
	    for(var i=0; i<n; ++i) {
	      result[i] = i;
	    }

	    if(n === 2 &&
	       points[0][0] === points[1][0] &&
	       points[0][1] === points[1][1]) {
	      return [0]
	    }

	    return result
	  }

	  //Sort point indices along x-axis
	  var sorted = new Array(n);
	  for(var i=0; i<n; ++i) {
	    sorted[i] = i;
	  }
	  sorted.sort(function(a,b) {
	    var d = points[a][0]-points[b][0];
	    if(d) {
	      return d
	    }
	    return points[a][1] - points[b][1]
	  });

	  //Construct upper and lower hulls
	  var lower = [sorted[0], sorted[1]];
	  var upper = [sorted[0], sorted[1]];

	  for(var i=2; i<n; ++i) {
	    var idx = sorted[i];
	    var p   = points[idx];

	    //Insert into lower list
	    var m = lower.length;
	    while(m > 1 && orient(
	        points[lower[m-2]], 
	        points[lower[m-1]], 
	        p) <= 0) {
	      m -= 1;
	      lower.pop();
	    }
	    lower.push(idx);

	    //Insert into upper list
	    m = upper.length;
	    while(m > 1 && orient(
	        points[upper[m-2]], 
	        points[upper[m-1]], 
	        p) >= 0) {
	      m -= 1;
	      upper.pop();
	    }
	    upper.push(idx);
	  }

	  //Merge lists together
	  var result = new Array(upper.length + lower.length - 2);
	  var ptr    = 0;
	  for(var i=0, nl=lower.length; i<nl; ++i) {
	    result[ptr++] = lower[i];
	  }
	  for(var j=upper.length-2; j>0; --j) {
	    result[ptr++] = upper[j];
	  }

	  //Return result
	  return result
	}

	var tinyqueue = TinyQueue;
	var _default$1 = TinyQueue;

	function TinyQueue(data, compare) {
	    if (!(this instanceof TinyQueue)) return new TinyQueue(data, compare);

	    this.data = data || [];
	    this.length = this.data.length;
	    this.compare = compare || defaultCompare;

	    if (this.length > 0) {
	        for (var i = (this.length >> 1) - 1; i >= 0; i--) this._down(i);
	    }
	}

	function defaultCompare(a, b) {
	    return a < b ? -1 : a > b ? 1 : 0;
	}

	TinyQueue.prototype = {

	    push: function (item) {
	        this.data.push(item);
	        this.length++;
	        this._up(this.length - 1);
	    },

	    pop: function () {
	        if (this.length === 0) return undefined;

	        var top = this.data[0];
	        this.length--;

	        if (this.length > 0) {
	            this.data[0] = this.data[this.length];
	            this._down(0);
	        }
	        this.data.pop();

	        return top;
	    },

	    peek: function () {
	        return this.data[0];
	    },

	    _up: function (pos) {
	        var data = this.data;
	        var compare = this.compare;
	        var item = data[pos];

	        while (pos > 0) {
	            var parent = (pos - 1) >> 1;
	            var current = data[parent];
	            if (compare(item, current) >= 0) break;
	            data[pos] = current;
	            pos = parent;
	        }

	        data[pos] = item;
	    },

	    _down: function (pos) {
	        var data = this.data;
	        var compare = this.compare;
	        var halfLength = this.length >> 1;
	        var item = data[pos];

	        while (pos < halfLength) {
	            var left = (pos << 1) + 1;
	            var right = left + 1;
	            var best = data[left];

	            if (right < this.length && compare(data[right], best) < 0) {
	                left = right;
	                best = data[right];
	            }
	            if (compare(best, item) >= 0) break;

	            data[pos] = best;
	            pos = left;
	        }

	        data[pos] = item;
	    }
	};
	tinyqueue.default = _default$1;

	var pointInPolygon = function (point, vs) {
	    // ray-casting algorithm based on
	    // http://www.ecse.rpi.edu/Homepages/wrf/Research/Short_Notes/pnpoly.html
	    
	    var x = point[0], y = point[1];
	    
	    var inside = false;
	    for (var i = 0, j = vs.length - 1; i < vs.length; j = i++) {
	        var xi = vs[i][0], yi = vs[i][1];
	        var xj = vs[j][0], yj = vs[j][1];
	        
	        var intersect = ((yi > y) != (yj > y))
	            && (x < (xj - xi) * (y - yi) / (yj - yi) + xi);
	        if (intersect) inside = !inside;
	    }
	    
	    return inside;
	};

	var orient$1 = orientation_1[3];

	var concaveman_1 = concaveman;
	var _default$2 = concaveman;

	function concaveman(points, concavity, lengthThreshold) {
	    // a relative measure of concavity; higher value means simpler hull
	    concavity = Math.max(0, concavity === undefined ? 2 : concavity);

	    // when a segment goes below this length threshold, it won't be drilled down further
	    lengthThreshold = lengthThreshold || 0;

	    // start with a convex hull of the points
	    var hull = fastConvexHull(points);

	    // index the points with an R-tree
	    var tree = rbush_1(16, ['[0]', '[1]', '[0]', '[1]']).load(points);

	    // turn the convex hull into a linked list and populate the initial edge queue with the nodes
	    var queue = [];
	    for (var i = 0, last; i < hull.length; i++) {
	        var p = hull[i];
	        tree.remove(p);
	        last = insertNode(p, last);
	        queue.push(last);
	    }

	    // index the segments with an R-tree (for intersection checks)
	    var segTree = rbush_1(16);
	    for (i = 0; i < queue.length; i++) segTree.insert(updateBBox(queue[i]));

	    var sqConcavity = concavity * concavity;
	    var sqLenThreshold = lengthThreshold * lengthThreshold;

	    // process edges one by one
	    while (queue.length) {
	        var node = queue.shift();
	        var a = node.p;
	        var b = node.next.p;

	        // skip the edge if it's already short enough
	        var sqLen = getSqDist(a, b);
	        if (sqLen < sqLenThreshold) continue;

	        var maxSqLen = sqLen / sqConcavity;

	        // find the best connection point for the current edge to flex inward to
	        p = findCandidate(tree, node.prev.p, a, b, node.next.next.p, maxSqLen, segTree);

	        // if we found a connection and it satisfies our concavity measure
	        if (p && Math.min(getSqDist(p, a), getSqDist(p, b)) <= maxSqLen) {
	            // connect the edge endpoints through this point and add 2 new edges to the queue
	            queue.push(node);
	            queue.push(insertNode(p, node));

	            // update point and segment indexes
	            tree.remove(p);
	            segTree.remove(node);
	            segTree.insert(updateBBox(node));
	            segTree.insert(updateBBox(node.next));
	        }
	    }

	    // convert the resulting hull linked list to an array of points
	    node = last;
	    var concave = [];
	    do {
	        concave.push(node.p);
	        node = node.next;
	    } while (node !== last);

	    concave.push(node.p);

	    return concave;
	}

	function findCandidate(tree, a, b, c, d, maxDist, segTree) {
	    var queue = new tinyqueue(null, compareDist);
	    var node = tree.data;

	    // search through the point R-tree with a depth-first search using a priority queue
	    // in the order of distance to the edge (b, c)
	    while (node) {
	        for (var i = 0; i < node.children.length; i++) {
	            var child = node.children[i];

	            var dist = node.leaf ? sqSegDist(child, b, c) : sqSegBoxDist(b, c, child);
	            if (dist > maxDist) continue; // skip the node if it's farther than we ever need

	            queue.push({
	                node: child,
	                dist: dist
	            });
	        }

	        while (queue.length && !queue.peek().node.children) {
	            var item = queue.pop();
	            var p = item.node;

	            // skip all points that are as close to adjacent edges (a,b) and (c,d),
	            // and points that would introduce self-intersections when connected
	            var d0 = sqSegDist(p, a, b);
	            var d1 = sqSegDist(p, c, d);
	            if (item.dist < d0 && item.dist < d1 &&
	                noIntersections(b, p, segTree) &&
	                noIntersections(c, p, segTree)) return p;
	        }

	        node = queue.pop();
	        if (node) node = node.node;
	    }

	    return null;
	}

	function compareDist(a, b) {
	    return a.dist - b.dist;
	}

	// square distance from a segment bounding box to the given one
	function sqSegBoxDist(a, b, bbox) {
	    if (inside(a, bbox) || inside(b, bbox)) return 0;
	    var d1 = sqSegSegDist(a[0], a[1], b[0], b[1], bbox.minX, bbox.minY, bbox.maxX, bbox.minY);
	    if (d1 === 0) return 0;
	    var d2 = sqSegSegDist(a[0], a[1], b[0], b[1], bbox.minX, bbox.minY, bbox.minX, bbox.maxY);
	    if (d2 === 0) return 0;
	    var d3 = sqSegSegDist(a[0], a[1], b[0], b[1], bbox.maxX, bbox.minY, bbox.maxX, bbox.maxY);
	    if (d3 === 0) return 0;
	    var d4 = sqSegSegDist(a[0], a[1], b[0], b[1], bbox.minX, bbox.maxY, bbox.maxX, bbox.maxY);
	    if (d4 === 0) return 0;
	    return Math.min(d1, d2, d3, d4);
	}

	function inside(a, bbox) {
	    return a[0] >= bbox.minX &&
	           a[0] <= bbox.maxX &&
	           a[1] >= bbox.minY &&
	           a[1] <= bbox.maxY;
	}

	// check if the edge (a,b) doesn't intersect any other edges
	function noIntersections(a, b, segTree) {
	    var minX = Math.min(a[0], b[0]);
	    var minY = Math.min(a[1], b[1]);
	    var maxX = Math.max(a[0], b[0]);
	    var maxY = Math.max(a[1], b[1]);

	    var edges = segTree.search({minX: minX, minY: minY, maxX: maxX, maxY: maxY});
	    for (var i = 0; i < edges.length; i++) {
	        if (intersects$1(edges[i].p, edges[i].next.p, a, b)) return false;
	    }
	    return true;
	}

	// check if the edges (p1,q1) and (p2,q2) intersect
	function intersects$1(p1, q1, p2, q2) {
	    return p1 !== q2 && q1 !== p2 &&
	        orient$1(p1, q1, p2) > 0 !== orient$1(p1, q1, q2) > 0 &&
	        orient$1(p2, q2, p1) > 0 !== orient$1(p2, q2, q1) > 0;
	}

	// update the bounding box of a node's edge
	function updateBBox(node) {
	    var p1 = node.p;
	    var p2 = node.next.p;
	    node.minX = Math.min(p1[0], p2[0]);
	    node.minY = Math.min(p1[1], p2[1]);
	    node.maxX = Math.max(p1[0], p2[0]);
	    node.maxY = Math.max(p1[1], p2[1]);
	    return node;
	}

	// speed up convex hull by filtering out points inside quadrilateral formed by 4 extreme points
	function fastConvexHull(points) {
	    var left = points[0];
	    var top = points[0];
	    var right = points[0];
	    var bottom = points[0];

	    // find the leftmost, rightmost, topmost and bottommost points
	    for (var i = 0; i < points.length; i++) {
	        var p = points[i];
	        if (p[0] < left[0]) left = p;
	        if (p[0] > right[0]) right = p;
	        if (p[1] < top[1]) top = p;
	        if (p[1] > bottom[1]) bottom = p;
	    }

	    // filter out points that are inside the resulting quadrilateral
	    var cull = [left, top, right, bottom];
	    var filtered = cull.slice();
	    for (i = 0; i < points.length; i++) {
	        if (!pointInPolygon(points[i], cull)) filtered.push(points[i]);
	    }

	    // get convex hull around the filtered points
	    var indices = monotoneConvexHull2d(filtered);

	    // return the hull as array of points (rather than indices)
	    var hull = [];
	    for (i = 0; i < indices.length; i++) hull.push(filtered[indices[i]]);
	    return hull;
	}

	// create a new node in a doubly linked list
	function insertNode(p, prev) {
	    var node = {
	        p: p,
	        prev: null,
	        next: null,
	        minX: 0,
	        minY: 0,
	        maxX: 0,
	        maxY: 0
	    };

	    if (!prev) {
	        node.prev = node;
	        node.next = node;

	    } else {
	        node.next = prev.next;
	        node.prev = prev;
	        prev.next.prev = node;
	        prev.next = node;
	    }
	    return node;
	}

	// square distance between 2 points
	function getSqDist(p1, p2) {

	    var dx = p1[0] - p2[0],
	        dy = p1[1] - p2[1];

	    return dx * dx + dy * dy;
	}

	// square distance from a point to a segment
	function sqSegDist(p, p1, p2) {

	    var x = p1[0],
	        y = p1[1],
	        dx = p2[0] - x,
	        dy = p2[1] - y;

	    if (dx !== 0 || dy !== 0) {

	        var t = ((p[0] - x) * dx + (p[1] - y) * dy) / (dx * dx + dy * dy);

	        if (t > 1) {
	            x = p2[0];
	            y = p2[1];

	        } else if (t > 0) {
	            x += dx * t;
	            y += dy * t;
	        }
	    }

	    dx = p[0] - x;
	    dy = p[1] - y;

	    return dx * dx + dy * dy;
	}

	// segment to segment distance, ported from http://geomalgorithms.com/a07-_distance.html by Dan Sunday
	function sqSegSegDist(x0, y0, x1, y1, x2, y2, x3, y3) {
	    var ux = x1 - x0;
	    var uy = y1 - y0;
	    var vx = x3 - x2;
	    var vy = y3 - y2;
	    var wx = x0 - x2;
	    var wy = y0 - y2;
	    var a = ux * ux + uy * uy;
	    var b = ux * vx + uy * vy;
	    var c = vx * vx + vy * vy;
	    var d = ux * wx + uy * wy;
	    var e = vx * wx + vy * wy;
	    var D = a * c - b * b;

	    var sc, sN, tc, tN;
	    var sD = D;
	    var tD = D;

	    if (D === 0) {
	        sN = 0;
	        sD = 1;
	        tN = e;
	        tD = c;
	    } else {
	        sN = b * e - c * d;
	        tN = a * e - b * d;
	        if (sN < 0) {
	            sN = 0;
	            tN = e;
	            tD = c;
	        } else if (sN > sD) {
	            sN = sD;
	            tN = e + b;
	            tD = c;
	        }
	    }

	    if (tN < 0.0) {
	        tN = 0.0;
	        if (-d < 0.0) sN = 0.0;
	        else if (-d > a) sN = sD;
	        else {
	            sN = -d;
	            sD = a;
	        }
	    } else if (tN > tD) {
	        tN = tD;
	        if ((-d + b) < 0.0) sN = 0;
	        else if (-d + b > a) sN = sD;
	        else {
	            sN = -d + b;
	            sD = a;
	        }
	    }

	    sc = sN === 0 ? 0 : sN / sD;
	    tc = tN === 0 ? 0 : tN / tD;

	    var cx = (1 - sc) * x0 + sc * x1;
	    var cy = (1 - sc) * y0 + sc * y1;
	    var cx2 = (1 - tc) * x2 + tc * x3;
	    var cy2 = (1 - tc) * y2 + tc * y3;
	    var dx = cx2 - cx;
	    var dy = cy2 - cy;

	    return dx * dx + dy * dy;
	}
	concaveman_1.default = _default$2;

	var convex_1 = createCommonjsModule(function (module, exports) {
	var __importDefault = (commonjsGlobal && commonjsGlobal.__importDefault) || function (mod) {
	    return (mod && mod.__esModule) ? mod : { "default": mod };
	};
	Object.defineProperty(exports, "__esModule", { value: true });


	var concaveman_1$1 = __importDefault(concaveman_1);
	/**
	 * Takes a {@link Feature} or a {@link FeatureCollection} and returns a convex hull {@link Polygon}.
	 *
	 * Internally this uses
	 * the [convex-hull](https://github.com/mikolalysenko/convex-hull) module that implements a
	 * [monotone chain hull](http://en.wikibooks.org/wiki/Algorithm_Implementation/Geometry/Convex_hull/Monotone_chain).
	 *
	 * @name convex
	 * @param {GeoJSON} geojson input Feature or FeatureCollection
	 * @param {Object} [options={}] Optional parameters
	 * @param {number} [options.concavity=Infinity] 1 - thin shape. Infinity - convex hull.
	 * @param {Object} [options.properties={}] Translate Properties to Feature
	 * @returns {Feature<Polygon>} a convex hull
	 * @example
	 * var points = turf.featureCollection([
	 *   turf.point([10.195312, 43.755225]),
	 *   turf.point([10.404052, 43.8424511]),
	 *   turf.point([10.579833, 43.659924]),
	 *   turf.point([10.360107, 43.516688]),
	 *   turf.point([10.14038, 43.588348]),
	 *   turf.point([10.195312, 43.755225])
	 * ]);
	 *
	 * var hull = turf.convex(points);
	 *
	 * //addToMap
	 * var addToMap = [points, hull]
	 */
	function convex(geojson, options) {
	    if (options === void 0) { options = {}; }
	    // Default parameters
	    options.concavity = options.concavity || Infinity;
	    // Container
	    var points = [];
	    // Convert all points to flat 2D coordinate Array
	    meta.coordEach(geojson, function (coord) {
	        points.push([coord[0], coord[1]]);
	    });
	    if (!points.length) {
	        return null;
	    }
	    var convexHull = concaveman_1$1.default(points, options.concavity);
	    // Convex hull should have at least 3 different vertices in order to create a valid polygon
	    if (convexHull.length > 3) {
	        return helpers.polygon([convexHull]);
	    }
	    return null;
	}
	exports.default = convex;
	});

	unwrapExports(convex_1);

	var centroid_1 = createCommonjsModule(function (module, exports) {
	Object.defineProperty(exports, "__esModule", { value: true });


	/**
	 * Takes one or more features and calculates the centroid using the mean of all vertices.
	 * This lessens the effect of small islands and artifacts when calculating the centroid of a set of polygons.
	 *
	 * @name centroid
	 * @param {GeoJSON} geojson GeoJSON to be centered
	 * @param {Object} [options={}] Optional Parameters
	 * @param {Object} [options.properties={}] an Object that is used as the {@link Feature}'s properties
	 * @returns {Feature<Point>} the centroid of the input features
	 * @example
	 * var polygon = turf.polygon([[[-81, 41], [-88, 36], [-84, 31], [-80, 33], [-77, 39], [-81, 41]]]);
	 *
	 * var centroid = turf.centroid(polygon);
	 *
	 * //addToMap
	 * var addToMap = [polygon, centroid]
	 */
	function centroid(geojson, options) {
	    if (options === void 0) { options = {}; }
	    var xSum = 0;
	    var ySum = 0;
	    var len = 0;
	    meta.coordEach(geojson, function (coord) {
	        xSum += coord[0];
	        ySum += coord[1];
	        len++;
	    });
	    return helpers.point([xSum / len, ySum / len], options.properties);
	}
	exports.default = centroid;
	});

	unwrapExports(centroid_1);

	var invariant = createCommonjsModule(function (module, exports) {
	Object.defineProperty(exports, "__esModule", { value: true });

	/**
	 * Unwrap a coordinate from a Point Feature, Geometry or a single coordinate.
	 *
	 * @name getCoord
	 * @param {Array<number>|Geometry<Point>|Feature<Point>} coord GeoJSON Point or an Array of numbers
	 * @returns {Array<number>} coordinates
	 * @example
	 * var pt = turf.point([10, 10]);
	 *
	 * var coord = turf.getCoord(pt);
	 * //= [10, 10]
	 */
	function getCoord(coord) {
	    if (!coord) {
	        throw new Error("coord is required");
	    }
	    if (!Array.isArray(coord)) {
	        if (coord.type === "Feature" && coord.geometry !== null && coord.geometry.type === "Point") {
	            return coord.geometry.coordinates;
	        }
	        if (coord.type === "Point") {
	            return coord.coordinates;
	        }
	    }
	    if (Array.isArray(coord) && coord.length >= 2 && !Array.isArray(coord[0]) && !Array.isArray(coord[1])) {
	        return coord;
	    }
	    throw new Error("coord must be GeoJSON Point or an Array of numbers");
	}
	exports.getCoord = getCoord;
	/**
	 * Unwrap coordinates from a Feature, Geometry Object or an Array
	 *
	 * @name getCoords
	 * @param {Array<any>|Geometry|Feature} coords Feature, Geometry Object or an Array
	 * @returns {Array<any>} coordinates
	 * @example
	 * var poly = turf.polygon([[[119.32, -8.7], [119.55, -8.69], [119.51, -8.54], [119.32, -8.7]]]);
	 *
	 * var coords = turf.getCoords(poly);
	 * //= [[[119.32, -8.7], [119.55, -8.69], [119.51, -8.54], [119.32, -8.7]]]
	 */
	function getCoords(coords) {
	    if (Array.isArray(coords)) {
	        return coords;
	    }
	    // Feature
	    if (coords.type === "Feature") {
	        if (coords.geometry !== null) {
	            return coords.geometry.coordinates;
	        }
	    }
	    else {
	        // Geometry
	        if (coords.coordinates) {
	            return coords.coordinates;
	        }
	    }
	    throw new Error("coords must be GeoJSON Feature, Geometry Object or an Array");
	}
	exports.getCoords = getCoords;
	/**
	 * Checks if coordinates contains a number
	 *
	 * @name containsNumber
	 * @param {Array<any>} coordinates GeoJSON Coordinates
	 * @returns {boolean} true if Array contains a number
	 */
	function containsNumber(coordinates) {
	    if (coordinates.length > 1 && helpers.isNumber(coordinates[0]) && helpers.isNumber(coordinates[1])) {
	        return true;
	    }
	    if (Array.isArray(coordinates[0]) && coordinates[0].length) {
	        return containsNumber(coordinates[0]);
	    }
	    throw new Error("coordinates must only contain numbers");
	}
	exports.containsNumber = containsNumber;
	/**
	 * Enforce expectations about types of GeoJSON objects for Turf.
	 *
	 * @name geojsonType
	 * @param {GeoJSON} value any GeoJSON object
	 * @param {string} type expected GeoJSON type
	 * @param {string} name name of calling function
	 * @throws {Error} if value is not the expected type.
	 */
	function geojsonType(value, type, name) {
	    if (!type || !name) {
	        throw new Error("type and name required");
	    }
	    if (!value || value.type !== type) {
	        throw new Error("Invalid input to " + name + ": must be a " + type + ", given " + value.type);
	    }
	}
	exports.geojsonType = geojsonType;
	/**
	 * Enforce expectations about types of {@link Feature} inputs for Turf.
	 * Internally this uses {@link geojsonType} to judge geometry types.
	 *
	 * @name featureOf
	 * @param {Feature} feature a feature with an expected geometry type
	 * @param {string} type expected GeoJSON type
	 * @param {string} name name of calling function
	 * @throws {Error} error if value is not the expected type.
	 */
	function featureOf(feature, type, name) {
	    if (!feature) {
	        throw new Error("No feature passed");
	    }
	    if (!name) {
	        throw new Error(".featureOf() requires a name");
	    }
	    if (!feature || feature.type !== "Feature" || !feature.geometry) {
	        throw new Error("Invalid input to " + name + ", Feature with geometry required");
	    }
	    if (!feature.geometry || feature.geometry.type !== type) {
	        throw new Error("Invalid input to " + name + ": must be a " + type + ", given " + feature.geometry.type);
	    }
	}
	exports.featureOf = featureOf;
	/**
	 * Enforce expectations about types of {@link FeatureCollection} inputs for Turf.
	 * Internally this uses {@link geojsonType} to judge geometry types.
	 *
	 * @name collectionOf
	 * @param {FeatureCollection} featureCollection a FeatureCollection for which features will be judged
	 * @param {string} type expected GeoJSON type
	 * @param {string} name name of calling function
	 * @throws {Error} if value is not the expected type.
	 */
	function collectionOf(featureCollection, type, name) {
	    if (!featureCollection) {
	        throw new Error("No featureCollection passed");
	    }
	    if (!name) {
	        throw new Error(".collectionOf() requires a name");
	    }
	    if (!featureCollection || featureCollection.type !== "FeatureCollection") {
	        throw new Error("Invalid input to " + name + ", FeatureCollection required");
	    }
	    for (var _i = 0, _a = featureCollection.features; _i < _a.length; _i++) {
	        var feature = _a[_i];
	        if (!feature || feature.type !== "Feature" || !feature.geometry) {
	            throw new Error("Invalid input to " + name + ", Feature with geometry required");
	        }
	        if (!feature.geometry || feature.geometry.type !== type) {
	            throw new Error("Invalid input to " + name + ": must be a " + type + ", given " + feature.geometry.type);
	        }
	    }
	}
	exports.collectionOf = collectionOf;
	/**
	 * Get Geometry from Feature or Geometry Object
	 *
	 * @param {Feature|Geometry} geojson GeoJSON Feature or Geometry Object
	 * @returns {Geometry|null} GeoJSON Geometry Object
	 * @throws {Error} if geojson is not a Feature or Geometry Object
	 * @example
	 * var point = {
	 *   "type": "Feature",
	 *   "properties": {},
	 *   "geometry": {
	 *     "type": "Point",
	 *     "coordinates": [110, 40]
	 *   }
	 * }
	 * var geom = turf.getGeom(point)
	 * //={"type": "Point", "coordinates": [110, 40]}
	 */
	function getGeom(geojson) {
	    if (geojson.type === "Feature") {
	        return geojson.geometry;
	    }
	    return geojson;
	}
	exports.getGeom = getGeom;
	/**
	 * Get GeoJSON object's type, Geometry type is prioritize.
	 *
	 * @param {GeoJSON} geojson GeoJSON object
	 * @param {string} [name="geojson"] name of the variable to display in error message
	 * @returns {string} GeoJSON type
	 * @example
	 * var point = {
	 *   "type": "Feature",
	 *   "properties": {},
	 *   "geometry": {
	 *     "type": "Point",
	 *     "coordinates": [110, 40]
	 *   }
	 * }
	 * var geom = turf.getType(point)
	 * //="Point"
	 */
	function getType(geojson, name) {
	    if (geojson.type === "FeatureCollection") {
	        return "FeatureCollection";
	    }
	    if (geojson.type === "GeometryCollection") {
	        return "GeometryCollection";
	    }
	    if (geojson.type === "Feature" && geojson.geometry !== null) {
	        return geojson.geometry.type;
	    }
	    return geojson.type;
	}
	exports.getType = getType;
	});

	unwrapExports(invariant);
	var invariant_1 = invariant.getCoord;
	var invariant_2 = invariant.getCoords;
	var invariant_3 = invariant.containsNumber;
	var invariant_4 = invariant.geojsonType;
	var invariant_5 = invariant.featureOf;
	var invariant_6 = invariant.collectionOf;
	var invariant_7 = invariant.getGeom;
	var invariant_8 = invariant.getType;

	var centerOfMass_1 = createCommonjsModule(function (module, exports) {
	Object.defineProperty(exports, "__esModule", { value: true });





	/**
	 * Takes any {@link Feature} or a {@link FeatureCollection} and returns its [center of mass](https://en.wikipedia.org/wiki/Center_of_mass) using this formula: [Centroid of Polygon](https://en.wikipedia.org/wiki/Centroid#Centroid_of_polygon).
	 *
	 * @name centerOfMass
	 * @param {GeoJSON} geojson GeoJSON to be centered
	 * @param {Object} [options={}] Optional Parameters
	 * @param {Object} [options.properties={}] Translate Properties to Feature
	 * @returns {Feature<Point>} the center of mass
	 * @example
	 * var polygon = turf.polygon([[[-81, 41], [-88, 36], [-84, 31], [-80, 33], [-77, 39], [-81, 41]]]);
	 *
	 * var center = turf.centerOfMass(polygon);
	 *
	 * //addToMap
	 * var addToMap = [polygon, center]
	 */
	function centerOfMass(geojson, options) {
	    if (options === void 0) { options = {}; }
	    switch (invariant.getType(geojson)) {
	        case 'Point':
	            return geojson;
	        case 'Polygon':
	            var coords = [];
	            meta.coordEach(geojson, function (coord) {
	                coords.push(coord);
	            });
	            // First, we neutralize the feature (set it around coordinates [0,0]) to prevent rounding errors
	            // We take any point to translate all the points around 0
	            var centre = centroid_1.default(geojson, { properties: options.properties });
	            var translation = centre.geometry.coordinates;
	            var sx = 0;
	            var sy = 0;
	            var sArea = 0;
	            var i, pi, pj, xi, xj, yi, yj, a;
	            var neutralizedPoints = coords.map(function (point) {
	                return [
	                    point[0] - translation[0],
	                    point[1] - translation[1]
	                ];
	            });
	            for (i = 0; i < coords.length - 1; i++) {
	                // pi is the current point
	                pi = neutralizedPoints[i];
	                xi = pi[0];
	                yi = pi[1];
	                // pj is the next point (pi+1)
	                pj = neutralizedPoints[i + 1];
	                xj = pj[0];
	                yj = pj[1];
	                // a is the common factor to compute the signed area and the final coordinates
	                a = xi * yj - xj * yi;
	                // sArea is the sum used to compute the signed area
	                sArea += a;
	                // sx and sy are the sums used to compute the final coordinates
	                sx += (xi + xj) * a;
	                sy += (yi + yj) * a;
	            }
	            // Shape has no area: fallback on turf.centroid
	            if (sArea === 0) {
	                return centre;
	            }
	            else {
	                // Compute the signed area, and factorize 1/6A
	                var area = sArea * 0.5;
	                var areaFactor = 1 / (6 * area);
	                // Compute the final coordinates, adding back the values that have been neutralized
	                return helpers.point([
	                    translation[0] + areaFactor * sx,
	                    translation[1] + areaFactor * sy
	                ], options.properties);
	            }
	        default:
	            // Not a polygon: Compute the convex hull and work with that
	            var hull = convex_1.default(geojson);
	            if (hull)
	                return centerOfMass(hull, { properties: options.properties });
	            else
	                return centroid_1.default(geojson, { properties: options.properties });
	    }
	}
	exports.default = centerOfMass;
	});

	var centerOfMass = unwrapExports(centerOfMass_1);

	var area_1 = createCommonjsModule(function (module, exports) {
	Object.defineProperty(exports, "__esModule", { value: true });

	// Note: change RADIUS => earthRadius
	var RADIUS = 6378137;
	/**
	 * Takes one or more features and returns their area in square meters.
	 *
	 * @name area
	 * @param {GeoJSON} geojson input GeoJSON feature(s)
	 * @returns {number} area in square meters
	 * @example
	 * var polygon = turf.polygon([[[125, -15], [113, -22], [154, -27], [144, -15], [125, -15]]]);
	 *
	 * var area = turf.area(polygon);
	 *
	 * //addToMap
	 * var addToMap = [polygon]
	 * polygon.properties.area = area
	 */
	function area(geojson) {
	    return meta.geomReduce(geojson, function (value, geom) {
	        return value + calculateArea(geom);
	    }, 0);
	}
	exports.default = area;
	/**
	 * Calculate Area
	 *
	 * @private
	 * @param {Geometry} geom GeoJSON Geometries
	 * @returns {number} area
	 */
	function calculateArea(geom) {
	    var total = 0;
	    var i;
	    switch (geom.type) {
	        case "Polygon":
	            return polygonArea(geom.coordinates);
	        case "MultiPolygon":
	            for (i = 0; i < geom.coordinates.length; i++) {
	                total += polygonArea(geom.coordinates[i]);
	            }
	            return total;
	        case "Point":
	        case "MultiPoint":
	        case "LineString":
	        case "MultiLineString":
	            return 0;
	    }
	    return 0;
	}
	function polygonArea(coords) {
	    var total = 0;
	    if (coords && coords.length > 0) {
	        total += Math.abs(ringArea(coords[0]));
	        for (var i = 1; i < coords.length; i++) {
	            total -= Math.abs(ringArea(coords[i]));
	        }
	    }
	    return total;
	}
	/**
	 * @private
	 * Calculate the approximate area of the polygon were it projected onto the earth.
	 * Note that this area will be positive if ring is oriented clockwise, otherwise it will be negative.
	 *
	 * Reference:
	 * Robert. G. Chamberlain and William H. Duquette, "Some Algorithms for Polygons on a Sphere",
	 * JPL Publication 07-03, Jet Propulsion
	 * Laboratory, Pasadena, CA, June 2007 http://trs-new.jpl.nasa.gov/dspace/handle/2014/40409
	 *
	 * @param {Array<Array<number>>} coords Ring Coordinates
	 * @returns {number} The approximate signed geodesic area of the polygon in square meters.
	 */
	function ringArea(coords) {
	    var p1;
	    var p2;
	    var p3;
	    var lowerIndex;
	    var middleIndex;
	    var upperIndex;
	    var i;
	    var total = 0;
	    var coordsLength = coords.length;
	    if (coordsLength > 2) {
	        for (i = 0; i < coordsLength; i++) {
	            if (i === coordsLength - 2) {
	                lowerIndex = coordsLength - 2;
	                middleIndex = coordsLength - 1;
	                upperIndex = 0;
	            }
	            else if (i === coordsLength - 1) {
	                lowerIndex = coordsLength - 1;
	                middleIndex = 0;
	                upperIndex = 1;
	            }
	            else {
	                lowerIndex = i;
	                middleIndex = i + 1;
	                upperIndex = i + 2;
	            }
	            p1 = coords[lowerIndex];
	            p2 = coords[middleIndex];
	            p3 = coords[upperIndex];
	            total += (rad(p3[0]) - rad(p1[0])) * Math.sin(rad(p2[1]));
	        }
	        total = total * RADIUS * RADIUS / 2;
	    }
	    return total;
	}
	function rad(num) {
	    return num * Math.PI / 180;
	}
	});

	var area = unwrapExports(area_1);

	const defaultProps = {
	  // Inherit all of GeoJsonLayer's props
	  ...layers.GeoJsonLayer.defaultProps,
	  // Label for each feature
	  getLabel: { type: "accessor", value: x => x.text },
	  // Label size for each feature
	  getLabelSize: { type: "accessor", value: 32 },
	  // Label color for each feature
	  getLabelColor: { type: "accessor", value: [0, 0, 0, 255] },
	  // Label always facing the camera
	  billboard: true,
	  // Label size units
	  labelSizeUnits: "pixels",
	  // Label background color
	  labelBackground: { type: "color", value: null, optional: true },
	  // Label font
	  fontFamily: "Monaco, monospace"
	};

	function getLabelAnchors(feature) {
	  const {type, coordinates} = feature.geometry;
	  switch (type) {
	    case 'Point':
	      return [coordinates];
	    case 'MultiPoint':
	      return coordinates;
	    case 'Polygon':
	      return [centerOfMass(feature).geometry.coordinates];
	    case 'MultiPolygon':
	      let polygons = coordinates.map(rings => helpers_9(rings));
	      const areas = polygons.map(area);
	      const maxArea = Math.max.apply(null, areas);
	      // Filter out the areas that are too small
	      return polygons.filter((f, index) => areas[index] > maxArea * 0.5)
	        .map(f => centerOfMass(f).geometry.coordinates);
	    default:
	      return [];
	  }
	}

	class LabeledGeoJsonLayer extends core.CompositeLayer {
	  updateState({ changeFlags }) {
	    const { data } = this.props;
	    if (changeFlags.dataChanged && data) {
	      const labelData = (data.features || data).flatMap((feature, index) => {
	        const labelAnchors = getLabelAnchors(feature);
	        return labelAnchors.map(p =>
	          this.getSubLayerRow({ position: p }, feature, index)
	        );
	      });

	      this.setState({ labelData });
	    }
	  }
	  renderLayers() {
	    const {
	      getLabel,
	      getLabelSize,
	      getLabelColor,
	      labelSizeUnits,
	      labelBackground,
	      billboard,
	      fontFamily
	    } = this.props;
	    return [
	      new layers.GeoJsonLayer(this.props, this.getSubLayerProps({ id: "geojson" }), {
	        data: this.props.data
	      }),
	      new layers.TextLayer(this.getSubLayerProps({ id: "text" }), {
	        data: this.state.labelData,
	        billboard,
	        sizeUnits: labelSizeUnits,
	        backgroundColor: labelBackground,
	        getPosition: d => d.position,
	        getText: this.getSubLayerAccessor(getLabel),
	        getSize: this.getSubLayerAccessor(getLabelSize),
	        getColor: this.getSubLayerAccessor(getLabelColor)
	      })
	    ];
	  }
	}

	LabeledGeoJsonLayer.layerName = "LabeledGeoJsonLayer";
	LabeledGeoJsonLayer.defaultProps = defaultProps;

	exports.LabeledGeoJsonLayer = LabeledGeoJsonLayer;

	return exports;

}({}, deck, deck));
