let XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;
const api = "https://api.weather.gov";
const longCoordRegEx = new RegExp("(?:([^\\D]*)(-?)(\\d{0,3})\\.(\\d+))");
const shortCoordRegEx = new RegExp("\\d{8}", "g");
var xhr = new XMLHttpRequest();
xhr.responseType = "json";

function requestData(url) {
  var apiUrl = api + url;
  xhr.open("GET", apiUrl, false);
  xhr.setRequestHeader("User-Agent", "(Oklahoma Weather Lab, owl@ou.edu)");
  xhr.send();
  return JSON.parse(xhr.responseText);
};

function checkCoordinates(latitude, longitude) {
  if (longCoordRegEx.test(longitude) && longCoordRegEx.test(latitude)) {
    return true;
  };
  if (!longCoordRegEx.test(longitude) || !longCoordRegEx.test(latitude)) {
    return false;
  };
};

//Eventually we can try and make this
function polygonBuilder(inputText) {
  var text = inputText;
  //return text;
  //text = "1111111 3434344s"
  var coordinateSets = inputText.matchAll(shortCoordRegEx);
  return coordinateSets;
};

/**
 * Gets county from coordinates (Might be very useless)
 * @param {number|string} latitude - Latitude of the coordinate pair
 * @param {number|string} longitude - Longitude of the coordinate pair
 * @returns {object} This is to get the name and other values for a county
 **/
function getCountyFromCoords(latitude, longitude) {
  var county = requestData("/zones?type=county&point=" + latitude + "," + longitude).features[0].properties;
  //var county = requestData("/zones?type=county&point=" + latitude + "," + longitude).features[0].properties;
  var obj = {
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
  };
  return obj;
};
//(Might be very useless)
function getForecastZoneFromCoords(latitude, longitude) {
  var forecastZone = requestData("/zones?type=forecast&point=" + latitude + "," + longitude).features[0].properties;
  var obj = {
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
  };
  return obj;
};

//Might change this function back to getAlertsFromCoordsByType in the future
/**
 * Gets alerts of the code from coordinates
 * @param {number|string} latitude - Latitude of the coordinate pair
 * @param {number|string} longitude - Longitude of the coordinate pair
 * @param {string} code - SAME code of event
 * @returns This is to get certain values from an alert
 **/
function getAlerts(latitude, longitude, code) {
  var alerts = requestData("/alerts/active?point=" + latitude + "," + longitude + "&code=" + code).features;
  //Add thing to this that gets 
  var obj = {
    /**
     * Gets the effective start time of the alert
     * @returns {string}
     **/
    getEffectiveTime: () => {
      return alerts[0].properties.effective;
    },
    /**
     * Gets the expiration time of the alert
     * @returns {string}
     **/
    getExpiresTime: () => {
      return alerts[0].properties.expires;
    },
    /**
     * Gets the name of the event like "Severe Thunderstorm Warning" or "Tornado Warning"
     * @returns {string}
     **/
    getEventName: () => {
      return alerts[0].properties.event;
    },
    /**
     * Gets the certainty of the warned weather happening from alert
     * @returns {string} Certainty (observed, likely, possible, unlikely, unknown)
     **/
    getCertainty: () => {
      return alerts[0].properties.certainty;
    },
    /**
     * Gets the severity of the warned weather happening from alert
     * @returns {string} (extreme, severe, moderate, minor, unknown)
     **/
    getSeverity: () => {
      return alerts[0].properties.severity;
    },
    /**
     * Gets the urgency of the warned weather happening from alert
     * @returns {string} Urgency (immediate, expected, future, past, unknown)
     **/
    getUrgency: () => {
      return alerts[0].properties.urgency;
    },
    /**
     * Gets the headline of the weather alert. this includes the name of the event, start time, end time and who sent it
     * @returns {string} Headline of the weather alert
     **/
    getHeadline: () => {
      return alerts[0].properties.headline;
    },
    /**
     * Gets the description of the storm, what hazards are coming with it and where it will impact
     * @returns {string} Description of alert
     **/
    getDescription: () => {
      return alerts[0].properties.description;
    },
    /**
     * Gets the instructions portion of the alert, tells you want to do if a tornado is coming
     * @returns {string} The very important instructions
     **/
    getInstructions: () => {
      return alerts[0].properties.instruction;
    },
    /**
     * Gets the what you should do from the alert. This could be "Shelter" or "Monitor"
     * @returns {string} Action you should take
     **/
    getResponse: () => {
      return alerts[0].properties.response;
    },
    /**
     * Gets how the hail threat was detected from alert if it applies
     * @returns {string} How the hail threat was detected
     **/
    getHailThreat: () => {
      if (alerts[0].properties.parameters.hasOwnProperty("hailThreat")) {
        return alerts[0].properties.parameters.hailThreat[0];
      } else {
        return "";
      };
    },
    /**
     * Gets the maximum hail size from alert if it applies
     * @returns {string} Maximum hail size
     **/
    getMaxHailSize: () => {
      if (alerts[0].properties.parameters.hasOwnProperty("maxHailSize")) {
        return alerts[0].properties.parameters.maxHailSize[0];
      } else {
        return "";
      };
    },
    /**
     * Gets how the tornado was detected or if one is possible from alert if it applies
     * @returns {string} How the tornado was detected or if one is possible
     **/
    getTornadoDetection: () => {
      if (alerts[0].properties.parameters.hasOwnProperty("tornadoDetection")) {
        return alerts[0].properties.parameters.tornadoDetection[0];
      } else {
        return "";
      };
    },
    /**
     * Gets how the wind threat was detected from alert if it applies
     * @returns {string} How the wind threat was detected
     **/
    getWindThreat: () => {
      if (alerts[0].properties.parameters.hasOwnProperty("windThreat")) {
        return alerts[0].properties.parameters.windThreat[0];
      } else {
        return "";
      };
    },
    /**
     * Gets the maximum wind gust from alert if it applies
     * @returns {string} Maximum wind gust
     **/
    getMaxWindGust: () => {
      if (alerts[0].properties.parameters.hasOwnProperty("maxWindGust")) {
        return alerts[0].properties.parameters.maxWindGust[0];
      } else {
        return "";
      };
    },
  };
  if (alerts.length > 0) {
    return obj;
  } else {
    return "";
  };
  //Gonna add more stuff to these so we can get more specific with functions
};

/**
 * This gets the SPC outlook text, probablities and coordinates
 * @param {number} day - What day outlook you want. Days 4-8 should be entered as 48
 * @returns {object} Returns both the probability points and outlook narrative
 **/
function getSPCOutlook(day) {
  var possibleDays = [1, 2, 3, 48];
  if (!possibleDays.includes(day) || typeof day !== "number") {
    console.log(day + " is not a valid value");
  } else {
    var obj = {
      /**
       * This gets the SPC outlook text
       * @returns {string} Returns outlook narrative
       **/
      getNarrative: () => {
        if (day == 48) {
          outlookNarrativeId = JSON.parse(JSON.stringify(requestData("/products?wmoid=ACUS48&type=SWO&limit=1")).slice(86, -2)).id;
          outlookNarrative = requestData("/products/" + outlookNarrativeId).productText;
          return outlookNarrative;
        };
        if (day != 48) {
          outlookNarrativeId = JSON.parse(JSON.stringify(requestData("/products?wmoid=ACUS0" + day + "type=SWO&limit=1")).slice(86, -2)).id;
          outlookNarrative = requestData("/products/" + outlookNarrativeId).productText;
          return outlookNarrative;
        };
      },
      /**
       * This gets the SPC outlook probablities and coordinates
       * @returns {string} Returns the probability points
       **/
      getProbabiltyPoints: () => {
        if (day == 48) {
          probablityPointsId = JSON.parse(JSON.stringify(requestData("/products?wmoid=WUUS48&type=PTS&limit=1")).slice(86, -2)).id;
          probablityPoints = requestData("/products/" + probablityPointsId).productText;
          return probablityPoints;
        };
        if (day != 48) {
          probablityPointsId = JSON.parse(JSON.stringify(requestData("/products?wmoid=WUUS0" + day + "&type=PTS&limit=1")).slice(86, -2)).id;
          probablityPoints = requestData("/products/" + probablityPointsId).productText;
          return probablityPoints;
        };
      },
    };
    return obj;
  };
};

//Need to add error handling so that in case there are no alerts available for an area, it tells you that there are none

//This was a lot of testing an pain
//console.log(getCountyFromCoords(39.7392,-104.9849).getID());
//console.log(getCountyFromCoords(39.7392,-104.9849).getName());
//console.log(getCountyFromCoords(39.7392,-104.9849).getState());
//console.log(getCountyFromCoords(39.7392,-104.9849).getWFO());

//console.log(checkCoordinates(39.7392,-104.9849));

//console.log(getSPCOutlook(2).getProbabiltyPoints());
//console.log(polygonBuilder(getSPCOutlook(2).getProbabiltyPoints()));

//console.log(JSON.stringify(getForecastZoneFromCoords(39.7392,-104.9849).getID()));
//console.log(JSON.stringify(getForecastZoneFromCoords(38.08,-111.87).getID()));
/*
console.log("getAlerts(34.22,-90.53,'FFA').getEffectiveTime()");
console.log(getAlerts(34.22, -90.53, "FFA").getEffectiveTime());
console.log("getAlerts(34.22,-90.53,'FFA').getInstructions()");
console.log(getAlerts(34.22, -90.53, "FFA").getInstructions());
console.log("getAlerts(34.22,-90.53,'FFA').getHeadline()");
console.log(getAlerts(34.22, -90.53, "FFA").getHeadline());
console.log("getAlerts(34.22,-90.53,'FFA').getExpiresTime()");
console.log(getAlerts(34.22, -90.53, "FFA").getExpiresTime());
console.log("getAlerts(34.22,-90.53,'FFA').getDescription()");
console.log(getAlerts(34.22, -90.53, "FFA").getDescription());
*/

console.log(getAlerts(33.1,-99.81,"TOR").getMaxHailSize());

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