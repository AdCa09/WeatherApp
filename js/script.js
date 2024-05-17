const accessKey = 'UEohjsn4fKHHV1BYUIil-XbcCcEs2cmzoE0nP-cVn8s';
const weatherKey = 'aeee27fc8c2c81bd6bba8d74d24cd65f';
alert('Please allow the position for a better user exeperience')
let input = document.querySelector('input');
let buttonSearch = document.querySelector('button');
let title = document.getElementById('location');

// Charger la ville sauvegardée au démarrage
window.addEventListener('load', () => {
    const savedCity = localStorage.getItem('savedCity');
    if (savedCity) {
        title.innerHTML = savedCity;
        fetchData(savedCity);
    }
});

//keydown pour le enter
input.addEventListener('keydown', (event) => {
    if (event.key === 'Enter') {
        event.preventDefault(); // Empêche le comportement par défaut du formulaire
        handleCityInput();
    }
});

// eventListener pour le button search
buttonSearch.addEventListener('click', function () {
    handleCityInput();
});

function handleCityInput() {
    const city = input.value.trim(); // Enlever les espaces superflus
    if (city) {
        title.innerHTML = city; // Affiche la ville saisie
        localStorage.setItem('savedCity', city); // Sauvegarder la ville dans localStorage
        fetchData(city); // Appelle fetchData avec la ville saisie
        input.value = ''; // Réinitialise l'input après avoir quitté
    }
}

function fetchData(city) {
    fetchCityImage(city);
    temperature(city);
    humidity(city);
    actualWind(city);
    fetchWeeklyWeather(city);
    actualDay(city);
    imageStatus(city);
}

//Fonction pour afficher différente images par rapport à la ville indiquée
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
    document.body.style.opacity = '0';
    document.body.style.backgroundImage = `url('${imageUrl}')`;
    document.body.style.backgroundSize = 'cover';
    document.body.style.backgroundRepeat = 'no-repeat';

    setTimeout(() => {
        document.body.style.opacity = '1';
    }, 100);
}

let spanTemp = document.getElementById('temperature');

function temperature(city) {
    fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${weatherKey}&units=metric`)
        .then(response => response.json())
        .then(data => {
            let airTemp = data.main.temp;
            airTemp = Math.round(airTemp);
            spanTemp.textContent = airTemp + ' °C';
        })
        .catch(error => {
            console.error('Une erreur s\'est produite lors de la récupération des données de température :', error);
        });
}

let humidityInfo = document.getElementById('infoHumidity');
function humidity(city) {
    fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${weatherKey}&units=metric`)
        .then(response => response.json())
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
        .then(response => response.json())
        .then(data => {
            let windSpeed = data.wind.speed;
            windSpeed = Math.round(windSpeed);
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
        .then(response => response.json())
        .then(data => {
            const dailyForecasts = data.list.slice(0, 5);
            const dayContainers = document.querySelectorAll('.dayContainer');

            dailyForecasts.forEach((forecast, index) => {
                const dayContainer = dayContainers[index];
                const temperatureElement = dayContainer.querySelector('.temperatureDay');
                let forecastAdd = forecast.main.temp;
                forecastAdd = Math.round(forecastAdd);
                temperatureElement.textContent = forecastAdd + '°C';
                const weatherDescription = forecast.weather[0].description;
                const dayStatusElement = dayContainer.querySelector('.dayStatus');
                dayStatusElement.textContent = weatherDescription;
            });
            imageStatus(city);
        })
        .catch(error => {
            console.error('Une erreur s\'est produite lors de la récupération des données de prévisions pour une semaine :', error);
        });
}

function imageStatus(city) {
    const dayStatusElements = document.querySelectorAll('.dayStatus');
    dayStatusElements.forEach((dayStatusElement, index) => {
        let image = document.querySelectorAll('.dayContainer img')[index];
        switch (dayStatusElement.textContent.trim()) {
            case 'clear sky':
                image.src = 'https://www.svgheart.com/wp-content/uploads/2020/09/sun-free-svg-file.png';
                break;
            case 'broken clouds':
                image.src = 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/95/Cartoon_cloud.svg/1200px-Cartoon_cloud.svg.png';
                break;
            case 'overcast clouds':
                image.src = 'https://cdn-icons-png.flaticon.com/512/5712/5712721.png';
                break;
            case 'light rain':
            case 'rain':
            case 'shower rain':
            case 'moderate rain':
            case 'heavy intensity rain':
            case 'drizzle':
                image.src = 'https://freepngimg.com/thumb/artwork/88591-animation-leaf-cloud-rain-area-free-download-png-hq.png';
                break;
            case 'few clouds':
                image.src = 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/57/Gnome-weather-few-clouds.svg/768px-Gnome-weather-few-clouds.svg.png';
                break;
            case 'snow':
                image.src = 'https://www.svgrepo.com/show/370930/weather-snow.svg';
                break;
            case 'scattered clouds':
                image.src = 'https://cdn-icons-png.flaticon.com/512/414/414927.png';
                break;
            default:
                image.src = '';
        }
        image.height = 90;
        image.left = '20%';
    });
}

function actualDay() {
    let h2 = document.querySelectorAll('h2');
    h2.forEach(day => {
        day.textContent = '';
    });
    let date = new Date();
    for (let i = 0; i < 5; i++) {
        let dateActu = date.toLocaleDateString('eu-EU', {
            weekday: 'short',
            day: 'numeric',
            month: 'short',
        });
        h2[i].textContent += ' ' + dateActu;
        date.setDate(date.getDate() + 1);
    }
}

function actualPosition() {
    navigator.geolocation.getCurrentPosition(success, error);
}

const success = (position) => {
    const latitude = position.coords.latitude;
    const longitude = position.coords.longitude;
    fetchDataByCoordinates(latitude, longitude);
};

const error = (error) => {
    console.error('Erreur de géolocalisation : ', error.message);
};

function fetchDataByCoordinates(latitude, longitude) {
    fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${weatherKey}&units=metric`)
        .then(response => response.json())
        .then(data => {
            const airTemp = data.main.temp;
            spanTemp.textContent = airTemp + ' °C';
            humidity(data.name);
            actualWind(data.name);
            fetchCityImage(data.name);
            temperature(data.name);
            fetchWeeklyWeather(data.name);
            actualDay();
            imageStatus(data.name);
            title.innerHTML = (data.name);
        })
        .catch(error => {
            console.error('Une erreur s\'est produite lors de la récupération des données météorologiques :', error);
        });
}

let mapIcon = document.querySelector('.fa-map-marker');
mapIcon.addEventListener('click', function () {
    actualPosition();
});
actualPosition();
