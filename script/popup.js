var Popup = function(monCanvas, _target, data_equilibrage, data_interface)
{
  var self = this;
  Object.keys(data_interface.elements).forEach(function(key) {
      console.log(key+" "+data_interface.elements[key]);
      if(data_interface.elements[key].nature == "image"){
        self[key] = new Icone(monCanvas, data_interface.elements[key], key, _target);
        _target.arrayOfGameObjects.push([key,"image"]);
        self[key].draw(monCanvas);
      }
  });


}
