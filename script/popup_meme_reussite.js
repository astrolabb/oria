/**
creation du popup pour le jeu de la mémé
uniquement dans le cadre d'une réussite
cette affichage a du sens car plusieurs images doivent être affichées pour
expliquer les différentes recettes

@param monCanvas context canevas où on affiche le popup
@param _target object (object popup)
@param data_equilibrage object (objects contenus dans le fichier data_equilibrage)
@param data_interface object (object popup du fichier data_interface.json)
@param ma_recette array tableau [0] ressource ou plat à creer [1] les ingrédients

*/
var Popup_meme_reussite = function(monCanvas, _target, data_equilibrage, data_interface, ma_recette)
{
  var self = this;
  _target.arrayOfGameObjects = [];
  Object.keys(data_interface.elements).forEach(function(key) {
      console.log(key+" "+data_interface.elements[key]);
      if(data_interface.elements[key].nature == "image"){
        self[key] = new Icone(monCanvas, data_interface.elements[key], key, _target);
        _target.arrayOfGameObjects.push([key,"image",self[key], key]);

      }
  });
  Object.keys(data_interface.elements).forEach(function(key) {
      console.log(key+" "+data_interface.elements[key]);
      if(data_interface.elements[key].nature == "text"){
          self[key] = new Text_affichage(monCanvas, data_interface.elements[key], key, data_interface.maxWidth_text, data_interface.lineHeight, _target.data_texte.map, data_interface.elements[key].reference=="" ? "" : data_interface.elements[data_interface.elements[key].reference]);
          _target.arrayOfGameObjects.push([key,"text",self[key], key]);
      }
  });
  // si il y a une image à afficher, on crée un nouvel objet
  if(ma_recette.length == 2){
    console.log("nom_image "+ma_recette[0]);
    var data_nature = {};

    for(var i=0; i<ma_recette[1].length; i++){

      if(data_equilibrage.ressource.hasOwnProperty(ma_recette[1][i])){
        data_nature = data_equilibrage.ressource;
      }else if(data_equilibrage.plats.hasOwnProperty(ma_recette[1][i])){
        data_nature = data_equilibrage.plats
      }
      self[ma_recette[1][i]] = new Icone(monCanvas, data_nature[ma_recette[1][i]], ma_recette[1][i], _target);
      self[ma_recette[1][i]]._width = (data_interface.icone_width);
      self[ma_recette[1][i]]._height = (data_interface.icone_height);
      self[ma_recette[1][i]]._x =  window.innerWidth/2 - data_interface.icone_width/2 - (ma_recette[1].length-1)*data_interface.icone_width/2 + self[ma_recette[1][i]]._width*i;
      self[ma_recette[1][i]]._y =  window.innerHeight/4;

      _target.arrayOfGameObjects.push([ma_recette[1][i], "image", self[ma_recette[1][i]], ma_recette[1][i]]);

    }

    for(var i=0; i<ma_recette[1].length; i++){

      if(ma_recette[1].length>1 && i>0){

          self[String("plus_"+i)] = new Icone(monCanvas, data_interface.elements.plus, String("plus_"+i), _target);
          self[String("plus_"+i)]._width = data_interface.icone_width;
          self[String("plus_"+i)]._height = data_interface.icone_height;
          self[String("plus_"+i)]._x =  window.innerWidth/2 - data_interface.icone_width - (ma_recette[1].length-1)*data_interface.icone_width/2 + self[String("plus_"+i)]._width*i;
          self[String("plus_"+i)]._y =  window.innerHeight/4;

          _target.arrayOfGameObjects.push([String("plus_"+i), "image", self[String("plus_"+i)], "plus"]);
      }
    }

    if(data_equilibrage.ressource.hasOwnProperty(ma_recette[0])){
      data_nature = data_equilibrage.ressource;
    }else if(data_equilibrage.plats.hasOwnProperty(ma_recette[0])){
      data_nature = data_equilibrage.plats
    }
    self[ma_recette[0]] = new Icone(monCanvas, data_nature[ma_recette[0]], ma_recette[0], _target);
    self[ma_recette[0]]._width = data_interface.icone_width;
    self[ma_recette[0]]._height = data_interface.icone_height;
    self[ma_recette[0]]._x =  window.innerWidth/2 - self[ma_recette[0]]._width/2;
    self[ma_recette[0]]._y =  window.innerHeight/4 + 2*(data_interface.icone_height);

    _target.arrayOfGameObjects.push([ma_recette[0], "image", self[ma_recette[0]], ma_recette[0]]);

    self["egal"] = new Icone(monCanvas, data_interface.elements.egal, "egal", _target);
    self["egal"]._width = (data_interface.icone_width);
    self["egal"]._height = (data_interface.icone_height);
    self["egal"]._x =  window.innerWidth/2 - data_interface.icone_width/2;
    self["egal"]._y =  window.innerHeight/4 + 1*(data_interface.icone_height) ;

    _target.arrayOfGameObjects.push(["egal", "image", self[String("egal")], "egal"]);


  }

}
