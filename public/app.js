async function updateDashboard() {
    // Fetch Revenue
    const revResponse = await fetch('/api/revenue');
    const revData = await revResponse.json();
    document.getElementById('total-revenue').innerText = '$' + revData.total.toFixed(2);

    // Fetch Pending
    const pendingResponse = await fetch('/api/pending');
    const pendingData = await pendingResponse.json();
    document.getElementById('pending-count').innerText = pendingData.count;

    // Fetch Orders
    const orderResponse = await fetch('/api/orders');
    const orders = await orderResponse.json();

    // Update Table
    const tbody = document.querySelector('#orders-table tbody');
    tbody.innerHTML = '';
    orders.forEach(order => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>#${order.orderid}</td>
            <td>${order.item}</td>
            <td>${order.orderstatus}</td>
            <td>$${order.totalamount}</td>
            <td>${new Date(order.timestamp).toLocaleTimeString()}</td>
        `;
        tbody.appendChild(row);
    });

    // Update Chart (Simple Item Count)
    const itemCounts = {};
    orders.forEach(o => {
        itemCounts[o.item] = (itemCounts[o.item] || 0) + 1;
    });

    if (window.myChart) {
        window.myChart.data.labels = Object.keys(itemCounts);
        window.myChart.data.datasets[0].data = Object.values(itemCounts);
        window.myChart.update();
    } else {
        const ctx = document.getElementById('ordersChart').getContext('2d');
        window.myChart = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: Object.keys(itemCounts),
                datasets: [{
                    label: '# of Orders',
                    data: Object.values(itemCounts),
                    backgroundColor: 'rgba(54, 162, 235, 0.5)',
                    borderColor: 'rgba(54, 162, 235, 1)',
                    borderWidth: 1
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false
            }
        });
    }
}

// Poll every 5 seconds
setInterval(updateDashboard, 5000);
updateDashboard();
