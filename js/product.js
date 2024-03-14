async function createProduct() {
    var nameInput = document.getElementById("id_product").value
    var amountInput = parseInt(document.getElementById("id_amount").value)
    var priceInput = parseFloat(document.getElementById("id_unit_price").value).toFixed(2)
    var qtdRow = document.getElementsByTagName('tr')
    var codeProduct = qtdRow.length;

    // pegando categoria selecionada e criando produto
    var select = document.querySelector('#id_category')
    const indice = select.selectedIndex
    const value = select.options[indice].text
    var category = await getCategory()
    var nameFilter = escapeHtml(nameInput)
    for (var i = 0; i <= (category.length - 1); i++) {
        if (category[i]["name"] == value) {
            var obj_product = {
                "code": codeProduct,
                "name": nameFilter,
                "amount": amountInput,
                "price_unit": priceInput,
                "category": {
                    "code": category[i]['code'],
                    "name": category[i]['name'],
                    "tax": category[i]['tax']
                }
            }
        } else {
            console.log('categoria errada!')
        }
    }
    return obj_product
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

    for (var i = 0; i <= 6; i++) {
        cells[i] = newRow.insertCell(i);
    }
    return cells
}

document.querySelector('form').addEventListener('submit', async function (event) {
    event.preventDefault();
    var product = await createProduct()
    let imgDelete = document.createElement('img')
    imgDelete.src = '../svg/trash-fill.svg'
    imgDelete.setAttribute("onclick", `deletar(${product.code})`)
    // enviar dados php
    await fetch('http://localhost/controller/products.php?action=1', {
        method: 'POST',
        body: JSON.stringify(product)
    }).then(response => response.json())
        .then(alert("Produto cadastrado com sucesso!"))
        .then(location.reload());
})

async function deletar(id) {
    if (confirm("Deseja realmente deletar?")) {
        localStorage.removeItem(id)
        var del = {
            'codeDelete': id
        }
        // enviar dados php
        await fetch('http://localhost/controller/products.php?action=3', {
            method: 'DELETE',
            body: JSON.stringify(del)
        }).then(response => response.json())
            .then(data => {
                if (data['status'] == 500) {
                    alert('Você não pode excluir esse produto pois está relacionado a uma compra!')
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
    })
    return category
}

async function selectCategory() {
    const select = document.getElementById('id_category')
    const data = await getCategory()
    if (data.length != 0) {
        for (var i = 0; i <= (data.length - 1); i++) {
            var filter = escapeHtml(data[i]['name'])
            select.innerHTML += `"<option value="${filter}">${filter}</option>"`
        }
    } else {
        alert('Cadastre uma categoria! Clique em (OK) para poder cadastrar.')
        window.location = '../html/categories.html'
    }
}

window.addEventListener('load', async function () {
    await selectCategory();
    await fetch('http://localhost/controller/products.php?action=get', {
        method: 'GET'
    }).then(response => response.json()).then(data => {
        for (var i = 0; i <= (data.length - 1); i++) {
            var table = addCells()
            let imgDelete = document.createElement('img')
            imgDelete.src = '../svg/trash-fill.svg'
            imgDelete.setAttribute("onclick", `deletar(${data[i]['code']})`)

            let imgEdit = document.createElement('img')
            imgEdit.src = '../svg/pencil-fill.svg'
            imgEdit.setAttribute('onclick', `editProduct(${data[i]['code']})`)

            table[0].innerText = data[i]['code']
            table[1].innerText = data[i]['name']
            table[2].innerText = data[i]['amount']
            table[3].innerText = `$${data[i]['price']}`
            table[4].innerText = data[i]['name_category']
            table[5].appendChild(imgEdit)
            table[6].appendChild(imgDelete)
        }
    })
})

async function editProduct(code) {
    var button = document.querySelector('.btn_edit')
    var cancel = document.querySelector('.btn_cancel')
    var buttonAdd = document.querySelector('#btn_add')
    buttonAdd.style.display = 'none';
    button.style.display = 'block';
    cancel.style.display = 'block';

    var product = await getProductById(code)

    var name = document.getElementById("id_product")
    var price = document.getElementById("id_unit_price")
    var category = document.getElementById("id_category")

    name.disabled = true
    price.disabled = true
    category.disabled = true

    name.value = product[0]['name']
    price.value = product[0]['price']
    category.value = product[0]['name_category']

    cancel.onclick = function () {
        location.reload()
    }

    button.onclick = function () {
        var amountInput = parseInt(document.getElementById("id_amount").value)
        if (amountInput <= 0) {
            alert('Quantidade inválida!')
            return
        }
        const data = {
            'codeProduct': code,
            'amount': amountInput
        }
        setAmountProduct(data)
    }
}

async function setAmountProduct(data) {
    await fetch('http://localhost/controller/products.php?action=5', {
        method: 'PUT',
        body: JSON.stringify(data)
    }).then(response => response.json())
        .then(alert('Quantidade atualizada com sucesso!'),
            location.reload()
        )
}

async function getProductById(id) {
    const product = []
    await fetch('http://localhost/controller/products.php?action=getById&id=' + id, {
        method: 'GET'
    }).then(response => response.json()).then(data => {
        for (var i = 0; i <= (data.length - 1); i++) {
            product[i] = data[i]
        }
    })
    return product
}
