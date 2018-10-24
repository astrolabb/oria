/**
construit les données/évènements pour la gestion du jeu
exemple : positionnement image / écouteurs des clicks /
@constructor

@param monCanvas context à afficher au joueur
@param data_interface Object données d'interface provenant de data_interface.json
@param data_equilibrage Object données d'équilibrage provenant de equilibrage_url
@param monCanvas_clic context pour gérer les clics
@param data_image_chargee Object contenant tous les contextes des images chargées

*/

function GameManager(monCanvas, data_interface, data_equilibrage, monCanvas_clic, data_image_chargee)
{
    console.log("fonction GameManager");

    this.monCanvas = monCanvas;
    this.monCanvas_click = monCanvas_clic;
    this.data_interface = data_interface;
    this.data_image_chargee = data_image_chargee;
    this.arrayOfGameObjects = [];
    this.arrayOfGameObjects2 = [];
    this.arrayOfClickObjects = {};
    this.map = {};
    this.pos_x = 0;
    this.pos_y = 0;

}
/**
 * prototype de lancement :
 de la page d'accueil
 *
 *
 */
 GameManager.prototype.setup = function ()
 {

   // tableau des contextes des éléments à cliquer : mise à 0
   this.arrayOfClickObjects = {};
   // canvas vu par le joueur vidé
   this.monCanvas.clearRect(0,0, window.innerWidth, window.innerHeight);
   console.log("GamaManager : Introduction");
   // Mise en place des images et des boutons de la page d'accueil
     this.monCanvas.beginPath();
     // mise place des images et des boutons par le contructeur Intro
     this.intro = new Intro(this.monCanvas,this, data_interface);
     // affichage des images et des boutons
     this.affichage_intro();
     // recupération position click, lien vers destination souhaitée
     this.click_canvas();
     // affichage du click
     this.monCanvas.closePath();

   // canvas des zone de click vidé
   this.monCanvas_click.clearRect(0,0, window.innerWidth, window.innerHeight);
   this.monCanvas_click.beginPath();
   // mise en place des zones à cliquer
   this.canvas_hit = new Gameplay(this.monCanvas_click, this, this.data_interface.introduction.elements);
   // affichage des zones à cliquer
   this.affichage_click_zone();
   this.monCanvas_click.closePath();

 }
 /**
  * Mise en place de la zone à clicker
  *
  * @return {[type]} [description]
  */
  GameManager.prototype.affichage_click_zone = function ()
   {
     console.log("affichage_click_zone");
     console.log("arrayOfGameObjects2 : "+JSON.stringify(this.arrayOfGameObjects2));
       for (var i in this.arrayOfGameObjects2) {
           this.canvas_hit[this.arrayOfGameObjects2[i]].draw(this.monCanvas_click);
       }
   }


 /**
  * Affichage de l introduction
  *
  * @return {[type]} [description]
  */
 GameManager.prototype.affichage_intro = function ()
  {
    console.log("affichage_intro");
    console.log("arrayOfGameObjects : "+JSON.stringify(this.arrayOfGameObjects));
      for (var i in this.arrayOfGameObjects) {
          if(this.arrayOfGameObjects[i][1]=="text"){
            this.intro[this.arrayOfGameObjects[i][0]].centrage();
          }else if(this.arrayOfGameObjects[i][1]=="image"){
            this.intro[this.arrayOfGameObjects[i][0]].affichage();
          }
      }

  }

/**
 * Init du jeu
 *
 * @return {[type]} [description]
 */
GameManager.prototype.setup2 = function ()
{

  var self = this;

  this.arrayOfGameObjects = [];
  this.arrayOfGameObjects2 = [];
  this.arrayOfClickObjects = {};

  this.monCanvas.clearRect(0, 0, window.innerWidth, window.innerHeight);
  this.monCanvas.beginPath();
  this.map = new Map(this.monCanvas, self, data_interface),
  this.affichage_map();
  this.click_canvas();
  this.monCanvas.closePath();

  this.monCanvas_click.clearRect(0, 0, window.innerWidth, window.innerHeight);
  this.monCanvas_click.beginPath();
  // mise en place des zones à cliquer
  this.canvas_hit = new Gameplay(this.monCanvas_click, this, this.data_interface.image);
  // affichage des zones à cliquer
  this.affichage_click_zone();
  this.monCanvas_click.closePath();

    if(!this.mon_Interval){
      this.mon_Interval = setInterval( function() {self.reload();}, 1000);
    }
}
/**
 * rechargement de la map
 *
 * @return {[type]} [description]
 */
 GameManager.prototype.reload = function ()
  {
    console.log("reload");
      this.monCanvas.clearRect(0, 0, window.innerWidth, window.innerHeight);

    for (var i in this.arrayOfGameObjects) {
          console.log("image "+i);
          this.map[this.arrayOfGameObjects[i]].draw(this.monCanvas);
      }


  }



/**
 * Affichage map
 *
 * @return {[type]} [description]
 */
 GameManager.prototype.affichage_map = function ()
  {
    console.log("affichage_map : affichage des icones");
      for (var i in this.arrayOfGameObjects) {
          this.map[this.arrayOfGameObjects[i]].draw(this.monCanvas);
      }
  }
  /**
   * position curseur
   *
   * @return {[type]} [description]
   */
   GameManager.prototype.position_curseur = function(e)
   {
     console.log("mesure pixel cliqué");
          this.pos_x = e.clientX;
          this.pos_y = e.clientY;
   }
   /**
    * Affichage curseur
    *
    * @return {[type]} [description]
    */
    GameManager.prototype.affichage_curseur = function()
    {
      console.log("affichage position curseur");
      this.monCanvas.fillStyle = "orange";
      this.monCanvas.rect(this.pos_x-1, 0, 2,  window.innerHeight);
      this.monCanvas.stroke();
      this.monCanvas.rect(0, this.pos_y-1, window.innerWidth,  2);
      this.monCanvas.stroke();
      this.monCanvas.arc(this.pos_x,this.pos_y,10,0,2*Math.PI, false);
      this.monCanvas.stroke();

    }
    /**
     * click sur le canvas
     *
     * @return {[type]} [description]
     */
     GameManager.prototype.click_canvas = function()
     {
       console.log("click");
        var self = this;
        $("#monCanvas").click(function(e){
          self.position_curseur(e);
          console.log("pos_x "+self.pos_x+" pos_y "+self.pos_y);
          self.affichage_curseur();
          var resultat = self.canvas_hit.direction(self.pos_x, self.pos_y, self.arrayOfClickObjects);
          console.log("mon resultat "+resultat);

          if(resultat){
            $("#monCanvas").off('click');
            self[resultat]();
          }

        });

     }
 /**
  * Affichage map
  *
  * @return {[type]} [description]
  */
  GameManager.prototype.setup3 = function ()
   {
this.setup();
   }
  /**
  * Affichage map
  *
  * @return {[type]} [description]
  */
  GameManager.prototype.setup4 = function ()
   {
     if(this.mon_Interval){
         clearInterval(this.mon_Interval);
     }
     this.monCanvas.putImageData(grey_scale(this), 0, 0);
     this.fadein(10);
   }

   /**
   * Affichage map
   *
   * @return {[type]} [description]
   */
   GameManager.prototype.setup5 = function ()
    {
this.setup();
    }
    /**
    * Affichage map
    *
    * @return {[type]} [description]
    */
    GameManager.prototype.setup6 = function ()
     {
this.setup();
     }
     /**
     * Affichage map
     *
     * @return {[type]} [description]
     */
     GameManager.prototype.setup7 = function ()
      {
this.setup();
      }
  /**
  * blanchi le canvas vu par le joueur
  *
  *
  */
  GameManager.prototype.fadein = function (nb)
     {
       self = this;
       var mon_compte = 0;
       this.mon_Interval2 = setInterval(function(){mon_compte++; fadein(self, mon_compte, nb)} , 400);
     }
