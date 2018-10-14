


function Main(data_interface, data_equilibrage){

  console.log("fonction Main");

  var monCanvas = $("#monCanvas")[0].getContext("2d");
  monCanvas.canvas.width  = window.innerWidth;
  monCanvas.canvas.height = window.innerHeight;
  monCanvas.beginPath();

  var mon_GameManager = new GameManager(monCanvas, data_interface, data_equilibrage);
  mon_GameManager.setup();

  monCanvas.closePath();
}
