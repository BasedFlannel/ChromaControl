/*
let clubber = require('clubber')
let objClubber = new Clubber({size:2048, mute:false})
let numBars=30
objClubber.listen(document.getElementById("mainAudio"))

let barVals = range(numBars);

let barWidth = (100 / numBars) + "%";
let barHeight = range(numBars);
let windowHeight = window.innerHeight;

function range(count){
  var ratings = []
  for (var i = 1; i <= count; i++){
    ratings.push(i)
  }

  return ratings
}


function interpolate(data, newLength) {
    var sliceElems = Math.floor(data.length / newLength)
    var newData = Array(newLength)
    var arrSlice
    for(var i = 0; i<newData.length; i++){
      arrSlice = data.slice(i*sliceElems,i*sliceElems+sliceElems)
      newData[i] = arrSlice.reduce(function(a,b){return a+b}) / sliceElems
    }
    return newData
}

function wheel(num){
  //takes a number 0-255 and returns one of 256 colors.
  opNum = (num*3)%256
  if(num<85){
    return rgbToHex(256-opNum,0,opNum)
  }
  else if(num<170){
    return rgbToHex(0,opNum,256-opNum)
  }
  else{
      return rgbToHex(opNum,256-opNum,0)
  }
}

function rgbToHex(red,green,blue){
  return '#' + (0x1000000 + (blue | (green << 8) | (red << 16))).toString(16).slice(1)
}


//event loop
window.setInterval(function(){
  clubber.update();
  barVals = interpolate(clubber.notes,numBars);
  document.querySelectorAll('.spectrum-bar').forEach(function(bar) {
    var barIntensity = barVals[bar.dataset.index]
    bar.style.height = barIntensity*0.39 + '%';
    //bar.innerHTML = barIntensity;
    bar.style.backgroundColor = wheel(barIntensity);
  });
},17);
*/
var chromusic = angular.module('chromusicApp', []);

  //app code here
  chromusic.controller('chromusicCtrl', function($scope,$window){
    let clubberReq = require('clubber');
    var mainAudio = document.getElementById("mainAudio");
    $scope.mainAudioSrc = "https://wizgrav.github.io/codepen-assets/march.mp3";
    $scope.clubber = new Clubber({size:2048, mute:false});
    $scope.clubber.listen(mainAudio);
    $scope.numBars = 30;
    //utility function for making an array from 1 to n
    $scope.range = function(count){
      var ratings = [];
      for (var i = 1; i <= count; i++) { ratings.push(i) }
      return ratings;
    }
    $scope.barVals = $scope.range($scope.numBars);
    //utility function for interpolating an array from one length to another
    $scope.interpolate = function(data, newLength) {
        var sliceElems = Math.floor(data.length / newLength);
        var newData = Array(newLength);
        var arrSlice;
        for(var i = 0; i<newData.length; i++){
          arrSlice = data.slice(i*sliceElems,i*sliceElems+sliceElems);
          newData[i] = arrSlice.reduce(function(a,b){return a+b}) / sliceElems;
        }
        return newData;
    }
    $scope.wheel = function(num){
      //takes a number 0-255 and returns one of 256 colors.
      opNum = (num*3)%256;
      var red, green, blue;
      var rgbToHex = function(red,green,blue){
        return '#' + (0x1000000 + (blue | (green << 8) | (red << 16))).toString(16).slice(1);
      };
      if(num<85)
      return rgbToHex(256-opNum,0,opNum);

      else if(num<170)
        return rgbToHex(0,opNum,256-opNum);
      else
          return rgbToHex(opNum,256-opNum,0);
    }

    var host = '192.168.1.105'
    var port = 21012
    var net = require('net')
    var JsonSocket = require('json-socket')
    var socket = new JsonSocket(new net.Socket());
    var sockConnected = false;
    socket.connect(port,host)
    socket.on('connect',function(){sockConnected = true});

    //update the clubber data and bars constantly
    window.setInterval(function(){
      $scope.clubber.update();
      $scope.barVals = $scope.interpolate($scope.clubber.notes,$scope.numBars);
      var colors = [];
      document.querySelectorAll('.spectrum-bar').forEach(function(bar) {
        var barIntensity = $scope.barVals[bar.dataset.index]
        bar.style.height = barIntensity*0.39 + '%';
        //bar.innerHTML = barIntensity;
        var color = $scope.wheel(barIntensity);
        colors.push(color);
        bar.style.backgroundColor = color;
      });
      console.log(JSON.stringify(colors))
      socket.sendMessage({data: colors})
    },17);
    //set up a few positional and size variables
    $scope.barWidth = (100 / $scope.numBars) + "%";
    $scope.barHeight = $scope.range($scope.numBars);
    $scope.windowHeight = window.innerHeight;
  });
