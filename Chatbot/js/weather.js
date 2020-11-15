onload = function() {
    const iconElement = document.querySelector(".weather-icon");
    const tempElement = document.querySelector(".temperature-value p");
    const descElement = document.querySelector(".temperature-description p");
    const locationElement = document.querySelector(".location p");
    const notificationElement = document.querySelector(".notification");
    const container = document.querySelector(".weather-container");

    const weather = {};

    weather.temperature = {
        unit: "celsius"
    }

    const KELVIN = 273;

    const key = "00fa0e76879f661bac11aabc810e35d6";

    if ('geolocation' in navigator) {
        navigator.geolocation.getCurrentPosition(setPosition, showError);
    } else {
        notificationElement.style.display = "block";
        notificationElement.innerHTML = "<p>Browser doesn't Support Geolocation</p>";
    }

    function setPosition(position) {
        let latitude = position.coords.latitude;
        let longitude = position.coords.longitude;

        getWeather(latitude, longitude);
    }

    function showError(error) {
        notificationElement.style.display = "block";
        notificationElement.innerHTML = `<p> ${error.message} </p>`;
    }

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

    async function displayWeather(data) {
        console.log(data);
        weather.temperature.value = Math.floor(data.main.temp - KELVIN);
        weather.description = data.weather[0].description;
        console.log(weather.temperature.value);
        weather.iconId = data.weather[0].icon;
        weather.city = data.name;
        weather.country = data.sys.country;
        var urlString = 'url(images/' + weather.iconId + '_back.gif)';
        document.body.style.backgroundImage = urlString;
        iconElement.innerHTML = `<img src="images/${weather.iconId}.png"/>`;
        tempElement.innerHTML = `${weather.temperature.value}°<span>C</span>`;
        descElement.innerHTML = capitalizeFLetter(weather.description);
        locationElement.innerHTML = `${weather.city}, ${weather.country}`;
        if (weather.iconId === "13d" || weather.iconId === "13n" || weather.iconId === "50d" || weather.iconId === "50n") {
            container.style.backgroundColor = "transparent";
            tempElement.style.color = "black";
            tempElement.innerHTML = weather.temperature.value + "°<span style='color:black'>C</span>";
            descElement.style.color = "black";
            locationElement.style.color = "black";
        }
    }

    function celsiusToFahrenheit(temperature) {
        return (temperature * 9 / 5) + 32;
    }

    tempElement.addEventListener("click", function() {
        if (weather.temperature.value === undefined) return;

        if (weather.temperature.unit == "celsius") {
            let fahrenheit = celsiusToFahrenheit(weather.temperature.value);
            fahrenheit = Math.floor(fahrenheit);
            weather.temperature.unit = "fahrenheit";
            tempElement.innerHTML = `${fahrenheit}°<span >F</span>`;
            if (weather.iconId === "13d" || weather.iconId === "13n" || weather.iconId === "50d" || weather.iconId === "50n") {
                tempElement.innerHTML = fahrenheit + "°<span style='color:black'>F</span>";
            }
        } else {
            tempElement.innerHTML = `${weather.temperature.value}°<span>C</span>`;
            weather.temperature.unit = "celsius"
            if (weather.iconId === "13d" || weather.iconId === "13n" || weather.iconId === "50d" || weather.iconId === "50n") {
                tempElement.innerHTML = weather.temperature.value + "°<span style='color:black'>C</span>";
            }
        }
    });
}