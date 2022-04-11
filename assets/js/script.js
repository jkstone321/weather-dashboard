//first i want to get the input from search box
var searchBtn = document.querySelector("#search-btn");
var searchInput = document.querySelector("#search-input");
var userFormEl = document.querySelector("#user-form");
var searchResults = document.querySelector("#search-results");
var chCity;
var weatherAPIKey = "08b8f0866209794788d1351ab8a3ebe4";
var lat;
var lon;
var cityName;
var currentWeather;
var btnNum = 0;


userFormEl.addEventListener("submit", function(event) {
    event.preventDefault();
    chCity = encodeURIComponent(searchInput.value.trim());
    cityName = searchInput.value.trim();
    var words = cityName.split(" ");
    for(var x = 0; x < words.length; x++) {
        words[x] = words[x][0].toUpperCase() + words[x].substr(1);
    }
    document.querySelector("#search-input").value = "";
    cityName = words.join(" ");
    console.log(chCity);
    displayButtons(cityName);
    getLatLon();
});
function displayButtons(city){
    btnNum = btnNum + 1;
    var buttonEl = document.createElement('button');
    buttonEl.classList = 'btn btn-primary';
    buttonEl.setAttribute("id", btnNum);
    buttonEl.innerHTML = city;
    searchResults.prepend(buttonEl);
}
function getLatLon() {
    var apiUrl = "http://api.openweathermap.org/geo/1.0/direct?appid=08b8f0866209794788d1351ab8a3ebe4&q="+chCity;

    fetch(apiUrl)
    .then(function (response) {
      return response.json();
    })
    .then(function (data) {
      console.log(data);
      lat = data[0].lat;
      lon = data[0].lon;
      console.log(lat, lon)
      getCityWeather();
    });

}
function getCityWeather() {
    var apiUrl = "https://api.openweathermap.org/data/2.5/onecall?appid=08b8f0866209794788d1351ab8a3ebe4&units=imperial&lat="+lat+"&lon="+lon;

    fetch(apiUrl)
    .then(function (response) {
      return response.json();
    })
    .then(function (data) {
      console.log(data);
      currentWeather = data.current.weather[0].id;
      // currentWeather = 15220;
      console.log(currentWeather);
      document.querySelector("#main-name").innerHTML = cityName + " ";
      var icon = document.createElement("i");
      //if statements for all the weather codes
      if(currentWeather == 511) {
          //freezing rain icon
          icon.classList = "bi bi-cloud-sleet";
      }else if(currentWeather == 781) {
          //tornado icon
          icon.classList = "bi bi-tornado";
      }else if(currentWeather == 800) {
          //sunny icon
          icon.classList = "bi bi-brightness-high";
      }else if(currentWeather >= 200 && currentWeather < 300) {
          //thunderstorm icon
          icon.classList = "bi bi-cloud-lightning";
      }else if(currentWeather >= 300 && currentWeather < 400) {
          //drizzle icon
          icon.classList = "bi bi-cloud-drizzle";
      }else if(currentWeather >= 500 && currentWeather < 600) {
          //rain icon
          icon.classList = "bi bi-cloud-rain-heavy";
      }else if(currentWeather >= 600 && currentWeather < 700) {
          //snow icon
          icon.classList = "bi bi-snow3";
      }else if(currentWeather >= 700 && currentWeather < 800) {
          //atmosphere icon
          icon.classList = "bi bi-cloud-haze2";
      }else if(currentWeather >= 800 && currentWeather < 900){
          //cloudy icon
          icon.classList = "bi bi-clouds";
      }else {
          //error icon
          icon.classList = "bi bi-bug";
      }
      document.querySelector("#main-name").appendChild(icon);
      document.querySelector("#main-temp").innerHTML = "Temperature: "+data.current.temp+"°F";
      document.querySelector("#main-wind").innerHTML = "Wind Speed: "+data.current.wind_speed+" MPH"
      document.querySelector("#main-humidity").innerHTML = "Humidity: "+data.current.humidity+"%";
      document.querySelector("#main-uv").innerHTML = "UV Index: "+data.current.uvi;

      //five day forecast

    });
}


//side buttons to change which city is displayed
document.querySelector("#search-results").addEventListener("click", function(event) {
    cityName = $(event.target).text();
    chCity = encodeURIComponent($(event.target).text());
    console.log(chCity);
    getLatLon();
});


