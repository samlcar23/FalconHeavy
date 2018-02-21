/**
 * Created by Hans Dulimarta on 2/1/17.
 */
class Sphere extends Object3D {
    /**
     * Create a 3D sphere with tip at the Z+ axis and base on the XY plane
     * @param {Object} gl      the current WebGL context
     * @param props with the following keys
     *    required : radius (sphere radius), splitDepth (recursion depth)
     *    optional: northColor, equatorColor, southColor
     */
    constructor (gl, props) {
        super(gl);
        const requiredProps = ['radius', 'splitDepth'];
        if (!this._checkProperties(props, requiredProps))
            throw "Sphere: missing required properties" + requiredProps;
        /* if colors are undefined, generate random colors */
        if (typeof props.northColor === "undefined")
            props.northColor = vec3.fromValues(Math.random(), Math.random(), Math.random());
        if (typeof props.equatorColor === "undefined")
            props.equatorColor = vec3.fromValues(Math.random(), Math.random(), Math.random());
        if (typeof props.southColor === "undefined")
            props.southColor = vec3.fromValues(Math.random(), Math.random(), Math.random());
        let blendColor = vec3.create();

        this.RADIUS = props.radius;
        this.vtx = [], this.idx = [];
        let seedA = vec3.fromValues(1, 1, 1);   // top: 0
        vec3.normalize(seedA, seedA);
        vec3.scale (seedA, seedA, this.RADIUS);
        let seedB = vec3.fromValues(-1, -1, 1);  // a:1
        vec3.normalize(seedB, seedB);
        vec3.scale (seedB, seedB, this.RADIUS);
        let seedC = vec3.fromValues(1, -1, -1);  // b:2
        vec3.normalize(seedC, seedC);
        vec3.scale (seedC, seedC, this.RADIUS);
        let seedD = vec3.fromValues(-1, 1, -1);  // c:3
        vec3.normalize(seedD, seedD);
        vec3.scale (seedD, seedD, this.RADIUS);

        this.vtx.push(seedA, seedB, seedC, seedD);
        let depth = props.splitDepth;
        this.split (depth, 0, 1, 2);
        this.split (depth, 0, 2, 3);
        this.split (depth, 0, 3, 1);
        this.split (depth, 1, 3, 2);
        let vertices = [], colors = [];
        for (let k = 0; k < this.vtx.length; k++)
        {
            vertices.push(this.vtx[k][0], this.vtx[k][1], this.vtx[k][2]);
            let zVal = this.vtx[k][2];
            if (zVal > 0)
                vec3.lerp (blendColor, props.equatorColor, props.northColor, zVal / this.RADIUS);
            else
                vec3.lerp (blendColor, props.equatorColor, props.southColor, -zVal / this.RADIUS);
            colors.push(blendColor[0], blendColor[1], blendColor[2]);
        }
        gl.bindBuffer(gl.ARRAY_BUFFER, this.vertexBuff);
        gl.bufferData(gl.ARRAY_BUFFER, Float32Array.from(vertices), gl.STATIC_DRAW);

        this.colorBuff = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, this.colorBuff);
        gl.bufferData(gl.ARRAY_BUFFER, Float32Array.from(colors), gl.STATIC_DRAW);

        let ibuff = gl.createBuffer();
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, ibuff);
        gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, Uint16Array.from(this.idx), gl.STATIC_DRAW)
        this.primitives.push({type: gl.TRIANGLES, buffer: ibuff, numPoints: this.idx.length});
    }

    split (N, a, b, c) {
        if (N > 0) {
            let mid_ab = vec3.lerp(vec3.create(), this.vtx[a], this.vtx[b], 0.5);
            vec3.normalize(mid_ab, mid_ab);
            vec3.scale (mid_ab, mid_ab, this.RADIUS);
            let mid_ac = vec3.lerp(vec3.create(), this.vtx[a], this.vtx[c], 0.5);
            vec3.normalize(mid_ac, mid_ac);
            vec3.scale (mid_ac, mid_ac, this.RADIUS);
            let mid_bc = vec3.lerp(vec3.create(), this.vtx[b], this.vtx[c], 0.5);
            vec3.normalize(mid_bc, mid_bc);
            vec3.scale (mid_bc, mid_bc, this.RADIUS);
            this.vtx.push(mid_ab);
            let n_ab = this.vtx.length - 1; // determine point id of mid_ab
            this.vtx.push(mid_bc);
            let n_bc = this.vtx.length - 1; // determine point id of mid_bc
            this.vtx.push(mid_ac);
            let n_ac = this.vtx.length - 1; // determine point id of mid_ac
            this.split (N - 1, a, n_ab, n_ac);
            this.split (N - 1, n_ab, b, n_bc);
            this.split (N - 1, n_ac, n_bc, c);
            this.split (N - 1, n_ab, n_bc, n_ac);
        } else {
            /* stop recursion, push the indices of the (micro) triangles */
            this.idx.push(a, b, c);
        }
    }
}