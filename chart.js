Chart.defaults.font.family = 'Oswald', 'sans serif';
Chart.defaults.color = '#d3d9e498';

const chartDeath = document.querySelector('#chartDeath').getContext('2d');
const myChart = new Chart(chartDeath, {
    type: 'bar',
    data: {
        labels: [],
        datasets: [{
            label: 'Death per day',
            data: [],
            backgroundColor: [
                'rgba(255, 95, 86, 0.6)',
            ],
            borderColor: [
                'rgba(100, 20, 20, 1)',
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

const chartConfirmed = document.querySelector('#chartConfirmed').getContext('2d');
const myChart2 = new Chart(chartConfirmed, {
    type: 'bar',
    data: {
        labels: [],
        datasets: [{
            label: 'Confrimed Case per Day',
            data: [],
            backgroundColor: [
                'rgba(255, 95, 86, 0.6)',
            ],
            borderColor: [
                'rgba(100, 20, 20, 1)',
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

