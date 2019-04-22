/**
creation d'un popup (résultat d'un jeu, affichage information)

@param monCanvas context canevas où on affiche le popup
@param _target object (object popup)
@param data_equilibrage object (objects contenus dans le fichier data_equilibrage)
@param data_interface object (object popup du fichier data_interface.json)
@param image_a_afficher object (object de l'image à afficher : cela peut être une ressource ou un plat)
@param nom_image String : nom de l'object de l'image à afficher
*/
var Popup = function(monCanvas, _target, data_equilibrage, data_interface, image_a_afficher, nom_image)
{
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
          self[key] = new Text_affichage(monCanvas, data_interface.elements[key], key, data_interface.maxWidth_text, data_interface.lineHeight, _target.data_texte.map, data_interface.elements[key].reference=="" ? "" : data_interface.elements[data_interface.elements[key].reference]);
          _target.arrayOfGameObjects.push([key,"text",self[key]]);
      }
  });
  // si il y a une image à afficher, on crée un nouvel objet
  if(image_a_afficher!=""){
    console.log("nom_image "+nom_image);
    self[nom_image] = new Icone(monCanvas, image_a_afficher, nom_image, _target);
    self[nom_image]._width = data_interface.icone_width;
    self[nom_image]._height = data_interface.icone_height;
    self[nom_image]._x =  window.innerWidth/2 - self[nom_image]._width/2;
    self[nom_image]._y =  window.innerHeight/3;

    _target.arrayOfGameObjects.push([nom_image, "image", self[nom_image]]);
  }

}
