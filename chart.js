// const oldData = [10, 30, 50]
const chart = document.querySelector('#chart').getContext('2d');
const myChart = new Chart(chart, {
    type: 'bar',
    data: {
        labels: ['Confirmed Cases', 'Global Average', 'Death', 'Global Average'],
        datasets: [{
            label: 'number of persons',
            data: [45658, 5000000, 1170000],
            backgroundColor: [
                'rgba(99, 240, 132, 0.2)',
                'rgba(255, 206, 86, 0.2)',
                'rgba(255, 95, 86, 0.2)',

            ],
            borderColor: [
                'rgba(99, 240, 132, 1)',
                'rgba(255, 206, 86, 1)',
                'rgba(255, 95, 86, 1)',

            ],
            borderWidth: 1
        }]
    },
    options: {
        scales: {
            y: {
                beginAtZero: true
            }
        }
    }
});
