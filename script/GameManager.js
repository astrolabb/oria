function GameManager(monCanvas, data_interface, data_equilibrage)
{
    console.log("fonction GameManager");

    this.monCanvas = monCanvas;
    this.arrayOfGameObjects = [];
    this.map = {};

}

/**
 * Init du jeu
 *
 * @return {[type]} [description]
 */
GameManager.prototype.setup = function ()
{
  var self = this;
  this.map = new Map(this.monCanvas, self, data_interface),
  this.affichage_map();
}

/**
 * Affichage map
 *
 * @return {[type]} [description]
 */
 GameManager.prototype.affichage_map = function ()
 {
      for (var i in this.arrayOfGameObjects) {
        console.log("this "+this.arrayOfGameObjects);
        console.log("this.map "+this.map.largeur);
        console.log("this.arrayOfGameObjects "+this.arrayOfGameObjects[i]);
        console.log("this.map[] "+this.map[this.arrayOfGameObjects[i]]);

        this.map[this.arrayOfGameObjects[i]].draw(this.monCanvas);
      }
  }
