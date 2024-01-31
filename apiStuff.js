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

/**
 * Gets county from coordinates
 * @param {number|string} latitude - Latitude of the coordinate pair
 * @param {number|string} longitude - Longitude of the coordinate pair
 * @returns {object} This is to get the name and other values for a county
 **/
function getCountyFromCoords(latitude, longitude) {
  var county = requestData("/zones?type=county&point=" + latitude + "," + longitude).features[0].properties;
  //var county = requestData("/zones?type=county&point=" + latitude + "," + longitude).features[0].properties;
  var obj = {
    /**
     * Gets the entire JSON of the county
     * @returns {JSON} JSON of county
     **/
    getAll: () => {
      return county;
    },
    /**
     * Gets the name of the county
     * @returns {string} County name
     **/
    getName: () => {
      return county.name;
    },
    /**
     * Gets the ID of the county
     * @returns {string} County ID
     **/
    getID: () => {
      return county.id;
    },
    /**
     * Gets the two letter state the county is in
     * @returns {string} State
     **/
    getState: () => {
      return county.state;
    },
    /**
     * Gets the WFO the county is in
     * @returns {string}
     **/
    getWFO: () => {
      return county.cwa[0];
    },
  }
  return obj;
};

function getForecastZoneFromCoords(latitude, longitude) {
  var forecastZone = requestData("/zones?type=forecast&point=" + latitude + "," + longitude).features[0].properties;
  var obj = {
    getAll: () => {
      return forecastZone;
    },
    getName: () => {
      return forecastZone.name;
    },
    getID: () => {
      return forecastZone.id;
    },
    getState: () => {
      return forecastZone.state;
    },
    getWFO: () => {
      return forecastZone.cwa[0];
    },
  }
  return obj;
};

/**
 * Gets county from coordinates
 * @param {number|string} latitude - Latitude of the coordinate pair
 * @param {number|string} longitude - Longitude of the coordinate pair
 * @param {string} code - SAME code of event
 * @returns {object} This is to get other values from an alert
 **/
function getAlertsForCoordsByType(latitude, longitude, code) {
  var alerts = requestData("/alerts?point=" + latitude + "," + longitude + "&code=" + code).features;
  var obj = {
    all: () => {
      return alerts[0];
    },
    getEventName: () => {
      return alerts[0].properties.event;
    },
    getCertainty: () => {
      return alerts[0].properties.coordinates;
    },
    getSeverity: () => {
      return alerts[0].properties.severity;
    },
    getUrgency: () => {
      return alerts[0].properties.urgency;
    },
    getHeadline: () => {
      return alerts[0].properties.headline;
    },
    getDescription: () => {
      return alerts[0].properties.description;
    },
    getInstructions: () => {
      return alerts[0].properties.instructions;
    },
    getResponse: () => {
      return alerts[0].properties.response;
    },
    getHailThreat: () => {
      if (alerts[0].properties.parameters.hasOwnProperty("hailThreat")) {
        return alerts[0].properties.parameters.hailThreat[0];
      } else {
        return null;
      };
    },
    getMaxHailSize: () => {
      if (alerts[0].properties.parameters.hasOwnProperty("maxHailSize")) {
        return alerts[0].properties.parameters.maxHailSize[0];
      } else {
        return null;
      };
    },
    getTornadoDetection: () => {
      if (alerts[0].properties.parameters.hasOwnProperty("tornadoDetection")) {
        return alerts[0].properties.parameters.tornadoDetection[0];
      } else {
        return null;
      };
    },
    getWindThreat: () => {
      if (alerts[0].properties.parameters.hasOwnProperty("windThreat")) {
        return alerts[0].properties.parameters.windThreat[0];
      } else {
        return null;
      };
    },
    getMaxWindGust: () => {
      if (alerts[0].properties.parameters.hasOwnProperty("maxWindGust")) {
        return alerts[0].properties.parameters.maxWindGust[0];
      } else {
        return null;
      };
    },
  }
  return obj;
  //Gonna add more stuff to these so we can get more specific with functions
}

/*
var obj = {
  allZones: allZones,
  getLandZone: () => {
    var zone = requestData("/zones?type=land&point=" + latitude + "," + longitude).features[0].properties;
    return zone;
  },
  getMarineZone: () => {
    var zone = requestData("/zones?type=marine&point=" + latitude + "," + longitude).features[0].properties;
    return console.log(JSON.stringify(zone));
  },
  getForecastZone: () => {
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
}*/

/**
 * This gets the SPC outlook text, probablities and coordinates
 * @param {number | string} day - What day outlook you want. Days 4-8 should be entered as 48
 * @param {string} probablityPoints - Categorical convective outlook and probabilistic coordinates
 * @param {string} outlookNarrative - The forecast discussion beneath every convective outlook
 * @returns {object} Returns both the probability points and outlook narrative
 **/
function getSPCOutlook(day) {
  var possibleDays = [1,2,3,48];
  var probablityPointsId;
  var probablityPoints;
  var outlookNarrativeId;
  var outlookNarrative;
  if (!possibleDays.includes(day) || typeof day !== "number") {
    console.log(day + " is not a valid value");
  } if (day == 48) {
    probablityPointsId = JSON.parse(JSON.stringify(requestData("/products?wmoid=WUUS48&type=PTS&limit=1")).slice(86,-2)).id;
    probablityPoints = requestData("/products/" + probablityPointsId).productText;
    outlookNarrativeId = JSON.parse(JSON.stringify(requestData("/products?wmoid=ACUS48&type=SWO&limit=1")).slice(86,-2)).id;
    outlookNarrative = requestData("/products/" + outlookNarrativeId).productText;
    var obj = {
      probablityPoints: probablityPoints,
      outlookNarrative: outlookNarrative
    };
    return obj;
  } if (day != 48) {
    probablityPointsId = JSON.parse(JSON.stringify(requestData("/products?wmoid=WUUS0" + day + "&type=PTS&limit=1")).slice(86,-2)).id;
    probablityPoints = requestData("/products/" + probablityPointsId).productText;
    outlookNarrativeId = JSON.parse(JSON.stringify(requestData("/products?wmoid=ACUS0" + day + "type=SWO&limit=1")).slice(86,-2)).id;
    outlookNarrative = requestData("/products/" + outlookNarrativeId).productText;
    var obj = {
      probablityPoints: probablityPoints,
      outlookNarrative: outlookNarrative
    };
    return obj;
  };
};

//console.log(getCountyFromCoords(39.7392,-104.9849).getID());
//console.log(getCountyFromCoords(39.7392,-104.9849).getName());
//console.log(getCountyFromCoords(39.7392,-104.9849).getState());
//console.log(getCountyFromCoords(39.7392,-104.9849).getWFO());

//console.log(JSON.stringify(getSPCOutlook(48)));

//console.log(JSON.stringify(getForecastZoneFromCoords(39.7392,-104.9849).getID()));
//console.log(JSON.stringify(getForecastZoneFromCoords(38.08,-111.87).getID()));



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