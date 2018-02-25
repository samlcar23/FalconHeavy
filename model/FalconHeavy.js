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

        //Create the boosters for each rocket cylinder
        leftBoosterGroup = this.makeBoosterArray(0,0);
        centerBoosterGroup = this.makeBoosterArray(0,0);
        rightBoosterGroup = this.makeBoosterArray(0,0);

        //Create the rocket cylinders
        leftRocketGroup = this.makeRocketCylinder(13.3);
        centerRocketGroup = this.makeRocketCylinder(18.7);
        rightRocketGroup = this.makeRocketCylinder(13.3);

        /*
          TODO: We should consider adding the leftBoosterGroup to a group we make for the leftCylinder or something.
          TODO:-- This way we would have only 3 groups that make up the main group
        */
        // Push all three booster groups to main Falcon Heavy Group (this).
        this.group.push(leftBoosterGroup, centerBoosterGroup, rightBoosterGroup);

        // Push the three rocket cylinders to main Falcon Heavy Group (this).
        this.group.push(leftRocketGroup, centerRocketGroup, rightRocketGroup);

        // Translate booster groups so all in a line side by side
        mat4.translate(leftBoosterGroup.coordFrame, leftBoosterGroup.coordFrame, vec3.fromValues(-1, 1, 0));
        mat4.translate(centerBoosterGroup.coordFrame, centerBoosterGroup.coordFrame, vec3.fromValues(0, 0, 0));
        mat4.translate(rightBoosterGroup.coordFrame, rightBoosterGroup.coordFrame, vec3.fromValues(1, -1, 0));

        //translate rocket groups to line up above their respective booster group; z = 0.3 to be above boosters
        mat4.translate(leftRocketGroup.coordFrame, leftRocketGroup.coordFrame, vec3.fromValues(-1, 1, .3));
        mat4.translate(centerRocketGroup.coordFrame, centerRocketGroup.coordFrame, vec3.fromValues(0, 0, .3));
        mat4.translate(rightRocketGroup.coordFrame, rightRocketGroup.coordFrame, vec3.fromValues(1, -1, .3));

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

        let rocketCylinder = new PolygonalPrism(gl, {
            topRadius: .55,
            bottomRadius: .55,
            numSides: 20,
            height: height,
            topColor: color,
            bottomColor: color
        });

        rocketGroup.group.push(rocketCylinder);

        return rocketGroup;
    }
}
