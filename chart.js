Chart.defaults.font.family = 'Oswald', 'sans serif';
Chart.defaults.color = '#d3d9e498';

const chart = document.querySelector('#chart').getContext('2d');
const myChart = new Chart(chart, {
    type: 'bar',
    data: {
        labels: [],
        datasets: [{
            label: 'number of Death per day',
            data: [],
            backgroundColor: [
                'rgba(255, 95, 86, 0.2)',
            ],
            borderColor: [
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
