onload = function() {
    const iconElement = document.querySelector(".weather-icon");
    const tempElement = document.querySelector(".temperature-value p");
    const descElement = document.querySelector(".temperature-description p");
    const locationElement = document.querySelector(".location p");
    const notificationElement = document.querySelector(".notification");

    const weather = {};

    weather.temperature = {
        unit: "celsius"
    }

    // APP CONSTS AND VARS
    const KELVIN = 273;
    // API KEY
    const key = "00fa0e76879f661bac11aabc810e35d6";

    if ('geolocation' in navigator) {
        navigator.geolocation.getCurrentPosition(setPosition, showError);
    } else {
        notificationElement.style.display = "block";
        notificationElement.innerHTML = "<p>Browser doesn't Support Geolocation</p>";
    }

    // SET USER'S POSITION
    function setPosition(position) {
        let latitude = position.coords.latitude;
        let longitude = position.coords.longitude;

        getWeather(latitude, longitude);
    }

    function showError(error) {
        notificationElement.style.display = "block";
        notificationElement.innerHTML = `<p> ${error.message} </p>`;
    }

    // GET WEATHER FROM API PROVIDER
    async function getWeather(latitude, longitude) {
        const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${key}`);
        const data = await response.json();
        console.log(data);
        displayWeather(data);
    }

    function capitalizeFLetter(string) {
        console.log(string);
        string = string[0].toUpperCase() +
            string.slice(1);
        return string;

    }
    // DISPLAY WEATHER TO UI
    async function displayWeather(data) {
        console.log(data);
        weather.temperature.value = Math.floor(data.main.temp - KELVIN);
        weather.description = data.weather[0].description;
        console.log(weather.temperature.value);
        weather.iconId = data.weather[0].icon;
        weather.city = data.name;
        weather.country = data.sys.country;
        iconElement.innerHTML = `<img src="images/${weather.iconId}.png"/>`;
        tempElement.innerHTML = `${weather.temperature.value}°<span>C</span>`;
        descElement.innerHTML = capitalizeFLetter(weather.description);
        locationElement.innerHTML = `${weather.city}, ${weather.country}`;
    }

    // C to F conversion
    function celsiusToFahrenheit(temperature) {
        return (temperature * 9 / 5) + 32;
    }

    tempElement.addEventListener("click", function() {
        if (weather.temperature.value === undefined) return;

        if (weather.temperature.unit == "celsius") {
            let fahrenheit = celsiusToFahrenheit(weather.temperature.value);
            fahrenheit = Math.floor(fahrenheit);

            tempElement.innerHTML = `${fahrenheit}°<span>F</span>`;
            weather.temperature.unit = "fahrenheit";
        } else {
            tempElement.innerHTML = `${weather.temperature.value}°<span>C</span>`;
            weather.temperature.unit = "celsius"
        }
    });
}