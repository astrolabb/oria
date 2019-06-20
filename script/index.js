
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
          console.log("Equilibrage2 :"+JSON.parse(data_equilibrage).or);
          console.log("Interface :"+JSON.stringify(data_interface));
          // quand le json d'euilibrage chargé on charge les images
          loadImages(data_image_chargement, function(images) {
              // quand les images sont chargées, on charge les sons
              loadSound(data_son_chargement, function(sons){
                  // quand les sons sont chargés, on lance le jeu
                  Main(data_interface,JSON.parse(data_equilibrage),images,sons, data_general);
              });
          });

  };
/**
fonction de chargement des Images

@param sources Object récupéré de data_image_chargement.json
@param callback fonction @return Object contenant le context de chaque image chargée
    Struncture {"nom_de__l_image" : "context de l'image", ...}
*/

   function loadImages(sources, callback) {

     var barre_chargement = document.createElement("progress");
     barre_chargement.setAttribute("value", "0");
     barre_chargement.setAttribute("max", "100");
     barre_chargement.className = "style_barre_chargement";
     document.body.appendChild(barre_chargement);

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
           barre_chargement.value =  loadedImages*100/numImages;
           if(++loadedImages >= numImages) {
             document.body.removeChild(barre_chargement);
             callback(images);
           }
         };
         images[src].src = sources[src];
       }
     }

 /**
  fonction de chargement des sons
  @param sources : nom du fichier contenant les différents sons à télécharger
  @param callback : fonction à exécuter quand tous les sons sont chargés

  */
  function loadSound(sources, callback) {

    var barre_chargement = document.createElement("progress");
    barre_chargement.setAttribute("value", "0");
    barre_chargement.setAttribute("max", "100");
    barre_chargement.className = "style_barre_chargement";
    document.body.appendChild(barre_chargement);

      var sons = {};
      var loadedSon = 0;
      var numSon = 0;
      // get num of sources
      for(var src in sources) {
        numSon++;
      }
      var stoptafonction = false;
      for(var src in sources) {
        sons[src] = new Audio();
        sons[src].addEventListener('canplaythrough', function reussi(e){
          loadedSon++;
          barre_chargement.value =  loadedSon*100/numSon;
          if(loadedSon >= numSon && !stoptafonction) {
            stoptafonction = true;
            document.body.removeChild(barre_chargement);
            callback(sons);
          }
          sons[src].removeEventListener('canplaythrough', reussi);
        }, false);
        sons[src].addEventListener('error', function failed(e)
        {
          console.log("COULD NOT LOAD AUDIO");
          $("#NETWORKERROR").show();
          sons[src].removeEventListener('error', failed);
        });
        sons[src].src = sources[src];
        sons[src].load();
      }
   }


});
