const timeEl = document.getElementById('time');
const dateEl = document.getElementById('date');
const currentWeatherItemsEl = document.getElementById('current-weather-items');
const timezone = document.getElementById('time-zone');
const countryEl = document.getElementById('country');
const weatherForecastEl = document.getElementById('weather-forecast');
const currentTempEl = document.getElementById('current-temp');
const currentWeatherEl = document.getElementById('current-weather');
const searchButton = document.getElementById('search');
const popUpEl = document.getElementById('pop-up')
const searchInput = document.getElementById('search-bar');
const searchMessage = document.getElementById('floating-text');

const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

//get and insert your own api key into API_KEY variable from "https://openweathermap.org/api"
const API_KEY ='';

searchButton.addEventListener('click', function(){
    if (searchInput.value.length < 3){
        searchMessage.innerHTML = `<label class="floating-text">City Please</label>`
        return
    } else{
    getCurrentWeather(document.getElementById('search-bar').value);
    popUpEl.innerHTML = `    
    <div class="pop-main" id="pop-up" hidden>
        <div class="pop-up">
            <h1>Local Weather</h1>
         <p>Enter your city for current weather and news.</p>
            <div class="city-search">
                <div class="input-data">
                    <input type="text" class="search-bar" id="search-bar" required>
                    <label class="floating-text">Search</label>
                </div>
            </div>
            <br>
            <button class="search" id="search">Search</button>
        </div>
    </div>`
}})

setInterval(() => {
    const time = new Date();
    const month = time.getMonth();
    const date = time.getDate();
    const day = time.getDay();
    const hour = time.getHours();
    const hoursIn12HrFormat = hour >= 13 ? hour %12: hour
    const minutes = time.getMinutes();
    const ampm = hour >=12 ? 'PM' : 'AM'

    timeEl.innerHTML = hoursIn12HrFormat + ':' + (minutes < 10? '0'+minutes: minutes)+ `<span id="am-pm">${ampm}</span><span class="small-pst">(Local time)</span>`

    dateEl.innerHTML = days[day] + ', ' + date+ ' ' + months[month]

}, 1000);

function getCurrentWeather(userSearch) {
    let searchCity = userSearch
    fetch(`https://api.openweathermap.org/data/2.5/weather?q=${searchCity}&units=imperial&appid=${API_KEY}`).then(res => res.json()).then(currentData => {
    showCurrentWeather(currentData);
    })
}

function showCurrentWeather(currentData) {
    let cIcon = currentData.weather[0].icon
    let cTemperature = Math.round(currentData.main.temp)
    let cCity = currentData.name
    let cHumidity = currentData.main.humidity
    let cWindSpeed = currentData.wind.speed
    let cSunrise = currentData.sys.sunrise
    let cSunset = currentData.sys.sunset
    let longitude = currentData.coord.lon
    let latitude = currentData.coord.lat
    let cDescription = currentData.weather[0].main

    currentWeatherEl.innerHTML = 
    `<div class="current-weather" id="current-weather">
    <div class="topWeather">
            <div class="current-city">${cCity}</div>
            <div class="description">${cDescription}</div>
        </div>                    
        <img src="http://openweathermap.org/img/wn/${cIcon}@4x.png" alt="weather icon" class="current-icon">
        <div class="current-temp">${cTemperature}&#176 F</div>
    </div>`

    currentWeatherItemsEl.innerHTML =
    `<div class="weather-item">
    <div>Humidity</div>
    <div>${cHumidity}%</div>
</div>
<div class="weather-item">
    <div>Wind Speed</div>
    <div>${cWindSpeed} mph</div>
</div>
<div class="weather-item">
    <div>Sunrise</div>
    <div>${window.moment(cSunrise * 1000).format('h:mm a')}</div>
</div>
<div class="weather-item">
    <div>Sunset</div>
    <div>${window.moment(cSunset*1000).format('h:mm a')}</div>
</div>`

fetch(`https://api.openweathermap.org/data/2.5/onecall?lat=${latitude}&lon=${longitude}&exclude=hourly,minutely&units=imperial&appid=${API_KEY}`).then(res => res.json()).then(data => {

    showWeatherData(data);
    })
}

function showWeatherData (data){
    timezone.innerHTML = data.timezone
    countryEl.innerHTML = data.lat + 'N ' + data.lon+'E'
    let otherDayForcast = ''
    data.daily.forEach((day, idx) => {
        if(idx == 0){
            currentTempEl.innerHTML = `
            <img src="http://openweathermap.org/img/wn//${day.weather[0].icon}@4x.png" alt="weather icon" class="w-icon">
            <div class="other">
                <div class="day">${window.moment(day.dt*1000).format('dddd')}</div>
                <div class="temp">High - ${day.temp.max}&#176;C</div>
                <div class="temp">Low - ${day.temp.min}&#176;C</div>
            </div>
            
            `
        }else{
            otherDayForcast += `
            <div class="weather-forecast-item">
                <div class="day">${window.moment(day.dt*1000).format('ddd')}</div>
                <img src="http://openweathermap.org/img/wn/${day.weather[0].icon}@2x.png" alt="weather icon" class="w-icon">
                <div class="temp">High - ${day.temp.max}&#176;C</div>
                <div class="temp">Low - ${day.temp.min}&#176;C</div>
            </div>
            
            `
        }
    })


    weatherForecastEl.innerHTML = otherDayForcast;
}