//Content Variables
var centralSampledProperties = []; // the entities for the Satellite positions
var centralEntities = []; // the entities for the Satellite positions
var jsonSatelliteData;
//Maximum shown satellites
var maximalSatellites = 2000;
var showTraces = false;
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
        terrainProviderViewModels: [], // Disable terrain changing
        infoBox: false, // Disable InfoBox widget
        selectionIndicator: false
            // Disable selection indicator
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
    viewer.clock.clockRange = Cesium.ClockRange.UNBOUNDED; // Loop at the end
    viewer.clock.multiplier = 1;

    //viewer.timeline = false;
    //console.log(viewer);
}


/**
 *
 *
 */
function manageDataImport(url) {
    console.log("manageDataImport");
    $.ajax(url, {
        statusCode: {
            404: function () {
                //alert("No Connection to Asteria-Services");
                loadSSAOfflineData("offline-session-satellites.json");
            },
            200: function () {
                console.log("Connected to Asteria");
                startAutoLoad(url, 1000);
                // setting the time by the tick event of the clock
                setInterval(MyTimeLineRefresher, 5000);
            }
        }
    });
}



/**
 * 
 * 
 */
function MyTimeLineRefresher() {
    var d = new Date();
    start = viewer.clock.currentTime;
    viewer.clock.startTime = start.clone();
    stop = Cesium.JulianDate.addSeconds(start, 3600, new Cesium.JulianDate());
    viewer.clock.stopTime = stop.clone();
    viewer.timeline.zoomTo(start, stop);
}




/*
 *
 */
function startAutoLoad(url, stepZise) {
    console.log("AutoUpdateCalled!");
    var interval = setInterval(
        function () {
            if (propagationEndTime != null) {
                var endTimeWithOffset = Cesium.JulianDate.addSeconds(propagationEndTime, -360, new Cesium.JulianDate());
                if (Cesium.JulianDate.greaterThan(viewer.clock.currentTime, endTimeWithOffset)) {
                    console.log("Current Time is out of the legal range:")
                    updateSampledPropertyListsBySteps(url, stepZise);
                } else {
                    console.log("Current Time is in the legal range:");
                    console.log("PropagationStartTime: " + Cesium.JulianDate.toDate(propagationStartTime));
                    console.log("Current Time:         " + Cesium.JulianDate.toDate(viewer.clock.currentTime));
                    console.log("EndTimeOffset of Pos: " + Cesium.JulianDate.toDate(endTimeWithOffset));
                    console.log("PropagationEndTime  : " + Cesium.JulianDate.toDate(propagationEndTime));
                    console.log("Difference: " + Cesium.JulianDate.secondsDifference(endTimeWithOffset, viewer.clock.currentTime) / 60 + "min");
                }
            } else {
                console.log("ELSE!!!!!")
                updateSampledPropertyListsBySteps(url, stepZise);
            }
        },
        5000);
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

    var pathConfig = null;
    if (showTraces) {
        pathConfig = {
            resolution: 1,
            material: new
            Cesium.PolylineGlowMaterialProperty({
                glowPower: 0.01,
                color: Cesium.Color.SILVER
            }),
            width: 10
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
            pixelSize: 2,
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
    var newSampledProperties = [];
    var entityArray = viewer.dataSourceDisplay.defaultDataSource.entities.values;
    var entityArrayLength = entityArray.length;
    //  console.log(entityArray[0]);
    $.getJSON(url, function (data) {
        jsonData = data;
    }).done(
        function () {
            // loaded data handling
            var satellites = jsonData.satellites;
            var c = 0;
            $.each(satellites, function (i, sat) {
                var positions = sat.positions;
                // Each position of a satellite must be put into a
                var k = containsSat(entityArray, sat);
                if (c < maximalSatellites)
                    if (k > -1) { //Contains satellite = true
                        $.each(positions, function (j, pos) {
                            var time = new Cesium.JulianDate(pos.mJE + 2400000 + 0.5, 0,
                                Cesium.TimeStandard.UTC);
                            var position = new Cesium.Cartesian3(pos.x, pos.y,
                                pos.z);
                            entityArray[k].position.addSample(time, position);
                            updatePropStartEndTime(time);
                        });
                    } else {
                        var sampledPositionProperty = buildSampledPositionProperty(positions);
                        var entity = buildEntity(sat.id, sampledPositionProperty, stop);
                        // Interpolation
                        entity.position.setInterpolationOptions({
                            interpolationDegree: 3,
                            interpolationAlgorithm: Cesium.LagrangePolynomialApproximation
                        });
                        //adding to the viewer
                        viewer.entities.add(entity);
                    }
                c++;
            });
        }).then(function () {
        viewer.clock.startTime = propagationStartTime.clone();
        viewer.clock.stopTime = propagationEndTime.clone();
        viewer.timeline.zoomTo(propagationStartTime, propagationEndTime);
        viewer.clock.currentTime = propagationStartTime;
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
    var property = new Cesium.SampledPositionProperty();
    $.each(OrbitPositionArray, function (j, pos) {
        var time = new Cesium.JulianDate(pos.mJE + 2400000 + 0.5, 0, Cesium.TimeStandard.UTC);
        var position = new Cesium.Cartesian3(pos.x, pos.y, pos.z);
        property.addSample(time, position);
        updatePropStartEndTime(time);
    });
    return property;
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

//////////////////////////////////////////////////////////////////////
/////////////////////////////////Test/////////////////////////////////

function loadSatelliteData(url) {
    var d;
    $.ajax({
        type: 'GET',
        url: url,
        data: '',
        dataType: 'json',
        success: function (data) {
            jsonSatelliteData = data;

        },
        error: function (xhr, ajaxOptions, thrownError) {
            console.log(xhr);
        }
    });
}

var counter = 0;

function recursiveTest() {
    if (counter < 5) {
        alert(counter);
        counter++;
        recursiveTest();
    }
}

/*
 * 
 * 
 */
var numFrom = 0;
var numTo = 0;

function updateSampledPropertyListsBySteps(url, stepSize) {
    var entityArray = viewer.dataSourceDisplay.defaultDataSource.entities.values;
    var entityArrayLength = entityArray.length;
    //  console.log(entityArray[0]);
    var tempURL = ""
    numFrom = numTo;
    numTo += stepSize;
    tempURL = url + "?" + "numFrom=" + numFrom + "&numTo=" + numTo;
    console.log(tempURL);
    $.getJSON(tempURL, function (data) {
        jsonData = data;
    }).done(
        function () {
            console.log("DONE!!!!!!!!!!!!!!");
            // loaded data handling
            var satellites = jsonData.satellites;
            var c = 0;
            $.each(satellites, function (i, sat) {
                var positions = sat.positions;
                // Each position of a satellite must be put into a
                var k = containsSat(entityArray, sat);
                if (c < maximalSatellites)
                    if (k > -1) { //Contains satellite = true
                        $.each(positions, function (j, pos) {
                            var time = new Cesium.JulianDate(pos.mJE + 2400000 + 0.5, 0,
                                Cesium.TimeStandard.UTC);
                            var position = new Cesium.Cartesian3(pos.x, pos.y,
                                pos.z);
                            entityArray[k].position.addSample(time, position);
                            updatePropStartEndTime(time);
                        });
                    } else {
                        var sampledPositionProperty = buildSampledPositionProperty(positions);
                        var entity = buildEntity(sat.id, sampledPositionProperty, propagationEndTime);
                        // Interpolation
                        entity.position.setInterpolationOptions({
                            interpolationDegree: 3,
                            interpolationAlgorithm: Cesium.LagrangePolynomialApproximation
                        });
                        //adding to the viewer
                        viewer.entities.add(entity);
                    }
                c++;
            })
        }).fail(function () {
        console.log("FAILED to load more Elements --> numFrom and numTo resetted");
        numFrom = 0;
        numTo = 0;
    }).then(function () {

        if (numTo <= maximalSatellites) {
            console.log("Loaded satellite recusive: " + numTo);
            //setTimeout(function () {
            tempURL = "";
            updateSampledPropertyListsBySteps(url, stepSize)
                //}, 10000);
                //updateSampledPropertyListsBySteps(tempURL, stepSize);
        } else {
            console.log("numFrom and numTo resetted");
            numFrom = 0;
            numTo = 0;
        }
    });
}


///////////////////////////////////////////HELPER FUNCTIONS////////////////////////////////////////////////////////////////////

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


//////////////////////////////////////////////View Contoller////////////////////////////////////////////////////////////////////
function flyToObjectByID(id) {
    var target = viewer.entities.getById(id);
    var options = {
        duration: 2
            // offset: new Cesium.HeadingPitchRange(-20, 90, 50)
    };

    //viewer.flyTo(target, options).then(function (result) {
    //    if (result) {
    viewer.selectedEntity = target;
    viewer.trackedEntity = target;

    //  }
    //    });
}


/*
 *
 */
function showObjects(strCathegorie, bool) {
    var zero = new Cesium.Cartesian3(0.0, 0.0, 0.0);
    var entityArray = viewer.dataSourceDisplay.defaultDataSource.entities.values;
    var borderFrom, BorderTo;

    switch (strCathegorie) {
        case "LEO":
            borderFrom = 200;
            BorderTo = 2000;
            break;
        case "MEO":
            borderFrom = 2000;
            BorderTo = 36000;
            break;
        case "GEO":
            borderFrom = 36000;
            BorderTo = 999999999;
            break;
        default:
            borderFrom = 0;
            BorderTo = 999999999;
    }

    for (var index = 0; index < entityArray.length; index++) {
        var SampPPColl = entityArray[index].position; // SampPPColl type = SampledPositionProperty
        var pAtPropStartTime = SampPPColl.getValue(propagationStartTime);
        var dist = Cesium.Cartesian3.distance(zero, pAtPropStartTime) / 1000 - 6371.007176;
        if (dist >= borderFrom && dist <= BorderTo) {
            entityArray[index].show = bool;
        }
    };
}
