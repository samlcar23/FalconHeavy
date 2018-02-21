/**
 * Created by Hans Dulimarta on 2/1/17.
 */
class PolygonalPrism extends Object3D {
    /**
     * Create a generalized cylinder
     * @param {Object} gl      the current WebGL context
     * @param {Object} props with the following structure
     {
        topRadius: ______,    // required
        bottomRadius: _____.  // required
        numSides: ______,     // required
        height: _______,      // required
        topColor: _____,      // optional
        bottomColor: _____    // optional
     }
     */
    constructor (gl, props) { // topRadius, bottomRadius, height, radialDiv, verticalDiv, props.topColor, props.bottomColor) {
        super(gl);
        const requiredProps = ["topRadius", "bottomRadius", "numSides", "height"];
        if (!this._checkProperties(props, requiredProps))
            throw "PolygonalPrism: missing required properties: " + requiredProps;
        /* if colors are undefined, generate random colors */
        if (typeof props.topColor === "undefined")
            props.topColor = vec3.fromValues(Math.random(), Math.random(), Math.random());
        if (typeof props.bottomColor === "undefined")
            props.bottomColor = vec3.fromValues(Math.random(), Math.random(), Math.random());
        let vertices = [], colors = [];
        const verticalDiv = 1;
        for (let s = 0; s < verticalDiv + 1; s++) {
            let h = props.height - s * props.height / verticalDiv;
            let r = props.topRadius + s * (props.bottomRadius - props.topRadius) / (verticalDiv + 1);
            for (let k = 0; k < props.numSides; k++) {
                let angle = k * 2 * Math.PI / props.numSides;
                let x = r * Math.cos(angle);
                let y = r * Math.sin(angle);

                /* the first three floats are 3D (x,y,z) position */
                vertices.push(x, y, h);
                //vec3.lerp(randColor, props.topColor, props.bottomColor, Math.random());
                /* linear interpolation between two colors */
                /* the next three floats are RGB */
                if (s == 0)
                    colors.push(props.topColor[0], props.topColor[1], props.topColor[2]);
                else
                    colors.push(props.bottomColor[0], props.bottomColor[1], props.bottomColor[2]);
            }
        }
        vertices.push(0,0,props.height); /* top cover */
        colors.push(props.topColor[0], props.topColor[1], props.topColor[2]);
        vertices.push (0,0,0); /* bottom cover */
        colors.push(props.bottomColor[0], props.bottomColor[1], props.bottomColor[2]);

        /* copy the (x,y,z,r,g,b) sixtuplet into GPU buffer */
        gl.bindBuffer(gl.ARRAY_BUFFER, this.vertexBuff);
        gl.bufferData(gl.ARRAY_BUFFER, Float32Array.from(vertices), gl.STATIC_DRAW);

        this.colorBuff = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, this.colorBuff);
        gl.bufferData(gl.ARRAY_BUFFER, Float32Array.from(colors), gl.STATIC_DRAW);

        var index;
        for (let s = 0; s < verticalDiv; s++) {
            index = [];
            let start = s * props.numSides;
            for (let k = 0; k < props.numSides; k++) {
                index.push(start + k, start + k + props.numSides);
            }
            index.push(start, start + props.numSides);
            let buff = gl.createBuffer();
            gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, buff);
            gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, Uint16Array.from(index), gl.STATIC_DRAW);
            this.primitives.push({type: gl.TRIANGLE_STRIP, buffer: buff, numPoints: index.length});
        }

        // Generate index for the triangle fan around the top cover
        index = [];
        index.push((verticalDiv + 1) * props.numSides);
        for (let k = 0; k < props.numSides; k++)
            index.push(k);
        index.push(0);
        let northBuff = gl.createBuffer();
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, northBuff);
        gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, Uint16Array.from(index), gl.STATIC_DRAW);
        this.primitives.push({type: gl.TRIANGLE_FAN, buffer: northBuff, numPoints: index.length});

        // Generate index for the triangle fan around the south pole
        index = [];
        index.push((verticalDiv + 1) * props.numSides + 1);
        let start = verticalDiv * props.numSides;
        for (let k = props.numSides - 1; k >= 0; k--)
            index.push(start + k);
        index.push(start + props.numSides - 1);
        let southBuff = gl.createBuffer();
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, southBuff);
        gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, Uint16Array.from(index), gl.STATIC_DRAW);
        this.primitives.push({type: gl.TRIANGLE_FAN, buffer: southBuff, numPoints: index.length});
    }
}