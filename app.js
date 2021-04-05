// https://api.openweathermap.org/data/2.5/weather?q=miami&appid=b51463bfb1804614467a199fd650671b
//b51463bfb1804614467a199fd650671b
// let days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

const weatherCont = document.querySelector('.weather-cont');
const curDate = new Date();

const api = {
    base: 'https://api.openweathermap.org/data/2.5/',
    key: 'b51463bfb1804614467a199fd650671b'
}

const errorMessage = (err) => {
    err = '<h3 class="text-danger">We\'re sorry, we have lost connection with our servers</h3>';
    return weatherCont.insertAdjacentHTML('beforeend',err )
}

const getJSON = async (url) => {
    const result = await fetch(url)
    if(!result.ok) errorMessage()

    return result.json();
}

const searchWeather = (location = "washington") => { 
    getJSON(`${api.base}weather?q=${location}&appid=${api.key}`)
    .then( convertKtoC )
    .then( setDate )
    .then( setTime )
    .then( renderWeather )
    .catch(() => errorMessage())
}

const convertKtoC = (data) => {
    let {temp,temp_max,temp_min,feels_like} = data.main 
    // 1. Conversion Kelvin to Celcius (0 K − 273.15 = -273.1 °C)
    temp = (temp - 273.15).toFixed(2)
    temp_max = (temp_max - 273.15).toFixed(2)
    temp_min = (temp_min - 273.15).toFixed(2)
    feels_like = (feels_like - 273.15).toFixed(2)

    return {temp,temp_max,temp_min,feels_like,data}
}

const setTime = (obj) => {
    const hour = curDate.getHours();
    const minutes = curDate.getMinutes()
    const time = `${hour}:${minutes}`

    return {time,obj}
}
const setDate = (obj) => {
    const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    
    const day = curDate.getDate();
    const month = curDate.getMonth();
    const year = curDate.getFullYear();
    const date = `${day} ${months[month]} ${year}`
    
    return {date,obj}
}

const renderWeather = (dataObj) => {
    console.log(dataObj)
    const {lat,lon} = dataObj.obj.obj.data.coord
    if(dataObj.obj.obj.data.wind.gust === undefined) dataObj.obj.obj.data.wind.gust = 'Not Defined'
    const html = `
        <div class="weather--state">
            <h2 class="text-secondary fnt-sBold">${(dataObj.obj.obj.data.name).toUpperCase()} <span class="fnt-regular text-muted">${lat}, ${lon}</span></h2>
            <p class="text-muted fnt-medium">${dataObj.obj.date}</p>
            <p class="text-muted fnt-medium">Updated at ${dataObj.time}</p>
        </div>

        <div class="weather--temp">
            <h1 class="fnt-sBold text-secondary">${dataObj.obj.obj.temp}ºC</h1>
            <p class="text-muted fnt-medium">Feels Like: ${dataObj.obj.obj.feels_like}</p>
        </div>

        <div class="weather--cont">
            <div class="weather--block">
                <div class="weather--status">
                    <h2 class="text-primary fnt-sBold">${(dataObj.obj.obj.data.weather[0].description).toUpperCase()}</h2>
                </div>
             <div class="weather--details">
                 <p class="text-muted fnt-regular">Humidity: ${dataObj.obj.obj.data.main.humidity}%</p>
                 <p class="text-muted fnt-regular">Max Temp: ${dataObj.obj.obj.temp_max}ºC</p>
                 <p class="text-muted fnt-regular">Min Temp: ${dataObj.obj.obj.temp_min}ºC</p>
                 <p class="text-muted fnt-regular">Pressure: ${dataObj.obj.obj.data.main.pressure}</p>                        
             </div>
        </div>
            <div class="weather--block">
                <div class="img-weather">
                    <img src="./img/sunrise.svg" alt="Sunrise">
                    <span><h3 class="text-secondary fnt-medium">Sunrise</h3></span>
                    <p class="text-muted fnt-regular">${dataObj.obj.obj.data.sys.sunrise}</p>
                </div>
                <div class="img-weather">
                    <img src="./img/sunset.svg" alt="Sunset">
                    <span><h3 class="text-secondary fnt-medium">Sunset</h3></span>
                    <p class="text-muted fnt-regular">${dataObj.obj.obj.data.sys.sunset}</p>
                </div>
            </div>
            <div class="weather--block">
                <h3 class="text-secondary fnt-medium"><span class="arrow-wind">&#8594;</span> ${dataObj.obj.obj.data.wind.gust} mph</h3>
                <p class="text-muted fnt-regular">Speed: ${dataObj.obj.obj.data.wind.speed} mps</p>
            </div>
        </div>
    `;
    weatherCont.insertAdjacentHTML('beforeend',html)
}



(() => searchWeather())();
