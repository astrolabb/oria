/**
constructor Synthese

@param monCanvas : context sur lequel doit s'afficher la synthese
@param _target Object : classe parent
@param data_interface Object : this.data_interface.synthese présent dans le fichier data_interface.json
@param key String : nom de propriété du bouton cliqué
@param data Object : bouton cliqué pour arrivé à cette scene
@param scene String scene en cours : synthese
@param texte Object texte à afficher et correspondant à this.data_texte.synthese
@param ressource Object : ensemble des ressources du jeu disponible dans le fichier data_equilibrage.json
@param plat ensemble des plats du jeu disponible dans le fichier data_equilibrage.json
@param carte Object : contenant les éléments de la frame "carte" et utilisés dans le GameManager par this.data_interface.carte.elements

*/
var Synthese = function(monCanvas, _target, data_interface, key, data, scene, texte, ressource, plat, carte){
  var self = this;

  this.monCanvas = monCanvas;
  this._target = _target;
  this.data_interface = data_interface;
  this.texte = texte;
  this.carte = JSON.parse(JSON.stringify(carte));
  this.data_ressource = JSON.parse(JSON.stringify(ressource));
  this.data_plat = JSON.parse(JSON.stringify(plat));

  _target.arrayOfGameObjects = [];
  Object.keys(data_interface.elements).forEach(function(key) {
      console.log(key+" "+data_interface.elements[key]);
      if(data_interface.elements[key].nature == "image"){

        self[key] = new Icone(monCanvas, data_interface.elements[key], key, _target);
        _target.arrayOfGameObjects.push([key,"image",self[key], key]);
      }
  });
// niveau
var taille_image = redimensionnement_image(this.data_interface.jeu_a_afficher.length, this.data_interface.max_hauteur1, this.data_interface.marge_gauche);
var ma_liste = this.data_interface.jeu_a_afficher;

for (i=0; i<ma_liste.length; i++){
  this.carte[ma_liste[i]].dir = "aide_synthese_popup";
  this.carte[ma_liste[i]]._x = this.data_interface.marge_gauche + i*taille_image;
  this.carte[ma_liste[i]]._y = this.data_interface.icone_jeu_y;
  this.carte[ma_liste[i]]._width = taille_image;
  this.carte[ma_liste[i]]._height = taille_image;
  self[ma_liste[i]] = new Icone(monCanvas, this.carte[ma_liste[i]], ma_liste[i], _target);
  self._target.arrayOfGameObjects.push([ma_liste[i],"image", self[ma_liste[i]], ma_liste[i]]);

}


// ressource
// mise en place des liens sur chaque ressource
var i=0;
taille_image = redimensionnement_image(fonction_tableau_ressource(self.data_ressource).length, this.data_interface.max_hauteur2, this.data_interface.marge_gauche);
Object.keys(self.data_ressource).forEach(function(key) {
  console.log(key);
  // on dirige le joueur vers le popup si click
  self.data_ressource[key].dir = "aide_synthese_popup";
  // on enlève les ombres et le nombre en stock : une image normale
  self.data_ressource[key].ombre = "draw";
  // si l'écran est large, on les affiche en ligne
  if(window.innerWidth > window.innerHeight){
    self.data_ressource[key]._x = self.data_interface.marge_gauche + i*taille_image;
    self.data_ressource[key]._y = self.data_interface.icone_ressource_y;
    self.data_ressource[key]._width = taille_image;
    self.data_ressource[key]._height = taille_image;
  // si l'écran est en hauteur, on les affiche en rectangle
  }else{
    data_equilibrage = mise_echelle(self.data_ressource, data_interface.marge_gauche, data_interface.icone_ressource_y2 + data_interface.marge_haut/2, 0, window.innerWidth, data_interface.max_hauteur2, 2);
  }
  self[key] = new Icone(monCanvas, self.data_ressource[key], key, _target);
  self._target.arrayOfGameObjects.push([key,"image", self[key], key]);
  i++;
  });



  // plats
  // mise en place des liens sur chaque plats
  i=0;
  taille_image = redimensionnement_image(fonction_tableau_ressource(self.data_plat).length, this.data_interface.max_hauteur2, this.data_interface.marge_gauche);
  Object.keys(self.data_plat).forEach(function(key) {
    // on dirige le joueur vers le popup si click
    self.data_plat[key].dir = "aide_synthese_popup";
    // on enlève les ombres et le nombre en stock : une image normale
    self.data_plat[key].ombre = "draw";
    // si l'écran est large, on les affiche en ligne
    if(window.innerWidth > window.innerHeight){
      self.data_plat[key]._x = self.data_interface.marge_gauche + i*taille_image;
      self.data_plat[key]._y = self.data_interface.icone_plat_y;
      self.data_plat[key]._width = taille_image;
      self.data_plat[key]._height = taille_image;
    // si l'écran est en hauteur, on les affiche en rectangle
    }else{
          data_ressources = mise_echelle(self.data_plat, data_interface.marge_gauche, data_interface.icone_plat_y2 + data_interface.marge_haut/2, 0, window.innerWidth, data_interface.max_hauteur2, 2);
    }
    self[key] = new Icone(monCanvas, self.data_plat[key], key, _target);
    self._target.arrayOfGameObjects.push([key,"image", self[key], key]);
    i++;
    });


  Object.keys(data_interface.elements).forEach(function(key) {
      console.log(key+" "+data_interface.elements[key]);
      if(window.innerWidth > window.innerHeight){

      }else{
        if(data_interface.elements[key].hasOwnProperty("_y2")){
          data_interface.elements[key]._y = data_interface.elements[key]._y2;
        }
      }
      if(data_interface.elements[key].nature == "text"){
          self[key] = new Text_affichage(monCanvas, data_interface.elements[key], key, data_interface.maxWidth_text, data_interface.lineHeight, _target.data_texte.synthese, data_interface.elements[key].reference=="" ? "" : data_interface.elements[data_interface.elements[key].reference]);
          _target.arrayOfGameObjects.push([key,"text",self[key], key]);
      }
  });


};
/**
prototype affichage_niveaux
permet de lancer les prototypes pour afficher les niveaux atteints, les ressources trouvées...

@param images : Object contenant tous les contextes des images chargées
@param carte : Object contenant les éléments de la frame "carte" et utilisés dans le GameManager par this.data_interface.carte.elements
@param objet_trouve : Object ressource découverte : structure objet_trouve[key] = Boolean
@param plat_trouve : Object plat découvert : structure objet_trouve[key] = Boolean
*/
Synthese.prototype.affichage_niveaux = function(images, carte, objet_trouve, plat_trouve){

  this.jeu_niveaux(images, carte);
  this.ressources_trouvees(images, objet_trouve, this.data_ressource, this.data_interface.icone_ressource_y);
  this.ressources_trouvees(images, plat_trouve, this.data_plat, this.data_interface.icone_plat_y);


}

/**
prototype ressources_trouvees
va servir afficher un calque sur les ressource ou les plats qui n'ont pas été découverts

@param images Object contenant tous les contextes des images chargées
@param objet_trouve Object peut correspondre à objet_debloque ou plat_trouve de users.js structure objet_trouve[key]=boolean
@param base Object correspondant à this.data_ressource ou this.data_plat : l'ensemble des caractéristiques des ressources et des plats
@param _y Number : coordonnée en y où sont disposées les icones
*/
Synthese.prototype.ressources_trouvees = function(images, objet_trouve, base, _y){
  var self=this;
  var _x;
  var taille_image;
  if(window.innerWidth > window.innerHeight){
    taille_image = redimensionnement_image(fonction_tableau_ressource(base).length, this.data_interface.max_hauteur2, this.data_interface.marge_gauche);
  }else{
    // dans ce cas on prend la taille stockée par defaut dans  data_equilibrage.json
    // dans "_width" ou "_height" grace à la fonction mise_echelle
  }
  var mon_image;
  var i=0;
  Object.keys(base).forEach(function(key) {
      if(window.innerWidth > window.innerHeight){
        _x = self.data_interface.marge_gauche + i*taille_image;
      }else{
        _x = base[key]._x;
        _y = base[key]._y;
        taille_image = base[key]._width;

      }

    if(!objet_trouve.hasOwnProperty(key)){
      if(base[key].cat=="plat"){
        base[key].dir = "aide_synthese_popup3";
      }
      self.monCanvas.globalAlpha = self.data_interface.alpha_;
      self.monCanvas.fillStyle = self.data_interface.couleur_masque;
      self.monCanvas.fillRect(_x, _y, taille_image, taille_image);
      self.monCanvas.globalAlpha =   1;
    }else{
      if(self.texte.hasOwnProperty(String(key+"_s"))){
        base[key].dir = "aide_synthese_popup2";
      }
    }
    i++;
  });

}
/**

*/
Synthese.prototype.jeu_niveaux = function(images, carte){
  var _x;
  var taille_image = redimensionnement_image(this.data_interface.jeu_a_afficher.length, this.data_interface.max_hauteur1, this.data_interface.marge_gauche);
  var mon_image;
  var ma_liste = this.data_interface.jeu_a_afficher;

  for (i=0; i<ma_liste.length; i++){
    _x = this.data_interface.marge_gauche + i*taille_image;
    mon_image = images[carte[ma_liste[i]].loc["niv"+this._target.mon_Player.niveau[ma_liste[i]]][Math.floor(Math.random()*carte[ma_liste[i]].loc["niv"+this._target.mon_Player.niveau[ma_liste[i]]].length)]];
    this.monCanvas.drawImage(mon_image,_x,this.data_interface.icone_jeu_y,taille_image,taille_image);
    this.monCanvas.globalAlpha = this.data_interface.alpha_;
    this.monCanvas.fillStyle = this.data_interface.couleur_masque;
    this.monCanvas.fillRect(_x, this.data_interface.icone_jeu_y, taille_image, taille_image);
    this.monCanvas.globalAlpha =   1;
    this.monCanvas.font = format_police(this.data_interface.taille_police1, this.data_interface.police);
    this.monCanvas.fillStyle = this.data_interface.couleur_texte;
    this.monCanvas.fillText(this._target.mon_Player.niveau[ma_liste[i]], _x+(taille_image/2), this.data_interface.icone_jeu_y + taille_image);
  }
}
