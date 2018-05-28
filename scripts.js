
$(document).ready(function () {
    var lat = "",
        lon = "",
        country = "",
        city = "",
        state = "",
        temp = "",
        pic = "",
        wkey = "134a2a3a1e2502e7415f6d6502a136ff/",
        lockey = "AIzaSyBPfJzCZ-L3MGzaS3cLCqyV1wbS9pZ5T50",
        geokey = "AIzaSyDY2_Bp1ICPX4-_HGHgokCAz67za-p6zG4",
        geolockey = "AIzaSyD48iTPeJpCIyau5j6eRlXAHEYhrzNS1wY";

//              //extra coords to play with:
//             //Bergen, Norway
//             // lat = 60.391920;
//             // lon = 5.322118;
//             //Lebanon, Missouri
//             //  lat = 37.670487;
//             //  lon = -92.752806;
//             //Badwater, California (Death Valley)
//             // lat = 36.22972;
//             // lon = -116.7682987;
//             //Santa Monica, California
//             // lat = 34.011776;
//             // lon = -118.494807;
//             //Seattle, Washington
//             // lat = 47.612329;
//             // lon = -122.338294;
//             //Rome, Italy
//             // lat = 41.905314;
//             // lon = 12.484865;
//             //Johannesburg, South Africa
//             // lat = -26.139839;
//             // lon = 27.993798;
//             //Pico Bolivar (summit), Merida, Venezuela
//             // lat = 8.5408552;
//             // lon = -71.0487095;
//             //hardcoded below for testing
// var map = "https://maps.googleapis.com/maps/api/staticmap?center=60.391920,5.322118&zoom=13&size=500x500&markers=color:0xFF7E5F|34.011776,-118.494807&key=AIzaSyBPfJzCZ-L3MGzaS3cLCqyV1wbS9pZ5T50";

    //success callback if Promise is created
    function success(position){
        // console.log("lat = " + position.coords.latitude);
        // console.log("lon = " + position.coords.longitude);
    }
    //error callback if Promise fails
    function error(err){
        console.log("Err.code = " + err.code + " Err.message = " + err.message)
    }
    //options for browser geolocation
    var options = {
        enableHighAccuracy: true,
        timeout: 5000,
        maximumAge: 0
    };
    //create a Promise object for the browser's location
    var getPosition = function (options) {
        return new Promise(function (success, error) {
            navigator.geolocation.getCurrentPosition(success, error, options);
        });
    };
    //invoke the Promise to sequentially order the routines
    getPosition()
        .then((position) => {
            lat = position.coords.latitude;
            lon = position.coords.longitude;
            //use the lazy jQuery way to invoke the google api, which does a reverse geocode request on the latitude & longitude to find the local area
            $.getJSON("https://maps.googleapis.com/maps/api/geocode/json?latlng=" + lat + "," + lon + "&result_type=locality&key=" + geokey, function (reply, status) {
            // $.getJSON("https://maps.googleapis.com/maps/api/geocode/json?latlng=60.391920,5.322118&result_type=locality&key=" + geokey, function (reply, status) {
            //     console.dir(reply);
                city = reply.results[0].address_components[0].long_name;
                state = reply.results[0].address_components[2].short_name;
                country = reply.results[0].address_components[3].long_name;
                $("#city").html(city + ", ");
                $("#state").html(state);
                $("#country").html(country);
            });
            //create a google map to show the current location -- comment this one out and test with the static locations around the world
            var map = "https://maps.googleapis.com/maps/api/staticmap?center=" + lat + "," + lon +
                "&zoom=13&size=500x500&markers=color:0xFF7E5F|" + lat + "," + lon + "&key=" + lockey;
            $("#imgMap").attr("src", map);
            var darkSkyUrl = "https://api.darksky.net/forecast/134a2a3a1e2502e7415f6d6502a136ff/" + lat + ',' + lon;
            // var darkSkyUrl = "https://api.darksky.net/forecast/134a2a3a1e2502e7415f6d6502a136ff/60.391920,5.322118";
            //use the extremely awesome CORS-busting fetchJsonp() method (link is in index.html) to invoke the darksky api
            fetchJsonp(darkSkyUrl)
                .then(function(obj){
                    return obj.json();
                })
                .then(function(obj){
                    // console.dir(obj);
                    //get the weather information and bind it to the html page
                    temp = Math.round(obj.currently.temperature);
                    pic = obj.currently.icon;
                    desc = obj.currently.summary;
                    $("#temp").html(temp);
                    $("#desc").html(desc);
                    $("#unit").html("F");
                    //assign the appropriate weather icon
                    getIcon(pic);
                })
                .catch(function(err){
                    console.log("PROBLEM! Error = " + err);
                })
        })
        .catch((err) => {
            console.error("The Promise error = " + err.message);
        });

    //convert between celcius and fahrenheit
    $("#unit").click(function () {
        if ($(this)[0].innerHTML !== "F"){
            $("#temp").html(temp);
            $(this).html("F");
        }else{
            $(this).html("C");
            var cent = Math.round((parseFloat($("#temp")[0].innerHTML) -32)*5/9);
            $("#temp").html(cent);
        }
    })
});

function getIcon(weatherPic) {
    var wPic = weatherPic.toLowerCase();
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

function displayIcon(wPic){
    $('div.' + wPic).removeClass('hide');
}
