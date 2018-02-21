/**
 * Created by Hans Dulimarta on 2/1/17.
 */
class Cone extends Object3D {
    /**
     * Create a 3D cone with tip at the Z+ axis and base on the XY plane
     * @param {Object} gl      the current WebGL context
     * @param {props} is an object with the following keys:
     *      required: radius, height
     *      optional: radialDiv, tipColor, baseColor
     */
    constructor (gl, props) {
        super(gl);
        const requiredProps = ['radius', 'height'];
        /* if colors are undefined, generate random colors */
        if (typeof props.tipColor === "undefined")
            props.tipColor = vec3.fromValues(Math.random(), Math.random(), Math.random());
        if (typeof props.baseColor === "undefined")
            props.baseColor = vec3.fromValues(Math.random(), Math.random(), Math.random());
        if (typeof props.radialDiv === "undefined")
            props.radialDiv = 20;
        let verticalDiv = 1;
        let vertices = [], colors = [];
        /* Instead of allocating two separate JS arrays (one for position and one for color),
           in the following loop we pack both position and color
           so each tuple (x,y,z,r,g,b) describes the properties of a vertex
          */
        /*
              Stack  |  Elevations     | Radii
            ---------+-----------------+---------
                1    |    0, H         |   R, 0
                2    |    0, H/2, H    |   R, R/2, 0
                3    | 0, H/3, 2H/3, H | R, 2R/3, R/3, 0
         */
        for (let s = 0; s < verticalDiv; s++) {
            let h = s * props.height / verticalDiv;
            let r = (verticalDiv - s) * props.radius / verticalDiv;
            for (let k = 0; k < props.radialDiv; k++) {
                let angle = k * 2 * Math.PI / props.radialDiv;
                let x = r * Math.cos(angle);
                let y = r * Math.sin(angle);

                /* the first three floats are 3D (x,y,z) position */
                vertices.push(x, y, h);
                //vec3.lerp(randColor, props.tipColor, props.baseColor, Math.random());
                /* linear interpolation between two colors */
                /* the next three floats are RGB */
                colors.push(props.baseColor[0], props.baseColor[1], props.baseColor[2]);
            }
        }
        vertices.push(0,0,props.height); /* tip of cone */
        colors.push(props.tipColor[0], props.tipColor[1], props.tipColor[2]);
        vertices.push (0,0,0); /* center of base */
        colors.push(props.baseColor[0], props.baseColor[1], props.baseColor[2]);

        /* copy the (x,y,z,r,g,b) sixtuplet into GPU buffer */
        gl.bindBuffer(gl.ARRAY_BUFFER, this.vertexBuff);
        gl.bufferData(gl.ARRAY_BUFFER, Float32Array.from(vertices), gl.STATIC_DRAW);

        this.colorBuff = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, this.colorBuff);
        gl.bufferData(gl.ARRAY_BUFFER, Float32Array.from(colors), gl.STATIC_DRAW);

        var index;
        for (let s = 0; s < verticalDiv - 1; s++) {
            index = [];
            let start = s * props.radialDiv;
            for (let k = 0; k < props.radialDiv; k++) {
                index.push(start + k + props.radialDiv, start + k);
            }
            index.push(start + props.radialDiv, start);
            let buff = gl.createBuffer();
            gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, buff);
            gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, Uint16Array.from(index), gl.STATIC_DRAW);
            this.primitives.push({type: gl.TRIANGLE_STRIP, buffer: buff, numPoints: index.length});
        }

        // Generate index for the topmost stack
        index = [];
        index.push(verticalDiv * props.radialDiv);
        let start = (verticalDiv - 1) * props.radialDiv;
        for (let k = 0; k < props.radialDiv; k++)
            index.push(start + k);
        index.push(start);
        let topBuff = gl.createBuffer();
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, topBuff);
        gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, Uint16Array.from(index), gl.STATIC_DRAW);
        this.primitives.push({type: gl.TRIANGLE_FAN, buffer: topBuff, numPoints: props.radialDiv + 2});

        // Generate index for the bottom circle
        index = [];
        index.push(verticalDiv * props.radialDiv + 1);
        for (let k = props.radialDiv - 1; k >= 0; k--)
            index.push(k);
        index.push(props.radialDiv - 1);
        let botBuff = gl.createBuffer();
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, botBuff);
        gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, Uint16Array.from(index), gl.STATIC_DRAW);
        this.primitives.push({type: gl.TRIANGLE_FAN, buffer: botBuff, numPoints: props.radialDiv + 2});
    }
}