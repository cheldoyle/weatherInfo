let lat;
let long;
let foreCastInfo;
let city;

let dayInfo = document.querySelectorAll(".dayInfo");

let example = document.querySelector(".example");

let dayTop = document.getElementById("dayName");
let tempTop = document.getElementById("tempLoc");
let imgTop = document.getElementById("forecastImgTop");
let windSTop = document.getElementById("windS");
let windDTop = document.getElementById("windD");
let foreTop = document.getElementById("foreIn");

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

    let time = forecast.properties.periods[0].isDaytime;
    let dayNightSwitch = timeCheck(time)

    example.src = forecast.properties.periods[0].icon;

    document.body.classList.add(dayNightSwitch);

    for (let i = 1; i < 8; i++) {
        let dayDisplay = document.querySelector(`.day${i} .day`);
        let tempImg = document.querySelector(`.day${i} .forecastImg`);
        let tempDisplay = document.querySelector(`.day${i} .temp`);
        let shortCast = document.querySelector(`.day${i} .shortCast`)
        let windSDisplay = document.querySelector(`.day${i} .windS`);
        let windDDisplay = document.querySelector(`.day${i} .windD`);
        foreCastDataCollection(forecast, dayDisplay, tempImg, tempDisplay, shortCast, windSDisplay, windDDisplay, count);
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
};

function foreCastDataCollection(forecast, day, tempImg, tempDisplay, castInfo, windSDisplay, windDDisplay, count) {
    count = checkDayName(count, forecast);
    let dayName = forecast.properties.periods[count].name;
    let dayTemp = forecast.properties.periods[count].temperature;
    let tempType = forecast.properties.periods[count].temperatureUnit;
    let detailInfo = forecast.properties.periods[count].detailedForecast;
    let windSpeed = forecast.properties.periods[count].windSpeed;
    let windDirection = forecast.properties.periods[count].windDirection;
    let dayImg = forecastImg(detailInfo);

    day.innerHTML = dayName;
    tempImg.classList.add(dayImg);
    tempDisplay.innerHTML = dayTemp + "°" + tempType;
    castInfo.innerHTML = detailInfo;
    windSDisplay.innerHTML = windSpeed;
    windDDisplay.innerHTML = windDirection;

    let starterInfo = forecast.properties.periods[0].detailedForecast;
    let starterImg = forecastImg(starterInfo);

    dayTop.innerHTML = forecast.properties.periods[0].name;
    tempTop.innerHTML = forecast.properties.periods[0].temperature + "°";
    imgTop.classList.add(starterImg);
    foreTop.innerHTML = forecast.properties.periods[0].detailedForecast;
    windSTop.innerHTML = forecast.properties.periods[0].windSpeed;
    windDTop.innerHTML = forecast.properties.periods[0].windDirection;
};

function displayCity(city) {
    let locationName = document.querySelector(".location .area");
    locationName.innerHTML = city;
};

dayInfo.forEach(div => {
    div.addEventListener("click", () => {
        imgTop.className = "";
        let clickedDiv = event.currentTarget;

        let dayName = clickedDiv.querySelector('.day').innerHTML;
        let img = clickedDiv.querySelector('.forecastImg').className.split(' ');
        img = img[img.length - 1]
        let temp = clickedDiv.querySelector('.temp').innerHTML;
        let shortCast = clickedDiv.querySelector('.shortCast').innerHTML;
        let windSpeed = clickedDiv.querySelector('.windS').innerHTML;
        let windDirect = clickedDiv.querySelector('.windD').innerHTML;

        dayTop.innerHTML = dayName;
        tempTop.innerHTML = temp;
        imgTop.classList.add("wi");
        imgTop.classList.add(img);
        foreTop.innerHTML = shortCast;
        windSTop.innerHTML = windSpeed;
        windDTop.innerHTML = windDirect;
    })
});

function forecastImg(descrip) {
    let imgClass = "error";
    let descripSearch = descrip.split(" ");
    for(let i = 0; i < descripSearch.length; i++) {
        if ((descripSearch[i] == "rain") || (descripSearch[i] == "rain.") || (descripSearch[i] == "Rain")) {
            imgClass = "wi-day-showers";
            break;
        }
        else if ((descripSearch[i] == "Sunny.") || (descripSearch[i] == "Sunny,") || (descripSearch[i] == "Sunny")) {
            imgClass = "wi-day-sunny";
            break;
        }
    };
    return imgClass;
};

function timeCheck(bool) {
    let backColor = "";
    if (bool) {
        backColor = "isDay";
    } else {
        backColor = "isNight";
    }
    return backColor
}