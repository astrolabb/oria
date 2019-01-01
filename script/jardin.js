/**
Constructor jardin
@param monCanvas contexte de dessin sur le Canevas
@param _target classe parentNode
@param data_interface Object données d'interface : data_interface.json

*/

var Jardin = function(monCanvas, _target, data_interface){
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
          self[key] = new Text_affichage(monCanvas, data_interface.elements[key], key, data_interface.maxWidth_text, data_interface.lineHeight, _target.data_texte.jardin);
          _target.arrayOfGameObjects.push([key,"text",self[key]]);
      }
  });


};
/**
constructor Roue

@param monCanvas : context sur lequel doit s'afficher la Roue
@param _target Object : classe parent
@param color_array Array : tableau de couleur présent dans data_interface.json
@param ressource Object : ensemble des ressources du jeu disponible dans le fichier data_equilibrage.json
@param data_interface Object : jardin présent dans le fichier sta_interface.json
@param images Object : ensemble des images du jeu stockées dans data_image_chargement.json
@param jardin_algo Object : ensemble des lots possibles classés par niveau dans le fichier data_interface.json


*/
var Roue = function(monCanvas, _target, color_array, ressource, data_interface, images, jardin_algo){
  self = this;
  this._target = _target;
  this.canvas = monCanvas;
  this.couleur = color_array;
  // mon_object sélectionne les objects des ressources dans l'object ressource qui vont être affichées sur la roue
  var mon_object = tri_ressource_jardin(ressource, jardin_algo, _target.mon_Player.niveau["jardin"]);
  // this.liste_camenbert  array tableau représentant les clés des ressources à afficher sur la roue
  this.liste_camenbert = object_to_array(mon_object, data_interface.lot_poubelle, _target.mon_Player.jardin_date_lance_roue, _target.mon_Player.jardin_poubelle, data_interface.malus_max);
  console.log("mon_object "+JSON.stringify(mon_object));
  // angle de démarrage : calibré pour commencer à la moitié d'un camembert
  this.angle_actuel = -(2*Math.PI)/(2*this.liste_camenbert.length);
  this.centre_x = window.innerWidth/2;
  this.centre_y = window.innerHeight/2;
  this.rayon = (window.innerWidth>window.innerHeight) ? data_interface.rayon_hauteur_max : data_interface.rayon_largeur_max;
  this.data_interface = data_interface;
  this.ressource = ressource;
  this.images = images;
  this.epaisseur_trait = this.rayon/50;
  this.hauteur_triangle = this.rayon/7;
  this.separation_fleche_cartouche = this.rayon/20;
  this.largeur_texte = 0;
  // nom du lot gagné
  this.resultat = "";
  // clé du lot gagné
  this.resultat_key = data_interface.lot_poubelle;


  this.dessin_repere(images);
  this.dessin_roue(images);



}
/**
prototype timer
*/
Roue.prototype.mon_timer = function(){
  var self = this;
  // ma_duree_random Number durée de rotation de la roue aléatoire
  var ma_duree_random = self.data_interface.duree_rotation*Math.random();
  var mon_heure = new Date().getTime();
  this.mon_timer_roue = setInterval( function(){
      self.tourne(mon_heure, ma_duree_random, self.data_interface.rotation_par_frame, self.images)
    }, self.data_interface.delay_timer);

}

/**
prototype dessin_roue
@param images Object : ensemble des images du jeu stockées dans data_image_chargement.json

*/
Roue.prototype.dessin_roue = function(images) {
  var self = this;
  var portion_camembert = (2*Math.PI)/this.liste_camenbert.length;
  var angle_debut_arc = this.angle_actuel;
    for(var i=0; i<(this.liste_camenbert.length) ; i++ ){
      var angle_fin_arc = portion_camembert*(i+1) + this.angle_actuel;
      self.dessin_camembert(i, angle_debut_arc, angle_fin_arc, this.liste_camenbert[i], portion_camembert,images);
      angle_debut_arc = angle_fin_arc;
    }

		// dessin d'un petit cercle à la base
    this.canvas.beginPath();
		this.canvas.arc(this.centre_x, this.centre_y, this.data_interface.rayon_petit_cercle, 0, 2*Math.PI, false);
    this.canvas.closePath();
    this.canvas.fillStyle = this.data_interface.couleur_petit_disque;
    this.canvas.fill();
    // dessin d'un grand cercle
    this.canvas.beginPath();
		this.canvas.arc(this.centre_x, this.centre_y, this.rayon, 0, 2*Math.PI, false);
    this.canvas.closePath();
    this.canvas.lineWidth   = this.epaisseur_trait;
    this.canvas.stroke();
}
/**
prototype dessin_camembert
dessine une portion de la roue
@param key Number itération dans le tableau this.liste_camenbert représentant les clés des ressources à afficher sur la roue
@param angle_deb Number angle du début du camembert par rapport à l'horizontale
@param angle_fin Number angle de fin du camembert par rapport à l'horizontale
@param nom String clé de la ressource à afficher
@param portion_camembert Number angle occupé par le camembert
@param images Object : ensemble des images du jeu stockées dans data_image_chargement.json


*/
Roue.prototype.dessin_camembert = function(key, angle_deb, angle_fin, nom, portion_camembert, images){

  this.canvas.beginPath();
  this.canvas.moveTo(this.centre_x, this.centre_y);
  this.canvas.arc(this.centre_x, this.centre_y, this.rayon, angle_deb, angle_fin);
  this.canvas.lineTo(this.centre_x, this.centre_y);
  this.canvas.closePath();

  this.canvas.fillStyle = this.couleur[key%this.couleur.length];
  this.canvas.fill();
  this.canvas.strokeStyle = this.data_interface.couleur_trait;
  this.canvas.stroke();

  this.canvas.save();
  this.canvas.translate(this.centre_x, this.centre_y);
  this.canvas.rotate((angle_deb+angle_fin)/2);

  this.canvas.fillStyle = "white";

  console.log(" nom "+nom);
    console.log(" this.ressource[nom] "+this.ressource[nom]);
      console.log(" this.ressource[nom].loc "+this.ressource[nom].loc);
  console.log(" images[this.ressource[nom].loc.niv1[0]] "+images[this.ressource[nom].loc.niv1[0]]);

//  this.canvas.fillText(this.ressource[nom].nom, 2*this.rayon/3, 0 );
  var taille_icone =this.rayon/2;
  console.log(" taille_icone "+taille_icone);
  this.canvas.drawImage(images[this.ressource[nom].loc.niv1[0]],this.rayon/3,-taille_icone/2,taille_icone,taille_icone);
  this.canvas.restore();

}
/**
prototype dessin_repere
dessine le décor autour de la roue : un fleche, le cartouche de résultat

*/
Roue.prototype.dessin_repere = function(images){


  this.canvas.beginPath();
  this.canvas.moveTo((2*this.epaisseur_trait) + this.centre_x+this.rayon, this.centre_y);
  this.canvas.lineTo((2*this.epaisseur_trait) + this.centre_x+this.rayon+this.hauteur_triangle, this.centre_y+this.hauteur_triangle);
  this.canvas.lineTo((2*this.epaisseur_trait) + this.centre_x+this.rayon+this.hauteur_triangle, this.centre_y-this.hauteur_triangle);
  this.canvas.closePath();
  this.canvas.fillStyle = this.data_interface.couleur_fleche;
  this.canvas.fill();

  var cle = (this.liste_camenbert.length - Math.ceil(((this.angle_actuel/(2*Math.PI))*this.liste_camenbert.length)))%this.liste_camenbert.length;
  console.log("cle "+cle);
  console.log("this.liste_camenbert[cle] "+this.liste_camenbert[cle]);
  var metrics_cle = this.canvas.measureText(this.liste_camenbert[cle]);
  var Width_cle = metrics_cle.width;
  if(Width_cle > this.largeur_texte){
    this.largeur_texte = Width_cle;
  }
  this.canvas.beginPath();
  this.canvas.fillStyle = this.data_interface.couleur_cartouche;
  this.canvas.fillRect((2*this.epaisseur_trait) + this.centre_x+this.rayon, this.centre_y+this.hauteur_triangle+this.separation_fleche_cartouche, this.largeur_texte, window.innerHeight/this.data_interface.taille_police1);
  this.canvas.closePath();


  this.canvas.textAlign = "left";
  this.canvas.textBaseline = "hanging";
  this.canvas.fillStyle = this.data_interface.couleur_texte;
  var texte_afficher = this.ressource[this.liste_camenbert[cle]].nom;
  this.resultat = texte_afficher;
  this.resultat_key = this.liste_camenbert[cle];
  this.canvas.font = format_police(this.data_interface.taille_police1, this.data_interface.police);
  this.canvas.fillText(texte_afficher, (2*this.epaisseur_trait) + this.centre_x+this.rayon, this.centre_y+this.hauteur_triangle+this.separation_fleche_cartouche)
}
/**
prototype tourne
fonction lue par le timer mon_timer permettant de calculer angle_actuel : l'angle de la première
ressource par rapport à l'horizontale

@param mon_heure Number date en milliseconde du démarrage de la roue
@param duree Number durée de rotation de la roue aléatoire
@param rotation Number angle de la rotation par frame
@param images Object : ensemble des images du jeu stockées dans data_image_chargement.json

*/

Roue.prototype.tourne = function(mon_heure, duree, rotation, images){
 var nouvelle_heure = new Date().getTime();
  if(nouvelle_heure>mon_heure+((this.data_interface.duree_acceleration+duree)*1000)){
    var temps_passe = (nouvelle_heure-mon_heure)/1000;
    var mon_angle_par_frame = this.angle_per_frame(rotation, temps_passe, this.data_interface.duree_deceleration, duree, this.data_interface.duree_deceleration) ;
    this.angle_actuel = this.angle_actuel + mon_angle_par_frame;
      if(this.angle_actuel>= 2*Math.PI-(2*Math.PI/this.liste_camenbert.length)){
        this.angle_actuel -= 2*Math.PI;
      }
      this.dessin_repere(images);
      this.dessin_roue(images);
      if(mon_angle_par_frame<=0){
        clearInterval(this.mon_timer_roue);
        this.mon_timer_roue = false;
        this._target.mon_Player.jardin_date_lance_roue = new Date().getTime();
        this._target.mon_Player.jardin_poubelle += 100;
        this._target.mon_Player.ressource[this.resultat_key] +=1;
        this._target.mon_Player.objet_debloque[this.resultat_key] = true;
        this._target.popup("setup2", this.resultat, "", "map", "jardin_fin");
      }
  }else{
    var temps_passe = (nouvelle_heure-mon_heure)/1000;
    this.angle_actuel += this.angle_per_frame(rotation, temps_passe, this.data_interface.duree_acceleration, duree, this.data_interface.duree_deceleration) ;
      if(this.angle_actuel>= 2*Math.PI-(2*Math.PI/this.liste_camenbert.length)){
        this.angle_actuel -= 2*Math.PI;
      }
      this.dessin_repere(images);
      this.dessin_roue(images);

  }
}
/**
prototype angle_per_frame
calcule l'angle de rotation pour chaque frame
cet angle est différent en phase d'accélération et de décélération
@param rotation Number angle de la rotation par frame défini dans l'objet jardin du fichier data_interface.json
@param duree_lancement Number temps écoulé depuis le lancement de la roue
@param duree_acceleration Number durée de la phase d'accéleration
@param duree Number durée de la phase stationnaire
@param duree_deceleration Number durée de la phase de décélération

*/
Roue.prototype.angle_per_frame = function(rotation, duree_lancement, duree_acceleration, duree, duree_deceleration){
  if(duree_lancement<duree_acceleration){
      return rotation*Math.sin((duree_lancement/duree_acceleration)*(Math.PI/2)) ;
  }else if(duree_lancement>(duree_acceleration+duree)){
      return rotation*Math.cos(((duree_lancement-duree_acceleration-duree)/duree_deceleration)*(Math.PI/2)) ;
  }else{
    return rotation;
  }

}
