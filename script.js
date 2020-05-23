$(document).ready(function() {

    var apiKey = "4f0377afa22da3660e9093d01504a4d8";

    var m = moment();
    currentDate = m.format('MM/DD/YYYY');

    var storedCities = localStorage.getItem("lastCity");
    var cities = [];
    if (storedCities !== null) {
      cities.push(storedCities);
    }
    displayCurrentWeather(cities[cities.length-1]);
    displayFiveDayWeather(cities[cities.length-1]);

    $("#city-search-button").on("click", function() {
        var city = $("#city-search-input").val();
        $("#city-search-input").val("");
        cities.push(city);
        if (cities.length > 10) {
        cities = cities.slice(1,11);
        }
        console.log(cities);
        localStorage.setItem("lastCity", city);
        renderCities();
        displayCurrentWeather(city);
        displayFiveDayWeather(city);
    })

    $(document).on("click", ".city-button", function() {
        var city = $(this).attr("city-data");
        localStorage.setItem("lastCity", city);
        displayCurrentWeather(city);
        displayFiveDayWeather(city);
    })

    function renderCities() {
        $("#city-button-storage").empty();
        if (cities.length !== null) {
          for (i=0; i<cities.length; i++) {
              var div = $("<div>");
              var button = $("<button>");
              button.text(cities[i]);
              button.attr("class", "city-button");
              button.attr("city-data", cities[i]);
              div.append(button);
              $("#city-button-storage").prepend(div);
          }
        }
    }

    function displayCurrentWeather(city) {
        $("#current-weather").empty();
        
        var queryURL = "https://api.openweathermap.org/data/2.5/weather?q=" + city + "&appid=" + apiKey;

        $.ajax({
          url: queryURL,
          method: "GET"
        }).then(function(response) {
            console.log(response);

            var K = parseInt(response.main.temp);
            var F = Math.round((K - 273.15) * 1.80 + 32);
            var temp = $("<p> Temperature: " + F + "°F</p>");
            
            var humidity = $("<p> Humidity: " + response.main.humidity + "%</p>");
            var windSpeed = $("<p> Wind Speed: " + response.wind.speed + " MPH</p>");

            var lat = response.coord.lat;
            var lon = response.coord.lon;
            var UVIndex = "";

            $.ajax({
                url: 'http://api.openweathermap.org/data/2.5/uvi?appid=' + apiKey + '&lat=' + lat + '&lon=' + lon,
                method: "GET"
              }).then(function(response) {
                UVIndex = $("<p> UV Index: <span id=UV>" + response.value + "</span></p>");
                $("#current-weather").append(UVIndex);
                if (response.value < 3) {
                    $('#UV').attr('style', 'background-color: green;')
                }
                else if (response.value < 6) {
                    $('#UV').attr('style', 'background-color: yellow;')
                }
                else if (response.value < 8) {
                    $('#UV').attr('style', 'background-color: orange;')
                }
                else if (response.value < 11) {
                    $('#UV').attr('style', 'background-color: red;')
                }
                else {
                    $('#UV').attr('style', 'background-color: violet;')
                }
              })
          
          var iconID = response.weather[0].icon;
          var weatherIcon = '<img src=http://openweathermap.org/img/w/' + iconID + '.png>';
          console.log(weatherIcon);
          var cityName = $("<h3>" + city + " (" + currentDate + ") " + weatherIcon + "</h3>");
          $("#current-weather").prepend(cityName, temp, humidity, windSpeed);

        });

      }

    function displayFiveDayWeather(city) {
        $("#five-day-weather").empty();

        var queryURL = "https://api.openweathermap.org/data/2.5/forecast?q=" + city + "&appid=" + apiKey;


        $.ajax({
          url: queryURL,
          method: "GET"
        }).then(function(response) {
        
          console.log(response);
          m = moment();
          for (i=0; i<5; i++) {
              n = i*8;
              var weatherData = response.list[n];
              console.log(weatherData);

              var dateNum = m.add(1, 'day');
              var date = $("<h5>" + dateNum.format('MM/DD/YYYY') + "</h5>");

              var iconID = weatherData.weather[0].icon;
              var weatherIcon = $('<img src=http://openweathermap.org/img/w/' + iconID + '.png>');

              var K = parseInt(weatherData.main.temp);
              var F = Math.round((K - 273.15) * 1.80 + 32);
              var temp = $("<p>Temp: " + F + "°F</p>");

              var humidity = $("<p>Humidity: " + weatherData.main.humidity + "%</p>");
              
              var forecastDiv = $("<div>");
              forecastDiv.attr("class", "col-md-2 forecastDiv");
              forecastDiv.append(date,weatherIcon,temp,humidity);
              console.log(forecastDiv);
              $("#five-day-weather").append(forecastDiv);
          }

        });

      }

})