if(!listing.geometry.coordinates){
    listing.geometry.coordinates = [77.594, 12.97]; // Ensure coordinates is an array [lng, lat]
}
const map = new maplibregl.Map({
    style: 'https://tiles.openfreemap.org/styles/liberty',
    center: listing.geometry.coordinates, // Correct usage
    zoom: 9,
    container: 'map',
});

const marker = new maplibregl.Marker({color:"red"})
    .setLngLat(listing.geometry.coordinates) // Remove extra []
    .setPopup(new maplibregl.Popup({offset:25})
        .setHTML(`<h4>${listing.title}</h4>
            <p>Exact Location provided after booking</p>`))
    .addTo(map);
