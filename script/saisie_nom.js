var Saisie_nom = function(monCanvas, _target, data_interface){
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
          self[key] = new Text_affichage(monCanvas, data_interface.elements[key], key, data_interface.maxWidth_text, data_interface.lineHeight, _target.data_texte.saisie_nom, data_interface.elements[key].reference=="" ? "" : data_interface.elements[data_interface.elements[key].reference]);
          _target.arrayOfGameObjects.push([key,"text",self[key]]);
      }
  });
};
Saisie_nom.prototype.mon_champ_saisie = function(ma_classe){
  this.mon_champ = document.createElement("input");
  this.mon_champ.type = "text";
  this.mon_champ.className = ma_classe.classe_champ_saisie;
//  this.mon_champ.style.position = 'fixed';
//  this.mon_champ.style.top = 30+"%";
//  mon_champ.style.left = 50+"%";
  this.mon_champ.style.font = format_police(ma_classe.taille_police_champ_saisie, ma_classe.police_champ_saisie);
  document.body.appendChild(this.mon_champ);
  this.mon_champ.focus();
}
