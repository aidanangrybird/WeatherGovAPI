var XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;
const api = "https://api.weather.gov";
const coordinateRegEx = new RegExp("^(?:([^\D]*)(-?)(\d{0,3})\.(\d+))$");
var xhr = new XMLHttpRequest();
xhr.responseType = "json";

function requestData(url) {
  var apiUrl = api + url;
  xhr.open("GET", apiUrl, false);
  xhr.setRequestHeader("User-Agent", "(Oklahoma Weather Lab, owl@ou.edu)");
  xhr.send();
  return JSON.parse(xhr.responseText);
}

function getZonesFromCoords(latitude, longitude) {
  var allZones = requestData("/zones?point=" + latitude + "," + longitude).features;
  var obj = {
    allZones: allZones,
    getLandZone: () => {
      var zone = requestData("/zones?type=land&point=" + latitude + "," + longitude).features[0].properties;
      return console.log(JSON.stringify(zone));
    },
    getMarineZone: () => {
      var zone = requestData("/zones?type=marine&point=" + latitude + "," + longitude).features[0].properties;
      return console.log(JSON.stringify(zone));
    },
    getForecastZone: () => {
      var newAPIUrl = api + "/zones?type=forecast&point=" + latitude + "," + longitude;
      var zone = requestData("/zones?type=forecast&point=" + latitude + "," + longitude).features[0].properties;
      return console.log(JSON.stringify(zone));
    },
    getForecastZoneID: () => {
      var id = requestData("/zones?type=coastal&point=" + latitude + "," + longitude).features[0].properties.id;
      return console.log(id);
    },
    getCoastalZone: () => {
      var zone = requestData("/zones?type=coastal&point=" + latitude + "," + longitude).features[0].properties;
      return console.log(JSON.stringify(zone));
    },
    getOffShoreZone: () => {
      var zone = requestData("/zones?type=offshore&point=" + latitude + "," + longitude).features[0].properties;
      return console.log(JSON.stringify(zone));
    },
    getFireZone: () => {
      var zone = requestData("/zones?type=fire&point=" + latitude + "," + longitude).features[0].properties;
      return console.log(JSON.stringify(zone));
    },
    getCountyZone: () => {
      var zone = requestData("/zones?type=county&point=" + latitude + "," + longitude).features[0].properties;
      return console.log(JSON.stringify(zone));
    },
    getCountyName: () => {
      var zone = requestData("/zones?type=county&point=" + latitude + "," + longitude).features[0].properties.name;
      return console.log(zone);
    }
  }
  return obj;
};

/**
 * This gets the SPC outlook text, probablities and coordinates
 * @param days - What day outlook you want. Days 4-8 should be entered as 48
 * @returns Stuff
 **/
function getSPCOutlook(day) {
  var possibleDays = [1,2,3,48];
  var probablityPointsId;
  var probablityPointsIdOld
  var probablityPoints;
  var outlookNarrativeId;
  var outlookNarrativeIdOld;
  var outlookNarrative;
  if (!possibleDays.includes(day)) {
    console.log(day + " is not a valid value");
  } if (day == 48) {
    probablityPointsIdOld = JSON.stringify(requestData("/products?wmoid=WUUS48&type=PTS&limit=1"));
    probablityPointsId = JSON.parse(probablityPointsIdOld.slice(86,-2)).id;
    probablityPoints = requestData("/products/" + probablityPointsId).productText;
    probablityNarrativeIdOld = JSON.stringify(requestData("/products?wmoid=ACUS48&type=SWO&limit=1"));
    outlookNarrativeId = JSON.parse(probablityNarrativeIdOld.slice(86,-2)).id;
    outlookNarrative = requestData("/products/" + outlookNarrativeId).productText;
    var obj = {
      probablityPoints: probablityPoints,
      outlookNarrative: outlookNarrative
    };
    return obj;
  } else {
    probablityPointsIdOld = JSON.stringify(requestData("/products?wmoid=WUUS0" + day + "&type=PTS&limit=1"));
    probablityPointsId = JSON.parse(probablityPointsIdOld.slice(86,-2)).id;
    probablityPoints = requestData("/products/" + probablityPointsId).productText;
    probablityNarrativeIdOld = JSON.stringify(requestData("/products?wmoid=ACUS0" + day + "&type=SWO&limit=1"));
    outlookNarrativeId = JSON.parse(probablityNarrativeIdOld.slice(86,-2)).id;
    outlookNarrative = requestData("/products/" + outlookNarrativeId).productText;
    var obj = {
      probablityPoints: probablityPoints,
      outlookNarrative: outlookNarrative
    };
    return obj;
  };
};

//getZonesFromCoords(39.7392,-104.9849).getLandZone();
//getZonesFromCoords(39.7392,-104.9849).getForecastZone();
//getZonesFromCoords(39.7392,-104.9849).getCountyZone();
//getZonesFromCoords(39.7392,-104.9849).getCountyName();


console.log(getSPCOutlook(1));


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