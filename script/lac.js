/**
Constructor lac
@param monCanvas contexte de dessin sur le Canevas
@param _target classe parentNode
@param data_interface Object données d'interface : data_interface.json
@param key String : nom de propriété du bouton cliqué
@param data Object : bouton cliqué pour arrivé à cette scene
@param scene String scene en cours : lac
@param ressources Object toutes les ressources du jeu
@param texte Object texte à afficher et correspondant à this.data_texte.lac
@param algo Object algo d'attribution des ressource et d'équilibrage par niveau correspndant à this.data_equilibrage.lac_algo[String(this.mon_Player.niveau.lac)]
*/

var Lac = function(monCanvas, _target, data_interface, key, data, scene, ressources, texte, algo){
  var self = this;
  this._target = _target;
  this.monCanvas = monCanvas;
  // temps du lancement du jeu
  this.temps_debut = new Date().getTime();
  // temps écoulé depuis le dernier changement de couleur de bouton
  this.temps_ecoule = new Date().getTime();
  // temps écoulé depuis le dernier rafraichissement de l'image
  this.temps_dernier_refresh = this.temps_ecoule;
  // durée du jeu en milli seconde
  this.duree_timer = algo.base_temps*1000;
  this.mon_intervalle = 0;
  this.interface = data_interface;
  this.ressources = ressources;
  this.couleur_bouton = [];
  this.key = key;
  this.data = data;
  this.scene = scene;
  this.score = 0;
  this.texte = texte;
  this.algo = algo;
  console.log("30_12_18 3 "+JSON.stringify(this.algo));


  _target.arrayOfGameObjects = [];
  // affichage des élement fiche de l'image : image de fond, bouton retour
  Object.keys(data_interface.elements).forEach(function(key) {
      console.log(key+" "+data_interface.elements[key]);
      if(data_interface.elements[key].nature == "image"){
        self[key] = new Icone(monCanvas, data_interface.elements[key], key, _target);
        _target.arrayOfGameObjects.push([key,"image",self[key], key]);
      }
  });
  // afffichage du texte : titre
  Object.keys(data_interface.elements).forEach(function(key) {
      console.log(key+" "+data_interface.elements[key]);
      if(data_interface.elements[key].nature == "text"){
          self[key] = new Text_affichage(monCanvas, data_interface.elements[key], key, data_interface.maxWidth_text, data_interface.lineHeight, _target.data_texte.lac, data_interface.elements[key].reference=="" ? "" : data_interface.elements[data_interface.elements[key].reference]);
          _target.arrayOfGameObjects.push([key,"text",self[key], key]);
      }
  });
  this.mon_gradient = monCanvas.createLinearGradient(0,0,0, data_interface.hauteur_colonne);
  for(i=0; i<data_interface.couleur_colonne.length; i++){
    this.mon_gradient.addColorStop(i/(data_interface.couleur_colonne.length-1),data_interface.couleur_colonne[i]);
  }
  var mes_couleurs = {};
  mes_couleurs[this.interface.couleur_bouton_actif] = true;
  var ma_couleur;
  var abs_col_gauche = centrage_colonne(data_interface.largeur_colonne, data_interface.marge_gauche, data_interface.nombre_colonne);
  // on boucle sur le nombre de colonne
  for(i=0; i<data_interface.nombre_colonne; i++){
    ma_couleur = getColorRandom();
    while(verifie_couleur(mes_couleurs, ma_couleur)){
      ma_couleur = getColorRandom();
    }

    // on crée un bouton par colonne
    self["bouton_"+i] = new Icone(monCanvas, data_interface.elements.bouton_lac, "bouton_"+i, _target);
    self["bouton_"+i]._x = abs_col_gauche + i*data_interface.largeur_colonne;
    self["bouton_"+i]._y = data_interface.marge_haut + data_interface.hauteur_colonne;
    self["bouton_"+i]._width = data_interface.largeur_colonne;
    self["bouton_"+i]._height = data_interface.largeur_colonne;
    self["bouton_"+i].couleur = ma_couleur;

    var ressource_hasard = this.interface.ressource_a_afficher[Math.floor(Math.random()*this.interface.ressource_a_afficher.length)];
    console.log("ressource_hasard "+JSON.stringify(ressource_hasard));
    // on crée une ressource qui tombe du haut du tableau
    self["ressource_"+i] = new Icone(monCanvas, this.ressources[ressource_hasard] , ressource_hasard, _target);
    self["ressource_"+i]._x = abs_col_gauche + i*data_interface.largeur_colonne;
    self["ressource_"+i]._y = data_interface.marge_haut;
    self["ressource_"+i]._width = data_interface.largeur_colonne;
    self["ressource_"+i]._height = data_interface.largeur_colonne;
    self["ressource_"+i].couleur = ma_couleur;
    self["ressource_"+i].lien = "non";
    self["ressource_"+i].ombre = "draw";


    _target.arrayOfGameObjects.push(["bouton_"+i,"icone",self["bouton_"+i], "bouton_"+i]);
    _target.arrayOfGameObjects.push([ressource_hasard,"image_chute",self["ressource_"+i], ressource_hasard]);
      mes_couleurs[ma_couleur] = true;
      this.couleur_bouton[i] = ma_couleur;

  }
};
/**
Prototype affichage_image_chute
affiche un colonne avec un gradient de couleur et pardessus une ressource tombant du haut du tableau

@param monCanvas : context où est affiché le jeu
@param icone : Object icone dont afficher la chute de la forme self["ressource_"+i]
*/
Lac.prototype.affichage_image_chute = function(monCanvas, icone){

  console.log("niveau : "+JSON.stringify(this._target.niveau));
  console.log("key : "+JSON.stringify(icone.key));
  console.log("images : "+JSON.stringify(this._target.niveau[icone.key]));
 console.log("loc : "+JSON.stringify(icone.loc[this._target.niveau[icone.key]]));

  var self = this;
  monCanvas.beginPath();
  monCanvas.globalAlpha = this.interface.fondu_colonne;
  monCanvas.fillStyle = this.mon_gradient;
  monCanvas.fillRect(icone._x, this.interface.marge_haut, this.interface.largeur_colonne, this.interface.hauteur_colonne);
  monCanvas.globalAlpha = 1;
  monCanvas.closePath();
  monCanvas.drawImage(this._target.data_image_chargee[icone.loc[this._target.niveau[icone.key]][Math.floor(Math.random()*icone.loc[this._target.niveau[icone.key]].length)]],icone._x,icone._y,icone._width,icone._height);


}
/**
Prototype affichage_bouton2
affiche un bouton rectangulaire pour chaque colonne

@param monCanvas : context où est affiché le jeu
@param icone : Object bouton qu'on veut afficher : de la forme self["bouton_"+i]

*/

Lac.prototype.affichage_bouton2 = function(monCanvas, icone){

  monCanvas.beginPath();
  monCanvas.fillStyle = icone.couleur;
  monCanvas.fillRect(icone._x, icone._y, icone._width, icone._height);
  monCanvas.closePath();
}
/**
Prototype affichage_score
crée un panneau à gauche et à droite du tableau : l'un pour le score l'autre pour le timer
deplus si le timer est inf 0, recherche la ressource gagnée et arrete l'animation ainsi que renvoie à la carte générale

@param monCanvas : context où est affiché le jeu

*/
Lac.prototype.affichage_score = function(monCanvas){
   var self = this;
   var mon_timer = new Date().getTime();
   var texte_afficher = Math.floor(this.algo.duree-(mon_timer - this.temps_debut)/1000);

    var largeur_panneau = window.innerWidth/2-(this.interface.largeur_colonne*this.interface.nombre_colonne/2) - 2* this.interface._x_score;
    var hauteur_panneau = this.interface._height_score;
    texte_sur_panneau(monCanvas, this.interface.couleur_texte, texte_afficher, this.interface._x_score,  this.interface._y_score, largeur_panneau, hauteur_panneau,  this.interface.couleur_cartouche, this.interface.police, this.interface.taille_police1);
    var position_x_panneau_score = 3*this.interface._x_score + largeur_panneau + this.interface.largeur_colonne*this.interface.nombre_colonne;
    texte_sur_panneau(monCanvas, this.interface.couleur_texte, this.score, position_x_panneau_score,  this.interface._y_score, largeur_panneau, hauteur_panneau,  this.interface.couleur_cartouche, this.interface.police, this.interface.taille_police1);

    if(texte_afficher <= 0){
      var mon_resultat=0;
      var pallier = 0;
      var ma_quantite = 0;
      Object.keys(this.algo.gain).forEach(function(key) {
          console.log(key+" "+JSON.stringify(self.algo.gain[key]));
          if(self.score >= self.algo.gain[key][1] && self.algo.gain[key][1]>pallier){
            pallier = self.algo.gain[key][1];
            mon_resultat = key;
            ma_quantite = self.algo.gain[key][0];
          }
      });
      this._target.mon_Player.ressource[mon_resultat] += ma_quantite;
      this._target.stop_animation();
      if(mon_resultat == 0){
        this._target.popup("setup2", "", "", "lac", "echec", "", "");
      }else{
        this._target.mon_Player.objet_debloque[mon_resultat] = true;
        this._target.popup("setup2", ma_quantite +" "+self.ressources[mon_resultat].nom, "", "lac", "reussite", self.ressources[mon_resultat], mon_resultat);
      }

    }

}
/**
Prototype affichage_decor
affiche 2 panneaux de chaque coté du tableau pour identifier les valeurs du timer et du score

@param monCanvas : context où est affiché le jeu

*/
Lac.prototype.affichage_decor = function(monCanvas){
  // légende timer

  var largeur_panneau = window.innerWidth/2-(this.interface.largeur_colonne*this.interface.nombre_colonne/2) - 2* this.interface._x_score;
  var hauteur_panneau = this.interface._height_score;
  texte_sur_panneau(monCanvas, this.interface.couleur_texte, this.texte["timer"], this.interface._x_score,  this.interface._y_score-hauteur_panneau, largeur_panneau, hauteur_panneau,  this.interface.couleur_legende, this.interface.police, this.interface.taille_police1);
  // légende score
  var position_x_panneau_score = 3*this.interface._x_score + largeur_panneau + this.interface.largeur_colonne*this.interface.nombre_colonne;
  texte_sur_panneau(monCanvas, this.interface.couleur_texte, this.texte["score"], position_x_panneau_score,  this.interface._y_score-hauteur_panneau, largeur_panneau, hauteur_panneau,  this.interface.couleur_legende, this.interface.police, this.interface.taille_police1);

}
/**
Prototype calcul_anim
calcule la position de la ressource pendant sa chute

@param temps Number : date actuelle en milliseconde
*/
Lac.prototype.calcul_anim = function(temps){
  var g;
  for(i=0; i<this.interface.nombre_colonne; i++){
      if(this["bouton_"+i].couleur==this.interface.couleur_bouton_actif){
        // @var g variable d'accelération : on peut moduler la chute en augmentant la puissance de this.mon_intervalle defini à 4 par défaut
          g = 2*this.interface.hauteur_colonne/(this.mon_intervalle*this.mon_intervalle*this.mon_intervalle*this.mon_intervalle);
  //      this["ressource_"+i]._y = this.interface.marge_haut+((temps-this.temps_ecoule)/this.mon_intervalle)*this.interface.hauteur_colonne;
          this["ressource_"+i]._y = this.interface.marge_haut+(0.5*g*(temps-this.temps_ecoule)*(temps-this.temps_ecoule)*(temps-this.temps_ecoule)*(temps-this.temps_ecoule));
      }else{
        this["ressource_"+i]._y = -this["ressource_"+i]._height;
      }
  }

}

/**
prototype fonction_timer
timer contenant requestAnimationFrame


*/
 Lac.prototype.fonction_timer = function(){
    var self = this;
    var temps_actu = new Date().getTime();
  // fonction timer-like de js
  this.mon_timer=window.requestAnimationFrame(function(){ self.fonction_timer();});
  // si aucun intervalle n'esy en cours
  if(this.mon_intervalle==0){
    // on en crée un d'un valeur random et dont le max est this.duree_timer
    this.mon_intervalle = Math.random()*this.duree_timer;

    while(this.mon_intervalle < (this.interface.intervalle_minimal*1000)){
      this.mon_intervalle = Math.random()*this.duree_timer;
    }
  }

  // si le temps d'activation du bouton est depassé, il faut en choisir un autre
  if(temps_actu>this.temps_ecoule+this.mon_intervalle){
    this.temps_ecoule = temps_actu;
    this.temps_dernier_refresh = temps_actu;
    this.mon_intervalle = 0;
    console.log("re-boucle");

    this.changement_bouton();
    this._target.affichage_lac(this.key, this.data, this.scene);
    this.affichage_decor(this.monCanvas);
    this.affichage_score(this.monCanvas);
  // si le temps entre 2 rafraichissements est dépassé : il faut rafraichir le canevas
  }else if(temps_actu>this.temps_dernier_refresh +this.interface.temps_entre_refresh){
    this.calcul_anim(temps_actu);
    this.temps_dernier_refresh = temps_actu;
    this._target.affichage_lac(this.key, this.data, this.scene);
    this.affichage_decor(this.monCanvas);
    this.affichage_score(this.monCanvas);
  }
}
/**
Prototype changement_bouton
permet d'activer un bouton et de désactiver les autres

*/
Lac.prototype.changement_bouton = function(){

  var mon_bouton_random = Math.floor(Math.random()*this.interface.nombre_colonne);
  for(i=0; i<this.couleur_bouton.length; i++){
    if(i == mon_bouton_random){
      this["bouton_"+i].couleur = this.interface.couleur_bouton_actif;
    }else{
      this["bouton_"+i].couleur = this.couleur_bouton[i];
    }

  }


}
/**
Prototype click
comportement lors d'un click


*/
Lac.prototype.click = function(_x, _y){
      console.log("click : x "+_x+" y "+_y);
      // si on clique sur un bouton : renvoie un nombre si oui et false si non
      var i = this.trouve_la_colonne(_x, _y);
      if(i>=0){
        // si le bouton est activé
        if(this["bouton_"+i].couleur == this.interface.couleur_bouton_actif){
          this.score+=this.algo.bonus;
          this["bouton_"+i].couleur = this.couleur_bouton[i];
        // si le bouton n'est pas activé
        }else{
          this.score-=this.algo.bonus;
        }
      }


}
/**
Prototype trouve_la_colonne
recherche si le joueur a cliqué sur un bouton

@param _x Number abscisse du click en pixel
@param _y Number ordonnée du click en pixel

@return Number si oui et false si non
*/
Lac.prototype.trouve_la_colonne = function(_x, _y){
  if(_y>this.interface.marge_haut + this.interface.hauteur_colonne && _y<this.interface.marge_haut + this.interface.hauteur_colonne + this.interface.largeur_colonne){


    var ma_colonne = Math.floor((_x-centrage_colonne(this.interface.largeur_colonne, this.interface.marge_gauche, this.interface.nombre_colonne))/this.interface.largeur_colonne);
    console.log("bouton cliqué "+ma_colonne);
    if(ma_colonne>=0 && ma_colonne<this.interface.nombre_colonne){
      return ma_colonne;
    }else{
      return -1;
    }
  }else{
    return -1;
  }
}
