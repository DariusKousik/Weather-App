const weatherTab=document.querySelector('[data-weather-tab]');
const searchTab=document.querySelector('[data-search-tab]');
const grantbtn=document.querySelector('[data-grant-btn]');
const grantUI=document.querySelector('[data-grant-weather-UI]');
const userUI=document.querySelector('[data-user-UI]');
const loadingUI=document.querySelector('[data-loading-UI]');
const searchForm=document.querySelector('[data-search-form]');
const searchBtn=document.querySelector('[data-search-button]');
const cityInput=document.querySelector('[data-city-input]');
const API_KEY = "d1845658f92b31c64bd94f06f7188c9c";


let currentTab=weatherTab;
currentTab.classList.add('current-tab');
grantUI.classList.add('active');

function switchTab(userTab){
    if (currentTab!=userTab){
        currentTab.classList.remove('current-tab');
        currentTab=userTab;
        currentTab.classList.add('current-tab');

        if (!searchForm.classList.contains('active')){
            searchForm.classList.add('active');
            grantUI.classList.remove('active');
            userUI.classList.remove('active');
        }

        else {
            searchForm.classList.remove('active');
            cityInput.value="";
            userUI.classList.remove('active');
            getCurrentLocation();
        }
    }

    else 
    return ;
}



weatherTab.addEventListener('click',()=>{
    switchTab(weatherTab);
});
searchTab.addEventListener('click',()=>{
    switchTab(searchTab);
});

async function fetchWeather(coordinates){
    let {lat,lon}=coordinates;
    grantUI.classList.remove('active');
    userUI.classList.remove('active');
    loadingUI.classList.add('active');
    try {
        const response = await fetch(
            `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`
        );
        const data=await response.json();

        loadingUI.classList.remove('active');
        userUI.classList.add('active');

        renderWeather(data);
    }
    catch (err){
        alert ('Data not fetched');
    }
}

function renderWeather(data){
    const cityName=document.querySelector('[data-cityName]');
    const cityImage=document.querySelector('[data-city-icon]');
    const weatherDesc=document.querySelector('[data-weather-desc]');
    const weatherImage=document.querySelector('[data-weather-icon]');
    const temp=document.querySelector('[data-temperature]');
    const windSpeed=document.querySelector('[data-wind-speed]');
    const humidity=document.querySelector('[data-humidity]');
    const clouds=document.querySelector('[data-clouds]');

    cityName.innerText=data?.name;
    cityImage.src=`https://flagcdn.com/144x108/${data?.sys?.country.toLowerCase()}.png`;
    weatherDesc.innerText=data?.weather?.[0]?.description;
    weatherImage.src=`http://openweathermap.org/img/w/${data?.weather?.[0]?.icon}.png`;
    temp.innerText=`${data?.main?.temp} °C`;
    windSpeed.innerText=`${data?.wind?.speed} m/s`;
    humidity.innerText=`${data?.main?.humidity}%`;
    clouds.innerText=`${data?.clouds?.all}%`;
}
grantbtn.addEventListener('click',getLocation);
function getCurrentLocation() {
    let localCoords=sessionStorage.getItem('user_coordinates');
    if (localCoords){
        coordinates=JSON.parse(localCoords);
        fetchWeather(coordinates);
    }
    else {
        grantUI.classList.add('active');
    }
}
function getLocation(){
    if (navigator.geolocation){
        navigator.geolocation.getCurrentPosition(showPosition);
    }
    else {
        alert("Geolocation is not supported by this browser.");
    }
}

function showPosition(position){
    let coordinates={
        lat:position.coords.latitude,
        lon:position.coords.longitude
    };

    sessionStorage.setItem('user_coordinates',JSON.stringify(coordinates));

    fetchWeather(coordinates);
}

searchBtn.addEventListener('click',(e) => {
    e.preventDefault();
    let cityData=cityInput.value;

    if (cityData=="") return ;

    
    fetchSearchWeather(cityData);
});

async function fetchSearchWeather(cityData){
    userUI.classList.remove('active');
    grantUI.classList.remove('active');
    loadingUI.classList.add('active');
    try {
        let response=await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${cityData}&appid=${API_KEY}&units=metric`);
        let data=await response.json();

        renderWeather(data);
        loadingUI.classList.remove('active');
        userUI.classList.add('active');
    }

    catch(err){
        loadingUI.classList.remove('active');
        alert('Data not Fetched');
    }
}
