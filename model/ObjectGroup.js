/**
 * Created by Hans Dulimarta on 2/9/18.
 */
class ObjectGroup {
  constructor(gl) {
    this.coordFrame = mat4.create();
    this.tempMat = mat4.create();
    this.group = [];
  }

  draw(gl) {
    if (arguments.length == 1)
      for (var k = 0; k < this.group.length; k++)
        this.group[k].draw(gl, this.coordFrame);
    else {
      /* second argument is the coordinate frame to use for drawing the group */
      mat4.multiply(this.tempMat, arguments[1], this.coordFrame);
      for (var k = 0; k < this.group.length; k++)
        this.group[k].draw(gl, this.tempMat);
    }
  }

  _checkProperties (props, keys) {
    if (typeof props === 'undefined') {
      //alert("Required property is missing");
      return false;
    }
    for (var k = 0; k < keys.length; k++)
      if (typeof props[keys[k]] === 'undefined') {
        //alert(`Required property ${keys[k]} is missing`);
        return false;
      }
    return true;
  }
}