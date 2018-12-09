/**
@constructor Gameplay
gestion des clicks
stockage des données dans :
@return arrayOfClickObjects Object String"couleur calque invisible" : Array[Object: icone cliquée, String: nom de la fonction à lancer lors du click, Object: données de l'image cliquée]
@return arrayOfGameObjects2 Array tableau contenant les images clickables

@param monCanvas context sur lequel on va dessiner les zones de clicks ici ce context est invisible : monCanvas_click
@param _parent classe appelant le constructeur
@param data essemble des icones necessitant un lien : la zone de click sera affichée si l'icone apparait à l'ecran
@param scene string nom de la scène actuelle du joueur
*/
var Gameplay = function(monCanvas, _parent, data, scene){
  this.monCanvas = monCanvas;
  this._parent = _parent;
  _parent.arrayOfGameObjects2 = [];
  _parent.arrayOfClickObjects = {};
  var self = this;

  Object.keys(data).forEach(function(key) {
      console.log(key+" "+data[key]);
       if(data[key].nature == "image" && data[key].lien == "oui"){
         console.log("bouton trouvé "+key+" data "+data[key]._x);
          self[key] = new Rectangle(monCanvas, data[key], key);
           _parent.arrayOfGameObjects2.push(key);
          while(true) {
               var colorKey = getColorRandom();
               if (!_parent.arrayOfClickObjects[colorKey]) {

                  self[key].color = colorKey;
                  _parent.arrayOfClickObjects[colorKey] = [key, data[key].dir, data[key], scene];
                  return;
               }
            }


      }

  });
}
Gameplay.prototype.direction = function(x,y,arrayOfClickObjects){

  var pixel = this.monCanvas.getImageData(x, y, 1, 1).data;
  console.log("pixel :"+pixel[0]+" "+pixel[1]+" "+pixel[2]);
  var color = 'rgb('+pixel[0]+','+pixel[1]+','+pixel[2]+')';
  var shape = arrayOfClickObjects[color];
    return shape;
}

var Rectangle = function(monCanvas, data_image, nom){
      this.monCanvas = monCanvas;
      this._x = data_image._x;
      this._y = data_image._y;
      this._width = data_image._width;
      this._height = data_image._height;
      this.lien = data_image.lien;
      this.color = "rgb(120,255,0)";
      console.log("coordonnées bouton _x "+this._x+" _y "+this._y+" nom "+nom);
}
Rectangle.prototype.draw = function(myCanvasContext){
  myCanvasContext.fillStyle = this.color;
  myCanvasContext.fillRect(this._x, this._y, this._width, this._height);
}
