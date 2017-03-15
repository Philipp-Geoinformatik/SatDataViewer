//Content Variables
var centralSampledProperties = []; // the entities for the Satellite positions
var centralEntities = []; // the entities for the Satellite positions
var jsonSatelliteData;
//Maximum shown satellites
var maximalSatellites = 5;
var showTraces = true;
// ServiceInformation
var propagationStartTime = null;
var propagationEndTime = null;

// Cesium Viewer
var viewer;

// Set bounds of our simulation time
var date = new Date();
var start = Cesium.JulianDate.fromDate(date);
var stop = Cesium.JulianDate.addSeconds(start, 3600, new Cesium.JulianDate());

/*
 * 
 */
function initCesiumView() {
    // console.log(Cesium.JulianDate.daysDifference(2457448,2457447));
    viewer = new Cesium.Viewer('cesiumContainer', {
        imageryProvider: new Cesium.ArcGisMapServerImageryProvider({
            url: 'http://server.arcgisonline.com/ArcGIS/rest/services/World_Street_Map/MapServer'
        }),
        baseLayerPicker: false
    });


    // Enable lighting based on sun/moon positions
    viewer.scene.globe.enableLighting = true;
    // Use STK World Terrain
    /*
     * viewer.terrainProvider = new Cesium.CesiumTerrainProvider({ url :
     * '//assets.agi.com/stk-terrain/world', requestWaterMask : true,
     * requestVertexNormals : true });
     */
    // Enable depth testing so things behind the terrain disappear.
    viewer.scene.globe.depthTestAgainstTerrain = true;
    // Set the random number seed for consistent results.
    Cesium.Math.setRandomNumberSeed(3);
    // Setting the Clock properties
    viewer.clock.clockRange = Cesium.ClockRange.BOUNDED; // Loop at the end
    viewer.clock.multiplier = 1;

    //viewer.timeline = false;
    //console.log(viewer);
}





/**
 *This function builds an entity for the Cesium viewer. Entities are the main obejcts of the visualizaion component.
 */
function buildEntity(id, positions, availStop) {
    var modelURL = null;
    if (id == 25544) {
        console.log("ISS build");
        modelURL = "models/iss.glb"
    }

    /**
     */
    var pathConfig = null;
    if (showTraces) {
        pathConfig = {
            resolution: 1,
            material: Cesium.Color.SILVER,
            width: 2,
            resolution: 60
        };
    }

    return {
        id: id,
        // Set the entity availability to the same interval as the simulation
        // time.
        availability: new Cesium.TimeIntervalCollection(
				[new Cesium.TimeInterval({
                start: propagationStartTime,
                stop: availStop
            })]),
        // Use our computed positions
        position: positions,
        point: {
            pixelSize: 5,
            color: Cesium.Color.SILVER,
            outlineColor: Cesium.Color.MIDNIGHTBLUE,
            outlineWidth: 1
        },
        // Automatically compute orientation based on position movement.
        /*orientation: new Cesium.VelocityOrientationProperty(positions)
            ,*/
        path: pathConfig,
        model: {
            uri: modelURL,
            minimumPixelSize: 32
        }
    }
}

/*
 * 
 * 
 */
function loadSSAOfflineData(url) {
    var trackedEntity;
    var newSampledProperties = [];
    var entityArray = viewer.dataSourceDisplay.defaultDataSource.entities.values;
    var entityArrayLength = entityArray.length;
    //  console.log(entityArray[0]);
    $.getJSON(url, function (data) {
        jsonData = data;
        console.log(jsonData);
    }).done(
        function () {
            // loaded data handling
            var satellites = jsonData.satellites;
            var c = 0;
            //console.log(satellites);
            $.each(satellites, function (i, sat) {
                var positions = sat.positions;
                //console.log(positions);
                // Each position of a satellite must be put into a
                var k = containsSat(entityArray, sat);
                //console.log(k);
                if (c < maximalSatellites) {
                    if (k > -1) { //Contains satellite = true
                        $.each(positions, function (j, pos) {
                            console.log(pos);
                            var time = new Cesium.JulianDate(pos.mJE /*+ 2400000 + 0.5*/ , 0,
                                Cesium.TimeStandard.UTC);
                            var position = new Cesium.Cartesian3(pos.x, pos.y, pos.z);
                            entityArray[k].position.addSample(time, position);
                            updatePropStartEndTime(time);
                        });
                    } else {
                        var sampledPositionProperty = buildSampledPositionProperty(positions);
                        var entity = buildEntity(sat.id, sampledPositionProperty, stop);
                        // Interpolation
                        entity.position.setInterpolationOptions({
                            interpolationDegree: 1,
                            interpolationAlgorithm: Cesium.HermitePolynomialApproximation,
                            referenceFrame: Cesium.ReferenceFrame.INERTIAL
                        });
                        //adding to the viewer
                        viewer.entities.add(entity);
                        trackedEntity = viewer.entities.getById(sat.id);
                    }
                }
                c++;
            });
        }).then(function () {
        viewer.clock.startTime = propagationStartTime.clone();
        viewer.clock.stopTime = propagationEndTime.clone();
        viewer.timeline.zoomTo(propagationStartTime, propagationEndTime);
        viewer.clock.currentTime = propagationStartTime;
        viewer.clock.ClockRange = Cesium.ClockRange.LOOP_STOP;
        viewer.trackedEntity = trackedEntity;
        viewer.selectedEntity = trackedEntity;
    });
}

/*
 *
 */
function updatePropStartEndTime(time) {
    if (propagationEndTime != null) {
        if (Cesium.JulianDate.greaterThan(time, propagationEndTime)) {
            //  console.log("More ahead time found!");
            propagationEndTime = time;
            //console.log(propagationEndTime);
        }
    } else {
        propagationEndTime = time;
    }
    if (propagationStartTime != null) {
        if (Cesium.JulianDate.greaterThan(propagationStartTime, time)) {
            //    console.log("More older time found!");
            propagationStartTime = time;
            console.log(propagationStartTime);
        }
    } else {
        propagationStartTime = time;
    }
}

/**
 *
 */
function buildSampledPositionProperty(OrbitPositionArray) {
    var property = new Cesium.SampledPositionProperty(Cesium.ReferenceFrame.INERTIAL, 0);
    $.each(OrbitPositionArray, function (j, pos) {
        var time = new Cesium.JulianDate(pos.mJE /*+ 2400000 + 0.5*/ , 0, Cesium.TimeStandard.UTC);
        var position = new Cesium.Cartesian3(pos.x, pos.y, pos.z);
        property.addSample(time, position);
        updatePropStartEndTime(time);
    });
    return property;
}

/**
 *
 */
function updateSampledPositionProperty(index, sampledPositionProperty, avialabilityStop) {
    var entityArray = viewer.dataSourceDisplay.defaultDataSource.entities.values;
    var XYZArray = entityArray[index]._position._property._values;
    var timesArray = entityArray[index]._position._property._times;
    entityArray[index]._availability._intervals[0].stop = avialabilityStop;
    for (var j = 0; j < XYZArray.length; j++) {
        XYZArray[j] = sampledPositionProperty._property._values[j];
    }
    for (var i = 0; i < timesArray.length; i++) {
        timesArray[i] = sampledPositionProperty._property._times[i];
    }
}

/**
 *Removes all entities of the viewer
 *
 */
function removeSamples() {
    var newSampledProperties = [];
    //var entityArray = viewer.dataSourceDisplay.defaultDataSource.entities.values.slice(1,5);
    //viewer.dataSourceDisplay.defaultDataSource.entities.values = entityArray.slice(1, 5);
    // viewer.entities.values.getEntityById(id);
    propagationEndTime = null;
    viewer.entities.removeAll();
    console.log(viewer.entities);
}

///////////////////////////////////////////HELPER FUNCTIONS////////////////////////////////////////////////////////////////////
/*
 *************************
 */
function showEllipsiod(id, name, positions) {
    var infoText = null;
    var pointSpec = {
        pixelSize: 5,
        color: Cesium.Color.SILVER,
        outlineColor: Cesium.Color.MIDNIGHTBLUE,
        outlineWidth: 1
    }
    var boxSpecs = {
        dimensions: new Cesium.Cartesian3(10.0, 10.0, 10.0),
        material: Cesium.Color.NAVY.withAlpha(0.5)
    }

    var pathConfig = {
        resolution: 60,
        material: Cesium.Color.SILVER,
        width: 0.35
    };
    return {
        id: id,
        name: name,
        // Set the entity availability to the same interval as the simulation
        // time.
        availability: new Cesium.TimeIntervalCollection(
				[new Cesium.TimeInterval({
                start: propagationStartTime,
                stop: propagationEndTime
            })]),
        // Use our computed positions
        position: positions,
        point: pointSpec,
        box: null,
        // Automatically compute orientation based on position movement.
        orientation: new Cesium.VelocityOrientationProperty(positions),
        path: pathConfig,
        ellipsoid: {
            radii: new Cesium.Cartesian3(500.0, 125.0, 100.0),
            fill: false,
            outline: true,
            outlineColor: new Cesium.Color(Math.random(128, 256), Math.random(64, 256), Math.random(128, 265), 1),
            slicePartitions: 30,
            stackPartitions: 30
        }
    }
}





function getAsInteger(nr) {
    var str = nr.toString();
    str = str.substring(0, str.indexOf("."));
    return Number(str);
}

/*
 *Checks if an array of satellites contains the specified object ID
 *returns -1 if the element could not found
 *retuns the index of the element 
 */
function containsSat(array, sat) {
    for (var i = 0; i < array.length; i++) {
        if (array[i].id === sat.id) {
            return i;
        }
    }
    return -1;
}
