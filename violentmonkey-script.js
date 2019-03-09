// ==UserScript==
// @name New Script
// @namespace Violentmonkey Scripts
// @match https://en.1.boardgamearena.com/classicgo
// @grant none
// ==/UserScript==


//document.body.style.background = "#ffffff";

var boardsize = 13;
var black, white, handicap = 0, komi = 0;

function mapplayer(p){
  if(p.includes(white)){
    return ";W";
  } else if (p.includes(black)){
    return ";B";
  } else {
    return "PLAYERERROR";
  } 
}

// char *sgfrows = "abcdefghijklmnopqrstuvwxy";

var sgfrows = "abcdefghijklmnopqrstuvwxy";
var bgacols = "ABCDEFGHJKLMNOPQRST";

function mapcol(c){
  var i = bgacols.indexOf(c);
  if(i > -1){
    return sgfrows[i];
  }
} 

function maprow(r){
  var i = parseInt(r);
  if(i !== NaN){
    return sgfrows[boardsize - i];
  }
}


function createsgf(str){
  
  
  var output = "", sgf = "";
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
       
      // find out number of handicap stones
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
      handicapstones += words[13];
      for (var i = 1; i <= handicap; i++){
        handicapstones += words[13+i];
      }
      output += "\nhandicap stones: " + handicapstones;
      
      //find out who is white from the first move (previous in the list)
      white = (moves[moves.length - 1].split(" "))[0];
      output += "\nwhite: " + white;
      
    } else if ((lines[i].includes("gains")) && (lines[i].includes("komi"))){
      // Komi line looks like this:
      // "szunyi gains 5 points for komi."
      
      // find out who is white by komi entry
      white = (lines[i].split(" "))[0];
      output += "\nwhite: " + white;
      
      // find out komi
      var k = parseInt((lines[i].split(" "))[2]);
      if(k !== NaN){
        komi = k;
      }
      output += "\nkomi: " + k;
      
      // find out who is black by the first move (previous in the list)
      black = (moves[moves.length - 1].split(" "))[0];
      output += "\nblack: " + black; 
      
    } else if (lines[i].includes("captures")){ 
      output += "line:" + lines[i];
      
    } else if (lines[i].includes("passes")){       
      output += "\npass: " + lines[i];
      moves.push(lines[i]);
    }
  }
  
  // compose sgf header:
  sgf += "(;GM[1]FF[4]CA[UTF-8]AP[bga2sgf:1]ST[2]RU[Japanese]SZ[" + boardsize + "]"; 
  if(handicap > 0){
    sgf += "HA[" + handicap + "]AB"+handicapstones;
  } else {
    sgf += "KM[" + komi + "]";    
  }
  
  sgf += "PW["+white+"]PB["+black+"]";
  
  
  //output += "\nsgf:\n" + sgf + moves.reverse().map(function(e){
  var sgfmoves = moves.reverse().map(function(e){
    var words = e.split(/[(,)]/);
    return mapplayer(words[0]) + "[" + mapcol(words[1]) + maprow(words[2]) + "]";
    //return words;
    
  });
  
  for (var i in sgfmoves){
    sgf += sgfmoves[i];
  }
  
  sgf += ")";
  
  return sgf;
}

window.onload = function(){
  var logs = document.getElementById('logs');
  alert(createsgf(logs.innerText));
} 
