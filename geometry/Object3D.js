/**
 * Created by Hans Dulimarta.
 */

class Object3D {
    constructor(gl) {
        this.vertexBuff = gl.createBuffer();
        this.colorBuff = null;
        /* primitives is an array of objects with the following fields:
            type:        gl.POINTS, gl.LINES, ....
            numElements: size of the index array for drawElements
            buffer:      buffer of type gl.ELEMENT_ARRAY_BUFFER

           Each object in this array is used by gl.drawElements()
         */
        this.primitives = [];
        this.coordFrame = mat4.create();
        this.tempMat = mat4.create();  // for temporary calculation
    }

    static linkShaderAttrib (attribs) {
        for (var k in attribs)
            Object3D[k] = attribs[k];
    }

    static linkShaderUniform(unis) {
        for (var k in unis)
            Object3D[k] = unis[k];
    }

    _checkProperties (props, keys) {
        if (typeof props === 'undefined') {
            return false;
        }
        for (var k = 0; k < keys.length; k++)
            if (typeof props[keys[k]] === 'undefined') {
                return false;
            }
        return true;
    }

    draw (gl) {
        if (arguments.length == 1)
            gl.uniformMatrix4fv(Object3D.model,
                false, /* matrix is NOT transposed */
                this.coordFrame);
        else {
            mat4.multiply(this.tempMat, arguments[1], this.coordFrame);
            gl.uniformMatrix4fv(Object3D.model,
                false, /* matrix is NOT transposed */
                this.tempMat);
        }

        /* select the vertex buffer */
        gl.bindBuffer(gl.ARRAY_BUFFER, this.vertexBuff);
        gl.vertexAttribPointer(Object3D.positionAttr, 3, gl.FLOAT, false, 0, 0);
        /* select the color buffer if it is defined */
        if (this.colorBuff != null) {
            gl.bindBuffer(gl.ARRAY_BUFFER, this.colorBuff);
            gl.vertexAttribPointer(Object3D.colorAttr, 3, gl.FLOAT, false, 0, 0);
        }

        for (var k = 0; k < this.primitives.length; k++) {
            let obj = this.primitives[k];
            gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, obj.buffer);
            gl.drawElements(obj.type, obj.numPoints, gl.UNSIGNED_SHORT, 0);
        }
    }
}