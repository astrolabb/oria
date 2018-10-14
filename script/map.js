var Map = function(monCanvas, _target, data_interface){
  var self = this;
  this.largeur = data_interface.largeur;
  this.hauteur = data_interface.hauteur;
  _target.arrayOfGameObjects = [];
  Object.keys(data_interface.image).forEach(function(key) {
      console.log(key+" "+data_interface.image[key]);
      self[key] = new Icone(monCanvas, data_interface.image[key], key);
      _target.arrayOfGameObjects.push(key);
  });



};

var Icone = function(myCanvasContext, data_image, nom){
  this.nom = nom;
  this.data_image = data_image;
  this.largeur = data_image.largeur;
  this.hauteur = data_image.hauteur;
  this._x = data_image._x;
  this._y = data_image._y;
  this.couleur = data_image.couleur;
}
Icone.prototype.draw = function(myCanvasContext){
  myCanvasContext.fillStyle = this.couleur;
  myCanvasContext.fillRect(this._x, this._y, this.largeur, this.hauteur);
}
