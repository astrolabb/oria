function GameManager(monCanvas, data_interface, data_equilibrage)
{
    console.log("fonction GameManager");

    this.monCanvas = monCanvas;
    this.arrayOfGameObjects = [];
    this.map = {};
    this.pos_x = 0;
    this.pos_y = 0;

}

/**
 * Init du jeu
 *
 * @return {[type]} [description]
 */
GameManager.prototype.setup = function ()
{
  var self = this;
  this.monCanvas.clearRect(0, 0, window.innerWidth, window.innerHeight);
  this.monCanvas.beginPath();
  this.map = new Map(this.monCanvas, self, data_interface),
  this.affichage_map();
  this.click_canvas();
  this.affichage_curseur();
  this.monCanvas.closePath();
}

/**
 * Affichage map
 *
 * @return {[type]} [description]
 */
 GameManager.prototype.affichage_map = function ()
  {
    console.log("affichage_map : affichage des icones");
      for (var i in this.arrayOfGameObjects) {
          this.map[this.arrayOfGameObjects[i]].draw(this.monCanvas);
      }
  }
  /**
   * position curseur
   *
   * @return {[type]} [description]
   */
   GameManager.prototype.position_curseur = function(e)
   {
     console.log("mesure pixel cliqué");
          this.pos_x = e.clientX;
          this.pos_y = e.clientY;
   }
   /**
    * Affichage curseur
    *
    * @return {[type]} [description]
    */
    GameManager.prototype.affichage_curseur = function()
    {
      console.log("affichage position curseur");
      this.monCanvas.fillStyle = "orange";
      this.monCanvas.rect(this.pos_x-1, 0, 2,  window.innerHeight);
      this.monCanvas.stroke();
      this.monCanvas.rect(0, this.pos_y-1, window.innerWidth,  2);
      this.monCanvas.stroke();
      this.monCanvas.arc(this.pos_x,this.pos_y,10,0,2*Math.PI, false);
      this.monCanvas.stroke();

    }
    /**
     * click sur le canvas
     *
     * @return {[type]} [description]
     */
     GameManager.prototype.click_canvas = function()
     {
       console.log("click");
        var self = this;
        $("#monCanvas").click(function(e){
          self.position_curseur(e);
          $("#monCanvas").off('click');
          self.setup();
        });

     }
