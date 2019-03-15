/**
Constructor Meme
@param monCanvas contexte de dessin sur le Canevas
@param _target classe parentNode
@param data_interface Object données d'interface : data_interface.json
@param key String : nom de propriété du bouton cliqué
@param data Object : bouton cliqué pour arrivé à cette scene
@param scene String scene en coursthis.data_interface.marge_gauche : lac
@param ressources Object toutes les ressources du jeu
@param texte Object texte à afficher et correspondant à this.data_texte.lac
@param algo Object algo d'attribution des ressource et d'équilibrage par niveau correspndant à this.data_equilibrage.lac_algo[String(this.mon_Player.niveau.lac)]
*/
var Meme = function(monCanvas, _target, data_interface, key, data, scene, ressources, texte, algo){
  var self = this;
  this._target = _target;
  this.monCanvas = monCanvas;
  this.algo = algo;
  this.data_interface = data_interface;
  this.data_ressource = ressources;
  this.cas = 0;

  this.color_array = [];
  this.table_couleur_image = {};

  this.melange_ressource = [];

  this.tableau_click = [];


  _target.arrayOfGameObjects = [];
  // affichage des élement fiche de l'image : image de fond, bouton retour
  Object.keys(data_interface.elements).forEach(function(key) {
      console.log(key+" "+data_interface.elements[key]);
      if(data_interface.elements[key].nature == "image"){
        self[key] = new Icone(monCanvas, data_interface.elements[key], key, _target);
        _target.arrayOfGameObjects.push([key,"image",self[key]]);
      }
  });
  // afffichage du texte : titre
  Object.keys(data_interface.elements).forEach(function(key) {
      console.log(key+" "+data_interface.elements[key]);
      if(data_interface.elements[key].nature == "text"){
          self[key] = new Text_affichage(monCanvas, data_interface.elements[key], key, data_interface.maxWidth_text, data_interface.lineHeight, _target.data_texte.meme, data_interface.elements[key].reference=="" ? "" : data_interface.elements[data_interface.elements[key].reference]);
          _target.arrayOfGameObjects.push([key,"text",self[key]]);
      }
  });

};
/**
prototype demarrage_jeu
permet de lancer le jeu dans le gameManager

@param : cas Number 0 au debut du jeu les icones sont visibles 1 les icones sont invisibles

*/
Meme.prototype.demarrage_jeu = function(cas){

  var tableau_ressource = fonction_tableau_ressource(this.data_ressource);
  this.affichage_tableau(tableau_ressource, cas);
  this.melanger_ressource(tableau_ressource);

}
/**
prototype melanger_ressource
permet de noyer les vrais résultats avec des résultats faux et de limiter le nombre de résultat faux

@param tableau_ressource Array prend l'object ressource et le transforme en tableau

@return this.melange_ressource Array de la longueur de this.color_array c'est à dire un tableau de longueur nb_colonne*nb_colonne ( et pas [nb_colonne][nb_colonne])
*/
Meme.prototype.melanger_ressource = function(tableau_ressource){
  this.melange_ressource = [];
  for(i=0; i<this.color_array.length ; i++){
    this.melange_ressource[i] = [];
    this.melange_ressource[i][0];
    for(j=1; j<=this.algo.choix_ressource_case ; j++){
      this.melange_ressource[i][j] = tableau_ressource[Math.floor(Math.random()*tableau_ressource.length)];
    }
  }
  for(i=0; i<this.color_array.length ; i++){
    this.melange_ressource[i][Math.floor(Math.random()*this.algo.choix_ressource_case)+1] = this.table_couleur_image[this.color_array[i]];
  }

}

/**
Prototype affichage_tableau
permet de gérer l'interface graphique

@param tableau_ressource Array prend l'object ressource et le transforme en tableau
@param : cas Number 0 au debut du jeu les icones sont visibles 1 les icones sont invisibles


*/
Meme.prototype.affichage_tableau = function(mon_tableau_ressource, cas){
  // determine la taille des cases en fonction de l'écran
  var taille_case = trouve_taille_case(this.algo.nb_colonne, this.data_interface.marge_gauche, this.data_interface.marge_haut);
  // détermine les coordonnées de la première case : Array
  var coord_premiere_case = fonction_coord_prem_case(taille_case, this.algo.nb_colonne);

  // permet de sélectionner une couleur unique pour chaque case
  var mes_couleurs = {};

  mes_couleurs[this.data_interface.couleur_click_case] = true;
  var ma_couleur;


  for(i=0; i<this.algo.nb_colonne ; i++){
    this.tableau_click[i] = [];
    for(j=0; j<this.algo.nb_colonne ; j++){
      if(cas==0){
        ma_couleur = getColorRandom();
        while(verifie_couleur(mes_couleurs, ma_couleur)){
          ma_couleur = getColorRandom();
        }
        this.color_array.push(ma_couleur);
        this.table_couleur_image[ma_couleur] = mon_tableau_ressource[Math.floor(Math.random()*mon_tableau_ressource.length)];
      // dans la suite du jeu on affiche juste une image dont le fond est de la même couleur qu'avant
      }else if(cas==1){
        ma_couleur = this.color_array[(i*this.algo.nb_colonne)+j];
      }
      this.tableau_click[i][j] = 0;
      this.ma_case(i,j, taille_case, coord_premiere_case, ma_couleur);
      // au début on affiche les icones
      if(cas==0){
        this.mon_icone(i,j, taille_case, coord_premiere_case, this.table_couleur_image[ma_couleur]);
      }
    }
  }
}
/**
prototype mon_icone
affiche l'icone voulue
@param num_ligne Number Numero de ligne
@param num_colonne Number Numero de colonne
@param taille Number taille des icones
@param coord_prem_case Array coordonnée de la première case [_x, _y]
@param String nom de la ressource à afficher
*/
Meme.prototype.mon_icone = function(num_ligne, num_colonne, taille, coord_prem_case, ressource){
  var mon_abs = coord_prem_case[0] + num_colonne*taille;
  var mon_ord = coord_prem_case[1] + num_ligne*taille;
  var mon_image = this._target.data_image_chargee[this.data_ressource[ressource].loc["niv"+this._target.mon_Player.niveau["meme"]][Math.floor(Math.random()*this.data_ressource[ressource].loc["niv"+this._target.mon_Player.niveau["meme"]].length)]];
  this.monCanvas.drawImage(mon_image,mon_abs,mon_ord,taille,taille);


}
/**
prototype ma_case
affiche la case choisie
@param num_ligne Number Numero de ligne
@param num_colonne Number Numero de colonne
@param taille Number taille des icones
@param coord_prem_case Array coordonnée de la première case [_x, _y]
@param String nom de la ressource à afficher

*/
Meme.prototype.ma_case = function(num_ligne, num_colonne, taille, coord_prem_case, couleur){

  this.monCanvas.beginPath();
  this.monCanvas.fillStyle = couleur;
  var mon_abs = coord_prem_case[0] + num_colonne*taille;
  var mon_ord = coord_prem_case[1] + num_ligne*taille;
  this.monCanvas.fillRect(mon_abs, mon_ord, taille, taille);
  this.monCanvas.strokeStyle = this.data_interface.couleur_trait;
  this.monCanvas.lineWidth=this.data_interface.taille_trait;
  this.monCanvas.strokeRect(mon_abs, mon_ord, taille, taille);
  this.monCanvas.closePath();

}
/**
prototype click
comportement lors d'un click

@param abs Number coord du click en abscisse
@param ord Number coord du click en ordonnée
*/
Meme.prototype.click = function(abs, ord){
  if(this.cas == 1){
    var taille_case = trouve_taille_case(this.algo.nb_colonne, this.data_interface.marge_gauche, this.data_interface.marge_haut);
    // détermine les coordonnées de la première case : Array
    var coord_premiere_case = fonction_coord_prem_case(taille_case, this.algo.nb_colonne);

    var case_x = fonction_click_case(abs, taille_case, this.algo.nb_colonne, window.innerWidth);
    var case_y = fonction_click_case(ord, taille_case, this.algo.nb_colonne, window.innerHeight);

    if(case_x>=0 && case_x<this.algo.nb_colonne && case_y>=0 && case_y<this.algo.nb_colonne){

      console.log("meme_click "+case_x+" y "+case_y);
      var ma_couleur = fonction_recherche_couleur_case(case_x, case_y, this.algo.nb_colonne, this.color_array);
      console.log("ma_couleur "+ma_couleur);

      this.ma_case(case_y,case_x, taille_case, coord_premiere_case, ma_couleur);

      this.tableau_click[case_y][case_x]++;
      if(this.tableau_click[case_y][case_x]>this.algo.choix_ressource_case){
        this.tableau_click[case_y][case_x] = 1;
      }
      var ressource_affichee = this.melange_ressource[(case_y*this.algo.nb_colonne)+case_x][this.tableau_click[case_y][case_x]];
      console.log("ressource_affichee "+ressource_affichee);
      var vrai_valeur = this.table_couleur_image[ma_couleur];
      this.mon_icone(case_y,case_x, taille_case, coord_premiere_case, ressource_affichee);
    }
  }
}
