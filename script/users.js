var Player = function (){
  this.or = 0;
  // affichage du mix choisi dans la section lonono pour la synthese de plat
  this.lonono_mix_plat = "";
  // affichage du mix choisi dans la section lonono pour la synthese de ressource
  this.lonono_mix_ressource = "";
  this.niveau = {};
  this.niveau_max = 0;
  // objet_debloque : Object répertorie tous les objets débloqués
  this.objet_debloque = {};
  // propriete servant à stocker la date du dernier lancé de la roue de la chance
  this.jardin_date_lance_roue = 0;
  // propriete poubelle : malus utilisé dans la section jardin pour les chances de gagner à la roue de la fortune
  this.jardin_poubelle = 0;
}

Player.prototype.setup = function (data_equilibrage)
{
  console.log("test 1 "+data_equilibrage.or);
  this.or = Number(data_equilibrage.or);
  this.plat = data_equilibrage.plat_demarrage;
  this.ressource = data_equilibrage.ressource_demarrage;
  this.niveau = data_equilibrage.niveau;
  this.niveau_max = data_equilibrage.max_niveau;
  this.ressource.nb_objet = this.init_nb_objet();


}
/**



*/
Player.prototype.changement_niv = function(key){
  console.log("changement_niv "+key)
  if(this.niveau[key]<this.niveau_max){
    this.niveau[key] +=1;
  }

}

/**
initialisation des niveaux
@return Object niveau structure "nom_image" -> "niveau"
*/
Player.prototype.niveau_init = function (arrayOfGameObjects){
  var mon_niveau = {}
  for (var i in arrayOfGameObjects) {
      if(arrayOfGameObjects[i][1]=="image" && !mon_niveau[arrayOfGameObjects[i][0]] || arrayOfGameObjects[i][1]=="image_chute" && !mon_niveau[arrayOfGameObjects[i][0]]){
        console.log("niveau_init "+String("niv"+this.niveau[arrayOfGameObjects[i][0]]) );
         mon_niveau[arrayOfGameObjects[i][0]] = String("niv"+this.niveau[arrayOfGameObjects[i][0]]);
      }
  }
  return mon_niveau;
}
/**
vente ou achat d'un article
@param key : Object article vendu ou acheté
@param nb_unit_key : Number nb_article vendus
@param ref : String monnaie de référence
@return Boolean true si l'échange si fait, false si il ne se fait pas

*/
Player.prototype.echange = function(key, nb_unit_key, ref, data){
  // si on vend un plat et qu'il y en a en stock
  if(nb_unit_key>0 && this.plat[key]>0){
    this.plat[key]--;
    this[ref]+=data[ref];
    return true;
  }else if(nb_unit_key<0 && this[ref]>=-nb_unit_key){
    this.ressource[key]++;
    this[ref]-=-data[ref];
    return true;
  }else{
    return false;
  }


}
/**
echange d'une ressource contre un plat ou une autre ressource
@param mix : array tableau représentant l'association de ressources sélectionnées
@param mix2 : array tableau représentant la catégorie des éléments présent dans : mix (ressource ou plat)
@param nombre : Number nombre de ressources créées
@param cat : catégorie de la ressource générée : ressource ou plat
@param _target : ressource générée
@return Boolean true si l'échange si fait, false si il ne se fait pas

*/
Player.prototype.echange2 = function(mix, mix2, resultat, nombre, cat,  _target){
  // si on vend un plat et qu'il y en a en stock
  for(i=0; i<mix.length; i++){
    // big dedicace NathalieOria héhé !
    console.log("mix "+mix[i]);
    console.log("mix2 "+mix2[i]);
    console.log("cat "+cat);
    console.log("resultat "+resultat);
    console.log("nombre "+nombre);

    this[mix2[i]][mix[i]] --;
  };
  this[cat][resultat] =  this[cat][resultat] + nombre;
  return true;
}
/**
prototype update_nb_objet
met à jour la propriété : nb_objet de l'object ressource
en comptabilisant le nombre d'objets découverts

@return total Number
*/
Player.prototype.update_nb_objet = function(bareme, nom, icone){
  var self = this;
  //console.log("update_nb_objet 1 "+ bareme[String(this.niveau[icone])]);
//  console.log("update_nb_objet "+JSON.stringify(this.niveau));
  console.log("update_nb_objet 2 "+ this.niveau[icone]);
  console.log("update_nb_objet 3 "+ nom);
  var total = 0 ;
  if(bareme[String(this.niveau[icone])]){
    total = -bareme[String(this.niveau[icone])][nom];
  }

  Object.keys(this.objet_debloque).forEach(function(key) {
            total++;
    });
    return total;
}
/**
fonction init_nb_objet
initialisation de la propriété b_objet de l'object ressource
au lancement du jeu

@return total Number Nombre d'objets débloqué au démarrage
*/
Player.prototype.init_nb_objet = function(){
  var self = this;
  var total = 0;
    Object.keys(this.ressource).forEach(function(key) {
        if(self.ressource[key]>0){
            self.objet_debloque[key] = self.ressource[key];
            total++;
        }
    });
    return total;
}
