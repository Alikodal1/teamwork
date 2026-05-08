const ctx = document.getElementById('expenseChart').getContext('2d');

new Chart(ctx, {
    type: 'doughnut',
    data: {
        labels: ['Yemek', 'Alışveriş', 'Ulaşım', 'Eğlence'],
        datasets: [{
            data: [1370, 1370, 720, 720],
            backgroundColor: ['#5d9ba6', '#36a2eb', '#fbc531', '#e17055'],
            borderWidth: 0,
            hoverOffset: 10
        }]
    },
    options: {
        plugins: {
            legend: { position: 'bottom' }
        },
        cutout: '70%'
    }
});