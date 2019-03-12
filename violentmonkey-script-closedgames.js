// ==UserScript==
// @name New Script 2
// @namespace Violentmonkey Scripts
// @match *://*/*
// @include https://*boardgamearena.com/*gamereview?table=*              
// @grant none
// ==/UserScript==

var boardsize = 13;
var black, white, handicap = 0, komi = 0;

function mapplayer(p){
  if(p.includes(white)){
    return "W";
  } else if (p.includes(black)){
    return "B";
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

function mapscore(s){
  var points =  s.split(/[.:]/);
  var p1 = parseInt(points[0]);
  var p2 = parseInt(points[1]);
  return p1-p2;
}


function createsgf2(str){
  
  
  var output = "", sgf = "";
  var moves = [];
  var handicapstones = [];
  var result = "", wins = "", score = "";
  var lines = str.split("\n");
  
  lines = lines.reverse();
  
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
      black = words[11];
      output += "\nblack: " + black;
      
      //parse handicap stones
      handicapstones += words[12];
      for (var i = 1; i <= handicap; i++){
        handicapstones += words[12+i];
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
      
    } else if (lines[i].includes("wins") && lines[i].includes("score")){
      //score line looks like this:
      // "EricKuhn wins the game with a score of 108:19."
      wins = (lines[i].split(" "))[0];
      score = (lines[i].split(" "))[8];
    }
  }
  
  // compose sgf header:
  //sgf += "(;GM[1]FF[4]CA[UTF-8]AP[bga2sgf:1]ST[2]RU[Japanese]SZ[" + boardsize + "]"; 
  sgf += "(;GM[1]FF[4]RU[Japanese]SZ[" + boardsize + "]"; 
  
  if(handicap > 0){
    sgf += "HA[" + handicap + "]AB";
    var a = handicapstones.split(/[(),.]+/);
    // note: first array entry is empty because the string starts with a deliminator
    //       consequently we start at second (index 1) entry
    for(var i = 1; i<handicap*2;){
      sgf += "[" + mapcol(a[i++]) + maprow(a[i++]) + "]";
    }
  } else {
    sgf += "KM[" + komi + "]";    
  }
  
  sgf += "PW["+white+"]PB["+black+"]";
  
  if(wins !== ""){
    sgf += "RE[" + mapplayer(wins) + "+" + mapscore(score) + "]";
  }
  
  
  //output += "\nsgf:\n" + sgf + moves.reverse().map(function(e){
  var sgfmoves = moves.reverse().map(function(e){
    var words = e.split(/[(,)]/);
    
    if(e.includes("plays")) {
      return ";" + mapplayer(words[0]) + "[" + mapcol(words[1]) + maprow(words[2]) + "]";
    } else if(e.includes("passes")){
      return ";" + mapplayer(words[0]) + "[]";
    }
    //return words;
    
  });
  
  for (var i in sgfmoves){
    sgf += sgfmoves[i];
  }
  
  sgf += ")";
  
  return sgf;
}

window.onload = function(){
  var logs = document.getElementById('gamelogs');  
  //alert(logs.innerText);  
  alert(createsgf2(logs.innerText));  
} 
