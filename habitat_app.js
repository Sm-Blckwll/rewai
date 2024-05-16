$(document).ready(function() {
    $("#habitat-cal").on("click", function () {
        var map = L.map('mapid2').setView([51.008, -4.467], 5);

        L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
            maxZoom: 19,
            attribution: 'Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community'
        }).addTo(map);

        var PriDrawnItems = new L.FeatureGroup();
        map.addLayer(PriDrawnItems);

        var savedPriPolygons = []; // Array to store saved polygons

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

        map.on(L.Draw.Event.CREATED, function (event) {
            var layer = event.layer;

            var PriHabitatType = $('#PriHabitatType').val();

            layer.PriHabitatType = PriHabitatType;

            var area = turf.area(layer.toGeoJSON()) / 10000;

            $('#PriAreaValue').text(area.toFixed(2) + ' ha');

            PriDrawnItems.addLayer(layer);
        });

        $('#saveHabitatButton').on('click', function () {
            // Get the selected new habitat type when the save button is clicked
            var PriHabitatType = $('#PriHabitatType').val();

            PriDrawnItems.eachLayer(function (layer) {
                // Save the layer and its data to the list
                var savedPriPolygon = {
                    layer: layer.toGeoJSON(),
                    PriHabitatType: PriHabitatType,
                    PriArea: turf.area(layer.toGeoJSON()) / 10000 // Calculate area on save
                };

                // Update the total area with the saved data
                savedPriPolygons.push(savedPriPolygon);

                var totalPriorityHabitatArea = savedPriPolygons.reduce(function (sum, savedPriPolygon) {
                    return sum + savedPriPolygon.PriArea;
                }, 0);

                $('#totalPriorityHabitatAreaValue').text(totalPriorityHabitatArea.toFixed(2) + ' ha');

                // Change the color of the saved polygon based on its new habitat type
                var PriHabitatColor = getColor(PriHabitatType);

                // Create a new layer from the GeoJSON representation
                var savedLayer = L.geoJSON(savedPriPolygon.layer, {
                    style: {
                        fillColor: PriHabitatColor,
                        color: PriHabitatColor,
                        weight: 2
                    }
                });

                // Add the saved polygon to the map
                map.addLayer(savedLayer);

                // Display the area and habitat name inside the polygon
                savedLayer.bindTooltip('Area: ' + savedPriPolygon.PriArea.toFixed(2) + ' ha of\n' + savedPriPolygon.PriHabitatType).openTooltip();
            });

            // Clear drawn items layer for next drawing
            PriDrawnItems.clearLayers();
        });
    });

    function getColor(PriHabitatType) {
        // Define colors for each habitat type
        // Example color mapping, you can extend this based on your needs
        switch (PriHabitatType) {
            case 'ancient woodland':
                return '#228B22'; // Forest Green
            case 'lowland beech and yew woodland':
                return '#808000'; // Olive
            case 'lowland mixed deciduous woodland':
                return '#32CD32'; // Lime Green
            case 'lowland oak woodland':
                return '#6B8E23'; // Olive Drab
            case 'lowland mixed coniferous woodland':
                return '#556B2F'; // Dark Olive Green
            case 'lowland heathland':
                return '#CD5C5C'; // Indian Red
            case 'acid grassland':
                return '#8FBC8F'; // Dark Sea Green
            case 'calcareous grassland':
                return '#20B2AA'; // Light Sea Green
            case 'purple moor grass and rush pasture':
                return '#8A2BE2'; // Blue Violet
            case 'lowland dry acid grassland':
                return '#BDB76B'; // Dark Khaki
            case 'upland hay meadow':
                return '#F0E68C'; // Khaki
            case 'mountain heath':
                return '#2F4F4F'; // Dark Slate Gray
            case 'mountain grassland':
                return '#556B2F'; // Dark Olive Green
            case 'mountain pasture':
                return '#D2B48C'; // Tan
            case 'blanket bog':
                return '#BC8F8F'; // Rosy Brown
            case 'lowland raised bog':
                return '#B8860B'; // Dark Goldenrod
            case 'fen':
                return '#4682B4'; // Steel Blue
            case 'reedbed':
                return '#2E8B57'; // Sea Green
            case 'lowland fens':
                return '#556B2F'; // Dark Olive Green
            case 'purple moor grass and rush mire':
                return '#4B0082'; // Indigo
            case 'base-rich fen':
                return '#32CD32'; // Lime Green
            case 'open water':
                return '#000080'; // Navy
            case 'brackish marsh':
                return '#7FFFD4'; // Aquamarine
            case 'saltmarsh':
                return '#F0FFFF'; // Azure
            case 'coastal dunes':
                return '#F5DEB3'; // Wheat
            case 'mudflats':
                return '#DAA520'; // Goldenrod
            case 'machair':
                return '#FFE4B5'; // Moccasin
            case 'calaminarian grassland':
                return '#00CED1'; // Dark Turquoise
            case 'serpentinous rocky slopes':
                return '#A0522D'; // Sienna
            case 'limestone pavement':
                return '#FFE4C4'; // Bisque
            case 'limestone grassland':
                return '#90EE90'; // Light Green
            case 'limestone heath':
                return '#FF6347'; // Tomato
            case 'juniper scrub':
                return '#556B2F'; // Dark Olive Green
            case 'mountain hare\'s-tail cottongrass':
                return '#B0E0E6'; // Powder Blue
            case 'upland calcareous grassland':
                return '#3CB371'; // Medium Sea Green
            case 'upland heath':
                return '#CD5C5C'; // Indian Red
            case 'uval':
                return '#FFE4E1'; // Misty Rose
            case 'subalpine scrub':
                return '#228B22'; // Forest Green
            case 'subalpine grassland':
                return '#2E8B57'; // Sea Green
            case 'alpine and subalpine calcareous grassland':
                return '#3CB371'; // Medium Sea Green
            case 'alpine and subalpine heaths':
                return '#CD5C5C'; // Indian Red
            case 'alpine and subalpine cliff and slope':
                return '#DAA520'; // Goldenrod
            case 'alpine and subalpine rock vegetation':
                return '#808080'; // Gray
            default:
                return '#808080'; // Gray
        }
    }
});