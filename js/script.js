// const accessKey = 'UEohjsn4fKHHV1BYUIil-XbcCcEs2cmzoE0nP-cVn8s';
// const weatherKey = 'aeee27fc8c2c81bd6bba8d74d24cd65f';

let input = document.querySelector('input');
let buttonSearch = document.querySelector('button');
let title = document.getElementById('location');

input.addEventListener('keydown', (event) => {
    if (event.key === 'Enter') {
        title.innerHTML = input.value;
        fetchData(input.value);
        event.preventDefault();
    }
});

buttonSearch.addEventListener('click', function () {
    fetchData(input.value);
});

function fetchData(city) {
    fetchCityImage(city);
    temperature(city);
    humidity(city);
    actualWind(city);
    fetchWeeklyWeather(city);

}

function fetchCityImage(city) {
    fetch(`https://api.unsplash.com/photos/random?query=${city}&client_id=${accessKey}`)
        .then(response => response.json())
        .then(data => {
            if (data.urls && data.urls.regular) {
                const imageUrl = data.urls.regular;
                updateBackgroundImage(imageUrl);
            } else {
                console.error('Aucune image trouvée pour cette ville.');
            }
        })
        .catch(error => {
            console.error('Une erreur s\'est produite :', error);
        });
}

function updateBackgroundImage(imageUrl) {
    document.body.style.backgroundImage = `url('${imageUrl}')`;
    document.body.style.backgroundSize = 'cover';
    document.body.style.backgroundRepeat = 'no-repeat';
}

let spanTemp = document.getElementById('temperature');

function temperature(city) {
    fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${weatherKey}&units=metric`)
        .then((response) => response.json())
        .then(data => {
            const airTemp = data.main.temp;
            spanTemp.textContent = airTemp + ' °C';
        })
        .catch(error => {
            console.error('Une erreur s\'est produite lors de la récupération des données de température :', error);
        });
}

let humidityInfo = document.getElementById('infoHumidity');
function humidity(city) {
    fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${weatherKey}&units=metric`)
        .then((response) => response.json())
        .then(data => {
            const humidityNow = data.main.humidity;
            humidityInfo.textContent = 'The humidity is at ' + humidityNow + '%';
        })
        .catch(error => {
            console.error('Une erreur s\'est produite lors de la récupération des données d\'humidité :', error);
        });
}

function actualWind(city) {
    fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${weatherKey}&units=metric`)
        .then((response) => response.json())
        .then(data => {
            const windSpeed = data.wind.speed;
            const windElement = document.getElementById('infoWind');
            windElement.textContent = windSpeed + ' km/h';
        })
        .catch(error => {
            console.error('Une erreur s\'est produite lors de la récupération des données de vitesse du vent :', error);
        });
}
const dayContainers = document.querySelectorAll('.dayContainer');

function fetchWeeklyWeather(city) {
    fetch(`https://api.openweathermap.org/data/2.5/forecast?q=${city}&cnt=40&appid=${weatherKey}&units=metric`)
        .then((response) => response.json())
        .then(data => {
            const dailyForecasts = data.list.slice(0, 5);
            const dayContainers = document.querySelectorAll('.dayContainer');

            dailyForecasts.forEach((forecast, index) => {
                const dayContainer = dayContainers[index];


                const temperatureElement = dayContainer.querySelector(`.temperatureDay${index + 1}`);
                temperatureElement.textContent = forecast.main.temp + '°C';


                const weatherDescription = forecast.weather[0].description;
                const dayStatusElement = dayContainer.querySelector('.dayStatus');
                dayStatusElement.textContent = weatherDescription;
            });
        })
        .catch(error => {
            console.error('Une erreur s\'est produite lors de la récupération des données de prévisions pour une semaine :', error);
        });
}

// function imageStatus(city) {
//
// }

