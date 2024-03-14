function createCategory() {
    var nameInput = document.getElementById("id_category").value;
    var taxInput = parseFloat(document.getElementById("id_tax").value).toFixed(2);
    var nameFilter = escapeHtml(nameInput)

    var obj_category = {
        "name": nameFilter,
        "tax": taxInput,
    }

    return obj_category
}

function escapeHtml(text) {
    var map = {
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#039;'
    };

    return text.replace(/[&<>"']/g, function (m) { return map[m]; });
}

function addCells() {
    var table = document.getElementsByTagName('table')[0];

    var newRow = table.insertRow(table.rows.length);
    var cells = []

    for (var i = 0; i <= 3; i++) {
        cells[i] = newRow.insertCell(i);
    }
    return cells
}

document.querySelector('form').addEventListener('submit', async function (event) {
    event.preventDefault();
    var category = createCategory()
    var obj_category = JSON.stringify(category)
    let imgDelete = document.createElement('img')
    imgDelete.src = '../svg/trash-fill.svg'
    imgDelete.setAttribute("onclick", `deletar(${category.code})`)

    // enviar dados php
    await fetch('http://localhost/controller/categories.php?action=1', {
        method: 'POST',
        body: obj_category
    }).then(response => response.json())
        .then(location.reload());
})

async function deletar(id) {
    if (confirm("Deseja realmente deletar?")) {
        localStorage.removeItem('category' + id)
        var del = {
            'codeDelete': id
        }
        // enviar dados php
        await fetch('http://localhost/controller/categories.php?action=2', {
            method: 'DELETE',
            body: JSON.stringify(del)
        }).then(response => response.json())
            .then(data => {
                if (data['status'] == 500) {
                    alert('Você não pode excluir essa categoria pois ela está relacionada a um produto!')
                }
            });
    }
    location.reload()
}

async function getCategory() {
    const category = []
    await fetch('http://localhost/controller/categories.php?action=get', {
        method: 'GET'
    }).then(response => response.json()).then(data => {
        for (var i = 0; i <= (data.length - 1); i++) {
            category[i] = data[i]
        }
    });
    return category
}

window.addEventListener('load', async function () {
    await fetch('http://localhost/controller/categories.php?action=get', {
        method: 'GET'
    }).then(response => response.json()).then(data => {
        for (var i = 0; i <= (data.length - 1); i++) {
            var table = addCells()
            console.log(data[i])
            let imgDelete = document.createElement('img')
            imgDelete.src = '../svg/trash-fill.svg'
            imgDelete.setAttribute("onclick", `deletar(${data[i]['code']})`)

            table[0].innerText = data[i]['code']
            table[1].innerText = data[i]['name']
            table[2].innerText = `${data[i]['tax']}%`
            table[3].appendChild(imgDelete)
        }
    });
}) 