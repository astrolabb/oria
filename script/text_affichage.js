var Text_affichage = function(monCanvas, data_texte, nom, maxWidth, lineHeight){
  this.monCanvas = monCanvas;
  this._x = data_texte._x;
  this._y = data_texte._y + lineHeight;
  this.text = data_texte.text;
  this.maxWidth = maxWidth;
  this.lineHeight = lineHeight;
  this.font = data_texte.police;
  this.fillStyle = data_texte.couleur;
  this.alignement = data_texte.alignement
}

Text_affichage.prototype.setup = function(text){
    this.affichage(text, this._x, this._y);
}
Text_affichage.prototype.affichage = function(line, x, y){
      this.monCanvas.font = this.font;
      this.monCanvas.fillStyle = this.fillStyle;
      this.monCanvas.fillText(line, x, y);
}
Text_affichage.prototype.centrage = function(){

        var _x = (window.innerWidth - this.maxWidth) / 2;
        var words = this.text.split(' ');
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
