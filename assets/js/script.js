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
var searchHistory = [];
var dayJsObject = dayjs();
var crntDate = dayJsObject.format("MM DD YYYY");
var tmeZone = "";
//gets date for tomorrow
var tmrrwDate = dayjs().add(1,"day").format("MM DD YYYY");

dayjs.extend(window.dayjs_plugin_utc);
dayjs.extend(window.dayjs_plugin_timezone);


if(JSON.parse(localStorage.getItem("search-history")) !== null){
    searchHistory = JSON.parse(localStorage.getItem("search-history"));
    for(var x = 0; x < searchHistory.length; x++) {
        cityName = searchHistory[x];
        words = cityName.split(" ");
        for(var y = 0; y < words.length; y++) {
            words[y] = words[y][0].toUpperCase() + words[y].substr(1);
        }
        cityName = words.join(" ");
        displayButtons(cityName);
    }
}
userFormEl.addEventListener("submit", function(event) {
    event.preventDefault();
    chCity = encodeURIComponent(searchInput.value.trim());
    cityName = searchInput.value.trim();
    searchHistory.push(cityName);
    localStorage.setItem("search-history", JSON.stringify(searchHistory));
    var words = cityName.split(" ");
    for(var x = 0; x < words.length; x++) {
        words[x] = words[x][0].toUpperCase() + words[x].substr(1);
    }
    cityName = words.join(" ");
    document.querySelector("#search-input").value = "";
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
    var apiUrl = "https://api.openweathermap.org/geo/1.0/direct?appid=08b8f0866209794788d1351ab8a3ebe4&q="+chCity;

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
      tmeZone = data.timezone;
      // currentWeather = 15220;
      console.log(currentWeather);
      document.querySelector("#main-name").innerHTML = cityName + " " + dayJsObject.tz(tmeZone).format("MM-DD-YYYY") + " ";
      var icon = document.createElement("i");
      icon.classList = getIcon(currentWeather);
      

      document.querySelector("#main-name").appendChild(icon);
      document.querySelector("#main-temp").innerHTML = "Temperature: "+data.current.temp+"°F";
      document.querySelector("#main-wind").innerHTML = "Wind Speed: "+data.current.wind_speed+" MPH"
      document.querySelector("#main-humidity").innerHTML = "Humidity: "+data.current.humidity+"%";
      document.querySelector("#main-uv").innerHTML = data.current.uvi;
      setUvBackground(data.current.uvi);

      //five day forecast
      for(var x = 1; x < 6; x++) {
          document.querySelector("#day"+x).innerHTML = dayjs().tz(tmeZone).add(x,"day").format("MM-DD-YYYY");
          var icon = document.createElement("i");
          icon.classList = getIcon(data.daily[x].weather[0].id)
          document.querySelector("#day"+x).appendChild(icon);
          document.querySelector("#day"+x+"-temp").innerHTML = "Temperature: " + data.daily[x].temp.day;
          document.querySelector("#day"+x+"-wind").innerHTML = "Wind: " + data.daily[x].wind_speed + " MPH";
          document.querySelector("#day"+x+"-humi").innerHTML = "Humidity: " + data.daily[x].humidity + "%";
      }
      
      
    });
}

function getIcon(code) {
    var classes = "";
    if(code == 511) {
        //freezing rain icon
        classes = "bi bi-cloud-sleet";
    }else if(code == 781) {
        //tornado icon
        classes = "bi bi-tornado";
    }else if(code == 800) {
        //sunny icon
        classes = "bi bi-brightness-high";
    }else if(code >= 200 && code < 300) {
        //thunderstorm icon
        classes = "bi bi-cloud-lightning";
    }else if(code >= 300 && code < 400) {
        //drizzle icon
        classes = "bi bi-cloud-drizzle";
    }else if(code >= 500 && code < 600) {
        //rain icon
        classes = "bi bi-cloud-rain-heavy";
    }else if(code >= 600 && code < 700) {
        //snow icon
        classes = "bi bi-snow3";
    }else if(code >= 700 && code < 800) {
        //atmosphere icon
        classes = "bi bi-cloud-haze2";
    }else if(code >= 800 && code < 900){
        //cloudy icon
        classes = "bi bi-clouds";
    }else {
        //error icon
        classes = "bi bi-bug";
    }
    return classes;
}
function setUvBackground (index) {
    if(index >= 0 && index < 4){
        //set background to green
        document.querySelector("#main-uv").setAttribute("style", "background-color: green");
    }else if(index >= 4 && index < 7){
        //set background to yellow
        document.querySelector("#main-uv").setAttribute("style", "background-color: yellow");
    }else if(index > 7){
        //setbackground to red
        document.querySelector("#main-uv").setAttribute("style", "background-color: red");
    }
}
//side buttons to change which city is displayed
document.querySelector("#search-results").addEventListener("click", function(event) {
    cityName = $(event.target).text();
    var words = cityName.split(" ");
    for(var x = 0; x < words.length; x++) {
        words[x] = words[x][0].toUpperCase() + words[x].substr(1);
    }
    cityName = words.join(" ");
    chCity = encodeURIComponent($(event.target).text());
    console.log(chCity);
    getLatLon();
    console.log(searchHistory);
});


//display date

console.log(dayJsObject.format())