async function updateDashboard() {
    // Stats
    const rev = await (await fetch('/api/revenue')).json();
    document.getElementById('total-revenue').innerText = '$' + rev.total.toFixed(2);

    const pend = await (await fetch('/api/pending')).json();
    document.getElementById('pending-count').innerText = pend.count;

    // table
    const orders = await (await fetch('/api/orders')).json();
    const tbody = document.getElementById('orders-table-body');
    tbody.innerHTML = '';

    // Chart data
    const itemCounts = {};

    orders.forEach(o => {
        // Table Row
        const tr = document.createElement('tr');
        tr.style.borderBottom = '1px solid #333';

        let details = '';
        try {
            const parsed = JSON.parse(o.userdetail);
            details = `<span style="color: #aaa; font-size: 0.8em;">${parsed.lang}</span>`;
        } catch (e) { details = o.userdetail; }

        tr.innerHTML = `
            <td style="padding: 10px;">#${o.orderid}</td>
            <td style="padding: 10px;">
                <img src="${o.img || 'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=100&q=80'}" 
                     style="width: 50px; height: 50px; border-radius: 8px; object-fit: cover; border: 1px solid #444;"
                     onerror="this.src='https://images.unsplash.com/photo-1513104890138-7c749659a591?w=100&q=80'">
            </td>
            <td style="padding: 10px;">
                <div style="font-weight: bold;">${o.item || 'Unknown'}</div>
                <div style="font-size: 0.75em; color: #888;">${o.category || 'Food'}</div>
            </td>
            <td style="padding: 10px; color: ${o.orderstatus === 'Pending' ? 'orange' : (o.orderstatus === 'Cancelled' ? 'red' : 'green')}">${o.orderstatus}</td>
            <td style="padding: 10px;">${details}</td>
            <td style="padding: 10px;">${new Date(o.timestamp).toLocaleTimeString()}</td>
        `;
        tbody.appendChild(tr);

        // Chart Data
        const name = o.item || 'Unknown';
        itemCounts[name] = (itemCounts[name] || 0) + 1;
    });

    renderChart(itemCounts);
}

let myChart = null;
function renderChart(data) {
    const ctx = document.getElementById('ordersChart').getContext('2d');
    if (myChart) myChart.destroy();

    myChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: Object.keys(data),
            datasets: [{
                label: 'Orders',
                data: Object.values(data),
                backgroundColor: '#d4af37',
                borderColor: '#fff',
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            plugins: {
                legend: { labels: { color: 'white' } }
            },
            scales: {
                y: { ticks: { color: 'white' }, grid: { color: '#333' } },
                x: { ticks: { color: 'white' }, grid: { color: '#333' } }
            }
        }
    });
}

setInterval(updateDashboard, 5000);
updateDashboard();
