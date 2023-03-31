import axios from "http://cdn.skypack.dev/axios";


export function getLocation(city){
    return axios.get("https://api.openweathermap.org/geo/1.0/direct?q=Lexington&appid=94a766159bf5132044fd7a660d14084b",
    {
        params: {
            city: city
        }
    }).then(({data}) =>{
        return (data)
    })
    // }).then(({ data}) =>{
    //     return (data)
    // })
    
}
// https://api.open-meteo.com/v1/forecast?latitude=52.52&longitude=13.41&hourly=temperature_2m,relativehumidity_2m,apparent_temperature,precipitation_probability,weathercode,windspeed_10m&daily=weathercode,temperature_2m_max,temperature_2m_min,apparent_temperature_max,apparent_temperature_min,sunrise,sunset,precipitation_sum&current_weather=true&temperature_unit=fahrenheit&windspeed_unit=mph&precipitation_unit=inch&timeformat=unixtime&timezone=America%2FChicago
export function getWeather(lat, lon, timezone){
    return axios.get("https://api.open-meteo.com/v1/forecast?latitude=52.52&longitude=13.41&hourly=temperature_2m,relativehumidity_2m,apparent_temperature,precipitation_probability,weathercode,windspeed_10m&daily=weathercode,temperature_2m_max,temperature_2m_min,apparent_temperature_max,apparent_temperature_min,sunrise,sunset,precipitation_sum&current_weather=true&temperature_unit=fahrenheit&windspeed_unit=mph&precipitation_unit=inch&timeformat=unixtime&timezone=America%2FChicago", 
        {
            params: {
                latitude: lat,
                longitude: lon,
                timezone,
            },
        }
    ).then(({ data}) => {
        // return (data)
        return {
            current: parseCurrentWeather(data),
            daily: parseDailyWeather(data),
            hourly: parseHourlyWeather(data),
            
        // 
        }
    })   
}


function parseCurrentWeather({ current_weather, daily }) {
    const {
        temperature: currentTemp,
        windspeed: windSpeed,
        weathercode: iconCode,
        time, 
    } = current_weather

    const{
        temperature_2m_max: [maxTemp],
        temperature_2m_min: [minTemp],
        apparent_temperature_max: [maxFL],
        apparent_temperature_min: [minFL],
        sunrise: [rise],
        sunset: [set],
        precipitation_sum: [precip],
    } = daily

    return{
        currentTemp: Math.round(currentTemp),
        highTemp: Math.round(maxTemp),
        lowTemp: Math.round(minTemp),
        highFL: Math.round(maxFL),
        lowFL: Math.round(minFL),
        precip: Math.round(precip*100)/100,
        sunRise: rise,
        sunSet:set,
        windSpeed: Math.round(windSpeed),
        iconCode,
        timeStamp: time*1000,
    }
}

function parseDailyWeather({ daily }){
    return daily.time.map((time, index) => {
        return {
            timestamp: time*1000,
            iconCode: daily.weathercode[index],
            maxTemp: Math.round(daily.temperature_2m_max[index]),
            minTemp: Math.round(daily.temperature_2m_min[index])
        }   

    })
}

function parseHourlyWeather({ hourly, current_weather }){
    return hourly.time.map((time, index) =>{
        return {
            timestamp: time * 1000,
            iconCode: hourly.weathercode[index],
            temp: Math.round(hourly.temperature_2m[index]),
            fl: Math.round(hourly.apparent_temperature[index]),
            windSpeed: Math.round(hourly.windspeed_10m[index]),
            precip: Math.round(hourly.precipitation_probability[index]),
        }
    }).filter(({ timestamp }) => timestamp >= current_weather.time *1000)
}


