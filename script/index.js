
// chargement du DOM
$(document).ready(function(){

/**
Chargement des données d'équilibrage
utilisation d'un HttpRequest pour laisser choix entre local et distant

@todo trouver url distante si décision équilibrage à postriori
*/
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
          // quand le json d'euilibrage chargé on charge les images
          loadImages(data_image_chargement, function(images) {
              // quand les images sont chargées, on charge le jeu
              Main(data_interface,data_equilibrage,images);
                  });

  };
/**
fonction de chargement des Images

@param sources Object récupéré de data_image_chargement.json
@param callback fonction @return Object contenant le context de chaque image chargée
    Struncture {"nom_de__l_image" : "context de l'image", ...}
*/

   function loadImages(sources, callback) {
       var images = {};
       var loadedImages = 0;
       var numImages = 0;
       // get num of sources
       for(var src in sources) {
         numImages++;
       }
       for(var src in sources) {
         images[src] = new Image();
         images[src].onload = function() {
           if(++loadedImages >= numImages) {
             callback(images);
           }
         };
         images[src].src = sources[src];
       }
     }

});
