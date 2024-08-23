var map = L.map('map').setView([58, -97], 4);
L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 17,
    attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
}).addTo(map);

let establishments = null;

document.getElementById('bandlistArea').addEventListener('click', function (event) {
    if (establishments) {
        map.removeLayer(establishments);
    }

    let target = event.target;
    // Check if the clicked element is a <td> and get the parent <tr>
    while (target && target.nodeName !== 'TR') {
        target = target.parentElement;
    }

    if (!target) return;
    document.getElementsByClassName('selected')[0].classList = 'data';
    target.classList = 'data selected';

    const name = target.children[0].textContent;
    const block = target.children[2].textContent;

    const band = licenses.find((license) => license.name === name && license.block === block);
    
    const parsed = band.licenses.map(x => {
        x.realArea = x.area;
        if (x.area == '2-017') x.area = '2-011';
        if (x.area == '2-018') x.area = '2-012';
        x.area = x.area.replace(/(\d-\d{3})-\d+/, '$1');
        return x;
    });

    parsed.sort((a, b) => {
        // sort to put subordinate services at the end
        if (a.subservice.toLowerCase().includes('subordinate') && !b.subservice.toLowerCase().includes('subordinate')) {
            return 1;
        } else if (!a.subservice.toLowerCase().includes('subordinate') && b.subservice.toLowerCase().includes('subordinate')) {
            return -1;
        }

        // sort by company
        return a.company.localeCompare(b.company);
    });

    establishments = L.geoJson(null, {
        filter: function (feature, layer) {
            if (feature.properties["description"].includes('TEL-074')) {
                return false
            }

            const has = parsed.find(x => feature.properties["description"].includes(x.area) && !x.subservice.toLowerCase().includes('subordinate'))
            if (!has) {
                const area = /<td>Service_Area_Zone_de_service<\/td><td>(.{1,3}-.{1,4})<\/td>/.exec(feature.properties["description"])[1];
                const areaName = /<td>Service_Area_Name<\/td><td>(.*)<\/td>/.exec(feature.properties["description"])[1]
                console.log('No data for ' + area + ' ' + areaName)
            }
            return has != null
        },
        onEachFeature: function (feature, layer) {
            const mines = parsed.filter(x => feature.properties["description"].includes(x.area));
            const brohtml = `
            <table>
                <thead>
                    <tr class="header">
                        <th>Name</th>
                        <th>Subservice</th>
                        <th>Area</th>
                    </tr>
                </thead>
                <tbody>
                    ${mines.map(x => {
                return `
                        <tr>
                            <td>${x.company}</td>
                            <td>${x.subservice}</td>
                            <td>${x.areaName}</td>
                        </tr>
                    `
            }).join('')}
            </table>
            `

            const area = /<td>Service_Area_Zone_de_service<\/td><td>(.{1,3}-.{1,4})<\/td>/.exec(feature.properties["description"])[1];
            const areaName = /<td>Service_Area_Name<\/td><td>(.*)<\/td>/.exec(feature.properties["description"])[1]
            layer.bindPopup(`<h3>${area} ${areaName}</h3><br>` + brohtml);
        },
        pointToLayer: function (feature, latlng) {
            return L.marker(latlng, { icon: svgIcon });
        },
        style: function (feature) {
            const mine = parsed.find(x => feature.properties["description"].includes(x.area) && !x.subservice.toLowerCase().includes('subordinate'))
            const company = mine.company.toLowerCase();
            if (company.includes('telus')) {
                // green
                return {
                    fillColor: 'green',
                    fillOpacity: 0.5,
                    weight: 1,
                    color: 'black'
                }
            } else if (company.includes('bell')) {
                // blue
                return {
                    fillColor: '#00b3ff',
                    fillOpacity: 0.5,
                    weight: 1,
                    color: 'black'
                }
            } else if (company.includes('rogers') || company.includes('fido')) {
                // red
                return {
                    fillColor: 'red',
                    fillOpacity: 0.5,
                    weight: 1,
                    color: 'black'
                }
            } else if (company.includes('vidéotron') || company.includes('videotron') || company.includes('freedom')) {
                // yellow
                return {
                    fillColor: 'yellow',
                    fillOpacity: 0.5,
                    weight: 1,
                    color: 'black'
                }
            }

            return {
                fillColor: 'gray',
                fillOpacity: 0.5,
                weight: 1,
                color: 'black'
            }
        }
    });

    const hasTel = parsed.some(x => x.area.startsWith('TEL-') && !x.subservice.toLowerCase().includes('subordinate'));
    const hasTier2 = parsed.some(x => x.area.startsWith('2-') && !x.subservice.toLowerCase().includes('subordinate'));
    const hasTier3 = parsed.some(x => x.area.startsWith('3-') && !x.subservice.toLowerCase().includes('subordinate'));
    const hasTier4 = parsed.some(x => x.area.startsWith('4-') && !x.subservice.toLowerCase().includes('subordinate'));

    if (hasTel) {
        const someWithTel = parsed.find(x => x.area.startsWith('TEL-'));
        console.log(someWithTel)
        omnivore.kml('assets/kmls/TEL.KML', null, establishments).addTo(map);
    }

    if (hasTier2) {
        omnivore.kml('assets/kmls/Tier2.KML', null, establishments).addTo(map);
    }

    if (hasTier3) {
        omnivore.kml('assets/kmls/Tier3.KML', null, establishments).addTo(map);
    }

    if (hasTier4) {
         omnivore.kml('assets/kmls/Tier4.KML', null, establishments).addTo(map);
    }
});