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
  var handicapstones = [];
  var lines = str.split("\n");
  for(var i in lines){
    
    if (lines[i].includes("plays")){  
      if (lines[i].includes("plays (O")){  
        boardsize = 19;        
      }      
      output += "\nmove: " + lines[i];
      moves.push(lines[i]);
      
    } else if (lines[i].includes("handicap")){
      // Handicap line looks like this:    
      // "2 have been placed on the board as the handicap for szunyi (D, 4)(K, 10)."
      var h = parseInt(lines[i]);
      if(h !== NaN){
        handicap = h;
      }
      output += "\nhandicap: " + h;
      
      // find out who is black
      var words = lines[i].split(" ");
      black = words[12];
      output += "\nblack: " + black;
      
      //parse handicap stones
      output += "\nhandicap stones: " + words[13];
      for (var i = 1; i <= handicap; i++){
        output += words[13+i];
      }
      
      //find out who is white from the previous move
      white = (moves[moves.length - 1].split(" "))[0];
      output += "\nwhite: " + white;
      
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
