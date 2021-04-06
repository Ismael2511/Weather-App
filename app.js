// https://api.openweathermap.org/data/2.5/weather?q=miami&appid=b51463bfb1804614467a199fd650671b
//b51463bfb1804614467a199fd650671b
// let days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
const DOMstring = {
    weatherCont: '.weather-cont',
    submit: '#btn_submit',
    inpSearch: '#inp_search',
    state: '#state',
    coords: '#coords',
    date: '#date',
    time: '#time',
    temp: '#temp',
    feels: '#feels_like',
    tStatus: '#temp_status',
    humidity: '#humidity',
    maxTemp: '#max_temp',
    minTemp: '#min_temp',
    pressure: '#pressure',
    sunrise: '#sunrise',
    sunset: '#sunset',
    clouds: '#clouds',
    wind_speed: '#wind_speed'
}

const api = {
    base: 'https://api.openweathermap.org/data/2.5/',
    key: 'APIKEY'
}
const inpState = document.querySelector(DOMstring.inpSearch);
const weatherCont = document.querySelector(DOMstring.weatherCont);
const btn = document.querySelector(DOMstring.submit);
const curDate = new Date();

const errorMessage = (err) => {
    err = '<h3 class="text-danger">We\'re sorry, we have lost connection with our servers</h3>';
    return weatherCont.insertAdjacentHTML('beforeend',err )
}

const getJSON = async (url) => await (await fetch(url)).json()

const searchWeather = (location = "santo domingo") => { 
    getJSON(`${api.base}weather?q=${location}&appid=${api.key}`)
    .then( convertKtoC )
    .then( setDate )
    .then( setTime )
    .then( renderWeather )
    .catch(() => errorMessage())
}

const convertKtoC = (data) => {
    let {temp,temp_max,temp_min,feels_like} = data.main 
    // 1. (0 K − 273.15 = -273.1 °C)
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

const convertUnixToDate = (time) => {
    const newTime = new Date(time * 1000)
    return `${newTime.getHours()}:${newTime.getMinutes()}:${newTime.getSeconds()}`; // 6:14:40
}
const renderWeather = (dataObj) => {
    // FIX OBJECTS WEIRDNESS
    const data = dataObj.obj.obj.data;
    const fstObj = dataObj.obj;
    const secObj = dataObj.obj.obj;
    
    const {lat,lon} = data.coord;
    const sunrise = convertUnixToDate(data.sys.sunrise);
    const sunset = convertUnixToDate(data.sys.sunset);
    // 2. Render HTML
   document.querySelector(DOMstring.state).textContent = (data.name).toUpperCase()
   document.querySelector(DOMstring.coords).textContent = `${lat}, ${lon}`
   document.querySelector(DOMstring.date).textContent = `${fstObj.date}`
   document.querySelector(DOMstring.time).textContent = `Updated at ${dataObj.time}`
   document.querySelector(DOMstring.temp).textContent = `${secObj.temp}ºC`
   document.querySelector(DOMstring.feels).textContent = `Feels Like: ${secObj.feels_like}`
   document.querySelector(DOMstring.tStatus).textContent = `${(data.weather[0].description).toUpperCase()}`
   document.querySelector(DOMstring.humidity).textContent = `Humidity: ${data.main.humidity}%`
   document.querySelector(DOMstring.maxTemp).textContent = `Max Temp: ${secObj.temp_max}ºC`
   document.querySelector(DOMstring.minTemp).textContent = `Min Temp: ${secObj.temp_min}ºC`
   document.querySelector(DOMstring.pressure).textContent = `Pressure: ${data.main.pressure}`
   document.querySelector(DOMstring.sunrise).textContent = `${sunrise}`
   document.querySelector(DOMstring.sunset).textContent = `${sunset}`
   document.querySelector(DOMstring.clouds).textContent = `Clouds: ${data.clouds.all}`
   document.querySelector(DOMstring.wind_speed).textContent = `Speed: ${data.wind.speed} mps`
}

(() => {
    searchWeather()
    inpState.focus()
})();

btn.addEventListener('click', () => {

    if(!inpState.value){
        
    };
    searchWeather(inpState.value)
})

 // const html = `
    //     <div class="weather--state">
    //         <h2 class="text-secondary fnt-sBold">${(data.name).toUpperCase()} <span class="fnt-regular text-muted">${lat}, ${lon}</span></h2>
    //         <p class="text-muted fnt-medium">${fstObj.date}</p>
    //         <p class="text-muted fnt-medium">Updated at ${dataObj.time}</p>
    //     </div>

    //     <div class="weather--temp">
    //         <h1 class="fnt-sBold text-secondary">${secObj.temp}ºC</h1>
    //         <p class="text-muted fnt-medium">Feels Like: ${secObj.feels_like}</p>
    //     </div>

    //     <div class="weather--cont">
    //         <div class="weather--block">
    //             <div class="weather--status">
    //                 <h2 class="text-primary fnt-sBold">${(data.weather[0].description).toUpperCase()}</h2>
    //             </div>
    //          <div class="weather--details">
    //              <p class="text-muted fnt-regular">Humidity: ${data.main.humidity}%</p>
    //              <p class="text-muted fnt-regular">Max Temp: ${secObj.temp_max}ºC</p>
    //              <p class="text-muted fnt-regular">Min Temp: ${secObj.temp_min}ºC</p>
    //              <p class="text-muted fnt-regular">Pressure: ${data.main.pressure}</p>                        
    //          </div>
    //     </div>
    //         <div class="weather--block">
    //             <div class="img-weather">
    //                 <img src="./img/sunrise.svg" alt="Sunrise">
    //                 <span><h3 class="text-secondary fnt-medium">Sunrise</h3></span>
    //                 <p class="text-muted fnt-regular">${sunrise}</p>
    //             </div>
    //             <div class="img-weather">
    //                 <img src="./img/sunset.svg" alt="Sunset">
    //                 <span><h3 class="text-secondary fnt-medium">Sunset</h3></span>
    //                 <p class="text-muted fnt-regular">${sunset}</p>
    //             </div>
    //         </div>
    //         <div class="weather--block">
    //             <h3 class="text-secondary fnt-medium"><span class="arrow-wind">&#8594;</span> ${dataObj.obj.obj.data.wind.gust} mph</h3>
    //             <p class="text-muted fnt-regular">Speed: ${dataObj.obj.obj.data.wind.speed} mps</p>
    //         </div>
    //     </div>
    // `;
    // weatherCont.insertAdjacentHTML('beforeend',html)