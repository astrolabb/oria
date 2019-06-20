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
        _target.arrayOfGameObjects.push([key,"image",self[key], key]);

      }
  });
  Object.keys(data_interface.elements).forEach(function(key) {
      console.log(key+" "+data_interface.elements[key]);
      if(data_interface.elements[key].nature == "text"){

          // si une image n'est pas présente, on place le texte en haut
          // sinon on le place comme précesé dans le fichier data_interface.json
          if(image_a_afficher!=""){
            data_interface.elements[key]._y = data_interface.position_texte_si_image_y;
          }else{
            data_interface.elements[key]._y = data_interface.position_texte_pas_image_y;
          }

          // on paramètre l'espace entre les lignes en fonction de l'orientation de l'écran
          if(window.innerWidth > window.innerHeight){
            var espace_entre_ligne = data_interface.lineHeight;
          }else{
            var espace_entre_ligne = data_interface.lineHeight2;
          }
          self[key] = new Text_affichage(monCanvas, data_interface.elements[key], key, data_interface.maxWidth_text, espace_entre_ligne, _target.data_texte.popup, data_interface.elements[key].reference=="" ? "" : data_interface.elements[data_interface.elements[key].reference]);
          _target.arrayOfGameObjects.push([key,"text",self[key], key]);
      }
  });
  // si il y a une image à afficher, on crée un nouvel objet
  if(image_a_afficher!=""){
    console.log("nom_image "+nom_image);
    self[nom_image] = new Icone(monCanvas, image_a_afficher, nom_image, _target);
    self[nom_image]._width = data_interface.icone_width;
    self[nom_image]._height = data_interface.icone_height;
    self[nom_image]._x =  window.innerWidth/2 - self[nom_image]._width/2;
    self[nom_image]._y =  data_interface.position_image;

    _target.arrayOfGameObjects.push([nom_image, "image", self[nom_image], nom_image]);
  }

}
