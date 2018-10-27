var Mon_Village = function(monCanvas, _target, data_equilibrage, data_interface)
{
    var self = this;
    _target.arrayOfGameObjects = [];
    // mise à l'échelle des images pour les disposer à l'ecran
    data_equilibrage = this.mise_echelle(data_equilibrage);

    Object.keys(data_interface.elements).forEach(function(key) {
        console.log(key+" "+data_interface.elements[key]);
        if(data_interface.elements[key].nature == "image"){
          self[key] = new Icone(monCanvas, data_interface.elements[key], key, _target);
          _target.arrayOfGameObjects.push([key,"image"]);
        }
    });

    Object.keys(data_equilibrage).forEach(function(key) {
        console.log(key+" "+data_equilibrage[key]);
        if(data_equilibrage[key].nature == "image"){
          self[key] = new Icone(monCanvas, data_equilibrage[key], key, _target);
          _target.arrayOfGameObjects.push([key,"image"]);
        }
    });
    Object.keys(data_equilibrage).forEach(function(key) {
        console.log(key+" "+data_equilibrage[key]);
        if(data_equilibrage[key].nature == "text"){
            self[key] = new Text_affichage(monCanvas, data_equilibrage[key], key, data_interface.maxWidth_text, data_interface.lineHeight);
            _target.arrayOfGameObjects.push([key,"text"]);
        }
    });
    Object.keys(data_interface.elements).forEach(function(key) {
        console.log(key+" "+data_interface.elements[key]);
        if(data_interface.elements[key].nature == "text"){
          self[key] = new Text_affichage(monCanvas, data_interface.elements[key], key, data_interface.maxWidth_text, data_interface.lineHeight);
          _target.arrayOfGameObjects.push([key,"text"]);
        }
    });

}
Mon_Village.prototype.mise_echelle = function(data_equilibrage){

  var marge_gauche = window.innerWidth/20;
  var marge_haut = window.innerWidth/6;
  var nb_image_ligne = Math.ceil(Math.sqrt(data_equilibrage.length));

  var largeur_image = (window.innerWidth/2 - 2*marge_gauche)/(Math.ceil(Math.sqrt(data_equilibrage.length)));
  var hauteur_image = (window.innerHeight/2 - 2*marge_haut)/(Math.ceil(Math.sqrt(data_equilibrage.length)));
  largeur_image = largeur_image>hauteur_image ? hauteur_image : largeur_image;
  hauteur_image = largeur_image>hauteur_image ? hauteur_image : largeur_image;
  var compteur = 0;
  var compteur2 = 0;
  Object.keys(data_equilibrage).forEach(function(key) {
      if(data_equilibrage[key].nature == "image"){
        compteur2 = compteur > nb_image_ligne ? compteur2+1 : compteur2;
        compteur = compteur > nb_image_ligne ? 0 : compteur;
        data_equilibrage._x = marge_gauche + compteur*largeur_image;
        data_equilibrage._y = marge_haut + compteur2*hauteur_image;
        data_equilibrage._width = largeur_image;
        data_equilibrage._height = hauteur_image;
        compteur++;
      }
  });

  return data_equilibrage;
}
