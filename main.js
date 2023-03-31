import {getWeather} from "./helper.js"
import { ICON_MAP } from "./iconMap.js"





const apiKey ="94a766159bf5132044fd7a660d14084b"
const apiURL = "https://api.openweathermap.org/geo/1.0/direct?q="

const apiKey2 = "d8b9248684ba4656a6c86736af871755"
const apiURL2 = "https://api.geoapify.com/v1/geocode/reverse?"

const sleep = (ms = 5000) => new Promise((r) => setTimeout(r,ms));


const searchBox = document.querySelector(".search input");
const searchBtn = document.querySelector(".search button");
const weatherIcon = document.querySelector(".weather-icon");

var city
var userTZ
var lat
var lon

if (isNaN(searchBox.value) == false){
    console.log('searchbox', searchBox.value);
    
}

searchBtn.addEventListener("click", ()=>{
    getInput(searchBox.value);
    
});

searchBox.addEventListener("keypress", function (e){
    if (e.key == 'Enter'){
        searchBtn.click();
    }
});

async function getLocation(city){
    const response = await fetch(apiURL + city + `&appid=${apiKey}`);
    const data = await response.json();

    lat = data[0].lat
    lon = data[0].lon
    console.log('lat',lat)

    document.querySelector(".city").innerHTML = city
    return [lat, lon]
}

async function getTimeZone(lat, lon){
    const response = await fetch(apiURL2 + `lat=${lat}&lon=${lon}&format=json&apiKey=${apiKey2}`);
    const data = await response.json();
    var tz = data.results[0].timezone.name
    console.log ('timezone:', tz)
    return tz
}

async function getInput(city){
    const coord = await getLocation(city)
    // await sleep()
    const user_tz = await getTimeZone(coord[0],coord[1])
    getWeather(coord[0],coord[1],user_tz)
.then (renderWeather).catch(e =>{
    console.error(e)
    alert("Error getting weather. ")
})

}


// Intl.DateTimeFormat().resolvedOptions().timeZone
getWeather(20, 20,'America/Chicago')
.then (renderWeather).catch(e =>{
    console.error(e)
    alert("Error getting weather. ")
})

function renderWeather({current, daily, hourly}){
    renderCurrentWeather(current)
    renderDailyWeather(daily)
    var results = renderHourlyWeather(hourly)
    // console.log(results)
    // console.log(results[0])
    // console.log(results[1])
    // displayHourlyWeatherChart(results[0],results[1])

}

const DATE_FORMATTER = new Intl.DateTimeFormat(undefined, {dateStyle: "full"})
const TIME_FORMATTER = new Intl.DateTimeFormat(undefined,{timeStyle:"short"})
function renderCurrentWeather(current){
    const currentIcon = document.querySelector(".weather-icon")
    currentIcon.src = getIcon(current.iconCode)
    document.querySelector(".temp").textContent = current.currentTemp + "°F"
    document.querySelector(".wind").innerHTML = current.windSpeed + "MPH"
    // document.querySelector(".fl").innerHTML = current.lowFL
    document.querySelector(".precip").innerHTML = current.precip
    document.querySelector(".date").innerHTML = DATE_FORMATTER.format(current.timeStamp)
    // document.querySelector(".hours").innerHTML= TIME_FORMATTER.format(current.timeStamp)
    // console.log(current.timeStamp)

    


}

const dailySection = document.querySelector(".daily")
const dayCardTemplate = document.getElementById("daycard")
const DAY_FORMATTER = new Intl.DateTimeFormat(undefined, { weekday: "long"})
function renderDailyWeather(daily){
    dailySection.innerHTML = ""
    daily = daily.slice(0,5)
    daily.forEach(day => {
        const element = dayCardTemplate.content.cloneNode(true)
        element.querySelector(".daily-max-temp").textContent = day.maxTemp + "°";
        element.querySelector(".daily-min-temp").textContent = day.minTemp + "°";
        element.querySelector(".dotw").textContent = DAY_FORMATTER.format(day.timestamp)
        element.querySelector(".day-card img").src = getIcon(day.iconCode)
        dailySection.append(element)
    })
    
}

const HOUR_FORMATTER = new Intl.DateTimeFormat(undefined, {hour: "numeric"})
function renderHourlyWeather(hourly){
    var x_val = []
    var y_val = []

    
    hourly.forEach(day =>{
        y_val.push(day.temp)
        

        x_val.push(HOUR_FORMATTER.format(day.timestamp))

    })
    // console.log(y_val)
    // console.log(x_val)
    return  [x_val, y_val]
}

// function displayHourlyWeatherChart (x,y){
//     if(window.myChart !=null){
//         window.myChart.destroy()
//     }

//     const ctx = document.getElementById('myChart');

//     window.myChart =
//     new Chart(ctx, {
//       type: 'line',
//       data: {
//         labels: x.slice(0,25),
//         datasets: [{
//         //   label: 'HOURLY FORECAST',
//           data: y.slice(0,25),
//           borderWidth: 2,
//           borderColor: 'rgba(249, 115, 62, 1)',
//         }]
//       },
//       options: {
//         maintainAspectRatio: false,
//         responsive: true,
//         tension: 0.4,
//         plugins:{
//             legend:{
//                 display: false,
                
//             }
//         },
//         label:{
//             display: false
//         },
//         scales: {
//           y: {
//             beginAtZero: false,
//             ticks:{
//                 beginAtZero: true,
//                 callback: function(value, index,values){
//                     return value + '°F'
//                 }
//             },
//             grid: {
//                 display: false
//             },

//           },
//           x: {
            
            
//           }

//         }
//       }
//     });

    
    
// }

function getIcon(iconCode){
    return `Weather-icon/${ICON_MAP.get(iconCode)}.png`
}