var Player = function (){
  this.or = 0;
  this.niveau = {};
  this.niveau_max = 0;

}

Player.prototype.setup = function (data_equilibrage)
{
  console.log("test 1 "+data_equilibrage.or);
  this.or = Number(data_equilibrage.or);
  this.plat = data_equilibrage.plat_demarrage;
  this.ressource = data_equilibrage.ressource_demarrage;
  this.niveau = data_equilibrage.niveau;
  this.niveau_max = data_equilibrage.max_niveau;

}
/**



*/
Player.prototype.changement_niv = function(nom){
  console.log("changement_niv "+nom)
  if(this.niveau[nom]<this.niveau_max){
    this.niveau[nom] +=1;
  }

}

/**
initialisation des niveaux
@return Object niveau structure "nom_image" -> "niveau"
*/
Player.prototype.niveau_init = function (arrayOfGameObjects){
  var mon_niveau = {}
  for (var i in arrayOfGameObjects) {
      if(arrayOfGameObjects[i][1]=="image" && !mon_niveau[arrayOfGameObjects[i][0]]){
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
