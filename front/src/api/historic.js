export default {
    getOrders: async (setOrder) => {
        await fetch('http://localhost/controller/orders.php?action=get', {
            method: 'GET',
        }).then(response => response.json())
            .then(data => setOrder(data))
    },

    getItemOrder: async (id, setListOrderItem) => {
        await fetch('http://localhost/controller/orders.php?action=getItem&id=' + id, {
            method: 'GET'
        }).then(response => response.json())
            .then(data => setListOrderItem(data) )
    }
}