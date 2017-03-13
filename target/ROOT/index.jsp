<!DOCTYPE html>
<html lang="en">

<head>
    <!-- Use correct character set. -->
    <meta charset="utf-8">
    <!-- Tell IE to use the latest, best version. -->
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <!-- Make the application on mobile take up the full browser screen and disable user scaling. -->
    <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, minimum-scale=1, user-scalable=no">
    <title>Asteria :: Catalog-Visualizer</title>
    <script src="jq.js"></script>
    <script src="Build/Cesium/Cesium.js"></script>
    <script src="logic.js"></script>
    <script src="airbus-cesium-HUD.js"></script>
    <link rel="stylesheet" type="text/css" href="css/navigationbar.css">

    <style>
        @import url(Build/Cesium/Widgets/widgets.css);
        html,
        body,
        #cesiumContainer {
            width: 100%;
            height: 100%;
            margin: 0;
            padding: 0;
            overflow: hidden;
        }
    </style>
</head>

<body>
    <!--<%@ page import="java.net.InetAddress" %>
        <%@ page import="java.net.UnknownHostException" %>-->
    <div id="cesiumContainer"></div>
    <div id="toolbar-left">

        <div class="class-navigation" id="navigationBox">
            <button type="button" class="ADS-button" id="btnEnvisat">Show Envisat</button>
            <button type="button" class="ADS-button" id="btnISS">Show ISS</button>
            <br>
            <div class="class-label-button-pattern">
                <label class="lblShow" id="lblLEO">Show LEO</label>
                <input class="show-sat-checkbox" type="checkbox" id="cbLEO">
            </div>
            <br>
            <div class="class-label-button-pattern">
                <label class="lblShow" id="lblLEO">Show MEO</label>
                <input class="show-sat-checkbox" type="checkbox" id="cbMEO">
            </div>
            <br>
            <div class="class-label-button-pattern">
                <label class="lblShow" id="lblGEO">Show GEO</label>
                <input class="show-sat-checkbox" type="checkbox" id="cbGEO">
                <div id="div-lable-menu">Menu</div>
            </div>
            <br>

        </div>
    </div>
    <script>
        initCesiumView();
        //manageDataImport("http://localhost:8080/catalog-visualizer34");
        manageDataImport("123456");
        //showFlightLine();
        /* startAutoLoad(<% try {
                     String inet = InetAddress.getLocalHost().getHostAddress();
                 
                     out.print("\"localhost:8080/CatalogConnectionServlet/catalog-visualizer\"");
                     //out.print("\"http://"+ inet + ":8080/catalog-visualizer\"");
               
             } catch (UnknownHostException e) {
                   } %>);
          */
    </script>
</body>

</html>
