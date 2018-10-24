var Map = function(monCanvas, _target, data_interface){
  var self = this;
  this.largeur = data_interface.largeur;
  this.hauteur = data_interface.hauteur;
  _target.arrayOfGameObjects = [];
  Object.keys(data_interface.image).forEach(function(key) {
      console.log(key+" "+data_interface.image[key]);
      self[key] = new Icone(monCanvas, data_interface.image[key], key, _target);
      _target.arrayOfGameObjects.push(key);
  });



};
var Icone = function(myCanvasContext, data_image, nom, _target){
  this._target = _target;
  this.monCanvas = myCanvasContext;
  this.nom = nom;
  this.data_image = data_image;
  this._width = data_image._width;
  this._height = data_image._height;
  this._x = data_image._x;
  this._y = data_image._y;
  this.couleur = data_image.couleur;
  this.loc = data_image.loc;
  this.lien = data_image.lien;
}
Icone.prototype.draw = function(myCanvasContext){
//  myCanvasContext.fillStyle = this.couleur;
//  myCanvasContext.fillRect(this._x, this._y, this.largeur, this.hauteur);
    var self = this;
    self.monCanvas.drawImage(this._target.data_image_chargee[this.loc[Math.floor(Math.random()*this.loc.length)]],self._x,self._y,self._width,self._height);


}
