/**


*/
var Synthese = function(monCanvas, _target, data_interface, key, data, scene, texte, ressource, plat){
  var self = this;
  this.monCanvas = monCanvas;
  this._target = _target;
  this.data_interface = data_interface;
  this.texte = texte;
  this.data_ressource = ressource;
  this.data_plat = plat;

  _target.arrayOfGameObjects = [];
  Object.keys(data_interface.elements).forEach(function(key) {
      console.log(key+" "+data_interface.elements[key]);
      if(data_interface.elements[key].nature == "image"){
        self[key] = new Icone(monCanvas, data_interface.elements[key], key, _target);
        _target.arrayOfGameObjects.push([key,"image",self[key]]);
      }
  });
  Object.keys(data_interface.elements).forEach(function(key) {
      console.log(key+" "+data_interface.elements[key]);
      if(data_interface.elements[key].nature == "text"){
          self[key] = new Text_affichage(monCanvas, data_interface.elements[key], key, data_interface.maxWidth_text, data_interface.lineHeight, _target.data_texte.synthese, data_interface.elements[key].reference=="" ? "" : data_interface.elements[data_interface.elements[key][reference]]);
          _target.arrayOfGameObjects.push([key,"text",self[key]]);
      }
  });


};
/**

*/
Synthese.prototype.affichage_niveaux = function(images, carte, objet_trouve, plat_trouve){
  this.jeu_niveaux(images, carte);
  this.ressources_trouvees(images, objet_trouve, this.data_ressource, this.data_interface.icone_ressource_y);
  this.ressources_trouvees(images, plat_trouve, this.data_plat, this.data_interface.icone_plat_y);
}

/**

*/
Synthese.prototype.ressources_trouvees = function(images, objet_trouve, base, _y){
  var self=this;
  var _x;
  var taille_image = redimensionnement_image(fonction_tableau_ressource(base).length, this.data_interface.max_hauteur2, this.data_interface.marge_gauche);
  var mon_image;
  var i=0;
  Object.keys(base).forEach(function(key) {
    _x = self.data_interface.marge_gauche + i*taille_image;
    mon_image = images[base[key].loc["niv"+self._target.mon_Player.niveau[key]][Math.floor(Math.random()*base[key].loc["niv"+self._target.mon_Player.niveau[key]].length)]];
    self.monCanvas.drawImage(mon_image,_x,_y,taille_image,taille_image);
    if(!objet_trouve.hasOwnProperty(key)){
      self.monCanvas.globalAlpha = self.data_interface.alpha_;
      self.monCanvas.fillStyle = self.data_interface.couleur_masque;
      self.monCanvas.fillRect(_x, _y, taille_image, taille_image);
      self.monCanvas.globalAlpha =   1;
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
