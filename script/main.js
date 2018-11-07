/**
fonction de lancement du jeu

@param data_interface : Object : toutes les donnees de l'interface provenant de data_interface.json
@param data_equilibrage : Object : toutes les données d'équilibrage provenant de equilibrage_url
@param data_image_chargee : Object : object contenant les contextes des images chargées

*/
function Main(data_interface, data_equilibrage, data_image_chargee){

  console.log("fonction Main");

  // Canevas sur lequel les images sont affichées. C'est le canevas que voit le joueur
  // @TODO: jquery nécessaire ?
  var monCanvas = $("#monCanvas")[0].getContext("2d");
  monCanvas.canvas.width  = window.innerWidth;
  monCanvas.canvas.height = window.innerHeight;

  // canevas invisible juste pour gestion click
  // on dessine des rectagles de la taille des boutons de couleur random. Enregistrement dans object et récupération de la couleur cliquée
  var hit_canvas = document.createElement('canvas');
  var monCanvas_clic = hit_canvas.getContext("2d");
  monCanvas_clic.canvas.width  = window.innerWidth;
  monCanvas_clic.canvas.height = window.innerHeight;

  // gestionnaire du joueur : niveaux, ressources...
  var mon_Player = new Player();
  // initialisation du joueur
  mon_Player.setup(data_equilibrage);
  // démarrage du gestionnaire de jeu : images/click
  var mon_GameManager = new GameManager(monCanvas, data_interface, data_equilibrage, monCanvas_clic, data_image_chargee, mon_Player);
  // lancement du menu d'accueil : prototype : setup
  mon_GameManager.setup2();


}

/**
@todo supprimer cette fonction si n'est pas utilisé
fonction grey_scale : met le contexte envoyé en nuance de gris
@param self : context le contexte à modifier
@return mes_donnees_image : obje ImageData : pixel modifiés en nuance de gris
*/
function grey_scale(monCanvas,_x, _y, _width, _height){

       console.log("fonction grey_scale");
       var mes_donnees_image = monCanvas.getImageData(_x,_y,_width,_height);
       var mes_pixels = mes_donnees_image.data;
       for(var i=0 ; i<mes_pixels.length ; i+=4){

         var mon_gris = mes_pixels[i]*0.33 + mes_pixels[i+1]*0.61 + mes_pixels[i+2]*0.06;
         mes_pixels[i] = mon_gris;
         mes_pixels[i+1] = mon_gris;
         mes_pixels[i+2] = mon_gris;
       // pixel i+3 représence l'alpha
       //  mes_pixels[i+3]
       }
    return mes_donnees_image;
  }
/**
fonction fadein
@todo supprimer cette fonction si n'est pas utilisé


*/
function fadein (self, i, nb){
  console.log("fonction fadein");
   if(i>nb){
     clearInterval(self.mon_Interval2);
   }
   self.monCanvas.beginPath();
  self.monCanvas.globalAlpha = 0.1;
  self.monCanvas.fillStyle = "FFFFFF";
  self.monCanvas.fillRect(0, 0, window.innerWidth, window.innerHeight);
   self.monCanvas.closePath();
    }

    /**

    */
    function getColorRandom(){
        var r = Math.round(Math.random()*255);
        var g = Math.round(Math.random()*255);
        var b = Math.round(Math.random()*255);

        var result = 'rgb('+r+','+g+','+b+')';
            console.log("couleur retournée "+result);
        return result;
    }
