// ==UserScript==
// @name New Script
// @namespace Violentmonkey Scripts
// @match https://en.1.boardgamearena.com/classicgo
// @grant none
// ==/UserScript==


//document.body.style.background = "#ffffff";

function createsgf(str){
  var boardsize = 13;
  var black, white, handicap = 0, komi = 0;
  
  var output = "";
  var moves = [];
  var lines = str.split("\n");
  for(var i in lines){
    
    if (lines[i].includes("plays")){  
      if (lines[i].includes("plays (O")){  
        boardsize = 19;        
      }      
      output += "\nmove: " + lines[i];
      
    } else if (lines[i].includes("handicap")){
      // Handicap line looks like this:    
      // "2 have been placed on the board as the handicap for szunyi (D, 4)(K, 10)."
      var h = parseInt(lines[i]);
      if(h !== NaN){
        handicap = h;
      }
      output += "\nhandicap: " + h;
      
      var words = lines[i].split(" ");
      black = words[12];
      output += "\nblack: " + black;
      
    } else if ((lines[i].includes("gains")) && (lines[i].includes("komi"))){
      output += "line:" + lines[i];
    } else if (lines[i].includes("captures")){ 
      output += "line:" + lines[i];
    } else if (lines[i].includes("passes")){ 
      output += "line:" + lines[i];
    }
  }
  return output;
}

window.onload = function(){
  var logs = document.getElementById('logs');
  alert(logs.innerText + createsgf(logs.innerText));
} 
