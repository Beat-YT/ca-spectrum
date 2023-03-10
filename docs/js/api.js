const WORKER_URL = 'https://what-is-the-spectrum.ytbeat32.workers.dev/';
const bUseMocking = false;


async function fetchArea(carrier, lat, lng) {
    const query = new URLSearchParams({ carrier, lat, lng });
    let requestUrl = WORKER_URL + '?' + query.toString();

    if (bUseMocking) {
        requestUrl = 'mock.html';
    }

    const response = await fetch(requestUrl);
    if (response.status !== 200) {
        throw new Error('Failed to fetch data: HTTP ' +
            response.status + " " + response.statusText);
            
    }

    return await response.text();
}

