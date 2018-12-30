var Text_affichage = function(monCanvas, data_texte, nom, maxWidth, lineHeight){
  this.monCanvas = monCanvas;
  this._x = data_texte._x;
  this._y = data_texte._y + lineHeight;
  this.text = data_texte.text;
  this.valeur_a_afficher = data_texte.valeur_a_afficher;
  this.maxWidth = maxWidth;
  this.lineHeight = lineHeight;
  this.font = format_police(data_texte.taille_police1, data_texte.police);
  this.fillStyle = data_texte.couleur;
  this.alignement = data_texte.alignement
}

Text_affichage.prototype.setup = function(text){
  if(this.alignement=="centrage2"){
    var _x = window.innerWidth/2;
    var _y = this._y;
    this.text_alignement(text,"center", _x, _y);
  }else if(this.alignement=="left"){
    var _x = this._x;
    var _y = this._y;
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
        var _x = (window.innerWidth - this.maxWidth) / 2;
        var words = mon_texte.split(' ');
        var line = '';
        for(var n = 0; n < words.length; n++) {
          var testLine = line + words[n] + ' ';
          var metrics = this.monCanvas.measureText(testLine);
          var testWidth = metrics.width;
          if (testWidth > this.maxWidth && n > 0) {
            this.affichage(line, _x, this._y);
            line = words[n] + ' ';
            this._y += this.lineHeight;
          }
          else {
            line = testLine;
          }
        }
        this.affichage(line, _x, this._y);

}
