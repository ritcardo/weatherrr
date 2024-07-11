document.addEventListener("DOMContentLoaded", function() {
    const apiKey = "Ao4qOuzkKzf8RrGk0QivOc0cJpRlAtJH"; // Replace with your actual API key
    const form = document.getElementById("cityForm");
    const weatherDiv = document.getElementById("weather");

    form.addEventListener("submit", function(event) {
        event.preventDefault();
        const city = document.getElementById("cityInput").value;
        getWeather(city);
    });

    function getWeather(city) {
        const locationUrl = `http://dataservice.accuweather.com/locations/v1/cities/search?apikey=${apiKey}&q=${city}`;

        fetch(locationUrl)
            .then(response => response.json())
            .then(data => {
                if (data && data.length > 0) {
                    const locationKey = data[0].Key;
                    fetchWeatherData(locationKey);
                    fetchDailyForecast(locationKey);
                    fetchHourlyForecast(locationKey);
                } else {
                    weatherDiv.innerHTML = `<p>City not found.</p>`;
                }
            })
            .catch(error => {
                console.error("Error fetching location data:", error);
                weatherDiv.innerHTML = `<p>Error fetching location data.</p>`;
            });
    }

    function fetchWeatherData(locationKey) {
        const currentWeatherUrl = `http://dataservice.accuweather.com/currentconditions/v1/${locationKey}?apikey=${apiKey}`;

        fetch(currentWeatherUrl)
            .then(response => response.json())
            .then(data => {
                if (data && data.length > 0) {
                    displayWeather(data[0]);
                } else {
                    weatherDiv.innerHTML = `<p>No weather data available.</p>`;
                }
            })
            .catch(error => {
                console.error("Error fetching current weather data:", error);
                weatherDiv.innerHTML = `<p>Error fetching current weather data.</p>`;
            });
    }

    function fetchDailyForecast(locationKey) {
        const dailyForecastUrl = `http://dataservice.accuweather.com/forecasts/v1/daily/5day/${locationKey}?apikey=${apiKey}`;

        fetch(dailyForecastUrl)
            .then(response => response.json())
            .then(data => {
            
                if (data && data.DailyForecasts && data.DailyForecasts.length > 0) {
                    displayDailyForecast(data.DailyForecasts);
                } else {
                    weatherDiv.innerHTML += `<p>No daily forecast data available.</p>`;
                }
            })
            .catch(error => {
                console.error("Error fetching daily forecast data:", error);
                weatherDiv.innerHTML += `<p>Error fetching daily forecast data.</p>`;
            });
    }

    function fetchHourlyForecast(locationKey) {
        const hourlyForecastUrl = `http://dataservice.accuweather.com/forecasts/v1/hourly/1hour/${locationKey}?apikey=${apiKey}`;

        fetch(hourlyForecastUrl)
            .then(response => response.json())
            .then(data => {

                if (data && data.length > 0) {
                    displayHourlyForecast(data);
                } else {
                    weatherDiv.innerHTML += `<p>No hourly forecast data available.</p>`;
                }
            })
            .catch(error => {
                console.error("Error fetching hourly forecast data:", error);
                weatherDiv.innerHTML += `<p>Error fetching hourly forecast data.</p>`;
            });
    }

    function displayWeather(data) {
        const temperature = data.Temperature.Metric.Value;
        const weather = data.WeatherText;
        const weatherContent = `
            <h2>Current Weather</h2>
            <p>Temperature: ${temperature}°C</p>
            <p>Weather: ${weather}</p>
        `;
        weatherDiv.innerHTML = weatherContent;
    }

    function displayDailyForecast(forecasts) {
        let forecastContent = "<h2>5 Days Daily Forecast</h2>";
        forecasts.forEach(forecast => {
            const date = new Date(forecast.Date);
            const temperature = forecast.Temperature.Maximum.Value;
            const weather = forecast.Day.IconPhrase;
            forecastContent += `
                <div>
                    <p>Date: ${date.toDateString()}</p>
                    <p>Temperature: ${temperature}°C</p>
                    <p>Weather: ${weather}</p>
                </div>
            `;
        });
        weatherDiv.innerHTML += forecastContent;
    }

    function displayHourlyForecast(forecasts) {
        let forecastContent = "<h2>1 Hourly Forecast</h2>";
        forecasts.forEach(forecast => {
            const date = new Date(forecast.DateTime);
            const temperature = forecast.Temperature.Value;
            const weather = forecast.IconPhrase;
            forecastContent += `
                <div>
                    <p>Date: ${date.toLocaleString()}</p>
                    <p>Temperature: ${temperature}°C</p>
                    <p>Weather: ${weather}</p>
                </div>
            `;
        });
        weatherDiv.innerHTML += forecastContent;
    }
});
