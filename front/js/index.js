window.addEventListener('load', async function () {
    getLocalStorage()
    await addProductsSelect()
    await optionSelected()
})

async function createObjProduct() {
    var select = document.querySelector('#id_product')
    const indice = select.selectedIndex
    const value = select.options[indice].value
    var amountInput = parseInt(document.getElementById("id_amount").value);
    var taxInput = parseFloat(document.getElementById("id_tax_value").value);
    var priceInput = parseFloat(document.getElementById("id_unit_price").value);
    var total = parseFloat((priceInput * amountInput).toFixed(2))
    var tax = parseFloat(((taxInput / 100) * total).toFixed(2))
    var productsList = await getProducts()
    console.log(productsList)
    for (var i = 0; i <= productsList.length; i++) {
        if (value == productsList[i]['code']) {
            const obj = {
                "code": productsList[i]['code'],
                "name": productsList[i]['name'],
                "amount": amountInput,
                "tax": tax,
                "price": priceInput,
                "total": total
            }
            return obj
        }
    }
}

function validationProduct(product) {
    var obj = Object.keys(localStorage)
    var cache = getCache()
    for (var i = 0; i <= obj.length - 1; i++) {
        if (product.code == cache[i]['code']) {
            return true
        }
    }
    return false
}

async function addProduct(event) {
    event.preventDefault();
    var product = await createObjProduct()
    var productsList = await getProducts()
    for (var i = 0; i <= (productsList.length - 1); i++) {
        if (product.code == productsList[i]['code']) {
            if (product.amount > productsList[i]['amount']) {
                alert(`Quantidade inválida! Existem apenas ${productsList[i]['amount']} no estoque`)
                return;
            } else if (validationProduct(product)) {
                alert('Produto já adicionado!')
                return
            }
            localStorage.setItem((product.code), JSON.stringify(product))
            location.reload()
            document.getElementById('id_total').value = `$${setTotal()}`
            document.getElementById('id_tax').value = `$${setTax()}`

        }
    }
}

function createOrder() {
    var obj = Object.keys(localStorage)
    var productList = []
    var tax = setTax()
    var total = setTotal()
    for (var i = 0; i <= localStorage.length - 1; i++) {
        productList[i] = JSON.parse(localStorage.getItem(obj[i]));
    }
    var order = {
        'products': productList,
        'tax': tax,
        'total': total
    };
    return order
}

document.getElementById('id_finish').addEventListener("click", async function (event) {
    event.preventDefault()
    var order = createOrder()
    if (localStorage.length != 0) {
        localStorage.clear()
        await fetch('http://localhost/controller/products.php?action=2', {
            method: 'PUT',
            body: JSON.stringify(order.products)
        }).then(response => response.json()).then(postOrder(order)).then(
            alert('Compra realizada com sucesso!'),
            window.location = '../html/history.html')
    } else {
        alert('Adicione um produto!')
    }
})

async function postOrder(order) {
    await fetch('http://localhost/controller/orders.php?action=1', {
        method: 'POST',
        body: JSON.stringify(order)
    }).then(response => response.json())
        .then(data => {
            console.log(data);
        });
}

function getLocalStorage() {
    var obj = Object.keys(localStorage)
    var products = []
    if (localStorage.length != 0) {
        for (var i = 0; i <= (obj.length - 1); i++) {
            products[i] = JSON.parse(localStorage.getItem(obj[i]))
            var table = addCells()
            let imgDelete = document.createElement('img')
            imgDelete.src = '../svg/trash-fill.svg'
            imgDelete.setAttribute("onclick", `deletar(${products[i]['code']})`)
            table[0].innerText = products[i]['name'];
            table[1].innerText = `$${products[i]['price']}`;
            table[2].innerText = products[i]['amount'];
            table[3].innerText = `$${products[i]['total']}`;
            table[4].appendChild(imgDelete)

            document.getElementById('id_total').value = `$${setTotal()}`
            document.getElementById('id_tax').value = `$${setTax()}`
        }
    } else {
        console.log('Adicione um Produto!')
    }
}

function getCache() {
    var obj = Object.keys(localStorage)
    var products = []
    for (var i = 0; i <= (obj.length - 1); i++) {
        products[i] = JSON.parse(localStorage.getItem(obj[i]))
    }
    return products
}

function setTotal() {
    var keys = Object.keys(localStorage)
    var obj = []
    var total = 0
    for (var i = 0; i <= (keys.length - 1); i++) {
        if (localStorage.getItem(keys[i])) {
            obj[i] = JSON.parse(localStorage.getItem(keys[i]))
            total += obj[i]["total"]
            total += obj[i]['tax']
        }
    }
    return parseFloat(total.toFixed(2))
}

function setTax() {
    var keys = Object.keys(localStorage)
    var obj = []
    var tax = 0
    for (var i = 0; i <= (keys.length - 1); i++) {
        if (localStorage.getItem(keys[i])) {
            obj[i] = JSON.parse(localStorage.getItem(keys[i]))
            tax += obj[i]["tax"]
        }
    }
    return parseFloat(tax.toFixed(2))
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

async function getProducts() {
    const products = [];
    await fetch('http://localhost/controller/products.php?action=get', {
        method: 'GET'
    }).then(response => response.json()).then(data => {
        for (var i = 0; i <= (data.length - 1); i++) {
            products[i] = data[i];
        }
    })
    return products;
}

async function addProductsSelect() {
    const select = document.getElementById('id_product')
    var products = await getProducts()
    if (products.length != 0) {
        for (var i = 0; i <= (products.length - 1); i++) {
            var filter = escapeHtml(products[i]['name'])
            select.innerHTML += `"<option value="${products[i]['code']}">${filter}</option>"`
        }
    } else {
        localStorage.clear()
        alert('Cadastre um produto! Clique em (OK) para poder cadastrar.')
        window.location = '../html/products.html'
    }
}

async function optionSelected() {
    var select = document.querySelector('#id_product')
    const indice = select.selectedIndex
    const value = select.options[indice].value
    var products = await getProducts()
    var taxInput = document.getElementById('id_tax_value')
    var priceInput = document.getElementById('id_unit_price')
    for (var i = 0; i <= (products.length - 1); i++) {
        if (value == products[i]["code"]) {
            taxInput.value = `${products[i]["tax"]}%`
            priceInput.value = products[i]["price"]
        }
    }
    return value
}

document.getElementById('btn_cancel').addEventListener("click", function () {
    qtdObj = Object.keys(localStorage)
    if (confirm("Deseja realmente cancelar?")) {
        localStorage.clear()
    }
})

function addCells() {
    var table = document.getElementsByTagName('table')[0];
    var newRow = table.insertRow(table.rows.length);
    var cells = []
    for (var i = 0; i <= 4; i++) {
        cells[i] = newRow.insertCell(i);
    }
    return cells
}

function deletar(id) {
    if (confirm("Deseja realmente deletar?")) {
        localStorage.removeItem(id)
    }
    location.reload()
}