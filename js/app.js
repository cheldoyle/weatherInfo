let lat;
let long;
let foreCastInfo;
let city;

let dayInfo = document.querySelectorAll(".dayInfo");
let fullDisplay = document.getElementById("infoSpace");

navigator.geolocation.getCurrentPosition((position) => {
    lat = position.coords.latitude;
    long = position.coords.longitude;
    fetch(`https://api.weather.gov/points/${lat},${long}`)
        .then(response => response.json())
        .then(data => {
            if (data.properties && data.properties.forecast) {
                foreCastInfo = data.properties.forecast;
                    fetch(foreCastInfo)
                    .then(response => response.json())
                    .then(forecastData => {
                        foreCastDisplay(forecastData);
                    })
                    .catch(error => {
                        console.error('Error fetching forecast data:', error);
                    });
            } else {
                console.error('Forecast property not found.');
            }
    })
        .catch(error => {
        console.log(error);
    });
    let location = getAddress(lat, long);
    location.then(result => {
        displayCity(result);
    });
});

function getAddress(lat, lon) {
    return fetch(`https://api.geoapify.com/v1/geocode/reverse?lat=${lat}&lon=${lon}&format=json&apiKey=8d2f4dab487d443e8491fa008867c0fd`).then(result => result.json()).then(result => {
      if (result && result.results.length) {
        return result.results[0].formatted
      }
  
      return null
    })
};

function foreCastDisplay(forecast) {
    console.log(forecast)
    let count = 0;

    for (let i = 1; i < 8; i++) {
        let dayDisplay = document.querySelector(`.day${i} .day`);
        let tempImg = document.querySelector(`.day${i} .dayImg`);
        let tempDisplay = document.querySelector(`.day${i} .temp`);
        let shortCast = document.querySelector(`.day${i} .shortCast`)
        let windDisplay = document.querySelector(`.day${i} .wind`);
        foreCastDataCollection(forecast, dayDisplay, tempImg, tempDisplay, shortCast, windDisplay, count);
        count += 2;
    }
};

function checkDayName(count, forecast) {
    let dayCheck = forecast.properties.periods[count].name;
    let nightCheck = dayCheck.split(" ");
    let newCount = count;
    for (let i = 0; i < nightCheck.length; i++) {
        if (nightCheck[i] == "Night") {
            newCount = count - 1;
        }
    };

    return newCount;
}

function foreCastDataCollection(forecast, day, tempImg, tempDisplay, shortCast, windDisplay, count) {
    count = checkDayName(count, forecast);
    let dayName = forecast.properties.periods[count].name;
    let dayImg;
    let dayTemp = forecast.properties.periods[count].temperature;
    let tempType = forecast.properties.periods[count].temperatureUnit;
    let castSmall = forecast.properties.periods[count].shortForecast;
    let windSpeed = forecast.properties.periods[count].windSpeed;
    let windDirection = forecast.properties.periods[count].windDirection;

    day.innerHTML = dayName;
    tempDisplay.innerHTML = dayTemp + "°" + tempType;
    shortCast.innerHTML = castSmall;
    windDisplay.innerHTML = `${windSpeed}\n${windDirection}`;
};

function displayCity(city) {
    let locationName = document.querySelector(".location .area");
    locationName.innerHTML = city;
};

dayInfo.forEach(div => {
    div.addEventListener("click", () => {
        fullDisplay.innerHTML = "Hello";
    })
})