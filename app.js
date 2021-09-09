const slctRegion = document.querySelector('#slctRegion');
// const slctTime = document.querySelector('#slctTime');
const populationSpan = document.querySelector('#populationDiv > #populationSpan');
const confirmedSpan = document.querySelector('#confirmedDiv > #confirmedSpan');
const deathSpan = document.querySelector('#deathDiv > #deathSpan');
const areaSpan = document.querySelector('#areaDiv > #areaSpan');
const lifeExpectSpan = document.querySelector('#lifeExpectDiv > #lifeExpectSpan');
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
        const resD = await axios.get('https://covid-api.mmediagroup.fr/v1/history?country=Germany&status=deaths');
        const daysAPI = resD.data.All.dates;
        const daysList = Object.keys(daysAPI);
        const dates = [];
        for (let i = 0; i <= 365; i += 30) {
            dates.push(daysList[i]);
        }
        myChart.data.labels = dates.reverse();
        myChart.update();

    }
    catch {
        console.log('Error on extracting countries name')
    }
}

// "name" from "countryStats" for executing as query (country name)
const chooseCountry = async (name) => {
    try {
        const resD = await axios.get(`https://covid-api.mmediagroup.fr/v1/history?country=${name}&status=deaths`)
        const history = resD.data.All;
        const resC = await axios.get(`https://covid-api.mmediagroup.fr/v1/cases?country=${name}`)
        const cases = resC.data.All;
        return [history, cases]
    }
    catch {
        console.log("Error on loading statistics of chosen country")
    }
}

//  "userSelectCountry" from "select listener" for passing throw "choose country"
const countryStats = async (userSelectCountry) => {
    const stats = await chooseCountry(userSelectCountry);
    const deathData = stats[0].dates;
    const confirmedTotal = stats[1].confirmed;
    const deathTotal = stats[1].deaths;
    const population = stats[1].population;
    const area = stats[1].sq_km_area;
    const lifeExpextancy = stats[1].life_expectancy;



    const statList = Object.values(deathData);

    const deathStat = [];

    for (let i = 0; i <= 365; i += 30) {
        let stat = statList[i] - statList[i + 1]
        deathStat.push(stat);
    }

    updateChartData(deathStat);
    populationSpan.textContent = population;
    confirmedSpan.textContent = confirmedTotal;
    deathSpan.textContent = deathTotal;
    areaSpan.textContent = area;
    lifeExpectSpan.textContent = lifeExpextancy;

    frame.src = `https://www.google.com/maps/embed/v1/place?key=${myKey}
    &q=${userSelectCountry}`
}

const updateChartData = async (inputDeath) => {
    myChart.data.datasets[0].data = inputDeath.reverse();
    myChart.update()
}

// Show countries in the "select slider"
extractCountries()


// select a country and show its statistics
slctRegion.addEventListener('change', async (evt) => {
    evt.preventDefault();
    const userSelectCountry = slctRegion.value;
    await countryStats(userSelectCountry);
})
