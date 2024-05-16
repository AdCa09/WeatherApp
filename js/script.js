const accessKey = 'UEohjsn4fKHHV1BYUIil-XbcCcEs2cmzoE0nP-cVn8s';
const weatherKey = 'aeee27fc8c2c81bd6bba8d74d24cd65f';
// alert('Please allow your location for the best user experience, thank you')
let input = document.querySelector('input');
let buttonSearch = document.querySelector('button');
let title = document.getElementById('location');

//keydown pour le enter
input.addEventListener('keydown', (event) => {
    if (event.key === 'Enter') {
        event.preventDefault(); // Empêche le comportement par défaut du formulaire
        title.innerHTML = input.value; // Affiche la ville saisie
        const city = input.value; // Sauvegarde la ville saisie dans une variable
        input.blur(); // Quitte l'input
        input.value = ''; // Réinitialise l'input après avoir quitté
        fetchData(city); // Appelle fetchData avec la ville saisie
    }
});
// eventListener pour le button search
buttonSearch.addEventListener('click', function () {
    fetchData(input.value);
});

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
            if (data.urls && data.urls.regular) {//vérifie si l'url est disponible avant de l'affichée
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

    //Timeout avant la prochaine image 
    setTimeout(() => {
        document.body.style.opacity = '1';
    }, 100); 
}

let spanTemp = document.getElementById('temperature');
//Function pour récupérer la température de la ville données, en celsius
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


                const temperatureElement = dayContainer.querySelector('.temperatureDay');
                temperatureElement.textContent = forecast.main.temp + '°C';


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

        // Vérifiez le statut météorologique pour chaque jour
        if (dayStatusElement.textContent.trim() === 'clear sky') {
            // Mettre à jour l'attribut src de l'image avec l'URL de l'image correspondant à 'clear sky'
            image.src = 'https://www.svgheart.com/wp-content/uploads/2020/09/sun-free-svg-file.png';
            image.height = 90;
        }
        if(dayStatusElement.textContent.trim() === 'broken clouds'){
            image.src = 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/95/Cartoon_cloud.svg/1200px-Cartoon_cloud.svg.png'
            image.height = 90;
            image.left = 20 + '%';
        }
        if(dayStatusElement.textContent.trim() === 'overcast clouds'){
            image.src = 'https://cdn-icons-png.flaticon.com/512/5712/5712721.png'
            image.height = 90;
            image.left = 20 + '%';
        }
        if(dayStatusElement.textContent.trim() === 'light rain' || dayStatusElement.textContent.trim() === 'rain' || dayStatusElement.textContent.trim() === 'shower rain'|| dayStatusElement.textContent.trim() === 'moderate rain' || dayStatusElement.textContent.trim() === 'heavy intensity rain' || dayStatusElement.textContent.trim() === 'drizzle'){
            image.src = 'https://cdn1.iconfinder.com/data/icons/weather-189/64/weather-icons-rainy-512.png'
            image.height = 90;
            image.left = 20 + '%';
        }
        if(dayStatusElement.textContent.trim() === 'few clouds'){
            image.src = 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/57/Gnome-weather-few-clouds.svg/768px-Gnome-weather-few-clouds.svg.png'
            image.height = 90;
            image.left = 20 + '%';
        }
        if(dayStatusElement.textContent.trim() === 'snow'){
            image.src = 'https://www.svgrepo.com/show/370930/weather-snow.svg'
            image.height = 90;
            image.left = 20 + '%';
        }
        if(dayStatusElement.textContent.trim() === 'scattered clouds'){
            image.src = ' https://cdn-icons-png.flaticon.com/512/414/414927.png'
            image.height = 90;
            image.left = 20 + '%';
        }
       
    });
}

function actualDay() {
    let h2 = document.querySelectorAll('h2');

    h2.forEach(day => {
        day.textContent = ''; // Efface le contenu existant
    });

    let date = new Date();
    for (let i = 0; i < 5; i++) {
        let dateActu = date.toLocaleDateString('eu-EU', {
            weekday: 'short',
            day: 'numeric',
            month: 'short',
            year: '2-digit',
        });
        h2[i].textContent += ' ' + dateActu;
        date.setDate(date.getDate() + 1); // Passage au jour suivant
    }
}

function actualPosition() {
    navigator.geolocation.getCurrentPosition(success, error);
}

const success = (position) => {
    const latitude = position.coords.latitude;
    const longitude = position.coords.longitude;

    // Appeler fetchData avec les coordonnées de latitude et de longitude
    fetchDataByCoordinates(latitude, longitude);
};

const error = (error) => {
    console.error('Erreur de géolocalisation : ', error.message);
};

function fetchDataByCoordinates(latitude, longitude) {
    // Appele l'API météo avec les coordonnées de latitude et de longitude
    fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${weatherKey}&units=metric`)
        .then((response) => response.json())
        .then(data => {
            // Extrait les informations météorologiques et les afficher
            const airTemp = data.main.temp;
            spanTemp.textContent = airTemp + ' °C';

            // Appele les autres fonctions pour récupérer les autres informations météorologiques
            humidity(data.name); // Utilise le nom de la ville retourné par l'API actuelle pour récupérer l'humidité
            actualWind(data.name); // Utilise le nom de la ville retourné par l'API actuelle pour récupérer la vitesse du vent
            fetchCityImage(data.name); // Utilise le nom de la ville retourné par l'API actuelle pour récupérer une image de la ville
            temperature(data.name); // Utilise le nom de la ville retourné par l'API actuelle pour récupérer la température
            fetchWeeklyWeather(data.name); // Utilise le nom de la ville retourné par l'API actuelle pour récupérer les prévisions météorologiques pour une semaine
            actualDay(); // Appele la fonction pour mettre à jour les jours de la semaine
            imageStatus(data.name); // Utilise le nom de la ville retourné par l'API actuelle pour mettre à jour les images de statut météorologique
            title.innerHTML = (data.name);
            
        })
        .catch(error => {
            console.error('Une erreur s\'est produite lors de la récupération des données météorologiques :', error);
        });
}
actualPosition();


let mapIcon = document.querySelector('.fa-map-marker');

mapIcon.addEventListener('click', function(){
    actualPosition();
});
