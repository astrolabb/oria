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
  var mon_GameManager = new GameManager(monCanvas, data_interface, data_equilibrage, monCanvas_clic, data_image_chargee, mon_Player, data_texte);
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
    /**
    fonction mise à l'échelle
    change l'abcisse, l'ordonnée, la largeur et la hauteur des icones à afficher
    pour les représenter en tableau
    @param data_equilibrage Object données sur les icones à afficher
    @param left number marge à marge_gauche
    @param up number marge en haut
    @param ref number alignement vertical

    @return data_equilibrage Object nouvelles données des icones à afficher
    */

    function mise_echelle(data_equilibrage, left, up, ref, largeur){

      var marge_gauche = left;
      var marge_haut = up;
      var nb_image_ligne = Math.ceil(Math.sqrt(Object.keys(data_equilibrage).length));
      console.log("data_equilibrage longueur "+Object.keys(data_equilibrage).length);
      console.log("nb_image_ligne "+nb_image_ligne);
      console.log("largeur ecran "+largeur);
      console.log("hauteur ecran "+window.innerHeight);
      var largeur_image = (largeur - 2*marge_gauche - (nb_image_ligne*5))/nb_image_ligne;
      console.log("largeur_image "+largeur_image);
      var hauteur_image = (window.innerHeight - 1.2*marge_haut - (nb_image_ligne*5))/nb_image_ligne;
      console.log("hauteur_image "+hauteur_image);
      largeur_image = largeur_image>hauteur_image ? hauteur_image : largeur_image;
      hauteur_image = largeur_image>hauteur_image ? hauteur_image : largeur_image;
      var compteur = 0;
      var compteur2 = 0;
      Object.keys(data_equilibrage).forEach(function(key) {
          if(data_equilibrage[key].nature == "image"){
            compteur2 = compteur >= nb_image_ligne ? compteur2+1 : compteur2;
            compteur = compteur >= nb_image_ligne ? 0 : compteur;
            data_equilibrage[key]._x = ref + marge_gauche + compteur*(largeur_image+5);
            data_equilibrage[key]._y = marge_haut + compteur2*(hauteur_image+5);
            data_equilibrage[key]._width = largeur_image;
            data_equilibrage[key]._height = hauteur_image;
            compteur++;
          }
      });

      return data_equilibrage;
    }
    /**
    fonction mix_ressources
    modifie le tableau de fabrication des plats ou des ressources

    @param mon_array array mon tableau de recette avant changement
    @param mon_array2 array mon tableau représentant les catégorie des ressources présentent dans mon_array
    @param niveau number niveau actuel pour le lonono
    @param icone string clé de l'icone cliquée
    @param cat string catégorie de ressource : ressource ou plat

    @return mon_array array nouveau tableau representant la recette
    */
    function mix_ressources(mon_array, mon_array2, niveau, icone, cat){
        mon_array.push(icone);
        mon_array2.push(cat);
        if(mon_array.length>niveau){
          mon_array.shift();
          mon_array2.shift();
        }
        return [mon_array, mon_array2];
    }
    /**
    fonction mix_reussite
    vérifie si l'association de ressource donne droit à un plat ou une nouvelle ressource

    @param mon_array : array composition des ressources
    @param algo : array algorithme des recettes
    @param niveau : number niveau pour le lonono

    @return ressource_trouvee array tableau vide si test recette echoue et sinon retourne [clee, nombre]

    */
    function mix_reussite(mon_array, algo, niveau){
      var ressource_trouvee = [];
      Object.keys(algo[String(niveau)]).forEach(function(key) {
        if(JSON.stringify(algo[String(niveau)][key][0]) == JSON.stringify(mon_array)){
          ressource_trouvee = [key, 1];
        }

      });
      return ressource_trouvee;
    }
    /**
    fonction affichage_ressource
    formatage des données pour l'affichage du mix pour la synthèse de plat et de ressource dans la section lonono

    */
    function affichage_ressource(mix, mix2, data){
      var affichage = "";
      mix.forEach(function(e, index){
          affichage += data[mix2[index]][e].nom+" ";
      });
      return affichage;

    }
