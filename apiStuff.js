var XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;
const api = "https://api.weather.gov";
const coordinateRegEx = new RegExp("^(?:([^\D]*)(-?)(\d{0,3})\.(\d+))$");
var xhr = new XMLHttpRequest();
xhr.responseType = "json";

function requestData(url) {
  xhr.open("GET", url, false);
  xhr.setRequestHeader("User-Agent", "(Oklahoma Weather Lab, owl@ou.edu)");
  xhr.send();
  return JSON.parse(xhr.responseText);
}

function getZonesFromCoords(latitude, longitude) {
  var newAPIUrl = api + "/zones?point=" + latitude + "," + longitude;
  var allZones = requestData(newAPIUrl).features;
  var obj = {
    allZones: allZones,
    getLandZone: () => {
      var newAPIUrl = api + "/zones?type=land&point=" + latitude + "," + longitude;
      var zone = requestData(newAPIUrl).features[0].properties;
      return console.log(JSON.stringify(zone));
    },
    getMarineZone: () => {
      var newAPIUrl = api + "/zones?type=marine&point=" + latitude + "," + longitude;
      var zone = requestData(newAPIUrl).features[0].properties;
      return console.log(JSON.stringify(zone));
    },
    getForecastZone: () => {
      var newAPIUrl = api + "/zones?type=forecast&point=" + latitude + "," + longitude;
      var zone = requestData(newAPIUrl).features[0].properties;
      return console.log(JSON.stringify(zone));
    },
    getCoastalZone: () => {
      var newAPIUrl = api + "/zones?type=coastal&point=" + latitude + "," + longitude;
      var zone = requestData(newAPIUrl).features[0].properties;
      return console.log(JSON.stringify(zone));
    },
    getOffShoreZone: () => {
      var newAPIUrl = api + "/zones?type=offshore&point=" + latitude + "," + longitude;
      var zone = requestData(newAPIUrl).features[0].properties;
      return console.log(JSON.stringify(zone));
    },
    getFireZone: () => {
      var newAPIUrl = api + "/zones?type=fire&point=" + latitude + "," + longitude;
      var zone = requestData(newAPIUrl).features[0].properties;
      return console.log(JSON.stringify(zone));
    },
    getCountyZone: () => {
      var newAPIUrl = api + "/zones?type=county&point=" + latitude + "," + longitude;
      var zone = requestData(newAPIUrl).features[0].properties;
      return console.log(JSON.stringify(zone));
    }
  }
  return obj;
};

getZonesFromCoords(39.7392,-104.9849).getFireZone();
getZonesFromCoords(39.7392,-104.9849).getCountyZone();
getZonesFromCoords(39.7392,-104.9849).getForecastZone();



	//For sure add option to switch between OWL and SPC convective forecasts
	
	//Create functions that can deconstruct the api data so each part of the zone or alert can be individually addressed
	//This will be better than having to do the pain of what I had to do in coordinateSelectionHelper
	//Also another part that will need to be done is decontructing the product text in a way where
	//we can pull out coordinates and probabilities
	
	
	//API documentation: https://www.weather.gov/documentation/services-web-api
	//Some important NWS API Product Type Code:
	//WWP: Severe Thunderstorm / Tornado Watch Probabilities
	//PWO: Public Severe Weather Outlook
	//HWO: Hazardous Weather Outlook
	//PTS: Probabilistic Outlook Points (More notes on this below)
	//This is the coordinates and probabilities for each of the convective outlooks.
	//The wmoCollectiveID within each of them is how we would get which day that product is for
	//WUUS01 is day 1 outlook, WUUS02 is day 2 outlook, WUUS03 is day 3 outlook, WUUS48 is days 4-8 outlook
	//SWO: Severe Storm Outlook Narrative (AC)
	//This is the text portion of the convective outlooks
	//SEL: Severe Local Storm Watch and Watch Cancellation Msg
	//The ones below will be handled with the active alerts section of the api:
	//TOR: Tornado Warning
	//SVR: Sever Thunderstorm Warning
	//SVS: Special Weather Statement