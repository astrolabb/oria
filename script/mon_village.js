var Mon_Village = function(monCanvas, _target, data_equilibrage, data_interface)
{
    var self = this;
    _target.arrayOfGameObjects = [];


    // mise à l'échelle des images pour les disposer à l'ecran
    data_equilibrage = this.mise_echelle(data_equilibrage, data_interface.marge_gauche, data_interface.marge_haut);

    this.data_equilibrage = data_equilibrage;
    this.data_interface = data_interface;

    console.log("nombre de plat "+JSON.stringify(this.plat));
    Object.keys(data_interface.elements).forEach(function(key) {
        console.log(key+" "+data_interface.elements[key]);
        if(data_interface.elements[key].nature == "image"){
          self[key] = new Icone(monCanvas, data_interface.elements[key], key, _target);
          _target.arrayOfGameObjects.push([key,"image"]);
        }
    });
    // boucle de création des icones du marché représentant les plats
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
Mon_Village.prototype.mise_echelle = function(data_equilibrage, left, up){

  var marge_gauche = left;
  var marge_haut = up;
  var nb_image_ligne = Math.ceil(Math.sqrt(Object.keys(data_equilibrage).length));
  console.log("data_equilibrage longueur "+Object.keys(data_equilibrage).length);
  console.log("nb_image_ligne "+nb_image_ligne);
  console.log("largeur ecran "+window.innerWidth);
  console.log("hauteur ecran "+window.innerHeight);
  var largeur_image = (window.innerWidth/2 - 2*marge_gauche - (nb_image_ligne*5))/nb_image_ligne;
  console.log("largeur_image "+largeur_image);
  var hauteur_image = (window.innerHeight - 1.2*marge_haut - (nb_image_ligne*5))/nb_image_ligne;
  console.log("hauteur_image "+hauteur_image);
  largeur_image = largeur_image>hauteur_image ? hauteur_image : largeur_image;
  hauteur_image = largeur_image>hauteur_image ? hauteur_image : largeur_image;
  var compteur = 0;
  var compteur2 = 0;
  Object.keys(data_equilibrage).forEach(function(key) {
      if(data_equilibrage[key].nature == "image"){
        compteur2 = compteur >= nb_image_ligne ? compteur2+1 : compteur2;
        compteur = compteur >= nb_image_ligne ? 0 : compteur;
        data_equilibrage[key]._x = marge_gauche + compteur*(largeur_image+5);
        data_equilibrage[key]._y = marge_haut + compteur2*(hauteur_image+5);
        data_equilibrage[key]._width = largeur_image;
        data_equilibrage[key]._height = hauteur_image;
        compteur++;
      }
  });

  return data_equilibrage;
}
