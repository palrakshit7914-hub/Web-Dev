const GEO_URL = "https://geocoding-api.open-meteo.com/v1/search";
const WEATHER_URL = "https://api.open-meteo.com/v1/forecast";


const weatherCodes = {
    "0": "Clear sky", "1": "Mainly clear", "2": "Partly cloudy", "3": "Overcast",
    "45": "Fog", "48": "Depositing rime fog", "51": "Light drizzle", "53": "Moderate drizzle",
    "55": "Dense drizzle", "56": "Light freezing drizzle", "57": "Dense freezing drizzle",
    "61": "Light rain", "63": "Moderate rain", "65": "Heavy rain", "66": "Light freezing rain",
    "67": "Heavy freezing rain", "71": "Light snow fall", "73": "Moderate snow fall",
    "75": "Heavy snow fall", "77": "Snow grains", "80": "Light rain showers",
    "81": "Moderate rain showers", "82": "Violent rain showers", "85": "Light snow showers",
    "86": "Heavy snow showers", "95": "Thunderstorm", "96": "Thunderstorm with light hail",
    "99": "Thunderstorm with heavy hail"
};

const searchBtn = document.getElementById("searchBtn");
const cityInput = document.getElementById("cityInput");
const weatherResult = document.getElementById("weatherResult");
const historyList = document.getElementById("historyList");

async function fetchWeather(city) {
    if (!city) {
        alert("Please enter a city name!");
        return;
    }

    try {
        // 1. Geocoding: Get Lat/Lon
        const geoResponse = await fetch(`${GEO_URL}?name=${city}&count=1&language=en&format=json`);
        const geoData = await geoResponse.json();

        if (!geoData.results || geoData.results.length === 0) {
            throw new Error("City not found!");
        }

        const { latitude, longitude, name, country } = geoData.results[0];

        // 2. Weather: Get current weather using coordinates
        const weatherResponse = await fetch(
            `${WEATHER_URL}?latitude=${latitude}&longitude=${longitude}&current_weather=true`
        );
        
        if (!weatherResponse.ok) throw new Error("Weather data unavailable!");

        const weatherData = await weatherResponse.json();

        // 3. Display and Save
        displayWeather(weatherData.current_weather, name, country);
        saveToLocalStorage(name);

    } catch (error) {
        console.error("Error:", error);
        weatherResult.innerHTML = `<p style="color:red;">${error.message}</p>`;
    }
}

// ===============================
//  DISPLAY WEATHER WITH CODE LOOKUP
// ===============================
function displayWeather(data, cityName, country) {
    // Extract the description using the code from the API
    const conditionText = weatherCodes[data.weathercode] || "Unknown Condition";

    weatherResult.innerHTML = `
        <p><strong>City:</strong> ${cityName}, ${country}</p>
        <p><strong>Temperature:</strong> ${data.temperature} °C</p>
        <p><strong>Condition:</strong> ${conditionText}</p>
        <p><strong>Wind Speed:</strong> ${data.windspeed} km/h</p>
    `;
}



function saveToLocalStorage(city) {
    let history = JSON.parse(localStorage.getItem("weatherHistory")) || [];
    if (!history.includes(city)) {
        history.push(city);
        localStorage.setItem("weatherHistory", JSON.stringify(history));
    }
    loadHistory();
}

function loadHistory() {
    historyList.innerHTML = "";
    let history = JSON.parse(localStorage.getItem("weatherHistory")) || [];
    history.forEach(city => {
        const li = document.createElement("li");
        li.textContent = city;
        li.style.cursor = "pointer";
        li.onclick = () => fetchWeather(city);
        historyList.appendChild(li);
    });
}

searchBtn.addEventListener("click", () => fetchWeather(cityInput.value.trim()));
window.addEventListener("load", loadHistory);