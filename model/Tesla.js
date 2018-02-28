/**
 * Let's make a car
 */
class Tesla extends ObjectGroup {

    constructor(gl) {
        super(gl);


        let tireGroup = new ObjectGroup(gl);
        let axleGroup = new ObjectGroup(gl);
        let bodyGroup = new ObjectGroup(gl);

        tireGroup = this.makeTires();
        axleGroup = this.makeAxles();
        bodyGroup = this.makeBody();

        this.group.push(tireGroup, axleGroup, bodyGroup);

    }

    makeBody(){
        let bodyGroup = new ObjectGroup(gl);
        //red
        var color = vec3.fromValues(.8, 0, 0);
        //black
        var color1 = vec3.fromValues(0, 0, 0);
        //grey
        var color2 = vec3.fromValues(.3, .3, .3);
        //darker red
        var color3 = vec3.fromValues(.7, 0, 0);
        //dark grey
        var color4 = vec3.fromValues(.1, .1, .1);

        let ff = new PolygonalPrism(gl, {
            topRadius: .5,
            bottomRadius: .5,
            numSides: 20,
            height: 1.90,
            topColor: color3,
            bottomColor: color3
        });
        let rf = new PolygonalPrism(gl, {
            topRadius: .5,
            bottomRadius: .5,
            numSides: 20,
            height: 1.90,
            topColor: color3,
            bottomColor: color3
        });
        let glass = new PolygonalPrism(gl, {
            topRadius: .5,
            bottomRadius: .5,
            numSides: 4,
            height: 1.7,
            topColor: color2,
            bottomColor: color2
        });
        let rearThing = new PolygonalPrism(gl, {
            topRadius: .5,
            bottomRadius: .5,
            numSides: 4,
            height: 1.69,
            topColor: color,
            bottomColor: color
        });
        let hoodPatch = new PolygonalPrism(gl, {
            topRadius: .7,
            bottomRadius: .7,
            numSides: 4,
            height: 1.5,
            topColor: color4,
            bottomColor: color4
        });
        let spoiler = new PolygonalPrism(gl, {
            topRadius: .05,
            bottomRadius: .05,
            numSides: 4,
            height: 1.5,
            topColor: color4,
            bottomColor: color4
        });

        //front fenders
        mat4.translate(ff.coordFrame, ff.coordFrame, vec3.fromValues(0, 0, .25));
        mat4.rotateX(ff.coordFrame, ff.coordFrame, glMatrix.toRadian(90));

        //rear fenders
        mat4.translate(rf.coordFrame, rf.coordFrame, vec3.fromValues(-4, 0, .25));
        mat4.rotateX(rf.coordFrame, rf.coordFrame, glMatrix.toRadian(90));

        //windshield
        mat4.translate(glass.coordFrame, glass.coordFrame, vec3.fromValues(-1.2, -.1, .90));
        mat4.rotateY(glass.coordFrame, glass.coordFrame, glMatrix.toRadian(90));
        mat4.rotateX(glass.coordFrame, glass.coordFrame, glMatrix.toRadian(90));

        //rear angled part
        mat4.translate(rearThing.coordFrame, rearThing.coordFrame, vec3.fromValues(-3.7, -.105, .90));
        mat4.rotateY(rearThing.coordFrame, rearThing.coordFrame, glMatrix.toRadian(90));
        mat4.rotateX(rearThing.coordFrame, rearThing.coordFrame, glMatrix.toRadian(90));

        //hood patch of dark grey
        mat4.translate(hoodPatch.coordFrame, hoodPatch.coordFrame, vec3.fromValues(-.7, -.95, .55));
        mat4.rotateY(hoodPatch.coordFrame, hoodPatch.coordFrame, glMatrix.toRadian(90));
        mat4.rotateZ(hoodPatch.coordFrame, hoodPatch.coordFrame, glMatrix.toRadian(45));

        //spoiler
        mat4.translate(spoiler.coordFrame, spoiler.coordFrame, vec3.fromValues(-4.94, -.2, 1));
        mat4.rotateY(spoiler.coordFrame, spoiler.coordFrame, glMatrix.toRadian(90));
        mat4.rotateX(spoiler.coordFrame, spoiler.coordFrame, glMatrix.toRadian(90));
        mat4.rotateZ(spoiler.coordFrame, spoiler.coordFrame, glMatrix.toRadian(90));


        bodyGroup.group.push(ff, rf, glass, rearThing, hoodPatch, spoiler);


        var temp = .5;
        for(var i = 0; i < 11; i++){

            let hood = new PolygonalPrism(gl, {
                topRadius: .7,
                bottomRadius: .7,
                numSides: 4,
                height: 1.8,
                topColor: color,
                bottomColor: color
            });

            mat4.translate(hood.coordFrame, hood.coordFrame, vec3.fromValues(temp, -.05, .5));
            mat4.rotateY(hood.coordFrame, hood.coordFrame, glMatrix.toRadian(90));
            mat4.rotateX(hood.coordFrame, hood.coordFrame, glMatrix.toRadian(90));
            mat4.rotateZ(hood.coordFrame, hood.coordFrame, glMatrix.toRadian(45));

            bodyGroup.group.push(hood);

            temp = temp -.5;
        }

        var temp2 = -.50;
        for(var j = 0; j < 5; j++){

            let body1 = new PolygonalPrism(gl, {
                topRadius: .25,
                bottomRadius: .25,
                numSides: 4,
                height: 6,
                topColor: color,
                bottomColor: color
            });

            mat4.translate(body1.coordFrame, body1.coordFrame, vec3.fromValues(-5, temp2, .25));
            mat4.rotateY(body1.coordFrame, body1.coordFrame, glMatrix.toRadian(90));
            mat4.rotateZ(body1.coordFrame, body1.coordFrame, glMatrix.toRadian(45));

            bodyGroup.group.push(body1);

            temp2 = temp2 -.25;
        }

        var temp3 = -1.7;
        for(var k = 0; k < 4; k++){

            let glassBody = new PolygonalPrism(gl, {
                topRadius: .7,
                bottomRadius: .7,
                numSides: 4,
                height: 1.7,
                topColor: color2,
                bottomColor: color2
            });

            mat4.translate(glassBody.coordFrame, glassBody.coordFrame, vec3.fromValues(temp3, -.1, .90));
            mat4.rotateY(glassBody.coordFrame, glassBody.coordFrame, glMatrix.toRadian(90));
            mat4.rotateX(glassBody.coordFrame, glassBody.coordFrame, glMatrix.toRadian(90));
            mat4.rotateZ(glassBody.coordFrame, glassBody.coordFrame, glMatrix.toRadian(45));

            bodyGroup.group.push(glassBody);

            temp3 = temp3 -.5;
        }



        return bodyGroup;

    }


    makeAxles(){

        // Group to hold axles
        let axleGroup = new ObjectGroup(gl);
        var color = vec3.fromValues(.23, .23, .23);

        let axle1 = new PolygonalPrism(gl, {
            topRadius: .2,
            bottomRadius: .2,
            numSides: 20,
            height: 2,
            topColor: color,
            bottomColor: color
        });
        let axle2 = new PolygonalPrism(gl, {
            topRadius: .2,
            bottomRadius: .2,
            numSides: 20,
            height: 2,
            topColor: color,
            bottomColor: color
        });

        mat4.translate(axle1.coordFrame, axle1.coordFrame, vec3.fromValues(0, 0, 0));
        mat4.rotateX(axle1.coordFrame, axle1.coordFrame, glMatrix.toRadian(90));
        mat4.translate(axle2.coordFrame, axle2.coordFrame, vec3.fromValues(-4, 0, 0));
        mat4.rotateX(axle2.coordFrame, axle2.coordFrame, glMatrix.toRadian(90));

        axleGroup.group.push(axle1, axle2);

        return axleGroup;

    }

    makeTires(){

        // Group to hold all tires
        let tiresGroup = new ObjectGroup(gl);

        //black
        var color = vec3.fromValues(0, 0, 0);
        var color1 = vec3.fromValues(.1, .1, .1);

        let fl = new Torus(gl, {
            majorRadius: .3,
            minorRadius: .2,
            majSubdiv: 20,
            minSubdiv: 20,
            topColor: color,
            bottomColor: color1
        });
        let fr = new Torus(gl, {
            majorRadius: .3,
            minorRadius: .2,
            majSubdiv: 20,
            minSubdiv: 20,
            topColor: color,
            bottomColor: color1
        });
        let bl = new Torus(gl, {
            majorRadius: .3,
            minorRadius: .2,
            majSubdiv: 20,
            minSubdiv: 20,
            topColor: color,
            bottomColor: color1
        });
        let br = new Torus(gl, {
            majorRadius: .3,
            minorRadius: .2,
            majSubdiv: 20,
            minSubdiv: 20,
            topColor: color,
            bottomColor: color1
        });

        mat4.translate(fl.coordFrame, fl.coordFrame, vec3.fromValues(0, 0, 0));
        mat4.rotateX(fl.coordFrame, fl.coordFrame, glMatrix.toRadian(90));
        mat4.translate(fr.coordFrame, fr.coordFrame, vec3.fromValues(0, -2, 0));
        mat4.rotateX(fr.coordFrame, fr.coordFrame, glMatrix.toRadian(90));
        mat4.translate(bl.coordFrame, bl.coordFrame, vec3.fromValues(-4, 0, 0));
        mat4.rotateX(bl.coordFrame, bl.coordFrame, glMatrix.toRadian(90));
        mat4.translate(br.coordFrame, br.coordFrame, vec3.fromValues(-4, -2, 0));
        mat4.rotateX(br.coordFrame, br.coordFrame, glMatrix.toRadian(90));

        tiresGroup.group.push(fl, fr, bl, br);

        return tiresGroup;

    }
}