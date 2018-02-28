/**
 * Created by Hans Dulimarta on 2/1/17.
 */
class Torus extends Object3D {
  /**
   * Create a torus around the Z+ axis
   * @param {Object} gl      the current WebGL context
   * @param {Object} props  with the following keys:
   *     required: majorRadius, minorRadius
   *     optional: majSubdiv, minSubdiv, topColor, bottomColor
   */
  constructor (gl, props) {
    super(gl);
    const requiredProps = ['majorRadius', 'minorRadius'];
    if (!this._checkProperties(props, requiredProps)) {
      throw "Torus: missing required properties ", requiredProps;
    }
    /* if colors are undefined, generate random colors */
    if (typeof props.topColor === "undefined")
      props.topColor = vec3.fromValues(Math.random(), Math.random(), Math.random());
    if (typeof props.bottomColor === "undefined")
      props.bottomColor = vec3.fromValues(Math.random(), Math.random(), Math.random());
    let minDiv, majDiv;
    if (typeof props.minSubdiv === "undefined")
      minDiv = 10;
    else
      minDiv = props.minSubdiv;
    if (typeof props.majSubdiv === "undefined")
      majDiv = 30;
    else
      majDiv = props.majSubdiv;
    let blendColor = vec3.create();
    let vertices = [], colors = [];
    for (let s = 0; s < minDiv; s++) {
      let minAngle = s * 2 * Math.PI / minDiv;
      let h = props.minorRadius * Math.sin(minAngle);
      let r = props.majorRadius + props.minorRadius * Math.cos(minAngle);
      for (let k = 0; k < majDiv; k++) {
        let majAngle = k * 2 * Math.PI / majDiv;
        let x = r * Math.cos(majAngle);
        let y = r * Math.sin(majAngle);

        /* the first three floats are 3D (x,y,z) position */
        vertices.push(x, y, h);
        let s = (h + props.minorRadius) / (2*props.minorRadius);
        vec3.lerp(blendColor, props.topColor, props.bottomColor, s);
        colors.push(blendColor[0], blendColor[1], blendColor[2]);
      }
    }

    gl.bindBuffer(gl.ARRAY_BUFFER, this.vertexBuff);
    gl.bufferData(gl.ARRAY_BUFFER, Float32Array.from(vertices), gl.STATIC_DRAW);

    this.colorBuff = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, this.colorBuff);
    gl.bufferData(gl.ARRAY_BUFFER, Float32Array.from(colors), gl.STATIC_DRAW);

    var startIndex = 0;
    for (let s = 0; s < minDiv - 1; s++) {
      let index = [];
      for (let k = 0; k < majDiv; k++) {
        index.push (startIndex + k + majDiv);
        index.push (startIndex + k);
      }
      index.push (startIndex + majDiv);
      index.push (startIndex);
      let iBuff = gl.createBuffer();
      gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, iBuff);
      gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, Uint16Array.from(index), gl.STATIC_DRAW);
      this.primitives.push({type: gl.TRIANGLE_STRIP, buffer: iBuff, numPoints: index.length});
      startIndex += majDiv;
    }
    let index = [];
    let NPOINTS = majDiv * minDiv;
    for (let k = 0; k < majDiv; k++) {
      index.push (k, NPOINTS - majDiv + k);
    }
    index.push (0, NPOINTS - majDiv);
    let iBuff = gl.createBuffer();
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, iBuff);
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, Uint16Array.from(index), gl.STATIC_DRAW);
    this.primitives.push({type: gl.TRIANGLE_STRIP, buffer: iBuff, numPoints: index.length});
  }

}