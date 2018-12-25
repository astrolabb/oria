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
var Carrelage = function(monCanvas, _target, color_array, ressource, data_interface, images, foret_algo){

  this._target = _target;
  this.monCanvas = monCanvas;
  this.colonne = data_interface.colonne;
  this.ligne = data_interface.ligne;
  this.color_case = color_array;
  this.images = images;
  this.ressource = ressource;
  this.data_interface = data_interface;
  console.log("this.foret_algo "+JSON.stringify(foret_algo));
  console.log("this.foret_algo2 "+JSON.stringify(foret_algo[String(this._target.mon_Player.niveau["foret"])]));
  console.log("this.foret_algo3 "+this._target.mon_Player.niveau["foret"]);
  this.foret_algo = foret_algo[String(this._target.mon_Player.niveau["foret"])];
  this.cases = random_case(this.ligne, this.colonne, this.color_case);
  this.table_couleur_image = liaison_couleur_image(ressource, color_array);
  console.log("this.table_couleur_image "+JSON.stringify(this.table_couleur_image));
  this.centrage_x = data_interface.centrage_carrelage_x;
  this.top_y = data_interface.top_carrelage_y;
  this.marge_x = data_interface.marge_gauche;
  this.taille_groupe_max = data_interface.taille_groupe_max;
  this.couleur_click = data_interface.couleur_case_clickee;
  // this.sens_decalage Number 0 pour decalage vers le bas, 1 pour decalage vers le haut, 2 decalage de gauche à droite, 3 decalage de droite à gauche
  this.sens_decalage = 2;
  // this.duree_animation Number durée en frame de l'animation de affichage trait + décalage des cases
  this.duree_animation = data_interface.duree_animation;
  // this.pos_animation Number durée en frame depuis le début de l'animation affichage trait + décalage des cases
  this.pos_animation = 0;
  // this.duree_affichage_trait temps pendant lequel un trait est affiché représentant un groupe de case de même couleur
  this.duree_affichage_trait = data_interface.duree_affichage_trait;
  // this.nb_case_succes Number nombre de cases alignés considéré comme un succès par le programme
  this.nb_case_succes = foret_algo[String(this._target.mon_Player.niveau["foret"])].nb_case_succes;
  this.score = 0;
  this.gain = foret_algo[String(this._target.mon_Player.niveau["foret"])].gain;
  console.log("this.gain "+JSON.stringify(this.gain));
  this.date_debut = new Date().getTime();
  this.duree = foret_algo[String(this._target.mon_Player.niveau["foret"])].duree;
  this.point_par_case = foret_algo[String(this._target.mon_Player.niveau["foret"])].point_par_case;
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
  // affichage du décors du jeu
  this.decors();


}
/**
prototype fonction_timer
timer contenant requestAnimationFrame


*/
Carrelage.prototype.fonction_timer = function(){
    var self = this;

    // fonction timer-like de js

  this.mon_timer=window.requestAnimationFrame(function(){ self.fonction_timer();});

  this.affiche_score();
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
    if(this.sens_decalage == 0 || this.sens_decalage == 1){
        for(i=this.ligne-1; i>=0; i--){
          for(j=0; j<this.colonne; j++){
            k = this.conversion_sens_glissement("ligne", i, this.ligne-1);
            l = this.conversion_sens_glissement("colonne", j, this.colonne-1);
            console.log("couleur "+this.cases[k][l].couleur);
            if(this.animation == 0 || this.animation == 1 && this.cases[k][l].decalage>0){
              coordonnees_case = this.coord_case(k,l, this.cases[k][l].decalage, true);
              if(k==0 && this.animation == 1 && this.cases[k][l].decalage>0){
              coordonnees_case_masque = this.coord_case(k,l, this.cases[k][l].decalage, false);
              this.dessine_case(k, l, this.couleur_click,coordonnees_case_masque);
              }
              this.dessine_case(k, l, this.cases[k][l].couleur,coordonnees_case);

            }else if( this.cases[k][l].decalage<0){
                coordonnees_case = this.coord_case(k,l, this.cases[k][l].decalage, false);
                this.dessine_case(k, l, this.couleur_click,coordonnees_case);
            }
          }
        }
    }else if(this.sens_decalage == 2 || this.sens_decalage == 3){
      for(j=this.colonne-1; j>=0; j--){
        for(i=0; i<this.ligne; i++){
          k = this.conversion_sens_glissement("ligne", i, this.ligne-1);
          l = this.conversion_sens_glissement("colonne", j, this.colonne-1);
          console.log("couleur "+this.cases[k][l].couleur);
          if(this.animation == 0 || this.animation == 1 && this.cases[k][l].decalage>0){
            coordonnees_case = this.coord_case(k,l, this.cases[k][l].decalage, true);
            if(k==0 && this.animation == 1 && this.cases[k][l].decalage>0){
            coordonnees_case_masque = this.coord_case(k,l, this.cases[k][l].decalage, false);
            this.dessine_case(k, l, this.couleur_click,coordonnees_case_masque);
            }
            this.dessine_case(k, l, this.cases[k][l].couleur,coordonnees_case);

          }else if( this.cases[k][l].decalage<0){
              coordonnees_case = this.coord_case(k,l, this.cases[k][l].decalage, false);
              this.dessine_case(k, l, this.couleur_click,coordonnees_case);
          }
        }
      }
    }


    if(this.animation == 1 &&   this.pos_animation>this.duree_animation){
      this.fin_animation();
    }

  }
/**
prototype decors
met en place le décors de du jeu. Partie fix
par exemple le cadre autour du carrelage


*/
Carrelage.prototype.decors = function(){
  // cadre autour du carrelage
  this.monCanvas.beginPath();
  this.monCanvas.fillStyle = this.data_interface.couleur_cartouche;
  this.monCanvas.fillRect(this.centrage_x-(this.case_width*this.colonne/2)-this.data_interface.epaisseur_trait, this.top_y-this.data_interface.epaisseur_trait, (this.case_width*this.colonne)+2*this.data_interface.epaisseur_trait, (this.case_height*this.ligne)+2*this.data_interface.epaisseur_trait);
  this.monCanvas.closePath();

  // légende timer
  var largeur_panneau = this.centrage_x-(this.case_width*this.colonne/2)-this.data_interface.epaisseur_trait - 2* this.data_interface._x_score;
  var hauteur_panneau = this.data_interface._height_score;
  texte_sur_panneau(this.monCanvas, this.data_interface.couleur_texte, "Timer", this.data_interface._x_score,  this.data_interface._y_score-hauteur_panneau, largeur_panneau, hauteur_panneau,  this.data_interface.couleur_legende);
  // légende score
  var position_x_panneau_score = 3*this.data_interface._x_score + largeur_panneau + this.case_width*this.colonne + 2*this.data_interface.epaisseur_trait;
  texte_sur_panneau(this.monCanvas, this.data_interface.couleur_texte, "Score", position_x_panneau_score,  this.data_interface._y_score-hauteur_panneau, largeur_panneau, hauteur_panneau,  this.data_interface.couleur_legende);

}
/**

*/
Carrelage.prototype.affiche_score = function(){
  var self=this;

  var mon_timer = new Date().getTime();
  if(mon_timer - this.date_debut < this.duree*1000){
    var texte_afficher = Math.floor(this.duree-(mon_timer - this.date_debut)/1000);
    var largeur_panneau = this.centrage_x-(this.case_width*this.colonne/2)-this.data_interface.epaisseur_trait - 2* this.data_interface._x_score;
    var hauteur_panneau = this.data_interface._height_score;
    texte_sur_panneau(this.monCanvas, this.data_interface.couleur_texte, texte_afficher, this.data_interface._x_score,  this.data_interface._y_score, largeur_panneau, hauteur_panneau,  this.data_interface.couleur_cartouche);
    var position_x_panneau_score = 3*this.data_interface._x_score + largeur_panneau + this.case_width*this.colonne + 2*this.data_interface.epaisseur_trait;
    texte_sur_panneau(this.monCanvas, this.data_interface.couleur_texte, this.score, position_x_panneau_score,  this.data_interface._y_score, largeur_panneau, hauteur_panneau,  this.data_interface.couleur_cartouche);

  }else{
    var mon_resultat=0;
    var pallier = 0;
    var ma_quantite = 0;
    Object.keys(this.gain).forEach(function(key) {
        console.log(key+" "+JSON.stringify(self.gain[key]));
        if(self.score >= self.gain[key][1] && self.gain[key][1]>pallier){
          pallier = self.gain[key][1];
          mon_resultat = key;
          ma_quantite = self.gain[key][0];
        }
    });
    this._target.mon_Player.ressource[mon_resultat] += ma_quantite;
    this._target.stop_animation();
    if(mon_resultat == 0){
      this._target.popup("setup2", "", "", "foret", "echec");
    }else{
      this._target.popup("setup2", mon_resultat, ma_quantite, "foret", "reussite");
    }

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
  var k,l,m;

  if(this.sens_decalage == 0 || this.sens_decalage == 1){
    // j : on boucle sur le numero de colonne
    for(j=0; j<this.colonne; j++){
       decalage_couleur = 0;
        // i : on boucle sur le numero de ligne
        for(i=this.ligne-1; i>=0; i--){
          k = this.conversion_sens_glissement("ligne", i, this.ligne-1);
          l = this.conversion_sens_glissement("colonne", j, this.colonne-1);
          if(this.cases[k][l].decalage == -1){
            decalage_couleur++;
          }
          if(this.test_sens_glissement(k, decalage_couleur) && decalage_couleur!=0){
              this.cases[k][l].couleur = random_couleur(this.color_case);
          }else{

              decalage_case = 0;
              trouve = false;
              if(this.sens_decalage == 0){
                for(m=k-1; m>=0; m--){
                  if(this.cases[m][l].decalage != -1){
                      decalage_case++;
                      if(!trouve && decalage_couleur == decalage_case){
                          trouve = true;
                          this.cases[k][l].couleur = this.cases[m][l].couleur;
                      //    this.cases[k][j].decalage = -1;
                      }
                  }
                }
              }else if(this.sens_decalage == 1){
                for(m=k+1; m<=this.ligne-1; m++){
                  if(this.cases[m][l].decalage != -1){
                      decalage_case++;
                      if(!trouve && decalage_couleur == decalage_case){
                          trouve = true;
                          this.cases[k][l].couleur = this.cases[m][l].couleur;
                      //    this.cases[k][j].decalage = -1;
                      }
                  }
                }
              }

              if(decalage_case<decalage_couleur && this.cases[k][l].decalage == -1){
                this.cases[k][l].couleur = random_couleur(this.color_case);

              }
            }

          this.cases[k][l].decalage = 0;
      }
    }
  }else if(this.sens_decalage == 2 || this.sens_decalage == 3){
    // j : on boucle sur le numero de ligne
    for(i=0; i<this.ligne; i++){
       decalage_couleur = 0;
        // i : on boucle sur le numero de colonne
        for(j=this.colonne-1; j>=0; j--){
          k = this.conversion_sens_glissement("ligne", i, this.ligne-1);
          l = this.conversion_sens_glissement("colonne", j, this.colonne-1);
          if(this.cases[k][l].decalage == -1){
            decalage_couleur++;
          }
          if(this.test_sens_glissement(l, decalage_couleur) && decalage_couleur!=0){
              this.cases[k][l].couleur = random_couleur(this.color_case);
          }else{

              decalage_case = 0;
              trouve = false;
              if(this.sens_decalage == 2){
                for(m=l-1; m>=0; m--){
                  if(this.cases[k][m].decalage != -1){
                      decalage_case++;
                      if(!trouve && decalage_couleur == decalage_case){
                          trouve = true;
                          this.cases[k][l].couleur = this.cases[k][m].couleur;
                      //    this.cases[k][j].decalage = -1;
                      }
                  }
                }
              }else if(this.sens_decalage == 3){
                for(m=l+1; m<=this.colonne-1; m++){
                  if(this.cases[k][m].decalage != -1){
                      decalage_case++;
                      if(!trouve && decalage_couleur == decalage_case){
                          trouve = true;
                          this.cases[k][l].couleur = this.cases[k][m].couleur;
                      //    this.cases[k][j].decalage = -1;
                      }
                  }
                }
              }

              if(decalage_case<decalage_couleur && this.cases[k][l].decalage == -1){
                this.cases[k][l].couleur = random_couleur(this.color_case);

              }
            }

          this.cases[k][l].decalage = 0;
      }
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
  if(couleur != this.couleur_click && this.animation == 0){
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
Carrelage.prototype.calcul_sens = function(valeur){
  console.log("this.foret_algo "+JSON.stringify(this.foret_algo));
  if(valeur<=this.foret_algo.prob_sens){
      return Math.floor(Math.random()*4);
  }else{
    return 0;
  }

}
/**

*/
Carrelage.prototype.click = function(_x, _y){
      console.log("click : x "+_x+" y "+_y);
      // on ne peut clicker que si il n'y a pas d'animation en cours
      if(this.animation == 0){
        this.sens_decalage = this.calcul_sens(Math.floor(Math.random()*100));
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
  // si les cases tombent de haut en bas ou de bas en haut
    if(this.sens_decalage == 0 || this.sens_decalage == 1){
      var k;
      var mon_decalage;
      for(j=0; j<this.colonne; j++){
        mon_decalage = 0;
        for(i=this.ligne-1; i>=0; i--){
          k = this.conversion_sens_glissement("ligne", i, this.ligne-1);
          l = this.conversion_sens_glissement("colonne", j, this.colonne-1);
          if(this.cases[k][l].decalage != -1){
            this.cases[k][l].decalage = mon_decalage;
          }else{
            console.log("trou détecté");
            mon_decalage++;
          }
        }
      }
    // si les cases vont de gauche à droite ou de droite à gauche
  }else if(this.sens_decalage == 2 || this.sens_decalage == 3){
      var k;
      var mon_decalage;
      for(i=0; i<this.ligne; i++){
        mon_decalage = 0;
        for(j=this.colonne-1; j>=0; j--){
          k = this.conversion_sens_glissement("ligne", i, this.ligne-1);
          l = this.conversion_sens_glissement("colonne", j, this.colonne-1);
          if(this.cases[k][l].decalage != -1){
            this.cases[k][l].decalage = mon_decalage;
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
Carrelage.prototype.test_sens_glissement = function(i, decalage_couleur){
  // si le sens de déplacement est de haut vers le bas
  if(this.sens_decalage == 0 || this.sens_decalage == 2){
    if( i<decalage_couleur ){
      return true;
    }else{
      return false;
    }
  // si le sens de déplacement est de bas vers le haut
}else if(this.sens_decalage == 1){
    if( (this.ligne-1)-i<decalage_couleur ){
      return true;
    }else{
      return false;
    }
  }else if(this.sens_decalage == 3){
      if( (this.colonne-1)-i<decalage_couleur ){
        return true;
      }else{
        return false;
      }
    }

}

/**

*/
Carrelage.prototype.conversion_sens_glissement = function(choix, i, nb){
  if(choix == "ligne"){
    // sens de haut en bas
    if(this.sens_decalage == 0){
      return i;
    // sens de bas en haut
    }else if(this.sens_decalage == 1){
      return Math.abs(i-nb);
    }else if(this.sens_decalage == 2){
      return i;
    }else if(this.sens_decalage == 3){
      return i;
    }
  }else if(choix == "colonne"){
    // sens de haut en bas
    if(this.sens_decalage == 0){
      return i;
    }else if(this.sens_decalage == 1){
      return i;
    }else if(this.sens_decalage == 2){
      return i;
    }else if(this.sens_decalage == 3){
      return Math.abs(i-nb);
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
var couleur_a_rechercher;
  for(i=0; i<groupes.length; i++){
    console.log("les groupes- "+groupes[i][2]);
    for(j=0; j<groupes[i][2]; j++){
      if(groupes[i][3]==1){
          couleur_a_rechercher = this.cases[groupes[i][0]-j][groupes[i][1]].couleur;
          this.cases[groupes[i][0]-j][groupes[i][1]].couleur=this.couleur_click;
          this.cases[groupes[i][0]-j][groupes[i][1]].decalage=-1;
          this.score += this.point_par_case;
          console.log("les groupes3- i "+Number(groupes[i][0]-j)+" j "+groupes[i][1]);
          this.complement_groupe(groupes[i][0]-j, groupes[i][1], 1, couleur_a_rechercher, 0);
      }else if(groupes[i][3]==0){
          couleur_a_rechercher = this.cases[groupes[i][0]][groupes[i][1]-j].couleur;
          this.cases[groupes[i][0]][groupes[i][1]-j].couleur=this.couleur_click;
          this.cases[groupes[i][0]][groupes[i][1]-j].decalage=-1;
          this.score += this.point_par_case;
          console.log("les groupes3- i "+groupes[i][0]+" j "+Number(groupes[i][1]-j));
            this.complement_groupe(groupes[i][0], groupes[i][1]-j, 0, couleur_a_rechercher, 0);
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
/**
prototype complement_groupe

@param i Number numero de ligne de la case pour laquelle il faut vérifier les cases adjacentes
@param j Number numero de colonne de la case pour laquelle il faut vérifier les cases adjacentes
@param sens number orientation du groupe dont fait partie la case : 0 pour horizontal 1 pour vertical
@param couleur color hex couleur du groupe
@param count number nombre de cases adjacentes de la même couleur trouvées

*/
Carrelage.prototype.complement_groupe = function(i, j, sens, couleur, count){
var k = i;
var l = j;
var condition = true;
count++;
  while(condition){
      if(sens == 0){
        k++;
      }else if(sens == 1){
        l++;
      }
      // si les valeurs de k et de l sont dans le carrelage
      if(k>=0 && k<=this.ligne-1 && l>=0 && l<= this.colonne-1){
        // si la case adjacente est de la bonne couleur
        if(this.cases[k][l].couleur == couleur){
          this.cases[k][l].couleur = this.couleur_click;
          this.cases[k][l].decalage = -1;
          this.score += this.point_par_case;
          if(count<this.taille_groupe_max){
            this.complement_groupe(k, l, (sens==0 ? 1:0), couleur);
          }else{
            condition = false;
          }
        }else{
          condition = false;
        }
      }else{
        condition = false;
      }
  }
  k = i;
  l = j;
  condition = true;
  while(condition){
      if(sens == 0){
        k=k-1;
      }else if(sens == 1){
        l=l-1;
      }
      // si les valeurs de k et de l sont dans le carrelage
      if(k>=0 && k<=this.ligne-1 && l>=0 && l<= this.colonne-1){
        // si la case adjacente est de la bonne couleur
        if(this.cases[k][l].couleur == couleur){
          this.cases[k][l].couleur = this.couleur_click;
          this.cases[k][l].decalage = -1;
          this.score += this.point_par_case;
          if(count<this.taille_groupe_max){
            this.complement_groupe(k, l, (sens==0 ? 1:0), couleur);
          }else{
            condition = false;
          }
        }else{
          condition = false;
        }
      }else{
        condition = false;
      }
  }

}
