export default {
    getAllProducts: async (setProducts) => {
        await fetch('http://localhost/controller/products.php?action=get', {
            method: 'GET'
        }).then(response => response.json()).then(data => setProducts(data))
    },
    addProductList: (data, selectValue, tax, amount, price, setMessage, setAlert, setSuccess, navigate) => {
        var total = parseFloat((amount * price).toFixed(2))
        var taxItem = parseFloat(((tax / 100) * total).toFixed(2))
        for (var i = 0; i <= data.length - 1; i++) {
            if (selectValue == data[i]['code']) {
                if (amount > data[i]['amount']) {
                    setMessage(`Quantidade inválida! Existem apenas ${data[i]['amount']} no estoque!`);
                    setAlert(true);
                    setTimeout(() => {
                        setAlert(false);
                    }, 2000)
                } else {
                    const obj = {
                        "code": data[i]['code'],
                        "name": data[i]['name'],
                        "amount": parseInt(amount),
                        "tax": taxItem,
                        "price": parseFloat(price).toFixed(2),
                        "total": (total + taxItem).toFixed(2)
                    }
                    localStorage.setItem(data[i]['code'], JSON.stringify(obj));
                    setMessage('Produto adicionado ao carrinho!');
                    setSuccess(true);
                    setTimeout(() => {
                        setSuccess(false);
                    }, 2000)
                    navigate("/");
                }
            }
        }
    },
    setDataProductById: (data, selectValue, setDataProduct) => {
        for (var i = 0; i <= data.length - 1; i++) {
            if (selectValue == data[i]['code']) {
                const obj = {
                    "tax": parseFloat(data[i]['tax']),
                    "price": parseFloat(data[i]['price']).toFixed(2)
                }
                setDataProduct(obj)
            }
        }
    },

    getLocalStorage: () => {
        const obj = Object.keys(localStorage)
        const list = []
        for (var i = 0; i <= obj.length - 1; i++) {
            list[i] = JSON.parse(localStorage.getItem(obj[i]))
        }
        return list
    },

    deleteItemStorage: (id) => {
        console.log(id)
        if (confirm('Tem certeza que deseja retirar esse item do carrinho?')) {
            localStorage.removeItem(id)
        }
        location.reload()
    },

    createOrder: (tax, total) => {
        const obj = Object.keys(localStorage)
        var productList = []
        for (var i = 0; i <= localStorage.length - 1; i++) {
            productList[i] = JSON.parse(localStorage.getItem(obj[i]));
        }
        let order = {
            'products': productList,
            'tax': tax,
            'total': total
        }
        return order
    },

    postOrder: async (order, setMessage, setSuccess) => {
        await fetch('http://localhost/controller/orders.php?action=1', {
            method: 'POST',
            body: JSON.stringify(order)
        }).then(res => {
            if (res.status === 200) {
                setMessage("Compra realizada com sucesso!");
                setSuccess(true);
                setTimeout(() => {
                    localStorage.clear();
                    window.location = "/historic";
                }, 2000);
            }
        })
    },

    updateProduct: async (order) => {
        await fetch('http://localhost/controller/products.php?action=2', {
            method: 'PUT',
            body: JSON.stringify(order.products)
        })
    },

    setTax: () => {
        const obj = Object.keys(localStorage)
        const list = []
        var tax = 0
        for (var i = 0; i <= obj.length - 1; i++) {
            list[i] = JSON.parse(localStorage.getItem(obj[i]))
            tax += parseFloat(list[i]['tax'])
        }
        return parseFloat(tax).toFixed(2)
    },

    setTotal: () => {
        const obj = Object.keys(localStorage)
        const list = []
        var total = 0
        for (var i = 0; i <= obj.length - 1; i++) {
            list[i] = JSON.parse(localStorage.getItem(obj[i]))
            total += parseFloat(list[i]['total'])
        }
        return parseFloat(total).toFixed(2)
    },
    cancelar: () => {
        localStorage.clear();
        location.reload()
    },

}