var Intro = function(monCanvas, _target, data_interface){
    self = this;
    this.monCanvas = monCanvas;
    this._target = _target;
    _target.arrayOfGameObjects = [];

        Object.keys(data_interface.introduction.elements).forEach(function(key) {
            console.log(key+" "+data_interface.introduction.elements[key]);
             if(data_interface.introduction.elements[key].nature == "image"){
                self[key] = new Mon_image(monCanvas, data_interface.introduction.elements[key], key, _target);
                _target.arrayOfGameObjects.push([key,"image"]);
            }

        });
        Object.keys(data_interface.introduction.elements).forEach(function(key) {
            console.log(key+" "+data_interface.introduction.elements[key]);
            if(data_interface.introduction.elements[key].nature == "text"){
                self[key] = new Texte(monCanvas, data_interface.introduction.elements[key], key, data_interface.introduction.maxWidth_text, data_interface.introduction.lineHeight);
                _target.arrayOfGameObjects.push([key,"text"]);
            }
        });

//    Object.keys(data_interface.introduction.elements.sort(alpha("nature"))).forEach(function(key) {
//        console.log(key+" "+data_interface.introduction.elements[key]);
//        if(data_interface.introduction.elements[key].nature == "text"){
//            self[key] = new Texte(monCanvas, data_interface.introduction.elements[key], key, data_interface.introduction.maxWidth_text, data_interface.introduction.lineHeight);
//            _target.arrayOfGameObjects.push([key,"image"]);
//        }else if(data_interface.introduction.elements[key].nature == "image"){
//            self[key] = new Image(monCanvas, data_interface.introduction.elements[key], key);
//            _target.arrayOfGameObjects.push([key,"texte"]);
//        }

//    });
}
function alpha(property){
      return function(a, b){
          if(a[property] < b[property]){
              return -1;
          }else if(a[property] > b[property]){
              return 1;
          }else{
              return 0;
          }
      }
  }
var Mon_image = function(monCanvas, data_image, nom, _target){
      this._target = _target;
      this.monCanvas = monCanvas;
      this._x = data_image._x;
      this._y = data_image._y;
      this._width = data_image._width;
      this._height = data_image._height;
      this.loc = data_image.loc;
      this.lien = data_image.lien;
}
Mon_image.prototype.affichage = function(){
      var self = this;
      self.monCanvas.drawImage(this._target.data_image_chargee[this.loc],self._x,self._y,self._width,self._height);

}
var Texte = function(monCanvas, data_texte, nom, maxWidth, lineHeight){
      this.monCanvas = monCanvas;
      this._x = (window.innerWidth - maxWidth) / 2;
      this._y = data_texte._y;
      this.text = data_texte.text;
      this.maxWidth = maxWidth;
      this.lineHeight = lineHeight;
      this.font = data_texte.police;
      this.fillStyle = data_texte.couleur;

  }
Texte.prototype.affichage = function(line, x, y){
      this.monCanvas.font = this.font;
      this.monCanvas.fillStyle = this.fillStyle;
      this.monCanvas.fillText(line, x, y);
}
Texte.prototype.centrage = function(){

        var words = this.text.split(' ');
        var line = '';

        for(var n = 0; n < words.length; n++) {
          var testLine = line + words[n] + ' ';
          var metrics = this.monCanvas.measureText(testLine);
          var testWidth = metrics.width;
          if (testWidth > this.maxWidth && n > 0) {
            this.affichage(line, this._x, this._y);
            line = words[n] + ' ';
            this._y += this.lineHeight;
          }
          else {
            line = testLine;
          }
        }
        this.affichage(line, this._x, this._y);
}
