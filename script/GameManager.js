/**
construit les données/évènements pour la gestion du jeu
exemple : positionnement image / écouteurs des clicks /
@constructor

@param monCanvas context à afficher au joueur
@param data_interface Object données d'interface provenant de data_interface.json
@param data_equilibrage Object données d'équilibrage provenant de equilibrage_url
@param monCanvas_clic context pour gérer les clics
@param data_image_chargee Object contenant tous les contextes des images chargées
@param mon_Player Object classe contenant les paramètres du joueur : score, ressources
@param data_texte Object contenant les textes à afficher dans les popups
*/

function GameManager(monCanvas, data_interface, data_equilibrage, monCanvas_clic, data_image_chargee, mon_Player, data_texte)
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
    this.data_texte = data_texte;

    // iinitialisation des variables utilisées dans la partie lonono
    // tableau représentant l'association des ressources ---> synthèse nouvelle ressource
    this.array_mix_ressource = [];
    // tableau représentant la catégorie des ressources présentent dans array_mix_ressource
    this.array_mix_ressource2 = [];
    // Object indexé sur le nom des object selectionne dans la but de fabriquer une ressource dans la partie lonono
    this.array_mix_ressource3 = {};
    // tableau représentant l'association des ressources --> synthèse plat
    this.array_mix_plat = [];
    // tableau représentant  la catégorie des ressources présentent dans array_mix_plat
    this.array_mix_plat2 = [];
    // Object indexé sur le nom des object selectionne dans la but de fabriquer un plat dans la partie lonono
    this.array_mix_plat3 = {};
    // string montre au joueur les ressources choisies dans le jeu du lonono
    this.mon_Player.lonono_mix_ressource = "";
    this.mon_Player.lonono_mix_plat = "";


}
/**
 * prototype de lancement :
 de la page d'accueil
 *
 *
 */
 GameManager.prototype.setup = function (key, data, scene)
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
     this.niveau = this.mon_Player.niveau_init(this.arrayOfGameObjects);

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
   this.canvas_hit = new Gameplay(this.monCanvas_click, this, this.data_interface.introduction.elements, "intro");
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
         console.log("object_fusionne2 "+this.arrayOfGameObjects2[i]);
           this.canvas_hit[this.arrayOfGameObjects2[i]].draw(this.monCanvas_click);
    // this.canvas_hit[this.arrayOfGameObjects2[i]].draw(this.monCanvas);

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
//    console.log("arrayOfGameObjects : "+JSON.stringify(this.arrayOfGameObjects));
      for (var i in this.arrayOfGameObjects) {
          if(this.arrayOfGameObjects[i][1]=="text"){

            this.intro[this.arrayOfGameObjects[i][0]].setup((this.intro[this.arrayOfGameObjects[i][0]].text=="" ? this.mon_Player[this.intro[this.arrayOfGameObjects[i][0]].valeur_a_afficher] : this.intro[this.arrayOfGameObjects[i][0]].text));
          }else if(this.arrayOfGameObjects[i][1]=="image"){
            this.arrayOfGameObjects[i][2][this.arrayOfGameObjects[i][2].ombre](this.monCanvas);
      //      this.intro[this.arrayOfGameObjects[i][0]].affichage();
          }
      }

  }

/**
 * Init du jeu
 *
 * @return {[type]} [description]
 */
GameManager.prototype.setup2 = function (bouton, data, scene)
{

  var self = this;
  //ferme toutes les animations, les retardateurs et les timers
  this.stop_animation();

  // tableau contenant les objects affichés à l'écran : (fond, bouton navigation, score)
  // structure [key, categorie String("image ou "texte)]
  this.arrayOfGameObjects = [];
  this.arrayOfGameObjects2 = [];
  this.arrayOfClickObjects = {};

  // mise à jour de la propriété nb_objet : nombre d'objets découverts pour la gestion des niveaux du lonono
  this.mon_Player.ressource.nb_objet = this.mon_Player.update_nb_objet(this.data_equilibrage.bareme_niveau.lonono, "nb_objet" , "lonono");
  // verification si le joueur n'a pas tout débloqué et donc n'a pas fini le jeu
  var ma_verif = this.mon_Player.verification_si_fini();
  // si le joueur a terminé le jeu
  if(ma_verif){
    this.setup10(bouton, data, scene);

  // si le joueur n'a pas terminé le jeu
  }else{

  console.log("affichage nombre objets découverts "+this.mon_Player.ressource.nb_objet);
  this.monCanvas.clearRect(0, 0, window.innerWidth, window.innerHeight);
  this.monCanvas.beginPath();
  this.map = new Map(this.monCanvas, self, this.data_interface.carte);
  console.log("mes_niveaux "+this.mon_Player);
  this.niveau = this.mon_Player.niveau_init(this.arrayOfGameObjects);

  /**
  affichage des boutons de changement de niveaux
  */
  this.bouton_niveau = new BoutonNiveau(this.monCanvas, self, this.data_interface.bouton_niveau.elements, this.data_equilibrage.bareme_niveau, this.map, this.mon_Player,this.data_interface.bouton_niveau.decalage_x,this.data_interface.bouton_niveau.decalage_y);
  this.affichage_map();
  this.click_canvas();
  this.monCanvas.closePath();

  this.monCanvas_click.clearRect(0, 0, window.innerWidth, window.innerHeight);
  this.monCanvas_click.beginPath();

  var object_fusionne = {};
  $.extend( object_fusionne, this.data_interface.carte.elements);
  $.extend( object_fusionne, this.bouton_niveau.monObject);
console.log("carte object_fusionne "+JSON.stringify(this.bouton_niveau.monObject));
  // mise en place des zones à cliquer
  this.canvas_hit = new Gameplay(this.monCanvas_click, this, object_fusionne, "map");
  // affichage des zones à cliquer
  this.affichage_click_zone();
  this.monCanvas_click.closePath();

    if(!this.mon_Interval){
      this.mon_Interval = setInterval( function() {
        self.map.bouge_meme();
        self.affichage_map();}, 3000);
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
    this.monCanvas.clearRect(0, 0, window.innerWidth, window.innerHeight);

      for (var i in this.arrayOfGameObjects) {
          if(this.arrayOfGameObjects[i][1]=="text"){
            this.arrayOfGameObjects[i][2].setup((this.arrayOfGameObjects[i][2].text=="" ? this.mon_Player[this.arrayOfGameObjects[i][2].valeur_a_afficher] : this.arrayOfGameObjects[i][2].text));
          }else if(this.arrayOfGameObjects[i][1]=="image"){
            this.arrayOfGameObjects[i][2][this.arrayOfGameObjects[i][2].ombre](this.monCanvas);
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
/**
      console.log("affichage position curseur");
      this.monCanvas.fillStyle = "orange";
      this.monCanvas.lineWidth=2;
      this.monCanvas.rect(this.pos_x-1, 0, 2,  window.innerHeight);
      this.monCanvas.stroke();
      this.monCanvas.rect(0, this.pos_y-1, window.innerWidth,  2);
      this.monCanvas.stroke();
      this.monCanvas.arc(this.pos_x,this.pos_y,10,0,2*Math.PI, false);
      this.monCanvas.stroke();

*/
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
            self[resultat[1]](resultat[0], resultat[2], resultat[3]);
          }

        });

     }
 /**
  * comportement lors d'un click sur le lonono
    lancement d'une transition
  *
  */
  GameManager.prototype.setup3 = function (key, data, scene)
   {
     console.log("lonono");
     self = this;
     //ferme toutes les animations, les retardateurs et les timers
     this.stop_animation();
     $("#monCanvas").addClass("niveau_de_gris mon_fadein");
     $("#monCanvas").one('webkitAnimationEnd oanimationend msAnimationEnd animationend', function(e) {
          $("#monCanvas").removeClass("niveau_de_gris mon_fadein");
          self.lonono(key, data, scene);

     });
   }
  /**
  * Affichage village
  *
  * @return {[type]} [description]
    @todo enlever les fonctions fadein en js qui sont commentées
  */
  GameManager.prototype.setup4 = function (key, data, scene)
   {
     console.log("village");
     self = this;
     //ferme toutes les animations, les retardateurs et les timers
     this.stop_animation();
     $("#monCanvas").addClass("niveau_de_gris mon_fadein");
     $("#monCanvas").one('webkitAnimationEnd oanimationend msAnimationEnd animationend', function(e) {
          $("#monCanvas").removeClass("niveau_de_gris mon_fadein");
          self.contructor_village(key, data);

     });
//     this.monCanvas.putImageData(grey_scale(this), 0, 0);
//     this.fadein(20);
   }

   /**
   * comportement lors de click sur le lac
   *
   @param key : String nom de la propriété de l'object this.arrayOfGameObjects3 (commençant par g pour la colonne de gauche, droite, et _ dans le cas d'une ressource déjà utilisée)
   @param data : propriété du object-bouton cliqué
   @param scene : frame dans lequel le bouton est cliqué
   */
   GameManager.prototype.setup5 = function (key, data, scene)
    {
      console.log("setup5 --> la lac");
      self = this;
      //ferme toutes les animations, les retardateurs et les timers
      this.stop_animation();
      $("#monCanvas").addClass("niveau_de_gris mon_fadein");
      $("#monCanvas").one('webkitAnimationEnd oanimationend msAnimationEnd animationend', function(e) {
           $("#monCanvas").removeClass("niveau_de_gris mon_fadein");
           self.lac(key, data, scene);

      });
    }
    /**
    * comportement lors de click sur la foret
    *
    @param key : String nom de la propriété de l'object this.arrayOfGameObjects3 (commençant par g pour la colonne de gauche, droite, et _ dans le cas d'une ressource déjà utilisée)
    @param data : propriété du object-bouton cliqué
    @param scene : frame dans lequel le bouton est cliqué
    */
    GameManager.prototype.setup6 = function (key, data, scene)
     {
       console.log("foret");
       self = this;
       //ferme toutes les animations, les retardateurs et les timers
       this.stop_animation();
       $("#monCanvas").addClass("niveau_de_gris mon_fadein");
       $("#monCanvas").one('webkitAnimationEnd oanimationend msAnimationEnd animationend', function(e) {
            $("#monCanvas").removeClass("niveau_de_gris mon_fadein");
            self.foret(key, data, scene);

       });
     }
     /**
     * fonction setup7
     comportement lors click sur le jardin
     fondu de l'image avant de faire apparaitre la roue de la chance
     *
     @param key : String nom de la propriété de l'object this.arrayOfGameObjects3 (commençant par g pour la colonne de gauche, droite, et _ dans le cas d'une ressource déjà utilisée)
     @param data : propriété du object-bouton cliqué
     @param scene : frame dans lequel le bouton est cliqué

     */
     GameManager.prototype.setup7 = function (key, data, scene)
      {
        console.log("jardin");
        self = this;
        //ferme toutes les animations, les retardateurs et les timers
        this.stop_animation();
        $("#monCanvas").addClass("niveau_de_gris mon_fadein");
        $("#monCanvas").one('webkitAnimationEnd oanimationend msAnimationEnd animationend', function(e) {
             $("#monCanvas").removeClass("niveau_de_gris mon_fadein");
             self.jardin(key, data, scene);

        });
      }
  /**
  prototype setup8
  comportement lors d'un click sur la grand-mère

  @param key : String nom de la propriété de l'object this.arrayOfGameObjects3 (commençant par g pour la colonne de gauche, droite, et _ dans le cas d'une ressource déjà utilisée)
  @param data : propriété du object-bouton cliqué
  @param scene : frame dans lequel le bouton est cliqué

  */
  GameManager.prototype.setup8 = function (key, data, scene)
   {
     console.log("Mémé");
     self = this;
     //ferme toutes les animations, les retardateurs et les timers
     this.stop_animation();
     $("#monCanvas").addClass("niveau_de_gris mon_fadein");
     $("#monCanvas").one('webkitAnimationEnd oanimationend msAnimationEnd animationend', function(e) {
          $("#monCanvas").removeClass("niveau_de_gris mon_fadein");
          self.meme(key, data, scene);

     });
   }
   /**
   prototype setup9
   comportement lors d'un click sur la synthèse des niveaux

   @param key : String nom de la propriété de l'object this.arrayOfGameObjects3 (commençant par g pour la colonne de gauche, droite, et _ dans le cas d'une ressource déjà utilisée)
   @param data : propriété du object-bouton cliqué
   @param scene : frame dans lequel le bouton est cliqué

   */
   GameManager.prototype.setup9 = function (key, data, scene)
    {
      console.log("Synthèse des niveaux");
      self = this;
      //ferme toutes les animations, les retardateurs et les timers
      this.stop_animation();
      $("#monCanvas").addClass("niveau_de_gris mon_fadein");
      $("#monCanvas").one('webkitAnimationEnd oanimationend msAnimationEnd animationend', function(e) {
           $("#monCanvas").removeClass("niveau_de_gris mon_fadein");
           self.synthese(key, data, scene);

      });
    }
    /**
    prototype setup10
    comportement lorsque le joueur a terminé le jeu

    @param key : String nom de la propriété de l'object this.arrayOfGameObjects3 (commençant par g pour la colonne de gauche, droite, et _ dans le cas d'une ressource déjà utilisée)
    @param data : propriété du object-bouton cliqué
    @param scene : frame dans lequel le bouton est cliqué

    */
    GameManager.prototype.setup10 = function (key, data, scene)
     {
       console.log("jeu terminé");
       self = this;
       //ferme toutes les animations, les retardateurs et les timers
       this.stop_animation();
       $("#monCanvas").addClass("niveau_de_gris mon_fadein");
       $("#monCanvas").one('webkitAnimationEnd oanimationend msAnimationEnd animationend', function(e) {
            $("#monCanvas").removeClass("niveau_de_gris mon_fadein");
            self.victoire(key, data, scene);

       });
     }
     /**
     prototype setup11
     comportement lorsque le joueur a terminé le jeu

     @param key : String nom de la propriété de l'object this.arrayOfGameObjects3 (commençant par g pour la colonne de gauche, droite, et _ dans le cas d'une ressource déjà utilisée)
     @param data : propriété du object-bouton cliqué
     @param scene : frame dans lequel le bouton est cliqué

     */
     GameManager.prototype.setup11 = function (key, data, scene)
      {
        console.log("sauvegarde en cours");
        self = this;
        try{
        localStorage.removeItem("niveau");
        localStorage.removeItem("ressource");
        localStorage.removeItem("plat");
        localStorage.setItem("niveau",JSON.stringify(this.mon_Player.niveau));
        localStorage.setItem("ressource",JSON.stringify(this.mon_Player.ressource));
        localStorage.setItem("plat",JSON.stringify(this.mon_Player.plat));
        //ferme toutes les animations, les retardateurs et les timers

        this.popup("setup2", "", "", "sauvegarde", "reussie");
        }catch (exception) {
          this.stop_animation();
          this.popup("setup2", "", "", "sauvegarde", "nonsauvegarde");
        }
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
  GameManager.prototype.contructor_village = function(key, data){
    var self = this;
    //ferme toutes les animations, les retardateurs et les timers
    this.stop_animation();
    this.arrayOfGameObjects = [];
    this.arrayOfGameObjects2 = [];
    this.arrayOfClickObjects = {};

    this.monCanvas.clearRect(0, 0, window.innerWidth, window.innerHeight);
    this.monCanvas.beginPath();
    this.village = new Mon_Village(this.monCanvas, self, this.data_equilibrage.plats, this.data_interface.village, this.data_equilibrage.ressource);
    this.niveau = this.mon_Player.niveau_init(this.arrayOfGameObjects);
    this.affichage_village(key, data);
    this.click_canvas();
    this.monCanvas.closePath();

    this.monCanvas_click.clearRect(0, 0, window.innerWidth, window.innerHeight);
    this.monCanvas_click.beginPath();
    var object_fusionne = {};
    $.extend( object_fusionne, this.data_equilibrage.plats);
    $.extend( object_fusionne, this.data_equilibrage.ressource);
    object_fusionne["retour"]= this.data_interface.village.elements.retour;

    console.log("object_fusionne2 "+JSON.stringify(object_fusionne));
    // mise en place des zones à cliquer
    this.canvas_hit = new Gameplay(this.monCanvas_click, this, object_fusionne, "village");
    // affichage des zones à cliquer
    this.affichage_click_zone();
    this.monCanvas_click.closePath();
      if(!this.mon_Interval){
          this.mon_Interval = setInterval( function() {
            self.monCanvas.clearRect(0, 0, window.innerWidth, window.innerHeight);
            self.affichage_village(key, data);}, 3000);
      }
  }
  GameManager.prototype.affichage_village = function(key, data)
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

            this.village[this.arrayOfGameObjects[i][0]][this.village[this.arrayOfGameObjects[i][0]].ombre](this.data_interface.village.alpha_, key);

          }
      }

  }
  /**
  prototype vente
  comportement quand click sur une icone du lonono ou du marché

  @param key : String nom de la propriété de l'object this.arrayOfGameObjects3 (commençant par g pour la colonne de gauche, droite, et _ dans le cas d'une ressource déjà utilisée)
  @param data : propriété du object-bouton cliqué
  @param scene : frame dans lequel le bouton est cliqué
  */
  GameManager.prototype.vente = function(key, data, scene)
  {
    if(scene == "lonono"){
        console.log("fabrication plats ou synthèse nouvelles ressources");
        console.log("scene "+scene);
        console.log("clé "+key);
        console.log("data "+JSON.stringify(data));
        // recherche du nombre de fois qu'une ressource est utilisée dans le but de vérifier que le joueur en a assez
        var mon_nombre = 0;
        for(j=0; j<this.array_mix_ressource.length; j++){
          if(data.nom2 == this.array_mix_ressource[j]){
            mon_nombre++;
          }
        }
        for(j=0; j<this.array_mix_plat.length; j++){
          if(data.nom2 == this.array_mix_plat[j]){
            mon_nombre++;
          }
        }
        console.log("mon_nombre"+mon_nombre);
        // si dans la section lonono, on a cliqué sur une ressource pour créer un nouvelle ressource
          if(data.action=="ressource" && this.mon_Player[data.cat][data.nom2]>mon_nombre){
              var var_tempo = mix_ressources(this.array_mix_ressource, this.array_mix_ressource2, this.mon_Player.niveau.lonono, data.nom2, data.cat, this.array_mix_ressource3, String("g"+key));
              this.array_mix_ressource = var_tempo[0];
              this.array_mix_ressource2 = var_tempo[1];
              this.array_mix_ressource3 = var_tempo[2];
              this.array_mix_plat = [];
              this.array_mix_plat2 = [];
              this.array_mix_plat3 = {};
              this.mon_Player.lonono_mix_plat = "";
              this.mon_Player.lonono_mix_ressource = affichage_ressource(this.array_mix_ressource, this.array_mix_ressource2, this.data_equilibrage);
              console.log("this.array_mix_plat3 "+JSON.stringify(this.array_mix_ressource3));


          // si dans la section lonono, on a cliqué sur une ressource pour créer un plat
        }else if(data.action=="plat" && this.mon_Player[data.cat][data.nom2]>mon_nombre){
                var var_tempo = mix_ressources(this.array_mix_plat, this.array_mix_plat2, this.mon_Player.niveau.lonono, data.nom2, data.cat, this.array_mix_plat3, String("d"+data.nom2));
                this.array_mix_plat = var_tempo[0];
                this.array_mix_plat2 = var_tempo[1];
                this.array_mix_plat3 = var_tempo[2];
                this.array_mix_ressource = [];
                this.array_mix_ressource2 = [];
                this.array_mix_ressource3 = {};
                this.mon_Player.lonono_mix_ressource = "";
                this.mon_Player.lonono_mix_plat = affichage_ressource(this.array_mix_plat, this.array_mix_plat2, this.data_equilibrage);
                console.log("this.array_mix_plat3 "+JSON.stringify(this.array_mix_plat3));
        }
        this.lonono(scene, data, scene);
      }else if(scene == "village"){
        console.log("debut de la vente");
        if(this.mon_Player.echange(key, data.or, "or", data)){
          if(data.or>0){
              this.popup("contructor_village", this.data_equilibrage.plats[key].nom, "", "village", "plat");
          }else{
              this.popup("contructor_village", this.data_equilibrage.ressource[key].nom, "", "village", "achat");
          }

        }else{
          this.contructor_village(key, data, scene);

        }
    }
  }
  /**
prototype recette_zero
remet à 0 les différents sélections du joueur dans le jeu du lonono
@param key : String nom de la propriété de l'object this.arrayOfGameObjects3 (commençant par g pour la colonne de gauche, droite, et _ dans le cas d'une ressource déjà utilisée)
@param data : propriété du object-bouton cliqué
@param scene : frame dans lequel le bouton est cliqué

  */
  GameManager.prototype.recette_zero = function(key, data, scene){

    this.array_mix_plat = [];
    this.array_mix_plat2 = [];
    this.array_mix_plat3 = {};
    this.array_mix_ressource = [];
    this.array_mix_ressource2 = [];
    this.array_mix_ressource3 = {};
    this.mon_Player.lonono_mix_ressource = "";
    this.mon_Player.lonono_mix_plat = "";
    this.lonono(scene, data, scene);
  }
  /**
  prototype retour_lonono
  bouton de retour du jeu du lonono vers la map
  @param key : String nom de la propriété de l'object this.arrayOfGameObjects3 (commençant par g pour la colonne de gauche, droite, et _ dans le cas d'une ressource déjà utilisée)
  @param data : propriété du object-bouton cliqué
  @param scene : frame dans lequel le bouton est cliqué
  */
  GameManager.prototype.retour_lonono = function(key, data, scene){

    this.array_mix_plat = [];
    this.array_mix_plat2 = [];
    this.array_mix_plat3 = {};
    this.array_mix_ressource = [];
    this.array_mix_ressource2 = [];
    this.array_mix_ressource3 = {};
    this.mon_Player.lonono_mix_ressource = "";
    this.mon_Player.lonono_mix_plat = "";
    this.setup2(scene, data, scene);
  }
  /**
  prototype popup
  contruction des objets du popup

  @param target canevas où doit s'afficher le popup
  @param var1 string : variable complémentaire à afficher en fin de texte
  @param var2 string variable complémentaire à afficher en fin de texte
  @param frame string scène où est affiché le popup : va servir d'attribut à rechercher le texte dans le fichier data_texte
  @param element string attribu de frame dans le fichier texte_data

  */
  GameManager.prototype.popup = function(target, var1, var2, frame, element){
    this.stop_animation();
    var self = this;
    console.log("popup ");

    this.arrayOfGameObjects = [];
    this.mon_popup = new Popup(this.monCanvas, self, this.data_equilibrage.plats, this.data_interface.popup);
    this.niveau = this.mon_Player.niveau_init(this.arrayOfGameObjects);
    this.affichage_popup(var1, var2, frame, element, target);


  }
  /**
  prototype d'affichage du popup

  @param var1 string : variable complémentaire à afficher en fin de texte
  @param var2 string variable complémentaire à afficher en fin de texte
  @param frame string scène où est affiché le popup : va servir d'attribut à rechercher le texte dans le fichier data_texte
  @param element string attribu de frame dans le fichier texte_data
  @param target canevas où doit s'afficher le popup

  */
  GameManager.prototype.affichage_popup = function(var1, var2, frame, element, target){
    console.log("fonction affichage_popup");
    self = this;
    for (var i in this.arrayOfGameObjects) {
        if(this.arrayOfGameObjects[i][1]=="text"){
            this.arrayOfGameObjects[i][2].setup(this.data_texte[frame][element]+": "+var1+" "+var2);
        }else if(this.arrayOfGameObjects[i][1]=="image"){
          console.log("affichage_popup "+this.arrayOfGameObjects[i][0]);
            this.arrayOfGameObjects[i][2].draw(this.monCanvas);
        }
    }
    $("#monCanvas").addClass("mon_fadein2");
    $("#monCanvas").one('webkitAnimationEnd oanimationend msAnimationEnd animationend', function(e) {
         $("#monCanvas").removeClass("mon_fadein2");
         self[target](frame,"", frame);

    });

  }
  GameManager.prototype.niveau_up = function(key, data, scene){
      console.log("click sur le changement de niveau "+key+" data "+JSON.stringify(data));
      self = this;
      console.log("click sur le changement de niveau "+this.bouton_niveau+" "+JSON.stringify(this.bouton_niveau.echange_ressource[data.key])+" "+data.key);
      this.mon_Player.niveau[data.key] = this.mon_Player.niveau[data.key]+1;
      this.bouton_niveau.echange_ressource[data.key].forEach(function(e){
        console.log("valeur ressource avant "+self.mon_Player.ressource[e[0]]);
        console.log("valeur ressource e[1] "+e[1]);
        console.log("valeur ressource e[2] "+e[2]);
          self.mon_Player.ressource[e[0]] = e[1] - e[2];
        console.log("valeur ressource avant "+self.mon_Player.ressource[e[0]]);
      });
      self.popup("setup2", data.key, this.mon_Player.niveau[data.key], "map", "niveau");
  }
  /**
  classe de gestion du lonono


  */
  GameManager.prototype.lonono = function(key, data, scene){
    //ferme toutes les animations, les retardateurs et les timers
    this.stop_animation();

      var self = this;
      this.arrayOfGameObjects = [];
      this.arrayOfGameObjects3 = {};
      this.arrayOfGameObjects2 = [];
      this.arrayOfClickObjects = {};




      this.monCanvas.clearRect(0, 0, window.innerWidth, window.innerHeight);
      this.monCanvas.beginPath();
      this.mon_lonono = new Mon_lonono(this.monCanvas, self, this.data_equilibrage.plats, this.data_interface.lonono, this.data_equilibrage.ressource, this.data_equilibrage.lonono_algo, this.data_equilibrage.lonono_algo2);
      this.niveau = this.mon_Player.niveau_init(this.arrayOfGameObjects);
      this.affichage_lonono(key, data, scene);
      this.click_canvas();
      this.monCanvas.closePath();

      this.monCanvas_click.clearRect(0, 0, window.innerWidth, window.innerHeight);
      this.monCanvas_click.beginPath();
      var object_fusionne = {};
//      $.extend( object_fusionne, this.data_equilibrage.plats);
//      $.extend( object_fusionne, this.data_equilibrage.ressource);
//      object_fusionne["retour"]= this.data_interface.village.elements.retour;

      this.arrayOfGameObjects3["retour_lonono"]= this.data_interface.lonono.elements.retour_lonono;
      this.arrayOfGameObjects3["validation_recette"]= this.data_interface.lonono.elements.validation_recette;
      this.arrayOfGameObjects3["recette_zero"]= this.data_interface.lonono.elements.recette_zero;
      console.log("object_fusionne2 "+JSON.stringify(object_fusionne));
      // mise en place des zones à cliquer
      this.canvas_hit = new Gameplay(this.monCanvas_click, this, this.arrayOfGameObjects3, "lonono");
      // affichage des zones à cliquer
      this.affichage_click_zone();
      this.monCanvas_click.closePath();
        if(!this.mon_Interval){
          console.log("debut fonction setInterval lonono ");

          this.mon_Interval = setInterval( function() {
              console.log("setInterval lonono "+key);
              self.mon_Player.niveau.lonono_icone = 1;
              self.niveau = self.mon_Player.niveau_init(self.arrayOfGameObjects);
              self.affichage_lonono(key, data, scene);
              }, 3000);
        }

  }
  GameManager.prototype.affichage_lonono = function(key, data, scene)
  {
    console.log("affichage_lonono");
    this.monCanvas.clearRect(0, 0, window.innerWidth, window.innerHeight);


      for (var i in this.arrayOfGameObjects) {
          if(this.arrayOfGameObjects[i][1]=="text"){
            console.log("valeur a afficher "+this.mon_lonono[this.arrayOfGameObjects[i][2]].valeur_a_afficher);
            console.log("valeur a afficher2 "+this.mon_Player[this.mon_lonono[this.arrayOfGameObjects[i][2]].valeur_a_afficher]);
            console.log("valeur a afficher3 "+(this.mon_lonono[this.arrayOfGameObjects[i][2]].text=="" ? this.mon_Player[this.mon_lonono[this.arrayOfGameObjects[i][2]].valeur_a_afficher] : this.mon_lonono[this.arrayOfGameObjects[i][2]].text));
          // affichage du Texte
          // si texte defini par défaut dans data_interface est egal à "" alors affichage de la valeur stockée dans this.mon_Player.(...)
            this.mon_lonono[this.arrayOfGameObjects[i][2]].setup((this.mon_lonono[this.arrayOfGameObjects[i][2]].text=="" ? this.mon_Player[this.mon_lonono[this.arrayOfGameObjects[i][2]].valeur_a_afficher] : this.mon_lonono[this.arrayOfGameObjects[i][2]].text));
          }else if(this.arrayOfGameObjects[i][1]=="image"){
            console.log("valeur a afficher4 "+this.arrayOfGameObjects[i][2]);
            console.log("valeur a afficher41 "+this.mon_lonono[this.arrayOfGameObjects[i][2]]._x);
            this.mon_lonono[this.arrayOfGameObjects[i][2]][this.mon_lonono[this.arrayOfGameObjects[i][2]].ombre](this.data_interface.lonono.alpha_, key);

                if(this.array_mix_plat3[this.arrayOfGameObjects[i][2]]){
                  console.log("astro t nul");
                  this.mon_lonono.icone_selectionne(this.arrayOfGameObjects[i][2], this.mon_lonono[this.arrayOfGameObjects[i][2]], this.array_mix_plat3[this.arrayOfGameObjects[i][2]]);
                }else if(this.array_mix_ressource3[this.arrayOfGameObjects[i][2]]){
                  this.mon_lonono.icone_selectionne(this.arrayOfGameObjects[i][2], this.mon_lonono[this.arrayOfGameObjects[i][2]], this.array_mix_ressource3[this.arrayOfGameObjects[i][2]]);
                }

          }
      }

  }
  /**
  prototype valid_lonono
  permet de vérifier si les sélections du joueur dans le jeu du lonono lui permettent d'obtenir un ressource

  @param key : String nom de la propriété de l'object this.arrayOfGameObjects3 (commençant par g pour la colonne de gauche, droite, et _ dans le cas d'une ressource déjà utilisée)
  @param data : propriété du object-bouton cliqué
  @param scene : frame dans lequel le bouton est cliqué
  */
  GameManager.prototype.valid_lonono = function(key, data, scene){
    console.log("valid_lonono");
    var mix_ressources = this.array_mix_ressource;
    var mix_plat = this.array_mix_plat;
    var cat_ressource = this.array_mix_ressource2;
    var cat_plat = this.array_mix_plat2;
    var poub = this.data_equilibrage.ressource_poubelle;
            // si pas de ressource de plat selectionné
            if(mix_ressources.length==0 && mix_plat.length==0){
              this.popup("lonono", "", "", "lonono", "pas_de_selection");
              // si des ressources sont sélectionnées
            }else if(mix_ressources.length!=0){
                // mix_reussite permet de savoir si un objet est gagné par le joueur retourne un tableau de la forme : [clee, nombre]
                var mon_affichage = mix_reussite(mix_ressources, this.data_equilibrage.lonono_algo, this.mon_Player.niveau.lonono);
                // si echec
                if(mon_affichage.length==0){
                    this.mon_Player.echange2(mix_ressources, cat_ressource, poub, 1, "ressource", this.mon_lonono);
                    var a_afficher = "echec_recette";
                    var a_afficher2 = "";
                    var a_afficher3 = affichage_ressource(mix_ressources, cat_ressource, this.data_equilibrage);
                    // on affiche une icone de lonono pas content
                    this.mon_Player.niveau["lonono_icone"] = 3;
                    this.mon_Player.objet_debloque[poub] = this.mon_Player.ressource[poub];
                // si réussite
                }else{
                    this.mon_Player.echange2(mix_ressources, cat_ressource, mon_affichage[0], mon_affichage[1], "ressource", this.mon_lonono);
                    var a_afficher = "reussite";
                    var a_afficher2 = mon_affichage[1];
                    // merci NathalieOria !!
                    var a_afficher3 = (a_afficher2>1 ? String(this.data_equilibrage.ressource[mon_affichage[0]].nom+"s") : this.data_equilibrage.ressource[mon_affichage[0]].nom);
                    // on affiche une icode de lonono content
                    this.mon_Player.niveau["lonono_icone"] = 2;
                    this.mon_Player.objet_debloque[this.data_equilibrage.ressource[mon_affichage[0]].nom] = this.mon_Player.ressource[this.data_equilibrage.ressource[mon_affichage[0]].nom];

                }
                this.mon_Player.lonono_mix_ressource = "";
                // initialisation des variables
                // tableau représentant l'association des ressources ---> synthèse nouvelle ressource
                this.array_mix_ressource = [];
                // tableau représentant la catégorie des ressources présentent dans array_mix_ressource
                this.array_mix_ressource2 = [];
                this.array_mix_ressource3 = {};
                this.popup("lonono", a_afficher2 , a_afficher3, "lonono", a_afficher);

            // si des ressources sont sélectionnées pour la création de plat
            }else if(mix_plat.length!=0){

            var mon_affichage = mix_reussite(this.array_mix_plat, this.data_equilibrage.lonono_algo2, this.mon_Player.niveau.lonono);
            console.log("mon_affichage "+mon_affichage);
            // si la recette n'est pas bonne
            if(mon_affichage.length==0){
                this.mon_Player.echange2(mix_plat, cat_plat, poub, 1, "ressource", this.mon_lonono);
                var a_afficher = "echec_recette";
                var a_afficher2 = "";
                var a_afficher3 = affichage_ressource(mix_plat, cat_plat, this.data_equilibrage);
                // on affiche une icone de lonono pas content
                this.mon_Player.niveau["lonono_icone"] = 3;
            }else{
                this.mon_Player.echange2(mix_plat, cat_plat, mon_affichage[0], mon_affichage[1], "plat", this.mon_lonono);
                var a_afficher = "reussite";
                var a_afficher2 = mon_affichage[1];
                // merci NathalieOria !!
                var a_afficher3 = (a_afficher2>1 ? String(this.data_equilibrage.plats[mon_affichage[0]].nom+"s") : this.data_equilibrage.plats[mon_affichage[0]].nom);
                // on affiche une icone de lonono content
                this.mon_Player.niveau["lonono_icone"] = 2;
            }
            this.mon_Player.lonono_mix_plat = "";
            // tableau représentant l'association des ressources --> synthèse plat
            this.array_mix_plat = [];
            // tableau représentant  la catégorie des ressources présentent dans array_mix_plat
            this.array_mix_plat2 = [];
            this.array_mix_plat3 = {};
            this.popup("lonono", a_afficher2 , a_afficher3, "lonono", a_afficher);
          }
  }
  GameManager.prototype.jardin = function(key, data, scene){
    var self = this;
    //ferme toutes les animations, les retardateurs et les timers
    this.stop_animation();
      // tableau contenant les objects affichés à l'écran : (fond, bouton navigation, score)
      // structure [key, categorie String("image ou "texte)]
      this.arrayOfGameObjects = [];
      this.arrayOfGameObjects2 = [];
      this.arrayOfClickObjects = {};

    this.monCanvas.clearRect(0, 0, window.innerWidth, window.innerHeight);
    this.monCanvas.beginPath();
    this.mon_jardin = new Jardin(this.monCanvas, self, this.data_interface.jardin);

    this.niveau = this.mon_Player.niveau_init(this.arrayOfGameObjects);

    this.affichage_jardin(key, data, scene);
    this.click_canvas();
    this.monCanvas.closePath();

    this.ma_roue = new Roue(this.monCanvas, self, this.data_interface.couleur_roue, this.data_equilibrage.ressource, this.data_interface.jardin, this.data_image_chargee, this.data_equilibrage.jardin_algo);

    $("#monCanvas").click(function(e){
        $("#monCanvas").off('click');
        self.ma_roue.mon_timer()

    });

    this.monCanvas_click.clearRect(0, 0, window.innerWidth, window.innerHeight);
    this.monCanvas_click.beginPath();

    var object_fusionne = {};
    $.extend( object_fusionne, this.data_interface.jardin.elements);
    console.log("carte object_fusionne "+JSON.stringify(object_fusionne));
    // mise en place des zones à cliquer
    this.canvas_hit = new Gameplay(this.monCanvas_click, this, object_fusionne, "map");
    // affichage des zones à cliquer
    this.affichage_click_zone();
    this.monCanvas_click.closePath();
  }
  /**
  prototype affichage_jardin

  */
  GameManager.prototype.affichage_jardin = function(key, data, scene){
    console.log("affichage_jardin : affichage des icones");
    this.monCanvas.clearRect(0, 0, window.innerWidth, window.innerHeight);
      for (var i in this.arrayOfGameObjects) {
          if(this.arrayOfGameObjects[i][1]=="text"){
            this.arrayOfGameObjects[i][2].setup((this.arrayOfGameObjects[i][2].text=="" ? this.mon_Player[this.arrayOfGameObjects[i][2].valeur_a_afficher] : this.arrayOfGameObjects[i][2].text));
          }else if(this.arrayOfGameObjects[i][1]=="image"){
            this.arrayOfGameObjects[i][2][this.arrayOfGameObjects[i][2].ombre](this.monCanvas);
          }
      }
  }
  /**


  */
  GameManager.prototype.foret = function(key, data, scene){
    var self = this;
    //ferme toutes les animations, les retardateurs et les timers
    this.stop_animation();
      // tableau contenant les objects affichés à l'écran : (fond, bouton navigation, score)
      // structure [key, categorie String("image ou "texte)]
      this.arrayOfGameObjects = [];
      this.arrayOfGameObjects2 = [];
      this.arrayOfClickObjects = {};

    this.monCanvas.clearRect(0, 0, window.innerWidth, window.innerHeight);
    this.monCanvas.beginPath();
    this.ma_foret = new Foret(this.monCanvas, self, this.data_interface.foret);

    this.niveau = this.mon_Player.niveau_init(this.arrayOfGameObjects);

    this.affichage_foret(key, data, scene);
    this.click_canvas();
    this.monCanvas.closePath();

    this.mon_carrelage = new Carrelage(this.monCanvas, self, this.data_interface.couleur_carrelage, this.data_equilibrage.ressource, this.data_interface.foret, this.data_image_chargee, this.data_equilibrage.foret_algo);
    // la fonction refresh permet d'afficher les lignes représentant les groupes de cases de la même couleur_roue
    // ainsi que de synchroniser l'animation de chute des cases et le remplacement des cases disparues
    this.mon_carrelage.refresh();

    // fonction timer-like de js
    this.mon_carrelage.mon_timer = window.requestAnimationFrame(function(){self.mon_carrelage.fonction_timer();});
    $("#monCanvas").click(function(e){
    //    $("#monCanvas").off('click');
        self.mon_carrelage.click(self.pos_x, self.pos_y);

    });

    this.monCanvas_click.clearRect(0, 0, window.innerWidth, window.innerHeight);
    this.monCanvas_click.beginPath();

    var object_fusionne = {};
    $.extend( object_fusionne, this.data_interface.foret.elements);
    console.log("carte object_fusionne "+JSON.stringify(object_fusionne));
    // mise en place des zones à cliquer
    this.canvas_hit = new Gameplay(this.monCanvas_click, this, object_fusionne, "foret");
    // affichage des zones à cliquer
    this.affichage_click_zone();
    this.monCanvas_click.closePath();
  }
  /**
  prototype affichage_jardin

  */
  GameManager.prototype.affichage_foret = function(key, data, scene){
    console.log("affichage_jardin : affichage des icones");
    this.monCanvas.clearRect(0, 0, window.innerWidth, window.innerHeight);
      for (var i in this.arrayOfGameObjects) {
          if(this.arrayOfGameObjects[i][1]=="text"){
            this.arrayOfGameObjects[i][2].setup((this.arrayOfGameObjects[i][2].text=="" ? this.mon_Player[this.arrayOfGameObjects[i][2].valeur_a_afficher] : this.arrayOfGameObjects[i][2].text));
          }else if(this.arrayOfGameObjects[i][1]=="image"){
            this.arrayOfGameObjects[i][2][this.arrayOfGameObjects[i][2].ombre](this.monCanvas);
          }
      }
  }
  /**
  prototype du comportement du bouton retour dans la partie foret

  @param key String nom du bouton cliqué pour arriver là
  @param data Object Object et propriété du bouton cliqué
  @param scene String partie du jeu où se trouve le joueur avant d'arriver sur cette fonction
  */
  GameManager.prototype.foret_supr = function(key, data, scene){
    console.log("module de supression animation foret");
    this.stop_animation();
    this.setup2(key, data, scene);
  }
  /**
  prototype de suppression des animation de la foret

  */
  GameManager.prototype.stop_animation = function(){

    $("#monCanvas").off('click');
    if(this.mon_carrelage){
      cancelAnimationFrame(this.mon_carrelage.mon_timer);
    }
    if(this.mon_lac){
      cancelAnimationFrame(this.mon_lac.mon_timer);
    }
    if(this.mon_Interval){
        clearInterval(this.mon_Interval);
        this.mon_Interval = false;
    }
    if(this.mon_retardateur){
      clearTimeout(this.mon_retardateur);
      this.mon_retardateur = false;
    }
    delete this.mon_lac;
    delete this.canvas_hit;
    delete this.intro;
    delete this.map;
    delete this.village;
    delete this.mon_lonono;
    delete this.mon_jardin;
    delete this.ma_meme;
    delete this.ma_foret;
    delete this.mon_carrelage;
    delete this.ma_synthese;
  }
  /**
  Prototype lac
  @param key : String nom de la propriété de l'object this.arrayOfGameObjects3 (commençant par g pour la colonne de gauche, droite, et _ dans le cas d'une ressource déjà utilisée)
  @param data : propriété du object-bouton cliqué
  @param scene : frame dans lequel le bouton est cliqué

  */
  GameManager.prototype.lac = function(key, data, scene){
    var self = this;
    //ferme toutes les animations, les retardateurs et les timers
    this.stop_animation();
    // tableau contenant les objects affichés à l'écran : (fond, bouton navigation, score)
    // structure [key, categorie String("image ou "texte)]
      this.arrayOfGameObjects = [];
      this.arrayOfGameObjects2 = [];
      this.arrayOfClickObjects = {};

    this.monCanvas.clearRect(0, 0, window.innerWidth, window.innerHeight);
    this.monCanvas.beginPath();
    this.mon_lac = new Lac(this.monCanvas, self, this.data_interface.lac, key, data, scene, this.data_equilibrage.ressource, this.data_texte.lac, this.data_equilibrage.lac_algo[String(this.mon_Player.niveau.lac)]);

    this.niveau = this.mon_Player.niveau_init(this.arrayOfGameObjects);


    this.click_canvas();
    this.monCanvas.closePath();

    this.affichage_lac(key, data, scene);

    // fonction timer-like de js
    this.mon_lac.mon_timer = window.requestAnimationFrame(function(){self.mon_lac.fonction_timer();});



    $("#monCanvas").click(function(e){
      //  $("#monCanvas").off('click');
        self.mon_lac.click(self.pos_x, self.pos_y);
    });

    this.monCanvas_click.clearRect(0, 0, window.innerWidth, window.innerHeight);
    this.monCanvas_click.beginPath();

    var object_fusionne = {};
    $.extend( object_fusionne, this.data_interface.lac.elements);
    console.log("carte object_fusionne "+JSON.stringify(object_fusionne));
    // mise en place des zones à cliquer
    this.canvas_hit = new Gameplay(this.monCanvas_click, this, object_fusionne, "lac");
    // affichage des zones à cliquer
    this.affichage_click_zone();
    this.monCanvas_click.closePath();

  }
  /**
  Prototype affichage_lac

  @param key : String nom de la propriété de l'object this.arrayOfGameObjects3 (commençant par g pour la colonne de gauche, droite, et _ dans le cas d'une ressource déjà utilisée)
  @param data : propriété du object-bouton cliqué
  @param scene : frame dans lequel le bouton est cliqué

  */
  GameManager.prototype.affichage_lac = function(key, data, scene){
    console.log("affichage_lac : affichage des icones");
    this.monCanvas.clearRect(0, 0, window.innerWidth, window.innerHeight);
      for (var i in this.arrayOfGameObjects) {
          if(this.arrayOfGameObjects[i][1]=="text"){
            this.arrayOfGameObjects[i][2].setup((this.arrayOfGameObjects[i][2].text=="" ? this.mon_Player[this.arrayOfGameObjects[i][2].valeur_a_afficher] : this.arrayOfGameObjects[i][2].text));
          }else if(this.arrayOfGameObjects[i][1]=="image"){
            this.arrayOfGameObjects[i][2][this.arrayOfGameObjects[i][2].ombre](this.monCanvas);
          // icone = boutons du lac
          }else if(this.arrayOfGameObjects[i][1]=="icone"){
            this.mon_lac.affichage_bouton2(this.monCanvas, this.arrayOfGameObjects[i][2]);
          // image_chute = icone dont la chute est à représenter
          }else if(this.arrayOfGameObjects[i][1]=="image_chute"){
            this.mon_lac.affichage_image_chute(this.monCanvas, this.arrayOfGameObjects[i][2]);
          }
      }
  }
  /**
  Prototype Mémé
  @param key : String nom de la propriété de l'object this.arrayOfGameObjects3 (commençant par g pour la colonne de gauche, droite, et _ dans le cas d'une ressource déjà utilisée)
  @param data : propriété du object-bouton cliqué
  @param scene : frame dans lequel le bouton est cliqué

  */
  GameManager.prototype.meme = function(key, data, scene){
    var self = this;
    //ferme toutes les animations, les retardateurs et les timers
    this.stop_animation();
    // tableau contenant les objects affichés à l'écran : (fond, bouton navigation, score)
    // structure [key, categorie String("image ou "texte)]
      this.arrayOfGameObjects = [];
      this.arrayOfGameObjects2 = [];
      this.arrayOfClickObjects = {};

    this.monCanvas.clearRect(0, 0, window.innerWidth, window.innerHeight);
    this.monCanvas.beginPath();
    this.ma_meme = new Meme(this.monCanvas, self, this.data_interface.meme, key, data, scene, this.data_equilibrage.ressource, this.data_texte.meme, this.data_equilibrage.meme_algo[String(this.mon_Player.niveau.meme)]);

    this.niveau = this.mon_Player.niveau_init(this.arrayOfGameObjects);


    this.click_canvas();
    this.monCanvas.closePath();

    this.affichage_meme(key, data, scene);

    this.ma_meme.demarrage_jeu(0);
    this.mon_retardateur = setTimeout( function(){
      self.ma_meme.cas = 1;
      self.ma_meme.demarrage_jeu(1)
    }, this.data_equilibrage.meme_algo[String(this.mon_Player.niveau.meme)].temps_affichage);

    $("#monCanvas").click(function(e){
      //  $("#monCanvas").off('click');
        self.ma_meme.click(self.pos_x, self.pos_y);
    });

    this.monCanvas_click.clearRect(0, 0, window.innerWidth, window.innerHeight);
    this.monCanvas_click.beginPath();

    var object_fusionne = {};
    $.extend( object_fusionne, this.data_interface.meme.elements);
    console.log("carte object_fusionne "+JSON.stringify(object_fusionne));
    // mise en place des zones à cliquer
    this.canvas_hit = new Gameplay(this.monCanvas_click, this, object_fusionne, "lac");
    // affichage des zones à cliquer
    this.affichage_click_zone();
    this.monCanvas_click.closePath();

  }
  /**
  Prototype affichage_meme

  @param key : String nom de la propriété de l'object this.arrayOfGameObjects3 (commençant par g pour la colonne de gauche, droite, et _ dans le cas d'une ressource déjà utilisée)
  @param data : propriété du object-bouton cliqué
  @param scene : frame dans lequel le bouton est cliqué

  */
  GameManager.prototype.affichage_meme = function(key, data, scene){
    console.log("affichage_lac : affichage des icones");
    this.monCanvas.clearRect(0, 0, window.innerWidth, window.innerHeight);
      for (var i in this.arrayOfGameObjects) {
          if(this.arrayOfGameObjects[i][1]=="text"){
            this.arrayOfGameObjects[i][2].setup((this.arrayOfGameObjects[i][2].text=="" ? this.mon_Player[this.arrayOfGameObjects[i][2].valeur_a_afficher] : this.arrayOfGameObjects[i][2].text));
          }else if(this.arrayOfGameObjects[i][1]=="image"){
            this.arrayOfGameObjects[i][2][this.arrayOfGameObjects[i][2].ombre](this.monCanvas);
          // icone = boutons du lac
          }
      }
  }
  /**

  */
  GameManager.prototype.valid_meme = function(key, data, scene){
    console.log("valid_meme");

    var reussite = true;
    var ma_ressource;
    var couleur_case;
    var vrai_valeur;
    var nb_erreur = 0;

    for(i=0; i<this.ma_meme.algo.nb_colonne ; i++){

      for(j=0; j<this.ma_meme.algo.nb_colonne ; j++){

        ma_ressource = this.ma_meme.melange_ressource[(i*this.ma_meme.algo.nb_colonne)+j][this.ma_meme.tableau_click[i][j]];
        couleur_case = this.ma_meme.color_array[(i*this.ma_meme.algo.nb_colonne)+j];
        vrai_valeur = this.ma_meme.table_couleur_image[couleur_case];
        if(vrai_valeur != ma_ressource){
          reussite = false;
          nb_erreur++;
        }
      }

    }
    //ferme toutes les animations, les retardateurs et les timers
    this.stop_animation();
    console.log("nombre d erreur "+nb_erreur);
    if(reussite){
      var mon_tableau_recette = fonction_tableau_recette(this.data_equilibrage.lonono_algo["3"], this.data_equilibrage.lonono_algo2["3"],this.data_texte.meme, this.data_equilibrage.ressource, this.data_equilibrage.plats);
      console.log("28_12_18 3 "+JSON.stringify(mon_tableau_recette));
      var ma_recette = mon_tableau_recette[Math.floor(Math.random()*mon_tableau_recette.length)];
      this.popup("setup2", ma_recette, "", "meme", "reussite");
    }
    else {
      var mon_texte = String(nb_erreur+" "+pluriel(nb_erreur, this.data_texte.meme.erreur));
      this.popup("setup2", mon_texte, "", "meme", "echec");
    }

  }
  /**

  */
  GameManager.prototype.synthese = function(key, data, scene){
    var self = this;
    //ferme toutes les animations, les retardateurs et les timers
    this.stop_animation();
    // tableau contenant les objects affichés à l'écran : (fond, bouton navigation, score)
    // structure [key, categorie String("image ou "texte)]
      this.arrayOfGameObjects = [];
      this.arrayOfGameObjects2 = [];
      this.arrayOfClickObjects = {};

    this.monCanvas.clearRect(0, 0, window.innerWidth, window.innerHeight);
    this.monCanvas.beginPath();
    this.ma_synthese = new Synthese(this.monCanvas, self, this.data_interface.synthese, key, data, scene, this.data_texte.synthese, this.data_equilibrage.ressource, this.data_equilibrage.plats);

    this.niveau = this.mon_Player.niveau_init(this.arrayOfGameObjects);

    this.synthese_affichage(key, data, scene);
    this.ma_synthese.affichage_niveaux(this.data_image_chargee, this.data_interface.carte.elements, this.mon_Player.objet_debloque, this.mon_Player.plat_trouve);

    this.click_canvas();
    this.monCanvas.closePath();

    $("#monCanvas").click(function(e){
      //  $("#monCanvas").off('click');
      //  self.ma_meme.click(self.pos_x, self.pos_y);
    });

    this.monCanvas_click.clearRect(0, 0, window.innerWidth, window.innerHeight);
    this.monCanvas_click.beginPath();

    var object_fusionne = {};
    $.extend( object_fusionne, this.data_interface.synthese.elements);
    console.log("carte object_fusionne "+JSON.stringify(object_fusionne));
    // mise en place des zones à cliquer
    this.canvas_hit = new Gameplay(this.monCanvas_click, this, object_fusionne, "synthese");
    // affichage des zones à cliquer
    this.affichage_click_zone();
    this.monCanvas_click.closePath();

  }
  /**
  Prototype synthese_affichage

  @param key : String nom de la propriété de l'object this.arrayOfGameObjects3 (commençant par g pour la colonne de gauche, droite, et _ dans le cas d'une ressource déjà utilisée)
  @param data : propriété du object-bouton cliqué
  @param scene : frame dans lequel le bouton est cliqué

  */
  GameManager.prototype.synthese_affichage = function(key, data, scene){
    console.log("synthese_affichage : affichage des icones");
    this.monCanvas.clearRect(0, 0, window.innerWidth, window.innerHeight);
      for (var i in this.arrayOfGameObjects) {
          if(this.arrayOfGameObjects[i][1]=="text"){
            this.arrayOfGameObjects[i][2].setup((this.arrayOfGameObjects[i][2].text=="" ? this.mon_Player[this.arrayOfGameObjects[i][2].valeur_a_afficher] : this.arrayOfGameObjects[i][2].text));
          }else if(this.arrayOfGameObjects[i][1]=="image"){
            this.arrayOfGameObjects[i][2][this.arrayOfGameObjects[i][2].ombre](this.monCanvas);

          }
      }
  }
  /**
  prototype victoire
  partie a afficher quand le joueur termine le jeu

  @param key : String nom de la propriété de l'object this.arrayOfGameObjects3 (commençant par g pour la colonne de gauche, droite, et _ dans le cas d'une ressource déjà utilisée)
  @param data : propriété du object-bouton cliqué
  @param scene : frame dans lequel le bouton est cliqué

  */
  GameManager.prototype.victoire = function(key, data, scene){
      var self = this;
      //ferme toutes les animations, les retardateurs et les timers
      this.stop_animation();

      // tableau contenant les objects affichés à l'écran : (fond, bouton navigation, score)
      // structure [key, categorie String("image ou "texte)]
      this.arrayOfGameObjects = [];
      this.arrayOfGameObjects2 = [];
      this.arrayOfClickObjects = {};

      console.log("affichage nombre objets découverts "+this.mon_Player.ressource.nb_objet);
      this.monCanvas.clearRect(0, 0, window.innerWidth, window.innerHeight);
      this.monCanvas.beginPath();
      this.ma_victoire = new Victoire(this.monCanvas, self, this.data_interface.victoire);

      this.niveau = this.mon_Player.niveau_init(this.arrayOfGameObjects);

      this.affichage_victoire(key, data, scene);
      this.click_canvas();
      this.monCanvas.closePath();

      this.monCanvas_click.clearRect(0, 0, window.innerWidth, window.innerHeight);
      this.monCanvas_click.beginPath();

      var object_fusionne = {};
      $.extend( object_fusionne, this.data_interface.victoire.elements);


      // mise en place des zones à cliquer
      this.canvas_hit = new Gameplay(this.monCanvas_click, this, object_fusionne, "victoire");
      // affichage des zones à cliquer
      this.affichage_click_zone();
      this.monCanvas_click.closePath();

  }
  /**
  Prototype affichage_victoire

  @param key : String nom de la propriété de l'object this.arrayOfGameObjects3 (commençant par g pour la colonne de gauche, droite, et _ dans le cas d'une ressource déjà utilisée)
  @param data : propriété du object-bouton cliqué
  @param scene : frame dans lequel le bouton est cliqué

  */
  GameManager.prototype.affichage_victoire = function(key, data, scene){
    console.log("affichage_victoire : affichage des icones");
    this.monCanvas.clearRect(0, 0, window.innerWidth, window.innerHeight);
      for (var i in this.arrayOfGameObjects) {
          if(this.arrayOfGameObjects[i][1]=="text"){
            this.arrayOfGameObjects[i][2].setup((this.arrayOfGameObjects[i][2].text=="" ? this.mon_Player[this.arrayOfGameObjects[i][2].valeur_a_afficher] : this.arrayOfGameObjects[i][2].text));
          }else if(this.arrayOfGameObjects[i][1]=="image"){
            this.arrayOfGameObjects[i][2][this.arrayOfGameObjects[i][2].ombre](this.monCanvas);

          }
      }
  }
  /**
  prototype credit
  partie pour afficher les crédits du jeu

  @param key : String nom de la propriété de l'object this.arrayOfGameObjects3 (commençant par g pour la colonne de gauche, droite, et _ dans le cas d'une ressource déjà utilisée)
  @param data : propriété du object-bouton cliqué
  @param scene : frame dans lequel le bouton est cliqué

  */
  GameManager.prototype.credit = function(key, data, scene){
      var self = this;
      //ferme toutes les animations, les retardateurs et les timers
      this.stop_animation();

      // tableau contenant les objects affichés à l'écran : (fond, bouton navigation, score)
      // structure [key, categorie String("image ou "texte)]
      this.arrayOfGameObjects = [];
      this.arrayOfGameObjects2 = [];
      this.arrayOfClickObjects = {};

      console.log("affichage nombre objets découverts "+this.mon_Player.ressource.nb_objet);
      this.monCanvas.clearRect(0, 0, window.innerWidth, window.innerHeight);
      this.monCanvas.beginPath();
      this.mes_credits = new Victoire(this.monCanvas, self, this.data_interface.credit);

      this.niveau = this.mon_Player.niveau_init(this.arrayOfGameObjects);

      this.affichage_victoire(key, data, scene);
      this.click_canvas();
      this.monCanvas.closePath();

      this.monCanvas_click.clearRect(0, 0, window.innerWidth, window.innerHeight);
      this.monCanvas_click.beginPath();

      var object_fusionne = {};
      $.extend( object_fusionne, this.data_interface.credit.elements);


      // mise en place des zones à cliquer
      this.canvas_hit = new Gameplay(this.monCanvas_click, this, object_fusionne, "credit");
      // affichage des zones à cliquer
      this.affichage_click_zone();
      this.monCanvas_click.closePath();

  }
  /**

  */
  GameManager.prototype.charger  = function(key, data, scene){
    //ferme toutes les animations, les retardateurs et les timers
    this.stop_animation();

    try {
      if(!localStorage.getItem("niveau")){
        this.popup("setup2", "", "", "sauvegarde", "nonchargement");
      }else{
        this.mon_Player.niveau = JSON.parse(localStorage.getItem("niveau"));
        this.mon_Player.ressource = JSON.parse(localStorage.getItem("ressource"));
        this.mon_Player.plat = JSON.parse(localStorage.getItem("plat"));
        this.popup("setup2", "", "", "sauvegarde", "chargement");
      }
    }catch (exception) {
      this.popup("setup2", "", "", "sauvegarde", "nonchargement");
    }

  }
