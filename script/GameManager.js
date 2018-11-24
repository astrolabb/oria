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
    // tableau représentant l'association des ressources --> synthèse plat
    this.array_mix_plat = [];
    // tableau représentant  la catégorie des ressources présentent dans array_mix_plat
    this.array_mix_plat2 = [];


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
GameManager.prototype.setup2 = function (bouton, data, scene)
{

  var self = this;
  // si un timer est en cours d'exécution, on l'arrète.
  if(this.mon_Interval){
      clearInterval(this.mon_Interval);
      this.mon_Interval = false;
  }

  // tableau contenant les objects affichés à l'écran : (fond, bouton navigation, score)
  // structure [key, categorie String("image ou "texte)]
  this.arrayOfGameObjects = [];
  this.arrayOfGameObjects2 = [];
  this.arrayOfClickObjects = {};

  // mise à jour de la propriété nb_objet : nombre d'objets découverts pour la gestion des niveaux du lonono
  this.mon_Player.ressource.nb_objet = this.mon_Player.update_nb_objet(this.data_equilibrage.bareme_niveau.lonono, "nb_objet" , "lonono");
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
console.log("carte object_fusionne "+JSON.stringify(object_fusionne));
  // mise en place des zones à cliquer
  this.canvas_hit = new Gameplay(this.monCanvas_click, this, object_fusionne, "map");
  // affichage des zones à cliquer
  this.affichage_click_zone();
  this.monCanvas_click.closePath();

    if(!this.mon_Interval){
      this.mon_Interval = setInterval( function() {self.affichage_map();}, 3000);
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
     if(this.mon_Interval){
         clearInterval(this.mon_Interval);
     }
     $("#monCanvas").addClass("niveau_de_gris mon_fadein");
     $("#monCanvas").one('webkitAnimationEnd oanimationend msAnimationEnd animationend', function(e) {
          $("#monCanvas").removeClass("niveau_de_gris mon_fadein");
          self.lonono(key, data, scene);

     });
   }
  /**
  * Affichage map
  *
  * @return {[type]} [description]
    @todo enlever les fonctions fadein en js qui sont commentées
  */
  GameManager.prototype.setup4 = function (key, data, scene)
   {
     console.log("village");
     self = this;
     if(this.mon_Interval){
         clearInterval(this.mon_Interval);
         this.mon_Interval = false;
     }
     $("#monCanvas").addClass("niveau_de_gris mon_fadein");
     $("#monCanvas").one('webkitAnimationEnd oanimationend msAnimationEnd animationend', function(e) {
          $("#monCanvas").removeClass("niveau_de_gris mon_fadein");
          self.contructor_village(key, data);

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
     * fonction setup7
     comportement lors click sur le jardin
     fondu de l'image avant de faire apparaitre la roue de la chance
     *
     * @param key String nom de l'icone clickée
      @param data
     */
     GameManager.prototype.setup7 = function (key, data, scene)
      {
        console.log("jardin");
        self = this;
        if(this.mon_Interval){
            clearInterval(this.mon_Interval);
        }
        $("#monCanvas").addClass("niveau_de_gris mon_fadein");
        $("#monCanvas").one('webkitAnimationEnd oanimationend msAnimationEnd animationend', function(e) {
             $("#monCanvas").removeClass("niveau_de_gris mon_fadein");
             self.jardin(key, data, scene);

        });
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
    if(this.mon_Interval){
        clearInterval(this.mon_Interval);
        this.mon_Interval = false;
    }
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
          this.mon_Interval = setInterval( function() {self.affichage_village(key, data);}, 3000);
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
  GameManager.prototype.vente = function(key, data, scene)
  {
    if(scene == "lonono"){
        console.log("fabrication plats ou synthèse nouvelles ressources");
        console.log("scene "+scene);
        console.log("clé "+key);
        console.log("data "+JSON.stringify(data));

        // si dans la section lonono, on a cliqué sur une ressource pour créer un nouvelle ressource
          if(data.action=="ressource" && this.mon_Player[data.cat][data.nom2]>0){
              var var_tempo = mix_ressources(this.array_mix_ressource, this.array_mix_ressource2, this.mon_Player.niveau.lonono, data.nom2, data.cat);
              this.array_mix_ressource = var_tempo[0];
              this.array_mix_ressource2 = var_tempo[1];

                  // si on a pas encore sélectionné suffisemment de plat : il se passe rien
                  if(this.array_mix_ressource.length<this.mon_Player.niveau.lonono){
                    // on affiche au prochain tour la partie mix déjà choisi en bas de l'ecran
                    this.mon_Player.lonono_mix_ressource = affichage_ressource(this.array_mix_ressource, this.array_mix_ressource2, this.data_equilibrage);
                    this.popup("lonono", "", "", "lonono", "nb_ressource_insuffisant");
                  }else{
                    var mon_affichage = mix_reussite(this.array_mix_ressource, this.data_equilibrage.lonono_algo, this.mon_Player.niveau.lonono);
                    if(mon_affichage.length==0){
                        this.mon_Player.echange2(this.array_mix_ressource, this.array_mix_ressource2, "ex______", 1, "ressource", this.mon_lonono);
                        var a_afficher = "echec_recette";
                        var a_afficher2 = "";
                        var a_afficher3 = affichage_ressource(this.array_mix_ressource, this.array_mix_ressource2, this.data_equilibrage);
                        this.mon_Player.niveau["lonono_icone"] = 3;
                        this.mon_Player.objet_debloque["ex______"] = this.mon_Player.objet_debloque["ex______"] + 1;


                    }else{
                        this.mon_Player.echange2(this.array_mix_ressource, this.array_mix_ressource2, mon_affichage[0], mon_affichage[1], data.action, this.mon_lonono);
                        var a_afficher = "reussite";
                        var a_afficher2 = mon_affichage[1];
                        // merci NathalieOria !!
                        var a_afficher3 = (a_afficher2>1 ? String(this.data_equilibrage.ressource[mon_affichage[0]].nom+"s") : this.data_equilibrage.ressource[mon_affichage[0]].nom);
                        this.mon_Player.niveau["lonono_icone"] = 2;
                        this.mon_Player.objet_debloque[this.data_equilibrage.ressource[mon_affichage[0]].nom] = this.mon_Player.objet_debloque[this.data_equilibrage.ressource[mon_affichage[0]].nom] + mon_affichage[1];
                    }
                    this.mon_Player.lonono_mix_ressource = "";
                    // initialisation des variables
                    // tableau représentant l'association des ressources ---> synthèse nouvelle ressource
                    this.array_mix_ressource = [];
                    // tableau représentant la catégorie des ressources présentent dans array_mix_ressource
                    this.array_mix_ressource2 = [];
                    this.popup("lonono", a_afficher2 , a_afficher3, "lonono", a_afficher);

                  }

          // si dans la section lonono, on a cliqué sur une ressource pour créer un plat
        }else if(data.action=="plat" && this.mon_Player[data.cat][data.nom2]>0){

                var var_tempo = mix_ressources(this.array_mix_plat, this.array_mix_plat2, this.mon_Player.niveau.lonono, data.nom2, data.cat);
                this.array_mix_plat = var_tempo[0];
                this.array_mix_plat2 = var_tempo[1];

                // si on a pas encore sélectionné suffisemment de plat : il se passe rien
                if(this.array_mix_plat.length<this.mon_Player.niveau.lonono){
                  this.mon_Player.lonono_mix_plat = affichage_ressource(this.array_mix_plat, this.array_mix_plat2, this.data_equilibrage);
                  this.popup("lonono", "", "", "lonono", "nb_ressource_insuffisant");
                }else{
                    console.log("array_mix_plat "+JSON.stringify(this.array_mix_plat));
                  var mon_affichage = mix_reussite(this.array_mix_plat, this.data_equilibrage.lonono_algo2, this.mon_Player.niveau.lonono);
                  console.log("mon_affichage "+mon_affichage);
                  if(mon_affichage.length==0){
                      this.mon_Player.echange2(this.array_mix_plat, this.array_mix_plat2, "ex______", 1, "ressource", this.mon_lonono);
                      var a_afficher = "echec_recette";
                      var a_afficher2 = "";
                      var a_afficher3 = affichage_ressource(this.array_mix_plat, this.array_mix_plat2, this.data_equilibrage);
                      this.mon_Player.niveau["lonono_icone"] = 3;
                  }else{
                      this.mon_Player.echange2(this.array_mix_plat, this.array_mix_plat2, mon_affichage[0], mon_affichage[1], data.action, this.mon_lonono);
                      var a_afficher = "reussite";
                      var a_afficher2 = mon_affichage[1];
                      // merci NathalieOria !!
                      var a_afficher3 = (a_afficher2>1 ? String(this.data_equilibrage.plats[mon_affichage[0]].nom+"s") : this.data_equilibrage.plats[mon_affichage[0]].nom);
                      this.mon_Player.niveau["lonono_icone"] = 2;
                  }
                  this.mon_Player.lonono_mix_plat = "";
                  // tableau représentant l'association des ressources --> synthèse plat
                  this.array_mix_plat = [];
                  // tableau représentant  la catégorie des ressources présentent dans array_mix_plat
                  this.array_mix_plat2 = [];
                  this.popup("lonono", a_afficher2 , a_afficher3, "lonono", a_afficher);
                }
          }else{
            this.lonono(key, data, scene);
          }
      }else if(scene == "village"){
        console.log("debut de la vente");
        if(this.mon_Player.echange(key, data.or, "or", data)){
          if(data.or>0){
              this.popup("contructor_village", this.data_equilibrage.plats[key].nom, "", "village", "plat");
          }else{
              this.mon_Player.objet_debloque[this.data_equilibrage.ressource[key].nom] = this.mon_Player.objet_debloque[this.data_equilibrage.ressource[key].nom] + 1;
              this.popup("contructor_village", this.data_equilibrage.ressource[key].nom, "", "village", "achat");
          }

        }else{
          this.contructor_village(key, data, scene);
        }
    }
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
    var self = this;
    console.log("popup");
    self = this;
    if(this.mon_Interval){
        clearInterval(this.mon_Interval);
    }
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
      if(this.mon_Interval){
          clearInterval(this.mon_Interval);
          this.mon_Interval = false;
      }

      var self = this;
      this.arrayOfGameObjects = [];
      this.arrayOfGameObjects3 = {};
      this.arrayOfGameObjects2 = [];
      this.arrayOfClickObjects = {};

      this.monCanvas.clearRect(0, 0, window.innerWidth, window.innerHeight);
      this.monCanvas.beginPath();
      this.mon_lonono = new Mon_lonono(this.monCanvas, self, this.data_equilibrage.plats, this.data_interface.lonono, this.data_equilibrage.ressource, this.data_equilibrage.lonono_algo, this.data_equilibrage.lonono_algo2);
      this.niveau = this.mon_Player.niveau_init(this.arrayOfGameObjects);
      this.affichage_lonono(key, data);
      this.click_canvas();
      this.monCanvas.closePath();

      this.monCanvas_click.clearRect(0, 0, window.innerWidth, window.innerHeight);
      this.monCanvas_click.beginPath();
      var object_fusionne = {};
//      $.extend( object_fusionne, this.data_equilibrage.plats);
//      $.extend( object_fusionne, this.data_equilibrage.ressource);
//      object_fusionne["retour"]= this.data_interface.village.elements.retour;

      this.arrayOfGameObjects3["retour"]= this.data_interface.village.elements.retour;
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
              self.affichage_lonono(key, data, scene);}, 3000);
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

          }
      }

  }
  GameManager.prototype.jardin = function(key, data, scene){
    var self = this;
    if(this.mon_Interval){
        clearInterval(this.mon_Interval);
        this.mon_Interval = false;
    }
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
