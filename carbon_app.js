$(document).ready(function() {
    $("#carbon-cal").on("click", function() {
        var map = L.map('mapid').setView([51.008, -4.467], 5);

        L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
            maxZoom: 19,
            attribution: 'Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community'
        }).addTo(map);

        var drawnItems = new L.FeatureGroup();
        map.addLayer(drawnItems);

        var drawControl = new L.Control.Draw({
            draw: {
                polyline: false,
                circle: false,
                marker: false,
                circlemarker: false,
                rectangle: false,
                polygon: {
                    shapeOptions: {
                        color: 'white'
                    },
                },
            },
        });
        map.addControl(drawControl);

        var sequestrationRates = {
            'woodland': 2.0,
            'plantation': 2.5,
            'grassland': 0.4,
            'silage': 1.0,
            'wetland': 1.5,
            'salt marsh': 2.5,
            'annual crops': 0.2,
            'perennial crops': 0.8,
            'urban': 0.0,
            'peatland': 3.0,
            'scrub': 0.3,
        };

        var savedPolygons = [];

        map.on(L.Draw.Event.CREATED, function(event) {
            var layer = event.layer;
            var currentHabitatType = $('#currentHabitatType').val();
            var newHabitatType = $('#newHabitatType').val();
            layer.currentHabitatType = currentHabitatType;
            layer.newHabitatType = newHabitatType;
            var area = turf.area(layer.toGeoJSON()) / 10000;
            $('#areaValue').text(area.toFixed(2) + ' ha');
            var currentSequestration = area * sequestrationRates[currentHabitatType];
            var newSequestration = area * sequestrationRates[newHabitatType];
            var sequestrationDifference = newSequestration - currentSequestration;
            layer.currentSequestration = currentSequestration;
            layer.newSequestration = newSequestration;
            layer.sequestrationDifference = sequestrationDifference;
            $('#currentCarbonValue').text(currentSequestration.toFixed(2) + ' t');
            $('#newCarbonValue').text(newSequestration.toFixed(2) + ' t');
            $('#carbonDifference').text(sequestrationDifference.toFixed(2) + ' t');
            drawnItems.addLayer(layer);
        });

        map.on(L.Draw.Event.EDITED, function(event) {
            var layers = event.layers;
            layers.eachLayer(function(layer) {
                var currentHabitatType = $('#currentHabitatType').val();
                var newHabitatType = $('#newHabitatType').val();
                layer.currentHabitatType = currentHabitatType;
                layer.newHabitatType = newHabitatType;
                var area = turf.area(layer.toGeoJSON()) / 10000;
                $('#areaValue').text(area.toFixed(2) + ' hectares');
                var currentSequestration = area * sequestrationRates[currentHabitatType];
                var newSequestration = area * sequestrationRates[newHabitatType];
                var sequestrationDifference = newSequestration - currentSequestration;
                layer.currentSequestration = currentSequestration;
                layer.newSequestration = newSequestration;
                layer.sequestrationDifference = sequestrationDifference;
                $('#currentCarbonValue').text('Current: ' + currentSequestration.toFixed(2) + ' t');
                $('#newCarbonValue').text('New: ' + newSequestration.toFixed(2) + ' t');
                $('#carbonDifference').text(sequestrationDifference.toFixed(2) + ' t');
            });
        });

        $('#currentHabitatType, #newHabitatType').on('change', updateSequestration);

        function updateSequestration() {
            drawnItems.eachLayer(function(layer) {
                var currentHabitatType = $('#currentHabitatType').val();
                var newHabitatType = $('#newHabitatType').val();
                var area = turf.area(layer.toGeoJSON()) / 10000;
                var currentSequestration = area * sequestrationRates[currentHabitatType];
                var newSequestration = area * sequestrationRates[newHabitatType];
                var sequestrationDifference = newSequestration - currentSequestration;
                layer.currentSequestration = currentSequestration;
                layer.newSequestration = newSequestration;
                layer.sequestrationDifference = sequestrationDifference;
                $('#currentCarbonValue').text('Current: ' + currentSequestration.toFixed(2) + ' t');
                $('#newCarbonValue').text('New: ' + newSequestration.toFixed(2) + ' t');
                var differenceElement = $('#carbonDifference');
                if (sequestrationDifference > 0) {
                    differenceElement.text('+' + sequestrationDifference.toFixed(2));
                    differenceElement.css('color', 'green');
                } else if (sequestrationDifference < 0) {
                    differenceElement.text(sequestrationDifference.toFixed(2));
                    differenceElement.css('color', 'red');
                } else {
                    differenceElement.text(sequestrationDifference.toFixed(2));
                    differenceElement.css('color', 'black');
                }
            });
        }

        $('#saveButton').click(function() {
            var newHabitatType = $('#newHabitatType').val();
            drawnItems.eachLayer(function(layer) {
                var savedPolygon = {
                    layer: layer.toGeoJSON(),
                    currentHabitatType: layer.currentHabitatType,
                    newHabitatType: newHabitatType,
                    currentSequestration: layer.currentSequestration,
                    newSequestration: layer.newSequestration,
                    sequestrationDifference: layer.sequestrationDifference
                };
                savedPolygons.push(savedPolygon);
                var totalCarbon = savedPolygons.reduce(function(sum, savedPolygon) {
                    return sum + savedPolygon.sequestrationDifference;
                }, 0);
                $('#totalCarbonValue').text(totalCarbon.toFixed(2) + ' tons of CO2e per year');
                var habitatColor = getColor(savedPolygon.newHabitatType);
                var savedLayer = L.geoJSON(savedPolygon.layer, {
                    style: {
                        fillColor: habitatColor,
                        color: habitatColor,
                        weight: 2
                    }
                });
                map.addLayer(savedLayer);
                var area = turf.area(savedPolygon.layer) / 10000;
                savedLayer.bindTooltip('Area: ' + area.toFixed(2) + 'ha of\n' + savedPolygon.newHabitatType).openTooltip();
            });
            drawnItems.clearLayers();
        });

        function getColor(habitatType) {
            switch (habitatType) {
                case 'woodland':
                    return '#008531';
                case 'plantation':
                    return '#008556';
                case 'grassland':
                    return '#7a9e16';
                case 'silage':
                    return '#72ba6c';
                case 'wetland':
                    return '#6cba9c';
                case 'salt marsh':
                    return '#6cbab5';
                case 'annual crops':
                    return '#baac6c';
                case 'perennial crops':
                    return '#b0ba6c';
                case 'urban':
                    return '#dbd5c5';
                case 'peatland':
                    return '#ba936c';
                case 'scrub':
                    return '#798767';
                default:
                    return '#ededed'; // Default color for unknown types
            }
        }
    });
});