// const accessKey = 'UEohjsn4fKHHV1BYUIil-XbcCcEs2cmzoE0nP-cVn8s';
// const weatherKey = 'bee22600aef914f336cc754250da5408';

// besoin de générer nouvelle clé avec un autre mail jetable
let input = document.querySelector('input')
let buttonSearch = document.querySelector('button');

buttonSearch.addEventListener('click', function(){
    let title = document.getElementById('location');
    let inputValue = input.value;
    title.innerHTML = inputValue;
    fetchCityImage(inputValue);
    temperature(inputValue);
    hours(inputValue);
    humidity(inputValue);
    actualWind(inputValue);
})

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
    document.body.style.backgroundSize = ' cover'; 
    document.body.style.backgroundRepeat = 'no-repeat';
}

let spanTemp = document.getElementById('temperature');

function temperature(city) {
    fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${weatherKey}&units=metric`)
        .then((response) => response.json())
        .then(data => {
            const airTemp = data.main.temp;
            spanTemp.textContent = airTemp + ' °C'; // Affiche la température dans l'élément span avec l'id 'temperature'
        })
        .catch(error => {
            console.error('Une erreur s\'est produite lors de la récupération des données de température :', error);
        });
}
let actualHours = document.getElementById('actualHours');
function hours(city) {
    fetch(`https://worldtimeapi.org/api/timezone/${city}`)
        .then(response => response.json())
        .then(data => {
            const currentTime = new Date(data.utc_datetime);
            const hours = currentTime.getHours();
            const minutes = currentTime.getMinutes();
            const seconds = currentTime.getSeconds();
            
            // Formater l'heure
            const formattedHours = hours < 10 ? `0${hours}` : hours;
            const formattedMinutes = minutes < 10 ? `0${minutes}` : minutes;
            const formattedSeconds = seconds < 10 ? `0${seconds}` : seconds;
            
            actualHours.innerHTML =(`Heure actuelle à ${city}: ${formattedHours}:${formattedMinutes}:${formattedSeconds}`);
        })
        .catch(error => {
            console.error('Une erreur s\'est produite lors de la récupération de l\'heure :', error);
        });
}
let humidityInfo = document.getElementById('infoHumidity');
function humidity(city){
    fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${weatherKey}&units=metric`)
    .then((response) => response.json())
    .then(data =>{
        const humidityNow = data.main.humidity;
        humidityInfo.textContent = 'The humidity is at ' + humidityNow +'%';
    })
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

