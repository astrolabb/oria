/**
constructor Mon_lonono
creation et affichage des activités après click sur le lonnono

@param monCanvas canevas sur lequel on dessine
@param _target classe parente
@param data_equilibrage Object différents plats
@param data_interface Object différentes icones de la frame "lonono"
@param data_ressources Object différentes ressources du joueur
@param lonono_algo Object algorithme de creation des ressources par le lonono classées par niveau
@param lonono_algo2 Object algorithme de creation des plats par le lonono classées par niveau

*/

var Mon_lonono = function(monCanvas, _target, data_plat, data_interface, data_ressources, lonono_algo, lonono_algo2){

  var self = this;
  this.monCanvas = monCanvas;
  this.couleur_selection = data_interface.couleur_selection;
  this.alpha_ = data_interface.alpha_;
  _target.arrayOfGameObjects = [];
  // object_trie ressource à faire apparaitre colonne de gauche
  // dans la partie du haut ressources --> nouvelles ressources
  var object_trie = {};
  Object.keys(lonono_algo).forEach(function(niveau) {
    if(niveau == String(_target.mon_Player.niveau.lonono)){
        Object.keys(lonono_algo[niveau]).forEach(function(resultat) {
              lonono_algo[niveau][resultat][0].forEach(function(e,index) {
                  console.log("resultat "+e);
                    if(data_ressources[e]){
                      object_trie[e] = data_ressources[e];
                  }
                });
          });
      }
  });
  // object_trie2 trie les ressources dont les icones doivent apparaitre : colonne de gauche
  // partie du bas : ressources --> plat
  var object_trie2 = {};
  Object.keys(lonono_algo2).forEach(function(niveau) {
    if(niveau == String(_target.mon_Player.niveau.lonono)){
        Object.keys(lonono_algo2[niveau]).forEach(function(resultat) {
              lonono_algo2[niveau][resultat][0].forEach(function(e,index) {
                  console.log("resultat "+e);
                    if(data_ressources[e]){
                      object_trie2[e] = data_ressources[e];
                  }
                });
          });
      }
  });
  console.log("av_data_ressources "+JSON.stringify(object_trie));
  console.log("av_data_ressources2 "+JSON.stringify(object_trie2));

  // mise à l'échelle des images pour les disposer à l'ecran
  var data_ressources2 = mise_echelle(JSON.parse(JSON.stringify(object_trie2)), data_interface.marge_gauche, data_interface.marge_haut, 2*window.innerWidth/3, window.innerWidth/3);
  var data_ressources3 = mise_echelle(JSON.parse(JSON.stringify(object_trie)), data_interface.marge_gauche, data_interface.marge_haut, 0, window.innerWidth/3);

  console.log("data_ressources3 "+JSON.stringify(data_ressources3));
  console.log("data_ressources2 "+JSON.stringify(data_ressources2));




  this.data_plat = data_plat;
  this.data_interface = data_interface;
  this.data_ressources = data_ressources3;
  this.data_ressources2 = data_ressources2;

  Object.keys(data_interface.elements).forEach(function(key) {
      console.log(key+" "+data_interface.elements[key]);
      if(data_interface.elements[key].nature == "image"){
        self[key] = new Icone(monCanvas, data_interface.elements[key], key, _target);
        _target.arrayOfGameObjects.push([key,"image",key]);
      }
  });


  // boucle de création des icones du marché représentant les ressources : dans la section "recherche ressources"
  Object.keys(data_ressources3).forEach(function(key) {
      console.log(key+" "+data_ressources3[key]);
      if(data_ressources3[key].nature == "image"){
        self["g"+key] = new Icone(monCanvas, data_ressources3[key], key, _target);
        data_ressources3[key].action = "ressource";
        data_ressources3[key].nom2 = key;
        console.log("valeur a afficher42 "+self["g"+key]._x);
        _target.arrayOfGameObjects.push([key,"image","g"+key]);
      }
  });
  // boucle de création des icones du marché représentant les ressources : dans la section "fabrication plat"
  Object.keys(data_ressources2).forEach(function(key) {
      console.log(key+" "+data_ressources2[key]);
      if(data_ressources2[key].nature == "image"){
        self["d"+key] = new Icone(monCanvas, data_ressources2[key], key, _target);
        data_ressources2[key].action = "plat";
        data_ressources2[key].nom2 = key;
        console.log("valeur a afficher42 "+self["d"+key]._x);
        _target.arrayOfGameObjects.push([key,"image","d"+key]);
      }
  });

  // creation des objects de texte
  Object.keys(data_interface.elements).forEach(function(key) {
      console.log("ma clée "+key+" "+data_interface.elements[key]);
      console.log("ma référence "+data_interface.elements[key].reference+" "+data_interface.elements[data_interface.elements[key].reference]);
      if(data_interface.elements[key].nature == "text"){
        self[key] = new Text_affichage(monCanvas, data_interface.elements[key], key, data_interface.maxWidth_text, data_interface.lineHeight, _target.data_texte.lonono, data_interface.elements[key].reference=="" ? "" : data_interface.elements[data_interface.elements[key].reference]);
        _target.arrayOfGameObjects.push([key,"text",key]);
      }
  });
  // reformatage de l'object data_ressources2 pour prendre en compte le fait qu'une même ressource peut être utilisée plusieurs fois
  Object.keys(data_ressources3).forEach(function(key) {
      Object.keys(data_ressources2).forEach(function(key2) {
          if(key2==key){
            data_ressources2["_"+key2] = data_ressources2[key2];

          }
      });
  });
  // c'est l'object arrayOfGameObjects3 qui va servir à la création des boutons
  _target.arrayOfGameObjects3 = {};
  $.extend( _target.arrayOfGameObjects3, data_ressources2);
  $.extend( _target.arrayOfGameObjects3, data_ressources3);

  console.log("data_ressources4 "+JSON.stringify(_target.arrayOfGameObjects3));


}
/**
prototype icone_selectionne
permet de mettre en evidence par une zone grisée les ressources cliquée par le joueur

@param key String nom du bouton cliqué (commençant par g pour la colonne de gauche, droite, et _ dans le cas d'une ressource déjà utilisée)
@param data Object : propriétés du bouton cliqué
@param nb Number : nombre de fois que la ressource est sélectionnée

*/
Mon_lonono.prototype.icone_selectionne = function (key, data, nb){
//  console.log("donnee icone selectionnée "+JSON.stringify(data)+" nom object "+key);
  for(j=0; j<nb; j++){
    this.monCanvas.globalAlpha =   this.alpha_;
    this.monCanvas.fillStyle =   this.couleur_selection;
    this.monCanvas.fillRect(data._x, data._y, data._width, data._height/(j+1));
    this.monCanvas.globalAlpha =   1;
  }
}
