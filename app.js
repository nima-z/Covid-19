const slctRegion = document.querySelector('#slctRegion');
const populationSpan = document.querySelector('#populationDiv > #populationSpan');
const confirmedSpan = document.querySelector('#confirmedDiv > #confirmedSpan');
const deathSpan = document.querySelector('#deathDiv > #deathSpan');
const areaSpan = document.querySelector('#areaDiv > #areaSpan');
const frame = document.querySelector('iframe');
const myKey = config.Api_key;



// Extract country name
const extractCountries = async () => {
    try {
        const res = await axios.get('https://covid-api.mmediagroup.fr/v1/cases')
        const countries = Object.keys(res.data)
        for (let country of countries) {
            const option = document.createElement('option');
            option.append(country);
            option.value = country;
            option.classList.add = "option"
            slctRegion.appendChild(option);
            frame.src = `https://www.google.com/maps/embed/v1/place?key=${myKey}&q=Iran&zoom=3`
        }

    }
    catch {
        console.log('Error on extracting countries name')
    }
}

// "name" from "countryStats" for executing as query (country name)
const chooseCountry = async (name) => {
    try {
        const resDH = await axios.get(`https://covid-api.mmediagroup.fr/v1/history?country=${name}&status=deaths`);
        const deathHistory = resDH.data.All;
        const resCH = await axios.get(`https://covid-api.mmediagroup.fr/v1/history?country=${name}&status=confirmed`);
        const confirmedHistory = resCH.data.All;
        const resC = await axios.get(`https://covid-api.mmediagroup.fr/v1/cases?country=${name}`);
        const cases = resC.data.All;
        return [deathHistory, cases, confirmedHistory]
    }
    catch {
        console.log("Error on loading statistics of chosen country")
    }
}

//  "userSelectCountry" from "select listener" for passing throw "choose country"
const countryStats = async (userSelectCountry) => {

    const stats = await chooseCountry(userSelectCountry);
    const dates = dateForCharts();

    const deathHistory = stats[0].dates;
    const confirmedHistory = stats[2].dates;

    const confirmedTotal = stats[1].confirmed;
    const deathTotal = stats[1].deaths;
    const population = stats[1].population;
    const area = stats[1].sq_km_area;

    const deathStat = [];
    for (let d of dates) {
        const variance = deathHistory[d[0]] - deathHistory[d[1]];
        deathStat.push(variance)
    }

    const confirmedStat = [];
    for (let d of dates) {
        const variance = confirmedHistory[d[0]] - confirmedHistory[d[1]];
        confirmedStat.push(variance)
    }

    updateChartData(deathStat, confirmedStat);

    populationSpan.textContent = population;
    confirmedSpan.textContent = confirmedTotal;
    deathSpan.textContent = deathTotal;
    areaSpan.textContent = area;

    frame.src = `https://www.google.com/maps/embed/v1/place?key=${myKey}
    &q=${userSelectCountry}`
}

const updateChartData = async (inputDeath, inputConfirmed) => {
    myChart.data.datasets[0].data = inputDeath
    myChart2.data.datasets[0].data = inputConfirmed
    myChart.update()
    myChart2.update()
}

const dateForCharts = function () {
    let date = new Date();

    const monthForChart = [];
    const monthForApi = [];
    for (let i = 0; i <= 12; i++) {

        const today = new Date();
        const yesterday = new Date();

        today.setDate(date.getDate() - 1);

        const thisMonth = today.getMonth();
        const num = thisMonth - i;
        today.setMonth(num);
        yesterday.setMonth(num)
        yesterday.setDate(today.getDate() - 1);

        const day1 = today.toISOString().slice(0, 10);
        const day2 = yesterday.toISOString().slice(0, 10);
        monthForChart.push(day1);
        monthForApi.push([day1, day2])
    }
    monthForChart.reverse()
    myChart.data.labels = monthForChart;
    myChart2.data.labels = monthForChart;
    myChart.update();
    myChart2.update();
    return (monthForApi.reverse())
}

// Show countries in the "select slider"
extractCountries()


// select a country and show its statistics
slctRegion.addEventListener('change', async (evt) => {
    evt.preventDefault();
    const userSelectCountry = slctRegion.value;
    await countryStats(userSelectCountry);
})
