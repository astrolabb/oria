/**
fonction de lancement du jeu

@param data_interface : Object : toutes les donnees de l'interface provenant de data_interface.json
@param data_equilibrage : Object : toutes les données d'équilibrage provenant de equilibrage_url
@param data_image_chargee : Object : object contenant les contextes des images chargées
@param data_son_charge : Object : object  contenant les contextes des sons chargés
@param data_general : Object : toutes les donnees concernant le jeu en général : adresse web, adresse des liens...
*/
function Main(data_interface, data_equilibrage, data_image_chargee, data_son_charge, data_general){

  console.log("fonction Main");

  // Canevas sur lequel les images sont affichées. C'est le canevas que voit le joueur
  // @TODO: jquery nécessaire ?
  var monCanvas = $("#monCanvas")[0].getContext("2d");
  monCanvas.canvas.width  = window.innerWidth;
  monCanvas.canvas.height = window.innerHeight;

  // canevas invisible juste pour gestion click
  // on dessine des rectagles de la taille des boutons de couleur random. Enregistrement dans object et récupération de la couleur cliquée
  var hit_canvas = document.createElement('canvas');
  var monCanvas_clic = hit_canvas.getContext("2d");
  monCanvas_clic.canvas.width  = window.innerWidth;
  monCanvas_clic.canvas.height = window.innerHeight;

  // gestionnaire du joueur : niveaux, ressources...
  var mon_Player = new Player();
  // initialisation du joueur
  mon_Player.setup(data_equilibrage);
  // démarrage du gestionnaire de jeu : images/click
  var mon_GameManager = new GameManager(monCanvas, data_interface, data_equilibrage, monCanvas_clic, data_image_chargee, mon_Player, data_texte, data_son_charge, data_general);
  // lancement du menu d'accueil : prototype : setup
  mon_GameManager.setup("", "{}", "demarrage");


}

/**
@todo supprimer cette fonction si n'est pas utilisé
fonction grey_scale : met le contexte envoyé en nuance de gris
@param self : context le contexte à modifier
@return mes_donnees_image : obje ImageData : pixel modifiés en nuance de gris
*/
function grey_scale(monCanvas,_x, _y, _width, _height){

       console.log("fonction grey_scale");
       var mes_donnees_image = monCanvas.getImageData(_x,_y,_width,_height);
       var mes_pixels = mes_donnees_image.data;
       for(var i=0 ; i<mes_pixels.length ; i+=4){

         var mon_gris = mes_pixels[i]*0.33 + mes_pixels[i+1]*0.61 + mes_pixels[i+2]*0.06;
         mes_pixels[i] = mon_gris;
         mes_pixels[i+1] = mon_gris;
         mes_pixels[i+2] = mon_gris;
       // pixel i+3 représence l'alpha
       //  mes_pixels[i+3]
       }
    return mes_donnees_image;
  }
/**
fonction fadein
@todo supprimer cette fonction si n'est pas utilisé


*/
function fadein (self, i, nb){
  console.log("fonction fadein");
   if(i>nb){
     clearInterval(self.mon_Interval2);
   }
   self.monCanvas.beginPath();
  self.monCanvas.globalAlpha = 0.1;
  self.monCanvas.fillStyle = "FFFFFF";
  self.monCanvas.fillRect(0, 0, window.innerWidth, window.innerHeight);
   self.monCanvas.closePath();
    }

    /**

    */
    function getColorRandom(){
        var r = Math.round(Math.random()*255);
        var g = Math.round(Math.random()*255);
        var b = Math.round(Math.random()*255);

        var result = 'rgb('+r+','+g+','+b+')';
            console.log("couleur retournée "+result);
        return result;
    }
    /**
    fonction mise à l'échelle
    change l'abcisse, l'ordonnée, la largeur et la hauteur des icones à afficher
    pour les représenter en tableau
    @param data_equilibrage Object données sur les icones à afficher
    @param left number marge à marge_gauche
    @param up number marge en haut
    @param ref number alignement vertical
    @param hauteur_max number hauteur maximale que peuvent les images (en les additionnant)
    @param cas number permet de choisir entre une répartition des images en carré : 1 ou en rectangle : 2

    @return data_equilibrage Object nouvelles données des icones à afficher
    */

    function mise_echelle(data_equilibrage, left, up, ref, largeur, hauteur_max, cas){

      var marge_gauche = left;
      var marge_haut = up;
      if(cas == 1){
        var nb_image_ligne = Math.ceil(Math.sqrt(Object.keys(data_equilibrage).length));
      }else if(cas == 2){
        var nb_image_ligne = Math.ceil(Math.sqrt(Object.keys(data_equilibrage).length*largeur/hauteur_max));
      }

      console.log("data_equilibrage longueur "+Object.keys(data_equilibrage).length);
      console.log("nb_image_ligne "+nb_image_ligne);
      console.log("largeur ecran "+largeur);
      console.log("hauteur ecran "+window.innerHeight);
      var largeur_image = (largeur - 2*marge_gauche - (nb_image_ligne*5))/nb_image_ligne;
      console.log("largeur_image "+largeur_image);
      var nb_ligne = Math.floor(Object.keys(data_equilibrage).length/nb_image_ligne);
      if(cas == 1){
        var hauteur_image = (hauteur_max - (nb_image_ligne*5))/nb_image_ligne;
      }else if(cas == 2){
        var hauteur_image = (hauteur_max - (nb_ligne*5))/nb_ligne;
      }
      console.log("hauteur_image "+hauteur_image);
      largeur_image = largeur_image>hauteur_image ? hauteur_image : largeur_image;
      hauteur_image = largeur_image>=hauteur_image ? hauteur_image : largeur_image;
      var compteur = 0;
      var compteur2 = 0;
      Object.keys(data_equilibrage).forEach(function(key) {
          if(data_equilibrage[key].nature == "image"){
            compteur2 = compteur >= nb_image_ligne ? compteur2+1 : compteur2;
            compteur = compteur >= nb_image_ligne ? 0 : compteur;
            data_equilibrage[key]._x = ref + marge_gauche + compteur*(largeur_image+5);
            data_equilibrage[key]._y = marge_haut + compteur2*(hauteur_image+5);
            data_equilibrage[key]._width = largeur_image;
            data_equilibrage[key]._height = hauteur_image;
            compteur++;
          }
      });

      return data_equilibrage;
    }
    /**
    fonction mix_ressources
    modifie le tableau de fabrication des plats ou des ressources

    @param mon_array array mon tableau de recette avant changement
    @param mon_array2 array mon tableau représentant les catégorie des ressources présentent dans mon_array
    @param niveau number niveau actuel pour le lonono
    @param icone string clé de l'icone cliquée
    @param cat string catégorie de ressource : ressource ou plat

    @return mon_array array nouveau tableau representant la recette
    */
    function mix_ressources(mon_array, mon_array2, niveau, icone, cat, mon_array3, nom_object){
        mon_array.push(icone);
        mon_array2.push(cat);
        if(mon_array3[nom_object]){
          mon_array3[nom_object] += 1;
        }else{
          mon_array3[nom_object] = 1;
        }
        if(mon_array.length>niveau){
          mon_array = [];
          mon_array2 = [];
          mon_array3 = {};
          mon_array.push(icone);
          mon_array2.push(cat);
          if(mon_array3[nom_object]){
            mon_array3[nom_object] += 1;
          }else{
            mon_array3[nom_object] = 1;
          }
        }
        return [mon_array, mon_array2, mon_array3];
    }
    /**
    fonction mix_reussite
    vérifie si l'association de ressource donne droit à un plat ou une nouvelle ressource

    @param mon_array : array composition des ressources
    @param algo : array algorithme des recettes
    @param niveau : number niveau pour le lonono

    @return ressource_trouvee array tableau vide si test recette echoue et sinon retourne [clee, nombre]

    */
    function mix_reussite(mon_array, algo, niveau){
      var ressource_trouvee = [];
      Object.keys(algo[String(niveau)]).forEach(function(key) {
        if(JSON.stringify(algo[String(niveau)][key][0].sort()) == JSON.stringify(mon_array.sort())){
          ressource_trouvee = [key, algo[String(niveau)][key][1]];
        }

      });
      return ressource_trouvee;
    }
    /**
    fonction affichage_ressource
    formatage des données pour l'affichage du mix pour la synthèse de plat et de ressource dans la section lonono

    */
    function affichage_ressource(mix, mix2, data){
      var affichage = "";
      mix.forEach(function(e, index){
          affichage += data[mix2[index]][e].nom+" ";
      });
      return affichage;

    }
    /**
    fonction object_to_array
    convertie un Objet en tableau

    @param mon_Object : Object à convertir
    @return mon_array : array à renvoyer

    function object_to_array(mon_Object){
      var mon_array = [];
      Object.keys(mon_Object).forEach(function(key) {
          mon_array.push(key);
      });
      return mon_array;
    }
    */

    /**
    fonction object_to_array
    convertie un Objet en tableau

    @param mon_Object : Object à convertir
    @return mon_array : array à renvoyer
    */
    function object_to_array(mon_Object, key_poubelle, date_dernier_lance, malus, malus_max){

      var ma_date = new Date().getTime();
      var bonus = Math.floor((ma_date-date_dernier_lance)/60000);
      var mon_malus = malus - bonus;
      if(mon_malus<0){
        mon_malus = 0;
      }else if(mon_malus>malus_max){
        mon_malus = malus_max;
      }
      var ma_chance = 1-(mon_malus/malus_max);

      var mon_array = [];
      Object.keys(mon_Object).forEach(function(key) {
          if(Math.random()<ma_chance){
            mon_array.push(key);
          }else{
            mon_array.push(key_poubelle);
          }
      });
      return mon_array;
    }
    /**
    fonction tri_ressource_jardin
    tri dans l'object ressource, les propietés dont les clés sont dans le tableau
    jardin_algo : en fonction du niveau du joueur

    @param ressource Object cf data_equilibrage
    @param jardin_algo Object cf data_equilibrage
    @param niveau Number niveau du joueur pour le jardin

    */
    function tri_ressource_jardin(ressource, jardin_algo, niveau){
  //      console.log("niveau "+niveau);
  //      console.log("jardin_algo "+JSON.stringify(jardin_algo));
  //      console.log("ressource "+JSON.stringify(ressource));



        var mon_object = {};
          jardin_algo[String(niveau)].forEach(function(e, index){
            Object.keys(ressource).forEach(function(key) {
                  if(e == key ){
                    console.log("e "+e+" key "+key);
                    mon_object[key] = ressource[key];
                  }
              });
          });
          return mon_object;
    }
    /**
    function random_case
    utilisée dans foret.js
    retourne un tableau qui représente la structure de chaque case d'une manière aléatoire après avoir choisi des couleurs dans un tableau prédéfini

    @param nb_ligne : Number nombre de ligne du carrelage
    @param nb_colonne : Number nombre de colonne du carrelage
    @param array_couleur : Array tableau représentant toutes les couleurs utilisées dans le carrelage

    @return mon_Array tableau tableau contenant des object sur les couleurs de chaque case
    */
    function random_case(nb_ligne, nb_colonne, array_couleur){
      var mon_Array = [];
        for(i=0; i<nb_ligne; i++){
            mon_Array[i] = [];
            for(j=0; j<nb_colonne; j++){
                mon_Array[i][j]={"couleur" : random_couleur(array_couleur), "decalage" : 0};
        //        console.log("i "+i+" j "+j+" array "+mon_Array[i][j]);
            }
        }
      return mon_Array;
    }
    /**
    function random_couleur
    utilisé dans random_case (main.js)
    retourne une couleur au hasard

    @param array_couleur tableau dans lequel se trouve la liste des couleurs
    @return une couleur en hexa au hasard

    */
    function random_couleur(array_couleur){
        return array_couleur[Math.floor(Math.random()*array_couleur.length)];
    }
    /**
    fonction liaison_couleur_image
    utilisée dans foret.js
    crée un object qui lie une couleur à une image

    @param ressource Object Object dont les propriétés sont l'ensemble des ressource du jeu
    @param color_array array : tableau repésentant les couleurs utilisées dans le carrelage
    @param scene String : chaine représentant le nom de la scene où la fonction est appelée

    @return tableau_liaison Object structure {"couleur hexa" : "string nom de la propriété"}
    */
    function liaison_couleur_image(ressource, color_array, scene){
      var tableau_ressource = [];
      var tableau_liaison = {};
      var index_ressource;
      Object.keys(ressource).forEach(function(key) {
        if(scene == "foret"){
          if(ressource[key].origin[scene]){
            tableau_ressource.push(key);
          }
        }else if(scene == meme){
          tableau_ressource.push(key);
        }
      });
      // le nombre de ressource provenant de la scene doit être supérieur au nombre de couleur
      for(i=0; i<color_array.length; i++){
        index_ressource = Math.floor(Math.random()*tableau_ressource.length);
        tableau_liaison[color_array[i]] = tableau_ressource[index_ressource];
        tableau_ressource.splice(index_ressource, 1);
      }
      return tableau_liaison;
    }
    /**


    */
    function hauteur_case(nb, top_y){
      return (window.innerHeight-(2*top_y))/nb;
    }
    /**


    */
    function largeur_case(nb, marge_x){
      return (window.innerWidth-(2*marge_x))/nb;
    }
    /**
    fonction ordonnee_case
    permet de déterminer l'odonnée d'un case en fonction de son numero de ligne
    @param i Number numero de ligne
    @param top number marge en haut
    @param _height number hauteur d'une case

    @return number ordonnée de la case en pixel

    */
    function ordonnee_case(i, top, _height){
      return top+(i*_height);
    }
    /**
    fonction recherche_numero_case_ordo
    détermine le numero de la ligne de la case cliquée
    @param _y Number ordonnée du click
    @param top number marge en haut
    @param _height number hauteur d'une case

    @return i Number numero de la ligne si click sur une case et -1 sinon

    */
    function recherche_numero_case_ordo(_y, top, _height, nb){
        if(Math.floor((_y-top)/_height)>=0 && Math.floor((_y-top)/_height)<nb){
          return Math.floor((_y-top)/_height);
        }else{
          return -1;
        }
     }

     /**
     fonction recherche_numero_case_abs
     détermine le numero de la colonne de la case cliquée
     @param _x Number abscisse du click
     @param left number marge à gauche
     @param _width number largeur d'une case

     @return i Number numero de la colonne si click sur une case et -1 sinon

     */
     function recherche_numero_case_abs(_x, left, _width, nb, _centre_x){
       console.log("total "+Math.ceil(-(_x-_centre_x+((nb/2)*_width))/_width)+" _x "+_x+" left "+left+" _width "+_width+" nb "+nb+" _centre_x "+_centre_x);
         if(Math.floor((_x-_centre_x+((nb/2)*_width))/_width)>=0  && Math.floor((_x-_centre_x+((nb/2)*_width))/_width)<nb){
           return Math.floor((_x-_centre_x+((nb/2)*_width))/_width);
         }else{
           return -1;
         }
      }

    /**


    */
    function abscisse_case(j, _centre_x, _marge_x, case_width, nb_case_largeur){
      var mon_abscisse;
      mon_abscisse = _centre_x-((nb_case_largeur/2)-j)*case_width;
      return mon_abscisse;
    }
    /**
    fonction decalage_case
    calcule la postion d'une case en prenant en compte les animations de décalage

    @param mon_array Number position en pixel de la case sous la forme d'un tableau [_x, _y]
    @param sens Number sens de décalage 0 pour decalage vers le bas, 1 pour decalage vers le haut, 2 decalage de gauche à droite, 3 decalage de droite à gauche
    @param decalage Number nombre de case à décaler
    @param duree_tot Number duere de l'animation en seconde
    @param pos_duree Number temps écoulé depuis le début de l'animation
    @param case_width Number largeur de la case en pixel
    @param case_height Number hauteur de la case en pixel

    @return  mon_array Number position en pixel de la case sous la forme d'un tableau [_x, _y]
    */
    function decalage_case(mon_array, sens, decalage, duree_tot, pos_duree, case_width, case_height){
      if(sens == 0 && decalage>0){
        mon_array[1] = mon_array[1] + decalage*(pos_duree/duree_tot)*case_height;
      }else if(sens == 1 && decalage>0){
        mon_array[1] = mon_array[1] - decalage*(pos_duree/duree_tot)*case_height;
      }else if(sens == 2 && decalage>0){
        mon_array[0] = mon_array[0] + decalage*(pos_duree/duree_tot)*case_width;
      }else if(sens == 3 && decalage>0){
        mon_array[0] = mon_array[0] - decalage*(pos_duree/duree_tot)*case_width;
      }
      return mon_array;

    }
    /**
    fonction texte_sur_panneau
    dispose un texte en premier plan sur un panneau de couleur uni afin de mettre en évidence le texte
    le texte est centré par rapport au panneau

    @param monCanvas context sur lequel doit apparaitre le texte
    @param texte_color color hex couleur du texte
    @param texte String texte à afficher
    @param panneau_x Number coordonnée en abscisse du panneau
    @param panneau_y Number coordonnée en ordonnée du panneau
    @param panneau_width Number largeur du panneau
    @param panneau_height Number hauteur du panneau
    @param panneau_color color hex couleur du panneau
    @param police String nom de la police à utiliser
    @param taille Number taille de la police : la taille en pixel est egale à la hauteur de l'écran dévisée par ce nombre
    */
    function texte_sur_panneau(monCanvas, texte_color, texte, panneau_x, panneau_y, panneau_width, panneau_heigth, panneau_color, police, taille){

      monCanvas.beginPath();
      monCanvas.fillStyle = panneau_color;
      monCanvas.fillRect(panneau_x, panneau_y, panneau_width, panneau_heigth);
      monCanvas.closePath();
      monCanvas.textBaseline = "middle";
      monCanvas.font = format_police(police, taille);
      monCanvas.fillStyle = texte_color;
      monCanvas.fillText(texte, panneau_x + panneau_width/2, panneau_y + panneau_heigth/2 );
      monCanvas.textBaseline = "alphabetic";

    }
    /**

    */
    function centrage_colonne(_width_col, _marge, nb_col){

      return (window.innerWidth- (nb_col*_width_col))/2;

    }
    /**

    */
    function verifie_couleur(mon_object, couleur){
      if(mon_object[couleur]){
        return true;
      }else{
        return false;
      }
    }
    /**

    */
    function trouve_taille_case(nb, marge_gauche, marge_haut){
      var hauteur_utile = window.innerHeight-2*marge_haut;
      var largeur_utile = window.innerWidth-2*marge_gauche;
      var taille_min;
      hauteur_utile>largeur_utile ? taille_min=largeur_utile : taille_min=hauteur_utile;

      return (taille_min/nb);
    }
    /**

    */
    function fonction_coord_prem_case(taille, nb){
      var coord_x = window.innerWidth/2 - ((nb/2)*taille);
      var coord_y = window.innerHeight/2 - ((nb/2)*taille);

      return [coord_x, coord_y];
    }
    /**

    */
    function fonction_tableau_ressource(mon_object){
      var tableau_ressource = [];

      Object.keys(mon_object).forEach(function(key) {
          tableau_ressource.push(key);
      });
      return tableau_ressource;
    }
    /**


    */
    function fonction_click_case(coord, taille, nb, ecran){

      return Math.floor((coord - ((ecran/2)-(taille*nb/2)))/taille);
    }
    /**

    */
    function fonction_recherche_couleur_case(key_x, key_y, nb, tableau_couleur){

      return tableau_couleur[(key_y*nb)+key_x];
    }
    /**

    */
    function pluriel(nb, mot){
      if(nb<2){
        return mot;
      }else{
        return String(mot+"s");
      }
    }
    /** fonction fonction_tableau_recette
    dans le jeu de la mémé permet l'affichage de la recette à utiliser dans le jeu du lonono
    permet de formater une réponse
    permet d'envoyer un tableau qu'un random rendra aléatoire
    @param liste_ressource Object dans l'algo du lonono pour fabriquer une ressource
    @param liste_plat Object dans l'algo du lonono pour fabriquer un plat
    @param texte Object ensemble des amorces
    @param data_ressource Object ressources du jeu
    @param data_plat Object plats du jeu

    @return mon_tableau_recette Array un tableau avec toutes les recettes
    */
    function fonction_tableau_recette(liste_ressource, liste_plat, texte, data_ressource, data_plat){
      var mon_tableau_recette = [];
      var mon_texte = "";
      Object.keys(liste_ressource).forEach(function(key) {
        mon_texte = "";
        mon_texte += texte.amorce1;
        if(data_ressource.hasOwnProperty(key)){
          mon_texte+=data_ressource[key].nom+" ";
        }else if(data_plat.hasOwnProperty(key)){
          mon_texte+=data_plat[key].nom+" ";
        }
        mon_texte += texte.amorce2;
        for(i=0; i<liste_ressource[key][0].length; i++){
          if(data_ressource.hasOwnProperty(liste_ressource[key][0][i])){
            mon_texte+=data_ressource[liste_ressource[key][0][i]].nom+trouve_le_dernier(i,liste_ressource[key][0].length,"+","");
          }else if(data_plat.hasOwnProperty(liste_ressource[key][0][i])){
            mon_texte+=data_plat[liste_ressource[key][0][i]].nom+trouve_le_dernier(i,liste_ressource[key][0].length,"+","");
          }
        }
        mon_tableau_recette.push(mon_texte);
      });
      Object.keys(liste_plat).forEach(function(key) {
        mon_texte = "";
        mon_texte += texte.amorce1;
        if(data_ressource.hasOwnProperty(key)){
          mon_texte+=data_ressource[key].nom+" ";
        }else if(data_plat.hasOwnProperty(key)){
          mon_texte+=data_plat[key].nom+" ";
        }
        mon_texte += texte.amorce2;
        for(i=0; i<liste_plat[key][0].length; i++){
          if(data_ressource.hasOwnProperty(liste_plat[key][0][i])){
            mon_texte+=data_ressource[liste_plat[key][0][i]].nom+trouve_le_dernier(i,liste_plat[key][0].length,"+","");

          }else if(data_plat.hasOwnProperty(liste_plat[key][0][i])){
            mon_texte+=data_plat[liste_plat[key][0][i]].nom+trouve_le_dernier(i,liste_plat[key][0].length,"+","");
          }
        }
        mon_tableau_recette.push(mon_texte);
      });

      return mon_tableau_recette;
    }
    /**
    fonction trouve_le_dernier
    trouve dans une boucle le dernier appel et si c'est le dernier affecte un comportement
    @param i Number iteration de la boucle actuelle
    @param nb Number nombre de boucle totale
    @param si_oui String
    @param sinon String
    */
    function trouve_le_dernier(i,nb,si_oui,sinon){
      if(i!=nb-1){
        return si_oui;
      }else{
        return sinon;
      }
    }
    /**
    fonction fonction_liste_recette
    dispose dans un tableau l'ensemble des recettes : ressource et plat pour un niveau
    et renvoie ce tableau en entier

    @param recette_ressource : Object liste des recettes provenant de lonono_algo (data_equilibrage) pour le niveau du joueur au lonono
    @param recette_plat : Object  liste des recettes provenant de  lonono_algo2 (data_equilibrage) pour le niveau du joueur sur le lonono

    @return mon_tableau_recette : Array tableau représentant l'ensemble des recette sur lesquelles un random va être effectué afin de n'en choisir qu'une
    */

    function fonction_liste_recette(recette_ressource, recette_plat){
      var mon_tableau_recette = [];
      var mon_tableau;
      console.log("recette_ressource "+JSON.stringify(recette_ressource));
      console.log("recette_plat "+JSON.stringify(recette_plat));
        Object.keys(recette_ressource).forEach(function(key) {
          mon_tableau = [];
          mon_tableau.push(key);
          mon_tableau.push(recette_ressource[key][0]);

          mon_tableau_recette.push(mon_tableau);

        });

        Object.keys(recette_plat).forEach(function(key) {
          mon_tableau = [];
          mon_tableau.push(key);
          mon_tableau.push(recette_plat[key][0]);

          mon_tableau_recette.push(mon_tableau);
        });

        return mon_tableau_recette;

    }
    /**
    fonction redimensionnement_image
    permet dans le jeu de la mémé de limiter la taille des cases
    @param nb Number nombre de colonne
    @param max_taille Number taille maximale de la case à ne pas dépasser
    @param marge_gauche Number marge gauche
    */
    function redimensionnement_image(nb, max_taille, marge_gauche){


      var largeur_utile = window.innerWidth-2*marge_gauche;
      var largeur_image = largeur_utile/nb;
      if(largeur_image>max_taille){
        return max_taille;
      }else{
        return largeur_image;
      }
    }
    /**
    fonction  format_police
    permet de retourner un format de police compatible avec le canvas.font

    @param nb Number valeur par laquelle il faut diviser la taille de l'ecran en hauteur
    @param police String police à utiliser
    */
    function format_police(nb, police){

      return String(window.innerHeight/nb)+"px "+police;

    }
