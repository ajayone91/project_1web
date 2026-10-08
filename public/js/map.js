

const mapContainer = document.getElementById('map');

if (mapContainer && window.mapToken) {
      mapboxgl.accessToken = window.mapToken;

      const map = new mapboxgl.Map({
            container: mapContainer,
            center: [ ...window.listing.geometry.coordinates],
            zoom: 9
      });

      new mapboxgl.Marker({ color: 'red' })
            .setLngLat([ ...window.listing.geometry.coordinates])
            .setPopup(
                  new mapboxgl.Popup({ offset: 25 }).setHTML
            ('<h5> ' + window.listing.title + '</h5> <p> exact location will be shown here </p>'  )

            ) // Add a popup with a title
            .addTo(map);
} else if (mapContainer) {
      mapContainer.textContent = 'Map is unavailable. Please check the Mapbox token.';
}

