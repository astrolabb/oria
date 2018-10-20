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

  // démarrage du gestionnaire de jeu : images/click
  var mon_GameManager = new GameManager(monCanvas, data_interface, data_equilibrage, monCanvas_clic, data_image_chargee);
  // lancement du menu d'accueil : prototype : setup
  mon_GameManager.setup();


}
