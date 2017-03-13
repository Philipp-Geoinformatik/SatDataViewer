$(document).ready(function () {


    $("#btnISS").click(function () {
        flyToObjectByID(12 /*25544*/ );
    });
    $("#btnEnvisat").click(function () {
        flyToObjectByID(27386);
    });
    $("#cbLEO").change(function () {
        if ($(this).is(":checked")) {
            showObjects("LEO", true);
        } else {
            showObjects("LEO", false);
        }
    });
    $("#cbMEO").change(function () {
        if ($(this).is(":checked")) {
            showObjects("MEO", true);
        } else {
            showObjects("MEO", false);
        }
    });
    $("#cbGEO").change(function () {
        if ($(this).is(":checked")) {
            showObjects("GEO", true);
        } else {
            showObjects("GEO", false);
        }
    });
});


function showTimes() {
    alert("PropagationStartTime:\t" + propagationStartTime + "\nCurrentTime:\t\t\t" + viewer.clock.currentTime + "\nPropagationEndTime:\t" + propagationEndTime);
}


function setPropend() {
    propagationEndTime = Cesium.JulianDate.addSeconds(propagationEndTime, -300, new Cesium.JulianDate());
    console.log(Cesium.JulianDate.toDate("" + propagationEndTime));
}


/*
 *
 */
function changePropEndTime() {
    propagationEndTime = new Cesium.JulianDate();

}





//////////////////// Dynamically GUI-Build////////////////////////////////////
/**
 * Adding the "Delete" button (start)
 **/
/* var button = document.createElement('button');
    button.type = 'button';
    button.textContent = 'Show Envisat';
    button.className = 'ADS-button';
    button.id = 'btnEnvisat';
    document.getElementById('toolbar-left').appendChild(button);

    var button2 = document.createElement('button');
    button2.type = 'button';
    button2.textContent = 'Show ISS';
    button2.className = 'ADS-button';
    button2.id = 'btnISS';
    document.getElementById('toolbar-left').appendChild(button2);

    var button3 = document.createElement('button');
    button3.type = 'button';
    button3.textContent = 'LEO';
    button3.className = 'ADS-button';
    button3.id = 'btnLEO';
    document.getElementById('toolbar-left').appendChild(button3);

    var box = document.createElement('div');
    box.type = 'div';
    box.className = "class-navigation";
    box.id = 'navigationBox';
    document.getElementById("toolbar-left").appendChild(box);
    //LEO
    var lblLEO = document.createElement('label');
    lblLEO.id = "lblLEO";
    lblLEO.innerHTML = "Show LEO";
    document.getElementById("navigationBox").appendChild(lblLEO);

    var cbLEO = document.createElement('input');
    cbLEO.type = 'checkbox';
    cbLEO.id = 'cbLEO';
    document.getElementById("navigationBox").appendChild(cbLEO);

    //MEO
    var lblMEO = document.createElement('label');
    lblMEO.id = "lblLEO";
    lblMEO.innerHTML = "Show MEO";
    document.getElementById("navigationBox").appendChild(lblMEO);

    var cbMEO = document.createElement('input');
    cbMEO.type = 'checkbox';
    cbMEO.id = 'cbMEO';
    document.getElementById("navigationBox").appendChild(cbMEO);

    //GEO
    var lblGEO = document.createElement('label');
    lblGEO.id = "lblGEO";
    lblGEO.innerHTML = "Show GEO";
    document.getElementById("navigationBox").appendChild(lblGEO);

    var cbGEO = document.createElement('input');
    cbGEO.type = 'checkbox';
    cbGEO.id = 'cbGEO';
    document.getElementById("navigationBox").appendChild(cbGEO);
*/
//////////////////////////////////////////////////
