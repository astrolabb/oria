$(document).ready(function(){

  var ctx = $("#monCanvas")[0].getContext("2d");
  ctx.beginPath();
  ctx.rect(20,30,60,80);
  ctx.fillStyle = "#FF0000";
  ctx.fill();
  ctx.closePath();
});
