const listOfCountries = document.querySelector('#listOfCountries');
const populationSpan = document.querySelector('#populationDiv > #populationSpan');
const confirmedSpan = document.querySelector('#confirmedDiv > #confirmedSpan');
const deathSpan = document.querySelector('#deathDiv > #deathSpan');
const areaSpan = document.querySelector('#areaDiv > #areaSpan');
const frame = document.querySelector('iframe');
const myKey = config.Api_key;

//**************/
// execute code
//**************/

// Show countries name in the slide bar
extractCountries()

// Select a country as a result and use it to send a request to API
listOfCountries.addEventListener('change', async (evt) => {
    evt.preventDefault();
    const selectedCountry = listOfCountries.value;
    await selectedCountryStats(selectedCountry);
})


//*************************************************************************/
// Functions
//*************************************************************************/

// Extract country name from API and put them in the slide bar to choose.
async function extractCountries() {
    try {
        const res = await axios.get('https://covid-api.mmediagroup.fr/v1/cases')
        const countries = Object.keys(res.data)

        for (let country of countries) {
            const option = document.createElement('option');
            option.append(country);
            option.value = country;
            option.classList.add = "option"
            listOfCountries.appendChild(option);
            frame.src = `https://www.google.com/maps/embed/v1/place?key=${myKey}&q=Iran&zoom=3`
        }
    }
    catch {
        console.log('Error on extracting countries name')
    }
}

//  Receive informations from the selected Country
async function selectedCountryStats(selectedCountry) {

    const stats = await extractData(selectedCountry);
    const listOfDates = dateForCharts();

    const deathStats = stats[0].dates;
    const ConfirmedStats = stats[2].dates;
    const totalDeath = stats[1].deaths;
    const totalConfirmed = stats[1].confirmed;
    const population = stats[1].population;
    const area = stats[1].sq_km_area;

    const listOfDeathPerDay = [];
    for (let date of listOfDates) {
        const variance = deathStats[date[0]] - deathStats[date[1]];
        listOfDeathPerDay.push(variance)
    }

    const listOfConfirmedPerDay = [];
    for (let date of listOfDates) {
        const variance = ConfirmedStats[date[0]] - ConfirmedStats[date[1]];
        listOfConfirmedPerDay.push(variance)
    }

    updateChartData(listOfDeathPerDay, listOfConfirmedPerDay);
    deathSpan.textContent = totalDeath;
    confirmedSpan.textContent = totalConfirmed;
    populationSpan.textContent = population;
    areaSpan.textContent = area;

    frame.src = `https://www.google.com/maps/embed/v1/place?key=${myKey}
    &q=${selectedCountry}`
}

// Getting the information of the chosen country (by "name" parameter)
async function extractData(countryName) {
    try {
        const resDH = await axios.get(`https://covid-api.mmediagroup.fr/v1/history?country=${countryName}&status=deaths`);
        const deathHistory = resDH.data.All;

        const resCH = await axios.get(`https://covid-api.mmediagroup.fr/v1/history?country=${countryName}&status=confirmed`);
        const confirmedHistory = resCH.data.All;

        const resC = await axios.get(`https://covid-api.mmediagroup.fr/v1/cases?country=${countryName}`);
        const cases = resC.data.All;

        return [deathHistory, cases, confirmedHistory]
    }
    catch {
        console.log("Error on loading statistics of chosen country")
    }
}

// Determine today and yesterday date for calculating "Death and Confirmed Cases" per day.
function dateForCharts() {
    let date = new Date();
    const monthForChart = [];
    const monthForApi = [];

    for (let i = 0; i <= 12; i++) {
        let today = new Date();
        let yesterday = new Date();

        today.setDate(date.getDate() - 1);
        const thisMonth = today.getMonth();
        const previousMonth = thisMonth - i;
        today.setMonth(previousMonth);
        yesterday.setMonth(previousMonth)
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

// Receive data from "selectedCountryStats" function
async function updateChartData(deathPerDay, confirmedPerDay) {
    myChart.data.datasets[0].data = deathPerDay
    myChart2.data.datasets[0].data = confirmedPerDay
    myChart.update()
    myChart2.update()
}


