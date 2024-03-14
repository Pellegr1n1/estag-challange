function addCells(valor) {
    var table = document.getElementsByTagName('table')[0];
    var newRow = table.insertRow(table.rows.length);
    var cells = []
    for (var i = 0; i <= valor; i++) {
        cells[i] = newRow.insertCell(i);
    }
    return cells
}

async function viewDetails(valor) {
    await fetch('http://localhost/controller/orders.php?action=getItem&id=' + valor, {
        method: 'GET'
    }).then(response => response.json())
        .then(data => {
            for (var i = 0; i <= (data.length - 1); i++) {
                console.log(data[i])
                alert(`
                Code: ${data[i]['code']}
                Name: ${data[i]['name']}
                Category: ${data[i]['name_category']} 
                Amount: ${data[i]['amount']}
                Unit Price: $${data[i]['price']}
                Tax: $${data[i]['tax']}
                Total: $${data[i]['total']}`)
            }
        })

}

window.addEventListener('load', async function () {
    await fetch('http://localhost/controller/orders.php?action=get', {
        method: 'GET',
    }).then(response => response.json())
        .then(data => {
            for (var i = 0; i <= (data.length - 1); i++) {
                var table = addCells(3)
                let icon = document.createElement('img')
                icon.src = '../svg/eye-fill.svg'
                icon.src = '../svg/eye-fill.svg'
                icon.setAttribute('onclick', `viewDetails(${data[i]['code']})`)

                table[0].innerText = data[i]['code']
                table[1].innerText = data[i]['tax']
                table[2].innerText = data[i]['total']
                table[3].appendChild(icon)
            }
        });
})