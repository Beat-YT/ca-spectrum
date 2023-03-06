/// <reference path="types.d.ts" />

function lookupSpectrum(lat, lng) {
    console.log(lat, lng)
}

var map = L.map('map').setView([58, -97], 4);
L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 17,
    attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
}).addTo(map);

map.locate({ setView: true, maxZoom: 16 })

var marker = L.marker();
marker.setLatLng([51.5, -0.09])
marker.addTo(map);
function onMapClick(e) {
    console.log(e)
    marker
        .setLatLng(e.latlng)
}


map.on('click', onMapClick);
map.on('locationfound', onMapClick);
map.locate({ setView: true, maxZoom: 16 });

/*
rows are like this:
<tr>
            <th>600Mhz</th>
            <th>700Mhz</th>
            <th>850Mhz</th>
            <th>1900Mhz</th>
            <th>2100MHz</th>
            <th>2300MHz</th>
            <th>2600MHz</th>
            <th>3500MHz</th>
        </tr>
*/



//queryLocation(50.8289243, -94.459076);


document.getElementById('submit').addEventListener('click', () => {
    const lat = marker._latlng.lat;
    const lng = marker._latlng.lng;
    const carrier = document.getElementById('carrierSelect').value

    onSubmit(carrier, lat, lng);
})

document.getElementById('mark-contigous').addEventListener('change', () => {
    const checked = document.getElementById('mark-contigous').checked;

    window.localStorage.setItem('mark-contigous', checked);
})

document.getElementById('carrierSelect').addEventListener('change', () => {
    const carrier = document.getElementById('carrierSelect').value;

    window.localStorage.setItem('carrier', carrier);
})

document.getElementById('allow-subordinate').addEventListener('change', () => {
    const checked = document.getElementById('allow-subordinate').checked;

    window.localStorage.setItem('allow-subordinate', checked);
})

document.getElementById('allow-subordinate').checked = window.localStorage.getItem('allow-subordinate') === 'true';
document.getElementById('mark-contigous').checked = window.localStorage.getItem('mark-contigous') === 'true';;
document.getElementById('carrierSelect').value = window.localStorage.getItem('carrier') || 'Bell';


function showLoading() {
    // Hide the website content until it is loaded
    // Show the loading screen
    document.getElementById('loading-screen').style.display = 'flex';

    // Prevent user from interacting with the website
    document.body.style.pointerEvents = 'none';
}

function hideLoading() {
    document.getElementById('loading-screen').style.display = 'none';
    document.getElementById('content').style.display = 'block';
    document.body.style.pointerEvents = 'auto';
}


document.getElementById('Localization').onclick = function() {
    map.locate({ setView: true, maxZoom: 16 })
}



hideLoading()   
