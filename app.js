const slctRegion = document.querySelector('#slctRegion');
const slctTime = document.querySelector('#slctTime');
const populationSpan = document.querySelector('#populationDiv > #populationSpan');
const confirmedSpan = document.querySelector('#confirmedDiv > #confirmedSpan');
const deathSpan = document.querySelector('#deathDiv > #deathSpan');
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
        const config = { params: { country: name } }
        const resD = await axios.get(`https://covid-api.mmediagroup.fr/v1/history${config}&status=deaths`)
        const deathData = resD.data.All;
        const resC = await axios.get(`https://covid-api.mmediagroup.fr/v1/history${config}&status=confirmed`)
        const confirmedData = resC.data.All;

        return [deathData, confirmedData]
    }
    catch {
        console.log("Error on loading statistics of chosen country")
    }
}

//  "userSelectCountry" from "select listener" for passing throw "choose country"
const countryStats = async (userSelectCountry) => {
    const stats = await chooseCountry(userSelectCountry);
    const deathStat = stats[0];
    const confirmedStat = stats[1];

    const date = dateRow.toISOString().slice(0, 10);


    const population = stat.population;


    updateChart(confirmed, deaths);
    populationSpan.textContent = population;
    confirmedSpan.textContent = confirmed;
    deathSpan.textContent = deaths;
    frame.src = `https://www.google.com/maps/embed/v1/place?key=${myKey}
    &q=${userSelectCountry}`
}

const updateChartData = async (c, d) => {
    myChart.data.datasets[0].data = [c, d];
    myChart.update()
}

const updateChartTime = async (period) => {
    const resC = await axios.get('https://covid-api.mmediagroup.fr/v1/history?country=Germany&status=confirmed');
    const daysAPI = resC.data.All.dates;
    const daysList = Object.keys(daysAPI);
    const dates = [];
    for (let i = 0; i <= period; i++) {
        dates.append(daysList[i]);
    }
    myChart.data.labels = ["rock", "roll"]
    myChart.update();
}


// Show countries in the "select slider"
extractCountries()




slctTime.addEventListener('change', async (evt) => {
    evt.preventDefault();
    const userTime = slctTime.value;
    await updateChartTime(userTime);
})
// select a country and show its statistics
slctRegion.addEventListener('change', async (evt) => {
    evt.preventDefault();
    const userSelectCountry = slctRegion.value;
    await countryStats(userSelectCountry);
})



