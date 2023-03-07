/// <reference path="parser.js" />

async function onSubmit(carrier, lat, lng) {
    try {
        clearTable();
        showLoading();
        const data = await fetchArea(carrier, lat, lng);
    
        const parsed = await parseData(data, carrier);
    
        console.log(parsed);
    /*
        const result = btoa(
            JSON.stringify({
                carrier,
                latlng: [lat, lng],
                data: parsed,
                mark: document.getElementById('mark-contigous').checked
            })
        );

        window.location.hash = result;*/

        updateTable(parsed);
    }
    finally {
        hideLoading();
    }
}


if (window.location.hash.length > 0) {
    const resultData = JSON.parse(atob(window.location.hash.substring(1)));
    marker.setLatLng(resultData.latlng);

    document.getElementById('carrierSelect').value = resultData.carrier;
    document.getElementById('mark-contigous').checked = resultData.mark;

    updateTable(resultData.data);
}

