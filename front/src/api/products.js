export default {
    registerProduct: async (name, amount, price, codeCategory, setMessage, setSuccess, navigate) => {
        let product = {
            "name": name,
            "amount": amount,
            "price_unit": price,
            "category": {
                "code": codeCategory,
            }
        }
        await fetch('http://localhost/controller/products.php?action=1', {
            method: 'POST',
            body: JSON.stringify(product)
        }).then(res => {
            if (res.status === 200) {
                navigate("/products");
                setMessage('Produto inserido com sucesso!');
                setSuccess(true);
                setTimeout(() => {
                    setSuccess(false)
                }, 2000)
            }
        })
    },
    getAllCategory: async (setCategory) => {
        await fetch('http://localhost/controller/categories.php?action=get', {
            method: 'GET'
        }).then(response => response.json()).then(data => setCategory(data));
    },

    getAllProducts: async (setProducts) => {
        await fetch('http://localhost/controller/products.php?action=get', {
            method: 'GET'
        }).then(response => response.json()).then(data => setProducts(data))
    },

    deleteProduct: async (id, setError, setMessage, setSuccess, navigate) => {
        localStorage.removeItem(id)
        var del = {
            'codeDelete': id
        }
        await fetch('http://localhost/controller/products.php?action=3', {
            method: 'DELETE',
            body: JSON.stringify(del)
        }).then(response => response.json())
            .then(data => {
                if (data['status'] === 500) {
                    setMessage('Você não pode excluir esse produto pois está relacionado a uma compra!');
                    setError(true);
                    navigate("/products");
                    setTimeout(() => {
                        setError(false)
                    }, 2000)
                } else {
                    setMessage('Produto excluído com sucesso!');
                    setSuccess(true);
                    navigate("/products");
                    setTimeout(() => {
                        setSuccess(false)
                    }, 2000)
                }
            });
    },

    editAmound: async (code, setMessage, setSuccess, navigate, setAlert) => {
        var button = document.querySelector('.btn_edit')
        var cancel = document.querySelector('.btn_cancel')
        var buttonAdd = document.querySelector('.btnAdd')


        var product = await getProductById(code)
        buttonAdd.style.display = 'none';
        button.style.display = 'block';
        cancel.style.display = 'block';

        var name = document.querySelector(".name")
        var price = document.querySelector(".price")
        var category = document.querySelector("select")

        name.disabled = true
        price.disabled = true
        category.disabled = true

        name.value = product[0]['name']
        price.value = product[0]['price']
        category.value = product[0]['code']

        cancel.onclick = function () {
            location.reload()
        }

        button.onclick = function () {

            var amountInput = document.querySelector('.amount').value
            if (amountInput <= 0) {
                setMessage("Quantidade inválida")
                setAlert(true)
                setTimeout(() => {
                    setAlert(false)
                }, 2000)
                return
            } else {
                const data = {
                    'codeProduct': code,
                    'amount': amountInput
                }
                setAmount(data, setSuccess, setMessage, navigate)
                buttonAdd.style.display = 'block';
                button.style.display = 'none';
                cancel.style.display = 'none';
                name.disabled = false
                price.disabled = false
                category.disabled = false
                name.value = ""
                price.value = ""
                category.value = ""
                document.querySelector('.amount').value = ""
            }
        }
    }
}

async function setAmount(data, setSuccess, setMessage, navigate) {
    await fetch('http://localhost/controller/products.php?action=5', {
        method: 'PUT',
        body: JSON.stringify(data)
    }).then(response => {
        if (response.status === 200) {
            setMessage("Quantidade atualizada com sucesso!")
            setSuccess(true)
            navigate("/products")
            setTimeout(() => {
                setSuccess(false)
            }, 2000)
        }
    })
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
