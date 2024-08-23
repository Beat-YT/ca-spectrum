/**
 * @type {import('../../assets/licenses.json')}
 */
let licenses = null;

fetch('assets/licenses.json')
    .then((response) => response.json())
    .then((adata) => {
        licenses = adata;
        const table = document.getElementById('band-table');
        licenses.forEach((license) => {
            const row = document.createElement('tr');

            row.innerHTML = `
                <td>${license.name}</td>
                <td>${license.freqs.join('<br>')}</td>
                <td>${license.block}</td>
            `;

            row.classList = 'data'
            table.appendChild(row);
        });
    });

