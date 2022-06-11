const cities = {
    "Ocean City": {
        state: "NJ",
        country: "USA",
        // temp: 77,
        // wind: 10,
        // humidity: 50,
        // precipChance: 25,
        // weatherIcon: "🌤",
        // forecast: [
        //     { day: "Wed", temp: 74, icon: "🌦" },
        //     { day: "Thu", temp: 72, icon: "🌦" },
        //     { day: "Fri", temp: 79, icon: "☀️" },
        //     { day: "Sat", temp: 82, icon: "🌤" },
        //     { day: "Sun", temp: 100, icon: "🔥" },
        // ],
    },
    Syracuse: {
        state: "NY",
        country: "USA",
        // temp: 45,
        // wind: 50,
        // humidity: 88,
        // precipChance: 110,
        // weatherIcon: "🌧",
        // forecast: [
        //     { day: "Weds", temp: 46, icon: "🌧" },
        //     { day: "Thu", temp: 51, icon: "🌧" },
        //     { day: "Fri", temp: 57, icon: "🌧" },
        //     { day: "Sat", temp: 55, icon: "🌦" },
        //     { day: "Sun", temp: 56, icon: "🌧" },
        // ],
    },
    "San Francisco": {
        state: "CA",
        country: "USA",
        // "lat": 37.7790262,
        // "lon": -122.419906,
        // "country": "US",
        // "state": "California",
        // temp: 65,
        // wind: 5,
        // humidity: 0,
        // precipChance: 0,
        // weatherIcon: "☀️",
        // forecast: [
        //     { day: "Weds", temp: 65, icon: "☀️" },
        //     { day: "Thu", temp: 66, icon: "☀️" },
        //     { day: "Fri", temp: 70, icon: "☀️" },
        //     { day: "Sat", temp: 67, icon: "☀️" },
        //     { day: "Sun", temp: 66, icon: "☀️" },
        // ],
    },
};

// We'll use these in updateHTML
// Source: https://openweathermap.org/weather-conditions

// .weather.main categories (umbrellas for .weather.description)
//  Thunderstorm, Drizzle, Rain, Snow, Atmosphere, Clear, Clouds
// Subdivide Clouds.  Also, Atmosphere has different Mains for each weather type.
const icons = {
    // description : icon
    Clear: "☀️",
    "few clouds": "🌤",
    "scattered clouds": "☁️",
    "overcast clouds": "☁️",
    "broken clouds": "☁",
    Rain: "🌧",
    Thunderstorm: "⛈",
    Snow: "❄️",
    Mist: "🌫",
    Squall: "💨",
    Tornado: "🌪",
    Drizzle: "🌧",
};
const getIcon = (weather) => {
    let weatherType = weather.main;
    if (
        weatherType === "Mist" ||
        weatherType === "Smoke" ||
        weatherType === "Haze" ||
        weatherType === "Dust" ||
        weatherType === "Fog" ||
        weatherType === "Sand" ||
        weatherType === "Ash"
    ) {
        weatherType = "Mist";
    } else if (weatherType === "Clouds") {
        // get specific clouds type
        weatherType = weather.description;
    }
    console.log("weatherType: ", weatherType);
    return icons[weatherType];
};
const weekdays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "Decembar",
];

const zipButton = document.getElementById("zip-button");
zipButton.addEventListener("click", (event) => {
    const zip = document.getElementById("zip-input").value;
    if (zip && zip.length === 5) {
        // check legit zip code
        getWeatherByZipcode(zip);
    }
});
document.addEventListener("keydown", (event) => {
    console.log(event.code);
    if (event.code === "Enter" || event.code === "NumpadEnter") {
        const zip = document.getElementById("zip-input").value;
        if (zip && zip.length === 5) {
            // check legit zip code
            getWeatherByZipcode(zip);
        }
    }
});

const locSelector = document.getElementById("location");
locSelector.addEventListener("change", (event) => {
    // Get cityData from object above
    const cityName = locSelector.value;
    const cityData = cities[locSelector.value];
    // Get lat/lon of that city
    const responsePromise = fetch(
        `https://api.openweathermap.org/geo/1.0/direct?q=${cityName},${cityData.state},${cityData.country}&limit=1&appid=587105ef534143cf16cb1c401766f57d`
    );
    responsePromise
        .then((response) => {
            return response.json();
        })
        .then((data) => {
            const lat = data[0].lat;
            const lon = data[0].lon;
            getWeatherByLatLon(lat, lon);
        });
});

const getWeatherByZipcode = async (zip) => {
    const response = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?zip=${zip}&units=imperial&appid=587105ef534143cf16cb1c401766f57d`
    );
    const data = await response.json();
    updateHTML(data);
};

const getWeatherByLatLon = async (lat, lon) => {
    console.log("getWeatherByLatLon()");
    // Get weather for that lat/lon
    const weatherRequest = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=imperial&appid=587105ef534143cf16cb1c401766f57d`
    );
    const weatherInfo = await weatherRequest.json();
    updateHTML(weatherInfo);
};

const updateHTML = async (weatherInfo) => {
    const dateInSecs = weatherInfo.dt;
    const dateInMS = dateInSecs * 1000;
    const date = new Date(dateInMS);
    const todayInt = date.getDay();
    const todayString = weekdays[todayInt];
    const todayMonth = months[date.getMonth()];
    const todayDay = date.getDate();
    const todayYear = date.getFullYear();
    const today = `${todayString}, ${todayMonth} ${todayDay}, ${todayYear}`;
    const lat = weatherInfo.coord.lat;
    const lon = weatherInfo.coord.lon;
    // Display city name
    document.getElementById("city-name").innerHTML =
        weatherInfo.name + " - " + today;
    // Show that weather in the HTML page
    document.getElementById("todaysTemp").innerHTML = weatherInfo.main.temp;
    document.getElementById(
        "todaysDetails"
    ).innerHTML = `${weatherInfo.weather[0].description}<br/>
    Humidity: ${weatherInfo.main.humidity}%<br/>
    Wind: ${weatherInfo.wind.speed}mph`;
    // Precipitation: ${cityData.precipChance}%<br/>
    document.getElementById("weather-now").innerHTML =
        weatherInfo.weather[0].main;

    document.getElementById("todaysWeatherIcon").innerHTML = getIcon(
        weatherInfo.weather[0]
    );

    // 5 Day Forecast
    // api.openweathermap.org/data/2.5/forecast?lat=43.0481221&lon=-76.1474244&cnt=1&units=imperial&appid=587105ef534143cf16cb1c401766f57d
    const fiveDayResponse = await fetch(
        `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&cnt=5&units=imperial&appid=587105ef534143cf16cb1c401766f57d`
    );
    const fiveDayData = await fiveDayResponse.json();
    const fiveDays = fiveDayData.list;
    let forecastHTML = "";
    let dayIndex = todayInt;
    let count = 0;
    for (let day of fiveDays) {
        dayIndex++;
        dayIndex = dayIndex % weekdays.length;
        forecastHTML += `<div class="forecast-day col-2 text-center">
        <div class="day">${weekdays[dayIndex]}</div>
        <div class="description">${day.weather[0].description}</div>
        <div class="small-icon">
            ${getIcon(day.weather[0])}
        </div>
        ${day.main.temp}°
    </div>`;
    }
    document.getElementById("forecast").innerHTML = forecastHTML;
};

// Current Weather
// https://api.openweathermap.org/data/2.5/weather?lat=43.0481221&lon=-76.1474244&units=imperial&appid=587105ef534143cf16cb1c401766f57d

// http://api.openweathermap.org/geo/1.0/direct?q={city name},{state code},{country code}&limit={limit}&appid={API key}

// Syracuse
// http://api.openweathermap.org/geo/1.0/direct?q=Syracuse,NY,USA&limit=1&appid=587105ef534143cf16cb1c401766f57d
// [{"name":"Syracuse","local_names":{"ru":"Сиракьюс","uk":"Сірак'юс","en":"Syracuse"},"lat":43.0481221,"lon":-76.1474244,"country":"US","state":"New York"}]

// Ocean City
// http://api.openweathermap.org/geo/1.0/direct?q=Ocean-city,NJ,USA&limit=1&appid=587105ef534143cf16cb1c401766f57d
// [{"name":"Ocean City","lat":39.2776156,"lon":-74.5746001,"country":"US","state":"New Jersey"}]

// San Fran
// http://api.openweathermap.org/geo/1.0/direct?q=Sanfrancisco,CA,USA&limit=1&appid=587105ef534143cf16cb1c401766f57d
//

const startEvent = new Event("change");
locSelector.dispatchEvent(startEvent);
