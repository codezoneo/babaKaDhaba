document.addEventListener('DOMContentLoaded', function () {
    const addBtn = document.getElementById('add-btn');
    const tableSelect = document.getElementById('table-select');
    const amountInput = document.getElementById('amount-input');
    const textInput = document.getElementById('text-input');
    const ordersContainer = document.getElementById('orders-container');
    const availableTables = ['tb1', 'tb2', 'tb3', 'tb4','tb5'];
    let orders = [];

    
    availableTables.forEach(table => {
        const orderSection = createOrderSection(table);
        ordersContainer.appendChild(orderSection);
    });

    
    addBtn.addEventListener('click', function (event) {
        event.preventDefault();

        const selectedTable = tableSelect.value;

        if (selectedTable === '') {
            alert('Please choose a table number.');
            return;
        }

       
        const amount = Number(amountInput.value);
        const textValue = textInput.value;

        if (selectedTable === '' || isNaN(amount) || amount <= 0) {
            alert('Please enter valid details.');
            return;
        }

        const order = { tableNumber: selectedTable, amount, textValue };

        axios.post("https://crudcrud.com/api/b91d7f2e05bb4ee7b6c7a86f5e251950/addOrder", order)
            .then(data => {
                const orderId = data.data._id;
        if (!orderId) {
            console.error('Error: Order ID not found in the server response');
            alert('Error: Order ID not found in the server response');
            return;
        }

        order._id = orderId;
                console.log('Order added successfully:', data);
                orders.push(order);
                updateOrdersTable();
            })
            .catch(error => {
                if (error.response) {
                    console.error('Error Placing order. Server responded with:', error.response.data);
                    alert('Error Placing order. Server responded with: ' + error.response.data);
                } else if (error.request) {
                    console.error('Error Placing order. No response received from the server.');
                    alert('Error Placing order. No response received from the server.');
                } else {
                    console.error('Error Placing order. Request setup error:', error.message);
                    alert('Error Placing order. Request setup error: ' + error.message);
                }
            });
        
        amountInput.value = '';
        textInput.value = '';
    });
    fetchOrdersFromAPI();
    function fetchOrdersFromAPI() {
        axios.get('https://crudcrud.com/api/b91d7f2e05bb4ee7b6c7a86f5e251950/addOrder')
            .then(response => {
                console.log('Orders fetched successfully:', response);
                orders = response.data;
            })
            .catch(error => {
                if (error.response) {
                    console.error('Error Fetching order. Server responded with:', error.response.data);
                    alert('Error Fetching order. Server responded with: ' + error.response.data);
                } else if (error.request) {
                    console.error('Error Fetching order. No response received from the server.');
                    alert('Error Fetching order. No response received from the server.');
                } else {
                    console.error('Error Fetching order. Request setup error:', error.message);
                    alert('Error Fetching order. Request setup error: ' + error.message);
                }
            })
            .finally(() => {
                updateOrdersTable();
            });
    }
    function updateOrdersTable() {
        availableTables.forEach(table => {
            let orderSection = document.getElementById(`order-section-${table}`);
            if (!orderSection) {
                orderSection = createOrderSection(table);
                ordersContainer.appendChild(orderSection);
            }

            orderSection.innerHTML = `<h3>Orders for Table ${table.charAt(2)}</h3>`;

            for (const order of orders) {
                if (order.tableNumber === table) {
                    const orderContainer = document.createElement('div');
                    orderContainer.classList.add('order-item');
            
                    const orderDetails = document.createElement('p');
                    orderDetails.textContent = `Amount: ${order.amount}, order-item: ${order.textValue}`;
            
                    const deleteButton = document.createElement('button');
                    deleteButton.textContent = 'Delete';
                    deleteButton.addEventListener('click', function () {
                        deleteOrder(order);
                    });
            
                    orderContainer.appendChild(orderDetails);
                    orderContainer.appendChild(deleteButton);
                    orderSection.appendChild(orderContainer);
                }
            }
        });
    }

    
    function createOrderSection(table) {
        const section = document.createElement('div');
        section.id = `order-section-${table}`;
        section.classList.add('order-section');
        return section;
    }

    
    function deleteOrder(order) {
        const orderId = order._id;
    
        axios.delete(`https://crudcrud.com/api/b91d7f2e05bb4ee7b6c7a86f5e251950/addOrder/${orderId}`)
            .then(response => {
                console.log('Order deleted successfully:', response);
    
                
                orders = orders.filter(o => o._id !== orderId);
                alert("order deleted successfully");
    
                
                updateOrdersTable();
            })
            .catch(error => {
                if (error.response) {
                   
                    console.error('Error deleting order. Server responded with:', error.response.data);
                    alert('Error deleting order. Server responded with: ' + error.response.data);
                } else if (error.request) {
                    console.error('Error deleting order. No response received from the server.');
                    alert('Error deleting order. No response received from the server.');
                } else {
                    // Something happened in setting up the request that triggered an Error
                    console.error('Error deleting order. Request setup error:', error.message);
                    alert('Error deleting order. Request setup error: ' + error.message);
                }
            });
        }

    updateOrdersTable();

    
});
