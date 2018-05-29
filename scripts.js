(function() {
    let lat = "",
        lon = "",
        temp = "",
        wkey = "134a2a3a1e2502e7415f6d6502a136ff/",
        lockey = "AIzaSyBPfJzCZ-L3MGzaS3cLCqyV1wbS9pZ5T50",
        geokey = "AIzaSyDY2_Bp1ICPX4-_HGHgokCAz67za-p6zG4",
        myImgMap = document.querySelector("#imgMap"),
        city = document.querySelector("#city"),
        state = document.querySelector("#state"),
        country = document.querySelector("#country"),
        tempDisp = document.querySelector("#temp"),
        weatherDesc = document.querySelector("#desc"),
        unitCelFahr = document.querySelector("#unit");


    //create a Promise object for the browser's location
    let getPosition = function (options) {
        return new Promise(function (success, error) {
            navigator.geolocation.getCurrentPosition(success, error, options);
        });
    };

        //success callback if Promise is created
        function success(position) {
            console.log("lat = " + position.coords.latitude);
            console.log("lon = " + position.coords.longitude);
        }

        //error callback if Promise fails
        function error(err) {
            console.log("Err.code = " + err.code + " Err.message = " + err.message)
        }

        //options for browser geolocation
        let options = {
            enableHighAccuracy: true,
            timeout: 5000,
            maximumAge: 0
        };

    //invoke the Promise to get the user's location and sequentially order the routines
    getPosition()
        .then((position) => {
            lat = position.coords.latitude;
            lon = position.coords.longitude;
            //invoke the google api, which does a reverse geocode request on the latitude & longitude to find the local area
            return fetch("https://maps.googleapis.com/maps/api/geocode/json?latlng=" + lat + "," + lon + "&result_type=locality&key=" + geokey)
                .then(handleErrors)
                .then(parseGeoData)
                .then(updateUIGeoLocation)
                .then(setUpMap)
                .then(fetchDarkSkyWeatherData)
                .catch(displayErrors);
        })
        .catch(handleErrors);

    //check if any errors occurred during fetch
    function handleErrors(res){
        if(!res.ok){
            throw Error(res.status);
        }
        return res;
    }
    //if error, display it to the console
    function displayErrors(err){
        console.log("INSIDE displayErrors: " + err);
    }
    //invoke the fetchJsonp CORS-bypassing call to darksky
    function fetchDarkSkyWeatherData() {
        fetchJsonp("https://api.darksky.net/forecast/" + wkey + lat + ',' + lon)
            .then(parseWeatherData)
            .then(updateUIWeather)
            .catch(function(err){
                console.log("Darksky Weather Problem: Error = " + err);
            });
    }
    //create a google map to show the current location
    function setUpMap(){
        const map = "https://maps.googleapis.com/maps/api/staticmap?center=" + lat + "," + lon +
            "&zoom=13&size=500x500&markers=color:0xFF7E5F|" + lat + "," + lon + "&key=" + lockey;
        myImgMap.src = map;
    }
    //parse the reverse geocode data from maps.googleapis.com
    function parseGeoData(response){
        return response.json().then(function(parsedGeoData){
            return parsedGeoData.results[0];
        })
    }
    //take the parsed geocode data and update the UI
    function updateUIGeoLocation(parsedGeoData){
        city.innerHTML = parsedGeoData.address_components[0].long_name + ", ";
        state.innerHTML = parsedGeoData.address_components[2].short_name;
        country.innerHTML = parsedGeoData.address_components[3].long_name;
    }
    //parse the weather data from the darksky api
    function parseWeatherData(response){
        return response.json().then(function(parsedData){
            return parsedData.currently;
        })
    }
    //take the parsed weather data and update the UI
    function updateUIWeather(parsedData){
        temp = Math.round(parsedData.temperature);
        tempDisp.innerHTML = temp;
        weatherDesc.innerHTML = parsedData.summary;
        unitCelFahr.innerHTML = "F";
        //assign the appropriate weather icon
        getIcon(parsedData.icon);
    }

    //convert between celsius and fahrenheit when clicking the C or F display
    unitCelFahr.addEventListener("click", function(){
        if (this.innerHTML !== "F"){
            tempDisp.innerHTML = temp;
            this.innerHTML = "F";
        }else{
            this.innerHTML = "C";
            tempDisp.innerHTML = Math.round((parseFloat(temp) -32)*5/9);
        }
    });

    //get the weather icon name from DarkSky and assign the corresponding icon from weather-icons.css
    function getIcon(weatherPic) {
        let wPic = weatherPic.toLowerCase();
        switch (wPic){
            case 'clear-day':
                wPic = "clear";
                displayIcon(wPic);
                break;
            case 'clear-night':
                wPic = "night-clear";
                displayIcon(wPic);
                break;
            case 'wind':
                displayIcon(wPic);
                break;
            case 'cloudy':
                displayIcon(wPic);
                break;
            case 'partly-cloudy-day':
                wPic = "partCloudDay";
                displayIcon(wPic);
                break;
            case 'partly-cloudy-night':
                wPic = "partCloudNight";
                displayIcon(wPic);
                break;
            case 'hail':
                displayIcon(wPic);
                break;
            case 'fog':
                displayIcon(wPic);
                break;
            case 'tornado':
                displayIcon(wPic);
                break;
            case 'rain':
                displayIcon(wPic);
                break;
            case 'snow':
                displayIcon(wPic);
                break;
            case 'sleet':
                displayIcon(wPic);
                break;
            case 'thunderstorm':
                displayIcon(wPic);
                break;
            default:
                $('div.clouds').removeClass('hide');
        }
    }

    //unhide the appropriate weather icon
    function displayIcon(wPic){
        var divIcon = document.getElementsByClassName(wPic);
        divIcon[0].classList.remove('hide');
    }
})();