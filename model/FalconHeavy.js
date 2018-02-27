/**
 * Let's make a rocket
 */
class FalconHeavy extends ObjectGroup {

    constructor(gl) {
        super(gl);

        /***************************************************************************************
         * Rough scale info: 10ft = 1.0
         * Example: a booster is roughly 3ft tall so 3/10 = 0.3 so the boosters height is 0.3
         * Left & Right Rocket Cylinders: Height = 133ft/10 = 13.3; Radius = 11ft/10 = 1.1/2 = .55
         * Center Rocket Cylinder: Height = 187ft/10 = 18.7; Radius = 11ft/10 = 1.1/2 = .55
         **************************************************************************************/

        //Groups for the booster arrays
        let leftBoosterGroup = new ObjectGroup(gl);
        let centerBoosterGroup = new ObjectGroup(gl);
        let rightBoosterGroup = new ObjectGroup(gl);

        //Groups for the rocket cylinders
        let leftRocketGroup = new ObjectGroup(gl);
        let centerRocketGroup = new ObjectGroup(gl);
        let rightRocketGroup = new ObjectGroup(gl);

        //Group for fairing on top of center rocket
        let fairingGroup = new ObjectGroup(gl);

        //Group for rocket cylinder toppers
        let leftRocketTopperGroup = new ObjectGroup(gl);
        let rightRocketTopperGroup = new ObjectGroup(gl);

        //Create the boosters for each rocket cylinder
        leftBoosterGroup = this.makeBoosterArray(0,0);
        centerBoosterGroup = this.makeBoosterArray(0,0);
        rightBoosterGroup = this.makeBoosterArray(0,0);

        //Create the rocket cylinders
        leftRocketGroup = this.makeRocketCylinder(13.3);
        centerRocketGroup = this.makeRocketCylinder(18.7);
        rightRocketGroup = this.makeRocketCylinder(13.3);

        //Create the fairing for the center rocket
        fairingGroup = this.makeFairing();

        //Create the topper for left and right rockets
        leftRocketTopperGroup = this.makeTopper();
        rightRocketTopperGroup = this.makeTopper();

        // Create support bars
        var color = vec3.fromValues(.23, .23, .23);
        let supportBar1 = new PolygonalPrism(gl, {
            topRadius: .05,
            bottomRadius: .05,
            numSides: 20,
            height: 2.5,
            topColor: color,
            bottomColor: color
        });
        mat4.rotateX(supportBar1.coordFrame, supportBar1.coordFrame, glMatrix.toRadian(90));
        mat4.rotateY(supportBar1.coordFrame, supportBar1.coordFrame, glMatrix.toRadian(45));
        mat4.translate(supportBar1.coordFrame, supportBar1.coordFrame, vec3.fromValues(0, 3, -1.25));

        let supportBar2 = new PolygonalPrism(gl, {
            topRadius: .05,
            bottomRadius: .05,
            numSides: 20,
            height: 2.9,
            topColor: color,
            bottomColor: color
        });
        mat4.rotateX(supportBar2.coordFrame, supportBar2.coordFrame, glMatrix.toRadian(90));
        mat4.rotateY(supportBar2.coordFrame, supportBar2.coordFrame, glMatrix.toRadian(45));
        mat4.translate(supportBar2.coordFrame, supportBar2.coordFrame, vec3.fromValues(-.55, 13.3, -1.42));

        let supportBar3 = new PolygonalPrism(gl, {
            topRadius: .05,
            bottomRadius: .05,
            numSides: 20,
            height: 2.9,
            topColor: color,
            bottomColor: color
        });
        mat4.rotateX(supportBar3.coordFrame, supportBar3.coordFrame, glMatrix.toRadian(90));
        mat4.rotateY(supportBar3.coordFrame, supportBar3.coordFrame, glMatrix.toRadian(45));
        mat4.translate(supportBar3.coordFrame, supportBar3.coordFrame, vec3.fromValues(.55, 13.3, -1.42));

        
        this.group.push(supportBar1, supportBar2, supportBar3);



        /*
          TODO: We should consider adding the leftBoosterGroup to a group we make for the leftCylinder or something.
          TODO:-- This way we would have only 3 groups that make up the main group
        */
        // Push all three booster groups to main Falcon Heavy Group (this).
        this.group.push(leftBoosterGroup, centerBoosterGroup, rightBoosterGroup);

        // Push the three rocket cylinders to main Falcon Heavy Group (this).
        this.group.push(leftRocketGroup, centerRocketGroup, rightRocketGroup);

        // Push the fairing group to the main Falcon Heavy Group (this).
        this.group.push(fairingGroup);

        //TODO: add the toppers to rocket cylinders instead
        // Push the rocket toppers to the main Falcon Heavy Group (this).
        this.group.push(leftRocketTopperGroup, rightRocketTopperGroup);

        // Translate booster groups so all in a line side by side
        mat4.translate(leftBoosterGroup.coordFrame, leftBoosterGroup.coordFrame, vec3.fromValues(-1, 1, 0));
        mat4.translate(centerBoosterGroup.coordFrame, centerBoosterGroup.coordFrame, vec3.fromValues(0, 0, 0));
        mat4.translate(rightBoosterGroup.coordFrame, rightBoosterGroup.coordFrame, vec3.fromValues(1, -1, 0));

        //translate rocket groups to line up above their respective booster group; z = 0.3 to be above boosters
        mat4.translate(leftRocketGroup.coordFrame, leftRocketGroup.coordFrame, vec3.fromValues(-1, 1, .3));
        mat4.translate(centerRocketGroup.coordFrame, centerRocketGroup.coordFrame, vec3.fromValues(0, 0, .3));
        mat4.translate(rightRocketGroup.coordFrame, rightRocketGroup.coordFrame, vec3.fromValues(1, -1, .3));

        //translate the fairing to be on top of the center rocket
        mat4.translate(fairingGroup.coordFrame, fairingGroup.coordFrame, vec3.fromValues(0, 0, 19));

        //translate the toppers to be on top of the cylinders
        mat4.translate(leftRocketTopperGroup.coordFrame, leftRocketTopperGroup.coordFrame, vec3.fromValues(-1, 1, 13.6));
        mat4.translate(rightRocketTopperGroup.coordFrame, rightRocketTopperGroup.coordFrame, vec3.fromValues(1, -1, 13.6));


    }

    makeBoosterArray(x, y){

        // Group to hold all boosters from this call
        let boosterGroup = new ObjectGroup(gl);

        //grey
        var color = vec3.fromValues(.23, .23, .23);

        //temp variables for booster placement
        var temp1 = 0.4;
        var temp2 = 0.15;

        //create 9 boosters in formation
        for (var k = 0; k < 9; k++){
            let booster = new PolygonalPrism(gl, {
                topRadius: .05,
                bottomRadius: .2,
                numSides: 15,
                height: .3,
                topColor: color,
                bottomColor: color
            });

            //center booster
            if(k === 0) {
                mat4.translate(booster.coordFrame, booster.coordFrame, vec3.fromValues(x, y, 0));
                //surrounding boosters
            } else if (k < 5) {
                mat4.translate(booster.coordFrame, booster.coordFrame, vec3.fromValues(temp1, temp2, 0));
                temp1 = temp1 * -1;
                var t = temp1;
                temp1 = temp2;
                temp2 = t;
            } else{
                mat4.translate(booster.coordFrame, booster.coordFrame, vec3.fromValues(temp2, temp1, 0));
                temp1 = temp1 * -1;
                var t = temp1;
                temp1 = temp2;
                temp2 = t;
            }

            // Push the single booster to the booster group
            boosterGroup.group.push(booster);
        }

        // Return the whole group to me manipulated later.
        return boosterGroup;
    }

    //Create a function that makes the Rocket cylinders. Maybe add all the little things to them in this function too?
    //adding all the little stuff here seems like a good idea to me.
    //TODO: Figure out a way to skin the cylinder with an image instead of trying to use shapes for SPACEX?
    makeRocketCylinder(height){

        // Group to hold all rocket cylinder parts from this call
        let rocketGroup = new ObjectGroup(gl);

        // white
        var color = vec3.fromValues(.9, .9, .9);
        // Gray
        var color1 = vec3.fromValues(.23, .23, .23);


        let rocketCylinder = new PolygonalPrism(gl, {
            topRadius: .55,
            bottomRadius: .55,
            numSides: 20,
            height: height,
            topColor: color,
            bottomColor: color
        });

        // Create 4 fins for bottom of cylinder
        let fin1 = new Cone(gl, {
            radius: .2,
            height: 6.343,
            tipColor: color1,
            baseColor: color1
        });

        let fin2 = new Cone(gl, {
            radius: .2,
            height: 6.343,
            tipColor: 1,
            baseColor: color1
        });

        let fin3 = new Cone(gl, {
            radius: .2,
            height: 6.343,
            tipColor: color1,
            baseColor: color1
        });

        let fin4 = new Cone(gl, {
            radius: .2,
            height: 6.343,
            tipColor: color1,
            baseColor: color1
        });

        // Position fins
        mat4.translate(fin1.coordFrame, fin1.coordFrame, vec3.fromValues(-.46, 0, .1));
        mat4.translate(fin2.coordFrame, fin2.coordFrame, vec3.fromValues(0, .46, .1));
        mat4.translate(fin3.coordFrame, fin3.coordFrame, vec3.fromValues(.46, 0, .1));
        mat4.translate(fin4.coordFrame, fin4.coordFrame, vec3.fromValues(0, -.46, .1));


        // Create top square clip things
        let topClip1 = new PolygonalPrism(gl, {
            topRadius: .17,
            bottomRadius: .17,
            numSides: 20,
            height: .22,
            topColor: color1,
            bottomColor: color1
        });

        let bottomClip1 = new PolygonalPrism(gl, {
            topRadius: .3,
            bottomRadius: .3,
            numSides: 20,
            height: .4,
            topColor: color1,
            bottomColor: color1
        });

        let topClip2 = new PolygonalPrism(gl, {
            topRadius: .17,
            bottomRadius: .17,
            numSides: 20,
            height: .22,
            topColor: color1,
            bottomColor: color1
        });

        let bottomClip2 = new PolygonalPrism(gl, {
            topRadius: .3,
            bottomRadius: .3,
            numSides: 20,
            height: .4,
            topColor: color1,
            bottomColor: color1
        });

        let topClip3 = new PolygonalPrism(gl, {
            topRadius: .17,
            bottomRadius: .17,
            numSides: 20,
            height: .22,
            topColor: color1,
            bottomColor: color1
        });

        let bottomClip3 = new PolygonalPrism(gl, {
            topRadius: .3,
            bottomRadius: .3,
            numSides: 20,
            height: .4,
            topColor: color1,
            bottomColor: color1
        });

        let topClip4 = new PolygonalPrism(gl, {
            topRadius: .17,
            bottomRadius: .17,
            numSides: 20,
            height: .22,
            topColor: color1,
            bottomColor: color1
        });

        let bottomClip4 = new PolygonalPrism(gl, {
            topRadius: .3,
            bottomRadius: .3,
            numSides: 20,
            height: .4,
            topColor: color1,
            bottomColor: color1
        });


        // Position square clip things
        mat4.translate(topClip1.coordFrame, topClip1.coordFrame, vec3.fromValues(-.43, 0, 12.9));
        mat4.translate(bottomClip1.coordFrame, bottomClip1.coordFrame, vec3.fromValues(-.3, 0, 12.5));

        mat4.translate(topClip2.coordFrame, topClip2.coordFrame, vec3.fromValues(0, .43, 12.9));
        mat4.translate(bottomClip2.coordFrame, bottomClip2.coordFrame, vec3.fromValues(0, .3, 12.5));

        mat4.translate(topClip3.coordFrame, topClip3.coordFrame, vec3.fromValues(.43, 0, 12.9));
        mat4.translate(bottomClip3.coordFrame, bottomClip3.coordFrame, vec3.fromValues(.3, 0, 12.5));

        mat4.translate(topClip4.coordFrame, topClip4.coordFrame, vec3.fromValues(0, -.43, 12.9));
        mat4.translate(bottomClip4.coordFrame, bottomClip4.coordFrame, vec3.fromValues(0, -.3, 12.5));


        rocketGroup.group.push(rocketCylinder, fin1, fin2, fin3, fin4, topClip1, bottomClip1, topClip2, bottomClip2, topClip3, bottomClip3, topClip4, bottomClip4);

        return rocketGroup;
    }

    makeFairing(){

        let fairingGroup = new ObjectGroup(gl);

        // white
        var color = vec3.fromValues(.9, .9, .9);
        //grey
        var color2 = vec3.fromValues(.23, .23, .23);

        let connector = new PolygonalPrism(gl, {
            topRadius: .8,
            /*honestly not sure why but it looks better*/
            bottomRadius: .30,
            numSides: 20,
            height: .5,
            topColor: color,
            bottomColor: color2
        });

        let body = new PolygonalPrism(gl, {
            topRadius: .8,
            bottomRadius: .8,
            numSides: 20,
            height: 2.1,
            topColor: color,
            bottomColor: color
        });

        let top1 = new PolygonalPrism(gl, {
            topRadius: .75,
            bottomRadius: .85,
            numSides: 20,
            height: .2,
            topColor: color,
            bottomColor: color
        });

        let top2 = new PolygonalPrism(gl, {
            topRadius: .65,
            bottomRadius: .85,
            numSides: 20,
            height: .2,
            topColor: color,
            bottomColor: color
        });

        let top3 = new PolygonalPrism(gl, {
            topRadius: .5,
            bottomRadius: .8,
            numSides: 20,
            height: .2,
            topColor: color,
            bottomColor: color
        });

        let top4 = new PolygonalPrism(gl, {
            topRadius: .27,
            bottomRadius: .725,
            numSides: 20,
            height: .2,
            topColor: color,
            bottomColor: color
        });

        let sphere = new Sphere(gl, {
            radius: .365,
            splitDepth: 5,
            northColor: color,
            equatorColor: color,
            southColor: color
        });



        mat4.translate(body.coordFrame, body.coordFrame, vec3.fromValues(0, 0, .5));
        mat4.translate(top1.coordFrame, top1.coordFrame, vec3.fromValues(0, 0, 2.6));
        mat4.translate(top2.coordFrame, top2.coordFrame, vec3.fromValues(0, 0, 2.8));
        mat4.translate(top3.coordFrame, top3.coordFrame, vec3.fromValues(0, 0, 3.0));
        mat4.translate(top4.coordFrame, top4.coordFrame, vec3.fromValues(0, 0, 3.2));
        mat4.translate(sphere.coordFrame, sphere.coordFrame, vec3.fromValues(0, 0, 3.15));


        fairingGroup.group.push(connector, body, top1, top2, top3, top4, sphere);

        return fairingGroup;

    }

    makeTopper(){

        let topperGroup = new ObjectGroup(gl);

        // white
        var color = vec3.fromValues(.9, .9, .9);

        let top1 = new PolygonalPrism(gl, {
            topRadius: .5,
            bottomRadius: .6,
            numSides: 20,
            height: .2,
            topColor: color,
            bottomColor: color
        });

        let top2 = new PolygonalPrism(gl, {
            topRadius: .4,
            bottomRadius: .6,
            numSides: 20,
            height: .2,
            topColor: color,
            bottomColor: color
        });

        let top3 = new PolygonalPrism(gl, {
            topRadius: .2,
            bottomRadius: .6,
            numSides: 20,
            height: .2,
            topColor: color,
            bottomColor: color
        });

        let sphere = new Sphere(gl, {
            radius: .25,
            splitDepth: 5,
            northColor: color,
            equatorColor: color,
            southColor: color
        });

        mat4.translate(top1.coordFrame, top1.coordFrame, vec3.fromValues(0, 0, 0));
        mat4.translate(top2.coordFrame, top2.coordFrame, vec3.fromValues(0, 0, .2));
        mat4.translate(top3.coordFrame, top3.coordFrame, vec3.fromValues(0, 0, .4));
        mat4.translate(sphere.coordFrame, sphere.coordFrame, vec3.fromValues(0, 0, .45));

        topperGroup.group.push(top1, top2, top3, sphere);

        return topperGroup;
    }
}
