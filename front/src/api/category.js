export default {
    registerCategory: async (name, tax, setSuccess, setMsg, navigate) => {
        let category = {
            "name": name,
            "tax": tax
        }
        await fetch('http://localhost/controller/categories.php?action=1', {
            method: 'POST',
            body: JSON.stringify(category)
        }).then(res => {
            if (res.status === 200) {
                navigate('/categories');
                setMsg('Categoria registrada com sucesso!')
                setSuccess(true);
                setTimeout(() => setSuccess(false), 2000);
            }
        })
    },

    getAllCategory: async (setCategory) => {
        await fetch('http://localhost/controller/categories.php?action=get', {
            method: 'GET'
        }).then(response => response.json()).then(data => setCategory(data));
    },

    deleteCategory: async (id, setMessage, setError, setSuccess, navigate) => {
        var del = {
            'codeDelete': id
        }
        await fetch('http://localhost/controller/categories.php?action=2', {
            method: 'DELETE',
            body: JSON.stringify(del)
        }).then(response => response.json().then(data => {
            if (data['status'] === 500) {
                navigate('/categories');
                setMessage("Você não pode excluir essa categoria pois está relacionada a um produto!")
                setError(true);
                setTimeout(() => setError(false), 2000);
            } else {
                navigate('/categories');
                setMessage("Categoria excluída com sucesso!");
                setSuccess(true);
                setTimeout(() => setSuccess(false), 2000);
            }
        }))
    }
}