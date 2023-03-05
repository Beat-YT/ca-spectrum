/// <reference path="types.d.ts" />

const indexes = Object.freeze(
    {
        600: 0,
        700: 1,
        850: 2,
        1900: 3,
        2100: 4,
        2300: 5,
        2600: 6,
        3500: 7,
    }
);



// a palette of colors that are easy to distinguish from each other
const PairableColors = Object.freeze(
    [
        "#FF7F50",
        "#FFC0CB",
        "#F0E68C",
        "#FFFACD",
        "#F5DEB3",
        "#FFE4E1",
        "#FFA07A",
        "#FFDAB9",
    ]
)


/**
 * 
 * @param {Spectrum[]} spectrumList
 * @returns 
 */
function updateTable(spectrumList) {
    const { tables, spectrumTable, templateTable } = clearTable();
    // first we need to group contiguous spectrum together
    const contiguousGroup = findContiguous(spectrumList);

    const bMarkContiguous = document.getElementById('mark-contigous').checked;

    // now we iterate over the spectrum groups and update the table accordingly and update the total
    contiguousGroup.forEach(group => {
        // get the total for the group and update it
        const totalBw = group.reduce((acc, x) => acc + x.bandwidth, 0);
        const total = document.getElementById(`${group[0].frequency}bw`);
        const currentTotal = parseFloat(total.innerText);
        total.innerText = currentTotal + totalBw;

        const color = PairableColors[contiguousGroup.indexOf(group) % PairableColors.length];

        // iterate over the spectrum in the group
        group.forEach(spectrum => {

            const index = indexes[spectrum.frequency];
            if (index === undefined) {
                console.error(`Unknown frequency: ${spectrum.frequency}`);
                return;
            }

            // find a free row or create a new one for the block
            let row = tables.find(x => x.getElementsByTagName('td')[index].innerHTML === '');

            if (!row) {
                row = templateTable.cloneNode(true);
                tables.push(row);

                spectrumTable.appendChild(row);
            }


            console.log('adding spectrum', spectrum.frequency);
            row.getElementsByTagName('td')[index].innerText = spectrum.name + `\n${spectrum.bandwidth} Mhz`;
            if (bMarkContiguous)
                row.getElementsByTagName('td')[index].style.backgroundColor = color;
        });
    });
}

/**
 * here we are trying to group contiguous spectrum
 * @param {Spectrum[]} spectrum 
 */
function findContiguous(spectrum) {
    // first of, we need to keep track of our contiguous spectrum
    // an array of array of spectrum that are contiguous
    const contiguousSpectrum = [];

    // we need to sort the spectrum by frequency since we are going to iterate over it
    const sortedSpectrum = spectrum.sort((a, b) => a.from - b.from);

    // we need to keep track of the current contiguous spectrum
    let currentContiguous = [];

    // now we iterate over the spectrum
    for (let i = 0; i < sortedSpectrum.length; i++) {
        const current = sortedSpectrum[i];
        const next = sortedSpectrum[i + 1];

        

        // if the next spectrum is contiguous with the current one, we add it to the current contiguous spectrum
        if (next && next.from === current.to && next.frequency === current.frequency && (current.paired == null ? next.paired == null : next.paired != null)) {

            currentContiguous.push(current);
        }
        else {
            // if the next spectrum is not contiguous, we add the current spectrum to the current contiguous spectrum
            currentContiguous.push(current);

            // we add the current contiguous spectrum to the list of contiguous spectrum
            contiguousSpectrum.push(currentContiguous);

            // we reset the current contiguous spectrum
            currentContiguous = [];
        }
    }

    return contiguousSpectrum;
}


// make a template table
const templateTable = document.createElement('tr');
templateTable.innerHTML = new Array(8).fill('<td></td>').join('');

function clearTable() {
    const spectrumTable = document.getElementById('spectrumTable');
    // make sure that the table is empty, but keep the header
    while (spectrumTable.children.length > 1) {

        spectrumTable.removeChild(spectrumTable.lastChild);
    }



    const sptrmTable = spectrumTable.getElementsByTagName('tr');

    const totalTable = sptrmTable[1];
    const tables = Array.from(sptrmTable);
    tables.shift(); // remove the header row
    tables.shift(); // remove the total row

    // reset the total
    const totals = Array.from(totalTable.getElementsByTagName('b'));
    totals.forEach(x => x.innerText = '0');

    return { tables, spectrumTable, templateTable };
}

