// query selectors
let location_div = document.querySelector("#location");
let weatherImage_div = document.querySelector("#weather-img");
let temperature_div = document.querySelector("#temperature");
let weatherDescription_div = document.querySelector("#weather-description");

// get latitude and longitude
let latitude;
let longitude;

// function to round number to 2 decimal places
function twoDecimalPlaces(number) {
    return Math.round(number * 100) / 100;
}

// funciton to set the background color depending upon the temperature
function setBackground(currentTemp) {
    let body = document.querySelector("body");
    if (currentTemp <= 5) {
        body.classList.add("snow");
    } else if (currentTemp > 5 && currentTemp <= 25) {
        body.classList.add("normal");
    } else if (currentTemp > 25 && currentTemp <= 35) {
        body.classList.add("warm");
    } else {
        body.classList.add("hot");
    }
}

//function to toggle celcius and farenheit
function setTemperatureToggler(currentTemp) {
    temperature_div.addEventListener("click", () => {
        if (temperature_div.dataset.temp === "C") {
            currentTemp = twoDecimalPlaces((currentTemp * (9 / 5)) + 32);
            temperature_div.innerHTML = `${currentTemp} °F <span class="fade"> |°C</span>`;
            temperature_div.dataset.temp = "F";
        } else {
            currentTemp = twoDecimalPlaces((currentTemp - 32) * (5 / 9));
            temperature_div.innerHTML = `${currentTemp} °C <span class="fade"> |°F</span>`;
            temperature_div.dataset.temp = "C";
        }
    });
}

navigator.geolocation.getCurrentPosition((pos) => {
    latitude = pos.coords["latitude"];
    longitude = pos.coords["longitude"];

    const apiKey = `9576b4d42352cf30782491e7f619ae14`;
    const proxy = `https://cors-anywhere.herokuapp.com/`;
    let api = `${proxy}api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${apiKey}`;

    console.log(api);

    fetch(api)
        .then(result => result.json())
        .then(resultJSON => {
            console.log(resultJSON);
            location_div.textContent = `${resultJSON.name}, ${resultJSON.sys.country}`;

            let imageId = resultJSON.weather[0].icon;
            weatherImage_div.innerHTML = `<img src="https://openweathermap.org/img/wn/${imageId}@2x.png" alt="Current weather icon." style="height: 100%; width: 100%;">`;


            let currentTemp = twoDecimalPlaces(resultJSON.main.temp - 273.15);
            temperature_div.innerHTML = `${currentTemp} °C <span class="fade"> |°F</span>`;
            temperature_div.dataset.temp = "C";

            weatherDescription_div.textContent = `${resultJSON.weather[0].description.charAt(0).toUpperCase() + resultJSON.weather[0].description.slice(1,)}`;

            setBackground(currentTemp);

            setTemperatureToggler(currentTemp);

        })
        .catch(error => {
            console.log(error);
            location_div.textContent = `Your location, Country`;

            weatherImage_div.innerHTML = `<img alt="Weather image representation.">`;

            let currentTemp = 25;
            temperature_div.innerHTML = `${currentTemp} °C <span class="fade"> |°F</span>`;
            temperature_div.dataset.temp = "C";

            setBackground(currentTemp);
            setTemperatureToggler(currentTemp);

            weatherDescription_div.textContent = `Sorry, data couldn't be loaded. Please enable location for app to work.`;
        });
});
