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
  this._x = data_image._x;
  this._y = data_image._y;
  this.couleur = data_image.couleur;
  this.loc = data_image.loc;
  this.lien = data_image.lien;
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
