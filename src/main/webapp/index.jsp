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
    <div id="cesiumContainer"></div>
    <script>
        initCesiumView();
        loadSSAOfflineData("sat.json");

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