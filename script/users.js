var Player = function (){
  this.or = 0;
  this.niveau = {};
  this.niveau_max = 0;

}

Player.prototype.setup = function (data_equilibrage)
{
  console.log("test 1 "+data_equilibrage.or);
  this.or = Number(data_equilibrage.or);
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
      if(arrayOfGameObjects[i][1]=="image"){
        console.log("niveau_init "+String("niv"+this.niveau[arrayOfGameObjects[i][0]]) );
         mon_niveau[arrayOfGameObjects[i][0]] = String("niv"+this.niveau[arrayOfGameObjects[i][0]]);
      }
  }
  return mon_niveau;

}
