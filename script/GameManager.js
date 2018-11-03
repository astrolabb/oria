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

function GameManager(monCanvas, data_interface, data_equilibrage, monCanvas_clic, data_image_chargee, mon_Player)
{
    console.log("fonction GameManager");
    console.log("test chargement : or "+mon_Player.or);
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
    this.mon_Player = mon_Player;
    this.data_equilibrage = data_equilibrage;

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
   console.log("GameManager : Introduction");
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

            this.intro[this.arrayOfGameObjects[i][0]].setup((this.intro[this.arrayOfGameObjects[i][0]].text=="" ? this.mon_Player[this.intro[this.arrayOfGameObjects[i][0]].valeur_a_afficher] : this.intro[this.arrayOfGameObjects[i][0]].text));
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
GameManager.prototype.setup2 = function (bouton, data)
{

  var self = this;

  this.arrayOfGameObjects = [];
  this.arrayOfGameObjects2 = [];
  this.arrayOfClickObjects = {};

  this.monCanvas.clearRect(0, 0, window.innerWidth, window.innerHeight);
  this.monCanvas.beginPath();
  this.map = new Map(this.monCanvas, self, this.data_interface.carte);
  console.log("mes_niveaux "+this.mon_Player);
  this.niveau = this.mon_Player.niveau_init(this.arrayOfGameObjects);

  this.affichage_map();
  this.click_canvas();
  this.monCanvas.closePath();

  this.monCanvas_click.clearRect(0, 0, window.innerWidth, window.innerHeight);
  this.monCanvas_click.beginPath();
  // mise en place des zones à cliquer
  this.canvas_hit = new Gameplay(this.monCanvas_click, this, this.data_interface.carte.elements);
  // affichage des zones à cliquer
  this.affichage_click_zone();
  this.monCanvas_click.closePath();

    if(!this.mon_Interval){
      this.mon_Interval = setInterval( function() {self.reload(self.map);}, 3000);
    }

}

/**
 * rechargement de la map
 *
 * @return {[type]} [description]
 */
 GameManager.prototype.reload = function (_target)
  {
    console.log("reload");
      this.monCanvas.clearRect(0, 0, window.innerWidth, window.innerHeight);

    for (var i in this.arrayOfGameObjects) {
          console.log("image "+i);
          if(this.arrayOfGameObjects[i][1]=="text"){
            // affichage du Texte
            // si texte defini par défaut dans data_interface est egal à "" alors affichage de la valeur stockée dans this.mon_Player.(...)
            _target[this.arrayOfGameObjects[i][0]].setup((_target[this.arrayOfGameObjects[i][0]].text=="" ? this.mon_Player[_target[this.arrayOfGameObjects[i][0]].valeur_a_afficher] : _target[this.arrayOfGameObjects[i][0]].text));
        //    _target[this.arrayOfGameObjects[i][0]].setup(this.mon_Player.or);
          }else if(this.arrayOfGameObjects[i][1]=="image"){
            _target[this.arrayOfGameObjects[i][0]][_target[this.arrayOfGameObjects[i][0]].ombre](this.monCanvas);
      //      _target[this.arrayOfGameObjects[i][0]].draw(this.monCanvas);
          }
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
          if(this.arrayOfGameObjects[i][1]=="text"){
            this.map[this.arrayOfGameObjects[i][0]].setup(this.mon_Player.or);
          }else if(this.arrayOfGameObjects[i][1]=="image"){
            this.map[this.arrayOfGameObjects[i][0]].draw(this.monCanvas);
          }
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
            console.log("click_canvas "+JSON.stringify(resultat));
            self[resultat[1]](resultat[0], resultat[2]);
          }

        });

     }
 /**
  * comportement lors d'un click sur le lonono
  *
  * @return {[type]} [description]
  */
  GameManager.prototype.setup3 = function (key, data)
   {
//this.setup();
this.mon_Player.or +=1;
this.setup2();
   }
  /**
  * Affichage map
  *
  * @return {[type]} [description]
    @todo enlever les fonctions fadein en js qui sont commentées
  */
  GameManager.prototype.setup4 = function (key, data)
   {
     console.log("village");
     self = this;
     if(this.mon_Interval){
         clearInterval(this.mon_Interval);
     }
     $("#monCanvas").addClass("niveau_de_gris mon_fadein");
     $("#monCanvas").one('webkitAnimationEnd oanimationend msAnimationEnd animationend', function(e) {
          $("#monCanvas").removeClass("niveau_de_gris mon_fadein");
          self.contructor_village();

     });
//     this.monCanvas.putImageData(grey_scale(this), 0, 0);
//     this.fadein(20);
   }

   /**
   * Affichage map
   *
   * @return {[type]} [description]
   */
   GameManager.prototype.setup5 = function (key, data)
    {
this.setup();
    }
    /**
    * comportement lors de click sur la foret
    *
    * @return {[type]} [description]
    */
    GameManager.prototype.setup6 = function (key, data)
     {
       console.log("setup6 "+key)
        this.mon_Player.changement_niv(key);
        this.setup2();
     }
     /**
     * Affichage map
     *
     * @return {[type]} [description]
     */
     GameManager.prototype.setup7 = function (key, data)
      {
this.setup();
      }
  /**
  * blanchi le canvas vu par le joueur en js
  @todo supprimer cette fonction si ne sert pas
  *
  *
  */
  GameManager.prototype.fadein = function (nb)
     {
       self = this;
       mon_compte = 0;
       this.mon_Interval2 = setInterval(function(){
         mon_compte++;
         fadein(self, mon_compte, nb);
       } , 400);
     }
  GameManager.prototype.contructor_village = function(){
    var self = this;
    this.arrayOfGameObjects = [];
    this.arrayOfGameObjects2 = [];
    this.arrayOfClickObjects = {};

    this.monCanvas.clearRect(0, 0, window.innerWidth, window.innerHeight);
    this.monCanvas.beginPath();
    this.village = new Mon_Village(this.monCanvas, self, this.data_equilibrage.plats, this.data_interface.village);
    this.niveau = this.mon_Player.niveau_init(this.arrayOfGameObjects);
    this.affichage_village();
    this.click_canvas();
    this.monCanvas.closePath();

    this.monCanvas_click.clearRect(0, 0, window.innerWidth, window.innerHeight);
    this.monCanvas_click.beginPath();
    // mise en place des zones à cliquer
    this.canvas_hit = new Gameplay(this.monCanvas_click, this, this.data_equilibrage.plats);
    // affichage des zones à cliquer
    this.affichage_click_zone();
    this.monCanvas_click.closePath();
      if(!this.mon_Interval){
          this.mon_Interval = setInterval( function() {self.reload(self.village);}, 3000);
      }
  }
  GameManager.prototype.affichage_village = function()
  {
    console.log("affichage_village");

      for (var i in this.arrayOfGameObjects) {
          if(this.arrayOfGameObjects[i][1]=="text"){
            console.log("valeur a afficher "+this.village[this.arrayOfGameObjects[i][0]].valeur_a_afficher);
            console.log("valeur a afficher2 "+this.mon_Player[this.village[this.arrayOfGameObjects[i][0]].valeur_a_afficher]);
            console.log("valeur a afficher3 "+(this.village[this.arrayOfGameObjects[i][0]].text=="" ? this.mon_Player[this.village[this.arrayOfGameObjects[i][0]].valeur_a_afficher] : this.village[this.arrayOfGameObjects[i][0]].text));
          // affichage du Texte
          // si texte defini par défaut dans data_interface est egal à "" alors affichage de la valeur stockée dans this.mon_Player.(...)
            this.village[this.arrayOfGameObjects[i][0]].setup((this.village[this.arrayOfGameObjects[i][0]].text=="" ? this.mon_Player[this.village[this.arrayOfGameObjects[i][0]].valeur_a_afficher] : this.village[this.arrayOfGameObjects[i][0]].text));
          }else if(this.arrayOfGameObjects[i][1]=="image"){

            this.village[this.arrayOfGameObjects[i][0]][this.village[this.arrayOfGameObjects[i][0]].ombre](this.data_interface.village.alpha_);

          }
      }

  }
  GameManager.prototype.vente = function(key, data)
  {
    if(this.mon_Player.echange(key, 1, "or", data)){
    this.popup("contructor_village");
  }

  }
  GameManager.prototype.popup = function(target){
    var self = this;
    console.log("popup");
    self = this;
    if(this.mon_Interval){
        clearInterval(this.mon_Interval);
    }
    this.popup = new Popup(this.monCanvas, self, this.data_equilibrage.plats, this.data_interface.popup);
    this.niveau = this.mon_Player.niveau_init(this.arrayOfGameObjects);
    this.affichage_popup();


  }
  GameManager.prototype.affichage_popup = function(){
    console.log("fonction affichage_popup");
    self = this;
    $("#monCanvas").addClass("mon_fadein2");
    $("#monCanvas").one('webkitAnimationEnd oanimationend msAnimationEnd animationend', function(e) {
         $("#monCanvas").removeClass("mon_fadein2");
         self.contructor_village();

    });


  }
