$(document).ready(function(){

  var equilibrage_url = "./data/data_equilibrage.json";
  var recup_equilibrage = new XMLHttpRequest();
  recup_equilibrage.open('GET', equilibrage_url, true);
  recup_equilibrage.setRequestHeader("Content-Type", "application/json");
  recup_equilibrage.send(null);
  recup_equilibrage.onload = function() {
          var type = recup_equilibrage.getResponseHeader('Content-Type');
          var data_equilibrage = recup_equilibrage.response;
          console.log("Equilibrage :"+$.parseJSON(JSON.stringify(data_equilibrage)));
          console.log("Interface :"+JSON.stringify(data_interface));

          Main(data_interface,data_equilibrage);

  };

});

  /*
  var ctx = $("#monCanvas")[0].getContext("2d");
  ctx.beginPath();

  ctx.fillStyle = "green";
  ctx.fillRect(0,0,300,600);


  ctx.fillStyle = "blue";
  ctx.fillRect(0,0,50,50);


  ctx.fillStyle = "yellow";
  ctx.fillRect(250,0,50,50);


  ctx.fillStyle = "black";
  ctx.fillRect(125,275,50,50);


  ctx.fillStyle = "grey";
  ctx.fillRect(0,550,50,50);


  ctx.fillStyle = "pink";
  ctx.fillRect(250,550,50,50);




  ctx.closePath();
  */
