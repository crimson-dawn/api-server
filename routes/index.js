'use strict';
var express = require('express');
var router = express.Router();
var request = require('request');

/* GET home page. */
router.get('/', function (req, res) {
  var lat = req.query.lat;
  var lng = req.query.lng;
  //y = lat, x=lng
  var _result = {};

  var metricsCallback = function (data) {
    
    var metrics = {};
    data.forEach(function (metric, index, array) {
      console.log(Object.keys(metric))
      var key = metric.name;
      if(metrics[key]) {
        metrics[key].values.push(metric.value);
      } else {
        metrics[key] = {};
        metrics[key].name = metric.name;
        metrics[key].values = [metric.value];
      }
    });
    console.log(metrics);
    _result.metrics = metrics;
    res.json(_result);
  };
  var boundaryCallback = function (data) {
    _result.boundaries = data;
    getLayerData(lat, lng, metricsCallback);
  };
  getBoundaryData(lat, lng, boundaryCallback);
});



function getBoundaryData(lat, lng, callback) {
  var boundariesUri = 'http://api.data.linz.govt.nz/api/vectorQuery.json?layer=804&';
  var boundariesEndQueryString = '&max_results=1&radius=0&geometry=true';
  var boundariesApiKey = '&key=6e69f7dfe0564917b36322a6581200f0';
  var url = boundariesUri + boundariesApiKey + '&y=' + lat + '&x=' + lng + boundariesEndQueryString;


  request(url, function (error, response, body) {
    if (!error && response.statusCode === 200) {
      var parsedBody = JSON.parse(body).vectorQuery.layers['804'];
      var result = parsedBody.features && parsedBody.features.length > 0 ? parsedBody.features[0].geometry : [];
    } else {
      //error 
      var result = body;
    }
    callback(result);
  });
}

function getLayerData(lat, lng, callback) {
  var metricsUri = 'http://api.lris.scinfo.org.nz/api/vectorQuery.json?radius=0&';
  var metricsApiKey = 'key=ac29936c13b1492ea857d97432f8c753';
  var latLng = '&x=' + lng + '&y=' + lat;
  var url = metricsUri + metricsApiKey + latLng;
  var layers = require('./layers.js');
  var results = [];

  layers.forEach(function (element, index) {
    (element.values).forEach(function (layer, _index) {
      var _url = url + '&layer=' + layer.id;
      var result;
      request(_url, function (error, response, body) {
        if (!error && response.statusCode === 200) {
          var parsedBody = JSON.parse(body).vectorQuery.layers[layer.id];
          if (parsedBody) {
            result = {
              name: element.name,
              value: layer.name
            };
            results.push(result);
          }
        }
        var outerIndexFinished = (index === (layers.length - 1));
        var innerIndexFinished = (_index === (element.values.length -1));
        if ( outerIndexFinished && innerIndexFinished) {
          callback(results);
        }
      });
    });
  });
}

module.exports = router;