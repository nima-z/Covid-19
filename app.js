const slctRegion = document.querySelector('#slctRegion');
const populationSpan = document.querySelector('#populationDiv > #populationSpan');
const confirmedSpan = document.querySelector('#confirmedDiv > #confirmedSpan');
const deathSpan = document.querySelector('#deathDiv > #deathSpan');

let map;

function initMap() {
    map = new google.maps.Map(document.getElementById("map"), {
        center: { lat: -34.397, lng: 150.644 },
        zoom: 8,
    });
}



// Extract country name
const extractCountries = async () => {
    try {
        const res = await axios.get('https://covid-api.mmediagroup.fr/v1/cases')
        const countries = Object.keys(res.data)
        for (let country of countries) {
            const option = document.createElement('option');
            option.append(country);
            option.value = country;
            slctRegion.appendChild(option)
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
        const res = await axios.get('https://covid-api.mmediagroup.fr/v1/cases', config)
        return res.data.All
    }
    catch {
        console.log("Error on loading statistics of chosen country")
    }
}

//  "userSelectCountry" from "select listener" for passing throw "choose country"
const countryStats = async (userSelectCountry) => {
    const stat = await chooseCountry(userSelectCountry);

    const confirmedCases = stat.confirmed;
    const deathCases = stat.deaths;
    const population = stat.population;
    populationSpan.textContent = population
    confirmedSpan.textContent = confirmedCases
    deathSpan.textContent = deathCases
}


// Show countries in the "select slider"
extractCountries();

// select a country and show its statistics
slctRegion.addEventListener('change', async (evt) => {
    evt.preventDefault();
    const userSelectCountry = slctRegion.value;
    await countryStats(userSelectCountry);


})

