/**
Text_affichage : classe d'affichage du texte
@param monCanvas : context du Canevas où afficher le texte
@param data_texte : Objet représentant le texte et présent dans le fichier data_interface.json
@param nom : String attibut du champ de texte dans le fichier data_interface.json
@param maxWidth : Number largeur maximale du texte
@param lineHeight : Number distance entre les lignes de texte
@param mon_texte : Object contenant les textes de la scène et présent dans le fichier data_texte.json
@param reference : attribut d'un image où le texte doit être placé dessus.
@param reference : référence de l'éléement sur lequel aligner le texte
*/

var Text_affichage = function(monCanvas, data_texte, nom, maxWidth, lineHeight, mon_texte, reference){
  this.monCanvas = monCanvas;
  this._x = data_texte._x;
  this._y = data_texte._y + lineHeight;
  console.log("31_12_18 "+data_texte.text);
  if(mon_texte){
    data_texte.text=="" ? this.text="" : this.text=mon_texte[data_texte.text];
  }else{
    this.text = data_texte.text;
  }
  this.valeur_a_afficher = data_texte.valeur_a_afficher;
  this.maxWidth = maxWidth;
  this.lineHeight = lineHeight;
  this.font = format_police(data_texte.taille_police1, data_texte.police);
  this.fillStyle = data_texte.couleur;
  this.alignement = data_texte.alignement;
  this.reference = reference;
  console.log("this.reference "+JSON.stringify(this.reference));
}
/**

*/

Text_affichage.prototype.setup = function(text){
  console.log("this.reference2 "+JSON.stringify(this.reference));
  var ma_ref_x = (this.reference=="" ? 0 : this.reference._x);
  var ma_ref_y = (this.reference=="" ? 0 : this.reference._y);
  var ma_ref_width = (this.reference=="" ? 0 : this.reference._width);
  var ma_ref_height = (this.reference=="" ? 0 : this.reference._height);

  if(this.alignement=="centrage2"){
    var _x = window.innerWidth/2;
    var _y = this._y;
    this.text_alignement(text,"center", _x, _y);
  }else if(this.alignement=="left"){
    var _x = this._x + ma_ref_x;
    var _y = (ma_ref_y==0 ? this._y : ma_ref_y);
    this.text_alignement(text,"left", _x, _y);
  }else if(this.alignement=="centrage3"){
    var _x = this._x;
    var _y = this._y;
    this.text_alignement(text,"center", _x, _y);
  }else if(this.alignement=="end"){
    var _x = window.innerWidth - window.innerWidth/20;
    var _y = this._y;
    this.text_alignement(text,"end", _x, _y);
  }else if(this.alignement=="centrage"){
    this.centrage(text);
  }else if(this.alignement=="ref"){
    var _x = ma_ref_x + ma_ref_width/2;
    var _y = ma_ref_y + ma_ref_height/3;;
    this.monCanvas.textAlign="center";
    this.monCanvas.textBaseline = "middle";
    this.affichage(text, _x, _y);
  }else{
    this.affichage(text, this._x, this._y);
  }

}
Text_affichage.prototype.affichage = function(line, x, y){
      this.monCanvas.font = this.font;
      this.monCanvas.fillStyle = this.fillStyle;
      this.monCanvas.fillText(line, x, y);
}
Text_affichage.prototype.affichage2 = function(line, _x, _y){
      this.monCanvas.font = this.font;
      this.monCanvas.fillStyle = this.fillStyle;
      this.monCanvas.fillText(line, _x, _y);
}
/**
fonction text_alignement
permet d'aligner un texte (un seule ligne) en fonction de l'attribut :  textAlign (merci Viraax)
@param text String Text à afficher
@param choix String valuer dde la propriété textAlign
@param _x Number référence de l'alignement
@param _y Number référence de l'alignement

*/
Text_affichage.prototype.text_alignement = function (text, choix, _x, _y){
  this.monCanvas.textAlign=choix;
  this.affichage2(text, _x, _y);

}
/**
fonction centrage
utilisée pour centrer des testes de plusieurs lignes
 @param text String texte à afficher si "" affiche le texte par défaut du fichier data_interface

*/
Text_affichage.prototype.centrage = function(text){
        console.log(typeof text);
        console.log("fonction centrage "+text+" this.text "+this.text);
        this.monCanvas.textAlign="start";
        var mon_texte = text=="" ? this.text : text;
        //var _x = (window.innerWidth - this.maxWidth) / 2;
        var _x;
        // on découpe la phrase en mot
        var words = mon_texte.split(' ');
        var line = '';
        var testWidth_avant = 0;
        var ancien_line="";
        // on boucle sur chaque mot
        for(var n = 0; n < words.length; n++) {
          // on calcule la largeur de la ligne avant l'ajout du mot
          testWidth_avant = this.monCanvas.measureText(line).width;

          // on concatene le mot au reste de la ligne
          var testLine = line + words[n] + ' ';
          var metrics = this.monCanvas.measureText(testLine);
          // et on calcule la largeur de la nouvelle ligne
          var testWidth = metrics.width;

          ancien_line = line;
          line += words[n] + ' ';
          // si la largeur dépasse la taille voulue, la ligne s'arrête
          if (testWidth > this.maxWidth) {
          //  _x = (window.innerWidth - testWidth) / 2;
          //  this.affichage(line, _x, this._y);
          //  line = '';
          //  this._y += this.lineHeight;
            _x = (window.innerWidth - testWidth_avant) / 2;
            this.affichage(ancien_line, _x, this._y);
            line = words[n] + ' ';
            this._y += this.lineHeight;
          }
          if (n == words.length-1) {
            line = testLine;
            _x = (window.innerWidth - testWidth) / 2;
            this.affichage(line, _x, this._y);
          }

        }
    //    this.affichage(line, _x, this._y);

}
