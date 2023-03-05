/// <reference path="bandMapping.js" />

async function parseData(rawHtml, carrier) {
    const ele = document.createElement('html');
    ele.innerHTML = rawHtml;


    // find the table with all the results. Using the classes is a bit of a hack, but it works
    const resultsTable = ele.getElementsByClassName('table table-striped table-bordered table-condensed dataTable')[0];
    const resultBody = resultsTable.getElementsByTagName('tbody')[0];

    // get all the rows from the table
    const rows = resultBody.getElementsByTagName('tr');
    
    const data = mapHtml(rows);

    // Rogers have A block everywhere, but it's registered under an other name (Fido Solutions)
    if (carrier === 'rogers') {
        data.push(
            {
                bandwidth: 15,
                category: 'Personal Communication Service',
                frequency: 1900,
                from: 1850,
                to: 1865,
                name: 'Block A',
                friendlyName: 'Band 2',
                paired: {
                    bandwidth: 15,
                    category: 'Personal Communication Service',
                    frequency: 1900,
                    from: 1930,
                    to: 1945,
                    name: "Block A'",
                    friendlyName: 'Band 2'
                }
            }
        )
    }

    return data;
}