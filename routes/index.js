'use strict';
var express = require('express');
var router = express.Router();
var request = require('request');



/* GET home page. */
router.get('/', function (req, res) {
  var lat = req.query.lat;
  var lng = req.query.lng;
  //y = lat, x=lng
  var boundaryCallback = function (data) {

  };
  getBoundaryData(lat, lng, boundaryCallback);
  getLayerData(lat, lng);


});



function getBoundaryData(lat, lng) {
  var boundariesUri = 'http://api.data.linz.govt.nz/api/vectorQuery.json?layer=804&';
  var boundariesEndQueryString = '&max_results=1&radius=0&geometry=true';
  //http://api.data.linz.govt.nz/api/vectorQuery.json?key=[key]&layer=804&x=171.6178138&y=-43.5152097&max_results=1&radius=0&geometry=true
  var boundariesApiKey = '&key=6e69f7dfe0564917b36322a6581200f0';
  var url = boundariesUri + boundariesApiKey + '&y=' + lat + '&x=' + lng + boundariesEndQueryString;


  request(url, function (error, response, body) {
    if (!error && response.statusCode === 200) {
      var parsedBody = JSON.parse(body).vectorQuery.layers['804'];
      var result = parsedBody.features && parsedBody.features.length > 0 ? parsedBody.features[0].geometry : [];
      res.json(result);
    } else {
      //error 
      console.log(body);
      res.json(body);
    }
  });
}

function getLayerData(lat, lng) {
  var metricsUri = 'http://api.lris.scinfo.org.nz/api/vectorQuery.json?';
  //http://api.lris.scinfo.org.nz/api/vectorQuery.json?key=ac29936c13b1492ea857d97432f8c753&layer=66&x=173.0296851171197&y=-41.43328962666189
  var metricsApiKey = 'key=ac29936c13b1492ea857d97432f8c753';
  var latLng = 'x=' & '&y='
  var url = metricsUri + metricsApiKey +

}

module.exports = router;