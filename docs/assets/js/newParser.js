function parseData(rawHtml) {
    const ele = document.createElement('html');
    ele.innerHTML = rawHtml;


    // find the table with all the results. Using the classes is a bit of a hack, but it works
    const resultsTable = ele.getElementsByClassName('table table-striped table-bordered table-condensed dataTable')[0];
    const resultBody = resultsTable.getElementsByTagName('tbody')[0];

    // get all the rows from the table
    const rows = resultBody.getElementsByTagName('tr');

    const data = Array.from(rows)
        .map(
            x => {
                const cells = x.getElementsByTagName('td');
                const cellArray = Array.from(cells);
                const [authorization, account, company, subservice, category, area, from, to] = cellArray.map(x => x.innerText.trim());
                const [areaCode, areaName] = area.split('\n');
                return {
                    authorization,
                    account,
                    company,
                    subservice,
                    category,
                    area: areaCode,
                    areaName: area,
                    from: parseFloat(from),
                    to: parseFloat(to)
                }
            }
        )
        .filter(x => x != null)
        .sort((a, b) => a.from - b.from)

    return data;
}