 function initAutocomplete() {
        var map = new google.maps.Map(document.getElementById('map'), {
          center: {lat:33.4054, lng:-86.8114},
          zoom: 13,
          mapTypeId: 'roadmap'
        });
          
           function addMarker(latLng){
        var spot = new google.maps.Marker({
          position: latLng,
          map: map
        });
    }
          //Hoover High school
        addMarker({lat:33.34409, lng:-86.83765});
          //UAB
        addMarker({lat:33.5021, lng:-86.8064});
          //makrios
        addMarker({lat:33.5019781662405, lng:-86.7975303608446});
          //Hoover masjid
        addMarker({Lat:33.419584, Lng:-86.814381});
          //Riverchase gallria
        addMarker({lat:33.3781654, lng:-86.8063779});
          //Birmingham Museum of Art
        addMarker({lat:33.5222, lng:-86.8101});
          
           // This event listener calls addMarker() when the map is clicked.
        google.maps.event.addListener(map, 'click', function(event) {
          addMarker(event.latLng, map);
        });
          
           function setMapOnAll(map) {
        for (var i = 0; i < spot.length; i++) {
          spot[i].setMap(map);
        }
      }
              // Removes the markers from the map, but keeps them in the array.
      function clearMarkers() {
        setMapOnAll(null);
      }
     
          

        // Create the search box and link it to the UI element.
        var input = document.getElementById('pac-input');
        var searchBox = new google.maps.places.SearchBox(input);
        map.controls[google.maps.ControlPosition.TOP_LEFT].push(input);

        // Bias the SearchBox results towards current map's viewport.
        map.addListener('bounds_changed', function() {
          searchBox.setBounds(map.getBounds());
        });

        var markers = [];
        // Listen for the event fired when the user selects a prediction and retrieve
        // more details for that place.
        searchBox.addListener('places_changed', function() {
          var places = searchBox.getPlaces();

          if (places.length == 0) {
            return;
          }

          // Clear out the old markers.
          markers.forEach(function(marker) {
            marker.setMap(null);
          });
          markers = [];

          // For each place, get the icon, name and location.
          var bounds = new google.maps.LatLngBounds();
          places.forEach(function(place) {
            if (!place.geometry) {
              console.log("Returned place contains no geometry");
              return;
            }
            var icon = {
              url: place.icon,
              size: new google.maps.Size(71, 71),
              origin: new google.maps.Point(0, 0),
              anchor: new google.maps.Point(17, 34),
              scaledSize: new google.maps.Size(25, 25)
            };

            // Create a marker for each place.
            markers.push(new google.maps.Marker({
              map: map,
              icon: icon,
              title: place.name,
              position: place.geometry.location
            }));

            if (place.geometry.viewport) {
              // Only geocodes have viewport.
              bounds.union(place.geometry.viewport);
            } else {
              bounds.extend(place.geometry.location);
            }
          });
          map.fitBounds(bounds);
        });
          function populateInfoWindow(marker, infowindow) {
              if (infowindow.marker != marker) {
                  infowindow.marker;
                  infowindow.setContent('<div>' + marker.title + '</div>');
                  infowindow.open(map, marker);
                  infowindow.addListener('closeclick', function(){
                      infowindow.setMarker(null);
                  });
              }
          }
          
           var streetViewService = new google.maps.StreetViewService();
           var radius = 50;
           function getStreetView(data, status){
               if (status == google.maps.StreetViewStatus.OK) {
                   var nearStreetViewLocation = data.location.latLng;
                   var heading = google.maps.geometry.spherical.computeHeading(nearStreetViewLocation, marker.position);
                   infowindow.setContent('<div>' + marker.title + '</div><div id = "pano"></div>');
                   var panoramaOptions = {
                       position: nearStreetViewLocation, 
                       pov: {
                           heading: heading, 
                           pitch: 30
                       }
                   };
                   var panorama = new google.maps.StreetViewPanorama(
                   document.getElementById('pano'), panoramaOptions);
               } else {
                   infowindow.setContent('<div>' + marker.title + '</div>' + '<div>No Street View Found</div>');
               }
           }
          streetViewService.getPanoramaByLocation(marker.position, radius, getStreetView);
          infowindow.open(map, marker);
      }