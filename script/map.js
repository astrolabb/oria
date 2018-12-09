var Map = function(monCanvas, _target, data_interface){
  var self = this;
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
          self[key] = new Text_affichage(monCanvas, data_interface.elements[key], key, data_interface.maxWidth_text, data_interface.lineHeight);
          _target.arrayOfGameObjects.push([key,"text",self[key]]);
      }
  });


};
var Icone = function(myCanvasContext, data_image, key, _target){
  this._target = _target;
  this.monCanvas = myCanvasContext;
  this.key = key;
  this.nom = data_image.nom;
  this.data_image = data_image;
  this._width = data_image._width;
  this._height = data_image._height;
  this.ombre = data_image.ombre;
  this._x = data_image._x;
  this._y = data_image._y;
  this.couleur = data_image.couleur;
  this.loc = data_image.loc;
  this.lien = data_image.lien;
  this.cat = data_image.cat;
}
Icone.prototype.draw_ombre = function(mon_alpha, key)
{
  // pour ktr55
    var self = this;

  this.monCanvas.shadowColor = '#000000';
  this.monCanvas.shadowOffsetX = 15;
  this.monCanvas.shadowOffsetY = 15;
  this.monCanvas.shadowBlur = 25;
  console.log("erreur draw_ombre "+this.key);
  console.log("erreur draw_ombre2 "+this._target.niveau[this.key]);
  this.monCanvas.drawImage(this._target.data_image_chargee[this.loc[this._target.niveau[this.key]][Math.floor(Math.random()*this.loc[this._target.niveau[this.key]].length)]],self._x,self._y,self._width,self._height);

  this.monCanvas.shadowBlur = 0;
  this.monCanvas.shadowOffsetX = 0;
  this.monCanvas.shadowOffsetY = 0;

  var object_fusionne = {};
  $.extend( object_fusionne, this._target.mon_Player.plat);
  $.extend( object_fusionne, this._target.mon_Player.ressource);

  console.log("object_fusionne "+JSON.stringify(object_fusionne));
  console.log("this.data_image "+JSON.stringify(this.data_image));

  console.log("ma clé "+key);

  if(key == "lonono"){
    var test = false;
    if(this._target.mon_Player.ressource[this.key] <= 0){
        var test = true;
    }
  }else{
    if(this.data_image.or<0){
    var test = this.isgrey(this._target.mon_Player.or, -(this.data_image.or), this.data_image.or);

    }else if(this.data_image.or>0){
    var test = this.isgrey(object_fusionne[this.key],0, this.data_image.or);
    }
  }
  if(test){
        console.log("mettre en gris");
        this.monCanvas.putImageData(grey_scale(this.monCanvas,this._x,this._y, this._width, this._height), this._x, this._y);
  }

console.log("valeur_a_afficher du texte sur icone "+object_fusionne[this.key]);
  var data_texte = {
    "_x" : self._x + (self._width/2),
    "_y" : self._y + (self._height/2),
    "text" : object_fusionne[this.key],
    "valeur_a_afficher" : this.key,
    "police" : this._target.data_interface.village.elements.texte_icone.police,
    "couleur" : this._target.data_interface.village.elements.texte_icone.couleur,
    "alignement" : this._target.data_interface.village.elements.texte_icone.alignement

  };
  this.texte_dessus = new Text_affichage(this.monCanvas, data_texte, "", 0, 0);
  this.texte_dessus.setup(data_texte.text);
}
Icone.prototype.draw = function(mon_alpha, key){
//  myCanvasContext.fillStyle = this.couleur;
//  myCanvasContext.fillRect(this._x, this._y, this.largeur, this.hauteur);
 console.log("niveau : "+JSON.stringify(this._target.niveau));
 console.log("key : "+JSON.stringify(this.key));
 console.log("images : "+JSON.stringify(this._target.niveau[this.key]));
console.log("loc : "+JSON.stringify(this.loc[this._target.niveau[this.key]]));

 //this.loc[this._target.niveau[this.key]

    var self = this;
   self.monCanvas.drawImage(this._target.data_image_chargee[this.loc[this._target.niveau[this.key]][Math.floor(Math.random()*this.loc[this._target.niveau[this.key]].length)]],self._x,self._y,self._width,self._height);
}
/**
prototype isgrey :
renvoie true si l'icone doit être en noir et blanc et false si doit être en couleur
@param Number value to check
@param String test à effectuer
@param Number ref this.data_image.or permet de différencier vente et achat

@return boolean true icone en noir et blanc false icone en couleur
*/
Icone.prototype.isgrey = function(valeur, test, ref)
{
  console.log("valeur isgrey "+valeur);
  if(ref>0 && valeur<=test){
    return true;
  }else if(ref<0 && valeur<test){
    return true;
  }else{
    return false;
  }

}
/**
constructor BoutonNiveau

*/

var BoutonNiveau = function(monCanvas, _target, bouton_niveau, bareme_niveau, map, mon_Player, decalage_x, decalage_y){
  self = this;
  this.monObject = {};
  this.echange_ressource = {};

  Object.keys(bareme_niveau).forEach(function(key) {
    if(self.testaffichage(bareme_niveau[key], mon_Player, key)){
        self[key] = new Icone(monCanvas, bouton_niveau, key, _target);
        self[key]._x = map[key]._x+self.choix_decalage(map[key]._x, decalage_x, window.innerWidth, self[key]._width);
        self[key]._y = map[key]._y+self.choix_decalage(map[key]._y, decalage_y, window.innerHeight, self[key]._height);

        _target.arrayOfGameObjects.push(["button"+key,"image", self[key]]);

        self.monObject["button"+key] = JSON.parse(JSON.stringify(bouton_niveau));
        console.log("carte object_fusionne "+map[key]._x+" key "+"button"+key);
        self.monObject["button"+key]._x = self[key]._x;
        self.monObject["button"+key]._y = self[key]._y;
        self.monObject["button"+key].key = key;
        console.log("carte object_fusionne "+JSON.stringify(self.monObject));

      }
  });
  console.log("carte object_fusionne "+JSON.stringify(this.monObject));

}
BoutonNiveau.prototype.choix_decalage = function(pos, decalage, taille_ecran, hauteur){
  if(pos+decalage+hauteur>taille_ecran){
    return -decalage;
  }else{
    return decalage;
  }
}
BoutonNiveau.prototype.testaffichage = function(bareme, mon_Player, key) {
  var mon_test = true;
  var test_nb_niveau = 0
  self = this;
  Object.keys(bareme).forEach(function(niveau) {
    (Number(niveau)>test_nb_niveau) ? test_nb_niveau=niveau : test_nb_niveau=test_nb_niveau;
    console.log("niveau "+niveau);
    console.log("mon_Player.niveau[key] "+mon_Player.niveau[key]);

    if(String(Number(mon_Player.niveau[key] + 1)) == niveau){
      console.log(String(Number(mon_Player.niveau[key] + 1))+" versus "+niveau);
      self.echange_ressource[key] = [];
          Object.keys(bareme[niveau]).forEach(function(key_niv) {
              if(!mon_Player.ressource[key_niv] || mon_Player.ressource[key_niv] <= bareme[niveau][key_niv] ){
                  mon_test = false;
              }else{
                console.log("condition dépasssée "+key_niv+ "mon_Player.ressource[key_niv] "+mon_Player.ressource[key_niv]+" bareme[niveau][key_niv] "+bareme[niveau][key_niv]);
                self.echange_ressource[key].push([key_niv, mon_Player.ressource[key_niv], bareme[niveau][key_niv]]);
              }
          });
      }
  });
  if(test_nb_niveau==mon_Player.niveau[key]){
   mon_test = false;
  }
return mon_test;
}
