// ==UserScript==
// @name BGA Script
// @namespace Szunyi Scripts
// @match http*://*.boardgamearena.com/classicgo?table=*
// @grant none
// ==/UserScript==

//document.body.style.background = "#ffffff";

window.onload = function(){
  var logs = document.getElementById('logs');
  alert("logs element: " + logs.textContent);
} 
