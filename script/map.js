var Map = function(monCanvas, _target, data_interface){
  var self = this;
  _target.arrayOfGameObjects = [];
  Object.keys(data_interface.elements).forEach(function(key) {
      console.log(key+" "+data_interface.elements[key]);
      if(data_interface.elements[key].nature == "image"){
        self[key] = new Icone(monCanvas, data_interface.elements[key], key, _target);
        _target.arrayOfGameObjects.push([key,"image"]);
      }
  });
  Object.keys(data_interface.elements).forEach(function(key) {
      console.log(key+" "+data_interface.elements[key]);
      if(data_interface.elements[key].nature == "text"){
          self[key] = new Text_affichage(monCanvas, data_interface.elements[key], key, data_interface.maxWidth_text, data_interface.lineHeight);
          _target.arrayOfGameObjects.push([key,"text"]);
      }
  });


};
var Icone = function(myCanvasContext, data_image, nom, _target){
  this._target = _target;
  this.monCanvas = myCanvasContext;
  this.nom = nom;
  this.data_image = data_image;
  this._width = data_image._width;
  this._height = data_image._height;
  this.ombre = data_image.ombre;
  this._x = data_image._x;
  this._y = data_image._y;
  this.couleur = data_image.couleur;
  this.loc = data_image.loc;
  this.lien = data_image.lien;

}
Icone.prototype.draw_ombre = function(mon_alpha)
{
  // pour ktr55
    var self = this;

  this.monCanvas.shadowColor = '#000000';
  this.monCanvas.shadowOffsetX = 15;
  this.monCanvas.shadowOffsetY = 15;
  this.monCanvas.shadowBlur = 25;

  this.monCanvas.drawImage(this._target.data_image_chargee[this.loc[this._target.niveau[this.nom]][Math.floor(Math.random()*this.loc[this._target.niveau[this.nom]].length)]],self._x,self._y,self._width,self._height);

  this.monCanvas.shadowBlur = 0;
  this.monCanvas.shadowOffsetX = 0;
  this.monCanvas.shadowOffsetY = 0;
  var test = this.isgrey(this._target.mon_Player.plat[this.nom],"inf0");
  if(test){
      console.log("mettre en gris");
      this.monCanvas.putImageData(grey_scale(this.monCanvas,this._x,this._y, this._width, this._height), this._x, this._y);
  }

console.log("valeur_a_afficher du texte sur icone "+this._target.mon_Player.plat[this.nom]);
  var data_texte = {
    "_x" : self._x + (self._width/2),
    "_y" : self._y + (self._height/2),
    "text" : this._target.mon_Player.plat[this.nom],
    "valeur_a_afficher" : this.nom,
    "police" : this._target.data_interface.village.elements.texte_icone.police,
    "couleur" : this._target.data_interface.village.elements.texte_icone.couleur,
    "alignement" : this._target.data_interface.village.elements.texte_icone.alignement

  };
  this.texte_dessus = new Text_affichage(this.monCanvas, data_texte, "", 0, 0);
  this.texte_dessus.setup(data_texte.text);
}
Icone.prototype.draw = function(myCanvasContext){
//  myCanvasContext.fillStyle = this.couleur;
//  myCanvasContext.fillRect(this._x, this._y, this.largeur, this.hauteur);
 console.log("niveau : "+JSON.stringify(this._target.niveau));
 console.log("nom : "+JSON.stringify(this.nom));
 console.log("images : "+JSON.stringify(this._target.niveau[this.nom]));
console.log("loc : "+JSON.stringify(this.loc[this._target.niveau[this.nom]]));

 //this.loc[this._target.niveau[this.nom]

    var self = this;
   self.monCanvas.drawImage(this._target.data_image_chargee[this.loc[this._target.niveau[this.nom]][Math.floor(Math.random()*this.loc[this._target.niveau[this.nom]].length)]],self._x,self._y,self._width,self._height);
}
/**
prototype isgrey :
renvoie true si l'icone doit être en noir et blanc et false si doit être en couleur
@param Number value to check
@param String test à effectuer

@return boolean true icone en noir et blanc false icone en couleur
*/
Icone.prototype.isgrey = function(valeur, test)
{
  console.log("valeur isgrey "+valeur);
  if(test=="inf0" && valeur<=0){
    return true;
  }else{
    return false;
  }

}
