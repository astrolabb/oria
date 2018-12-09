/**
Constructor Foret
@param monCanvas contexte de dessin sur le Canevas
@param _target classe parentNode
@param data_interface Object données d'interface : data_interface.json

*/

var Foret = function(monCanvas, _target, data_interface){
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
          self[key] = new Text_affichage(monCanvas, data_interface.elements[key], key, data_interface.maxWidth_text, data_interface.lineHeight);
          _target.arrayOfGameObjects.push([key,"text",self[key]]);
      }
  });


};
/**
@constructor Carrelage
classe de création du carrelage du jeu ainsi que ses prototypes commandant les différents comportements lors des clicks...

@param monCanvas Context : contexte sur lequel le carrelage doit être dessiné
@param _target Object : Object parent
@param color_array array : tableau repésentant les différentes couleurs de fond des cases. structure ["couleur en hexa","..."]
@param ressource Object : Object représentant les différentes ressources du jeu : object présent dans data_equilibrage.json
@param data_interface Object : Object foret présent dans le fichier data_interface.json et dont les propriétés sont les constantes du jeu de carrelage
@param images Object : Object data_image_chargement présent dans le fichier data_image_chargement.json et représentant les images chargées au démarrage
@param jardin_algo Object : algorithme de gestion des gains du jeu de carrelage

*/
var Carrelage = function(monCanvas, _target, color_array, ressource, data_interface, images, jardin_algo){

  this._target = _target;
  this.monCanvas = monCanvas;
  this.colonne = data_interface.colonne;
  this.ligne = data_interface.ligne;
  this.color_case = color_array;
  this.images = images;
  this.ressource = ressource;
  this.cases = random_case(this.ligne, this.colonne, this.color_case);
  this.table_couleur_image = liaison_couleur_image(ressource, color_array);
  console.log("this.table_couleur_image "+JSON.stringify(this.table_couleur_image));
  this.centrage_x = data_interface.centrage_carrelage_x;
  this.top_y = data_interface.top_carrelage_y;
  this.marge_x = data_interface.marge_gauche;
  this.couleur_click = data_interface.couleur_case_clickee;
  // this.sens_decalage Number 0 pour decalage vers le bas, 1 pour decalage vers le haut, 2 decalage de gauche à droite, 3 decalage de droite à gauche
  this.sens_decalage = 0;
  // this.duree_animation Number durée en frame de l'animation de affichage trait + décalage des cases
  this.duree_animation = data_interface.duree_animation;
  // this.pos_animation Number durée en frame depuis le début de l'animation affichage trait + décalage des cases
  this.pos_animation = 0;
  // this.duree_affichage_trait temps pendant lequel un trait est affiché représentant un groupe de case de même couleur
  this.duree_affichage_trait = data_interface.duree_affichage_trait;
  // this.nb_case_succes Number nombre de cases alignés considéré comme un succès par le programme
  this.nb_case_succes = data_interface.nb_case_succes;
  // this.couleur_ligne_groupe color hex : couleur des lignes montrant les groupes de cases de la même couleur
  this.couleur_ligne_groupe = data_interface.couleur_ligne_groupe;
  // this.animation : Number une animation est-elle en cours ? 0 non, 1 oui
  this.animation = 0;
  var case_width = largeur_case(this.colonne, this.marge_x);
  var case_height = hauteur_case(this.ligne, this.top_y);
  case_width<case_height ? case_height=case_width : case_width = case_height;
  // largeur de chaque case
  this.case_width = case_width;
  // hauteur de chaque case
  this.case_height = case_height;

}
/**
prototype fonction_timer
timer contenant requestAnimationFrame


*/
Carrelage.prototype.fonction_timer = function(){
    var self = this;

    // fonction timer-like de js

    this.mon_timer=window.requestAnimationFrame(function(){ self.fonction_timer();});

  if(this.animation == 1){
    console.log("refresh");
    this.pos_animation++;

    this.affichage_carrelage();
  }
}

/**

*/
Carrelage.prototype.affichage_carrelage = function(){
    var coordonnees_case;
    var coordonnees_case_masque;
    var self = this;
    for(i=this.ligne-1; i>=0; i--){
      for(j=0; j<this.colonne; j++){
        console.log("couleur "+this.cases[i][j].couleur);
        if(this.animation == 0 || this.animation == 1 && this.cases[i][j].decalage>0){
          coordonnees_case = this.coord_case(i,j, this.cases[i][j].decalage, true);
          if(i==0 && this.animation == 1 && this.cases[i][j].decalage>0){
          coordonnees_case_masque = this.coord_case(i,j, this.cases[i][j].decalage, false);
          this.dessine_case(i, j, this.couleur_click,coordonnees_case_masque);
          }
          this.dessine_case(i, j, this.cases[i][j].couleur,coordonnees_case);

        }else if( this.cases[i][j].decalage<0){
            coordonnees_case = this.coord_case(i,j, this.cases[i][j].decalage, false);
            this.dessine_case(i, j, this.couleur_click,coordonnees_case);
        }
      }
    }
    if(this.animation == 1 &&   this.pos_animation>this.duree_animation){
      this.fin_animation();
    }
  }
/**
Prototype fin_animation
fonction appelée à la fin de l'animation de placement des cases

*/
Carrelage.prototype.fin_animation = function(){
  var self = this;
  this.animation = 0;
  this.pos_animation = 0;
  var decalage_couleur;
  var decalage_case;
  var trouve;
  // j : on boucle sur le numero de colonne
  for(j=0; j<this.colonne; j++){
     decalage_couleur = 0;
      // i : on boucle sur le numero de ligne
      for(i=this.ligne-1; i>=0; i--){
        if(this.cases[i][j].decalage == -1){
          decalage_couleur++;
        }
        if(i<decalage_couleur && decalage_couleur!=0){
            this.cases[i][j].couleur = random_couleur(this.color_case);
        }else{

            decalage_case = 0;
            trouve = false;
            for(k=i-1; k>=0; k--){
              if(this.cases[k][j].decalage != -1){
                  decalage_case++;
                  if(!trouve && decalage_couleur == decalage_case){
                      trouve = true;
                      this.cases[i][j].couleur = this.cases[k][j].couleur;
                  //    this.cases[k][j].decalage = -1;
                  }
              }
            }
            if(decalage_case<decalage_couleur && this.cases[i][j].decalage == -1){
              this.cases[i][j].couleur = random_couleur(this.color_case);

            }
          }

        this.cases[i][j].decalage = 0;
    }
  }
  this.affichage_carrelage();
  var groupe = this.groupe_succes();
  this.coord_affich_groupe(groupe);
  setTimeout(function(){self.recherche_case_groupe(groupe);}, self.duree_affichage_trait);


}

/**
prottype dessine_case
dessine la case
@param : i Number : numero de la ligne du Carrelage
@param : j Number : numero de la colonne de carrelage
@param : couleur : color
*/
Carrelage.prototype.dessine_case = function(i, j, couleur, coordonnees_case){
  this.monCanvas.fillStyle = couleur;
  console.log("case_x "+coordonnees_case[0]+" case_y "+coordonnees_case[1]+" case_width "+this.case_width+" case_height"+this.case_height);
  this.monCanvas.fillRect(coordonnees_case[0], coordonnees_case[1], this.case_width, this.case_height );
  if(couleur != this.couleur_click){
    this.monCanvas.drawImage(this.images[this.ressource[this.table_couleur_image[couleur]].loc["niv"+this._target.mon_Player.niveau["foret"]][Math.floor(Math.random()*this.ressource[this.table_couleur_image[couleur]].loc["niv"+this._target.mon_Player.niveau["foret"]].length)]],coordonnees_case[0],coordonnees_case[1],this.case_width,this.case_height);
  }
}
/**
prototype coord_case
permet de récupérer les coordonnées de chaque case:

@param : i Number : numero de la ligne du Carrelage
@param : j Number : numero de la colonne de carrelage
@param : choix_decalage boolean choix si le décalage lors des animations doit être pris en compte : false non, true oui
@return : mon_array array structure [abscisse case, ordonnee case, largeur case, hauteur case ]

*/
Carrelage.prototype.coord_case = function(i, j, decalage, choix_decalage){

    var case_y = ordonnee_case(i, this.top_y, this.case_height);
    var case_x = abscisse_case(j, this.centrage_x, this.marge_x, this.case_width,this.colonne);
    var mon_array = [case_x, case_y];
    if(choix_decalage){
      mon_array = decalage_case([case_x, case_y], this.sens_decalage, decalage, this.duree_animation, this.pos_animation, this.case_width, this.case_height);
    }

  return mon_array;
}
/**

*/
Carrelage.prototype.click = function(_x, _y){
      console.log("click : x "+_x+" y "+_y);
      // on ne peut clicker que si il n'y a pas d'animation en cours
      if(this.animation == 0){
        this.animation = 1;
        this.pos_animation = 0;
        var i = this.trouve_la_case(_x, _y)["ord"];
        var j = this.trouve_la_case(_x, _y)["abs"];
        console.log("i "+i+" j "+j);
        this.cases[i][j].couleur=this.couleur_click;
        this.cases[i][j].decalage=-1;
        this.calcul_decalage();
        this.affichage_carrelage();
      }
}
/**
prototype calcul_decalage
calcule le décalage à effectuer pour chaque case

*/
Carrelage.prototype.calcul_decalage = function(click_y, click_x){
  // si les cases tombent de haut en bas
  if(this.sens_decalage == 0){
      var mon_decalage;
      for(j=0; j<this.colonne; j++){
        mon_decalage = 0;
        for(i=this.ligne-1; i>=0; i--){
          if(this.cases[i][j].decalage != -1){

            this.cases[i][j].decalage = mon_decalage;
          }else{
            console.log("trou détecté");
            mon_decalage++;
          }
        }
      }
  }

}
/**

*/
Carrelage.prototype.trouve_la_case = function(_x, _y){
  var i = recherche_numero_case_ordo(_y, this.top_y, this.case_height, this.ligne);
  var j = recherche_numero_case_abs(_x, this.marge_x, this.case_width, this.colonne,this.centrage_x);
  return {"abs" : j, "ord" : i};
}

/**
@prototype groupe_succes
détermine les positions des groupes de cases considérés comme un succès par le programme

@return : groupes array tableau qui va stocker les groupes de cases de même couleur alignées
// structure [numero ligne de la case du groupe la plus basse en partant du bas, numero colonne du groupe, nombre de case de même couleur alignées, 1 pour vertical 0 pour horizontal ]

*/
Carrelage.prototype.groupe_succes = function(){


  // groupes : tableau qui va stocker les groupes de cases de même couleur alignées
  // structure [numero ligne de la case du groupe la plus basse en partant du bas, numero colonne du groupe, nombre de case de même couleur alignées, 1 pour vertical 0 pour horizontal ]
  var groupes = [];
  // nb_cases_alignees :nombre de case de la même couleur alignées
  var nb_cases_alignees;
  // change_groupe : boolean indique si il y a une interuption dans la continuité des couleurs et qu'il faut passer à un autre groupe
  var change_groupe;

  /**
  **************** groupes verticaux ********************
  */
  for(j=0; j<this.colonne; j++){
    nb_cases_alignees = 1;
    for(i=0; i<this.ligne; i++){
      change_groupe = false;
      if(i!=this.ligne-1){
        if(this.cases[i][j].couleur == this.cases[i+1][j].couleur && this.cases[i][j].decalage!=-1){
          nb_cases_alignees++;
        }else{
            change_groupe = true;
        }
      }else{
        change_groupe = true;
      }
      if(change_groupe){
          if(nb_cases_alignees>=this.nb_case_succes){
            console.log("vertical "+i+" "+j+" "+nb_cases_alignees);
            groupes.push([i, j, nb_cases_alignees, 1]);
          }
          nb_cases_alignees = 1;
      }
    }
  }

  /**
  **************** groupes horizontaux ********************
  */
  for(i=0; i<this.ligne; i++){
    nb_cases_alignees = 1;
    for(j=0; j<this.colonne; j++){
      change_groupe = false;
      if(j!=this.colonne-1){
        if(this.cases[i][j].couleur == this.cases[i][j+1].couleur && this.cases[i][j].decalage!=-1){
          nb_cases_alignees++;
        }else{
            change_groupe = true;
        }
      }else{
        change_groupe = true;
      }
      if(change_groupe){
          if(nb_cases_alignees>=this.nb_case_succes){
            console.log("horizontal "+i+" "+j+" "+nb_cases_alignees);
            groupes.push([i, j, nb_cases_alignees, 0]);

          }
          nb_cases_alignees = 1;
      }
    }
  }

  return groupes;
}
/**
@prototype coord_affich_groupe : permet de trouver les coordonnées des lignes à tracer pour mettre en évidence les groupes de cases dont les couleurs sont les mêmes

@param groupes array tableau qui va stocker les groupes de cases de même couleur alignées
// structure [numero ligne de la case du groupe la plus basse en partant du bas, numero colonne du groupe, nombre de case de même couleur alignées, 1 pour vertical 0 pour horizontal ]


*/
Carrelage.prototype.coord_affich_groupe = function(groupes){
  var mes_coord_point1;
  var mes_coord_point2;
  for(i=0; i<groupes.length; i++){
    mes_coord_point1 = this.coord_case(groupes[i][0], groupes[i][1], 0, false);
    if(groupes[i][3] == 1){
        mes_coord_point2 = this.coord_case(groupes[i][0]-groupes[i][2]+1, groupes[i][1], 0, false);
    }else if(groupes[i][3] == 0){
       mes_coord_point2 = this.coord_case(groupes[i][0], groupes[i][1]-groupes[i][2]+1, 0, false);
    }
    this.affichage_ligne([mes_coord_point1,mes_coord_point2,groupes[i][3]]);
  }

}
/**
@prototype affichage_ligne
afficher une ligne pour représenter un groupe de case de la même couleur

@param coordonnees tableau représentant les 2 extrémité de la ligne à tracer

*/
Carrelage.prototype.affichage_ligne = function(coordonnees){
/** this.monCanvas.fillStyle = this.couleur_ligne_groupe;
   if(coordonnees[2]==0){
      this.monCanvas.fillRect(coordonnees[0][0]+this.case_width/2,coordonnees[0][1] +this.case_height/2,coordonnees[0][0]-coordonnees[1][0]-this.case_width,this.case_height/5);
   }else if(coordonnees[2]==1){
      this.monCanvas.fillRect(coordonnees[0][0]+this.case_width/2,coordonnees[0][1] +this.case_height/2, this.case_width/5,Math.abs(coordonnees[0][1]-coordonnees[1][1]-this.case_height));
   }
   */
   this.monCanvas.strokeStyle=this.couleur_ligne_groupe;
   this.monCanvas.beginPath();
    if(coordonnees[2]==1){
       this.monCanvas.moveTo(coordonnees[0][0]+this.case_width/2,coordonnees[0][1] + this.case_height/2);
       this.monCanvas.lineTo(coordonnees[1][0]+this.case_width/2,coordonnees[1][1] +this.case_height/2);
    }else if(coordonnees[2]==0){
       this.monCanvas.moveTo(coordonnees[0][0]+this.case_width/2,coordonnees[0][1] + this.case_height/2);
       this.monCanvas.lineTo(coordonnees[1][0]+this.case_width/2,coordonnees[1][1] + this.case_height/2);
    }
   this.monCanvas.lineWidth=7;
   this.monCanvas.stroke();
}
/**
prototype refresh
permet d'afficher les lignes représentant les groupes de cases de la même couleur_roue
ainsi que de synchroniser l'animation de chute des cases et le remplacement des cases disparues


*/
Carrelage.prototype.refresh = function () {
  var self = this;
  this.affichage_carrelage();
  var groupe = this.groupe_succes();
  this.coord_affich_groupe(groupe);
  setTimeout(function(){self.recherche_case_groupe(groupe);}, self.duree_affichage_trait);

}
/**
prototype recherche_case_groupe
recherche toutes les cases de la grille faisant parties d'un groupe de case adjacente de meme couleur
modifie son état et sa couleur pour procéder à l'animation de chute des briques


*/
Carrelage.prototype.recherche_case_groupe = function(groupes){
console.log("les groupes "+JSON.stringify(groupes));
  for(i=0; i<groupes.length; i++){
    console.log("les groupes- "+groupes[i][2]);
    for(j=0; j<groupes[i][2]; j++){
      if(groupes[i][3]==1){
          this.cases[groupes[i][0]-j][groupes[i][1]].couleur=this.couleur_click;
          this.cases[groupes[i][0]-j][groupes[i][1]].decalage=-1;
          console.log("les groupes3- i "+Number(groupes[i][0]-j)+" j "+groupes[i][1]);

      }else if(groupes[i][3]==0){
          this.cases[groupes[i][0]][groupes[i][1]-j].couleur=this.couleur_click;
          this.cases[groupes[i][0]][groupes[i][1]-j].decalage=-1;
          console.log("les groupes3- i "+groupes[i][0]+" j "+Number(groupes[i][1]-j));

      }
    }
  }
  if(groupes.length>0){
    this.calcul_decalage();
    this.animation = 1;
    this.pos_animation = 0;
  }
  this.affichage_carrelage();

}
