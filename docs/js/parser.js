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
    if (carrier.toLowerCase() === 'rogers') {
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


/**
 * @param {HTMLCollectionOf<HTMLTableRowElement>} rows
 * @returns {Spectrum[]}
 */
function mapHtml(rows) {
    const bAllowSubordinate = true//document.getElementById('allow-subordinate').checked;

    return Array.from(rows)
        .filter(
            x => {
                if (bAllowSubordinate)
                    return true;

                const cells = x.getElementsByTagName('td');
                const type = cells[3].innerHTML.trim();

                return type.toLowerCase() != 'subordinate';
            }
        ).map(
            x => {
                const cells = x.getElementsByTagName('td');
                const category = cells[4].innerHTML.trim();
                const from = parseFloat(cells[6].innerHTML.trim());
                const to = parseFloat(cells[7].innerHTML.trim());
                const bandwidth = to - from;

                return {
                    "name": undefined,
                    category,
                    to,
                    from,
                    bandwidth,
                    paired: null,
                    //frequency: mapBandToFrequency(category)
                }
            }
        )
        .filter(x => x != null)
        .sort((a, b) => a.from - b.from)
        //.filter(x => x.frequency != null)
        .filter(
            (x, i, array) => {
                const isPaired = array.some(s => s.paired === x);
                return !isPaired
            });
}