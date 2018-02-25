/**
 * Let's make a rocket
 */
class FalconHeavy extends ObjectGroup {

    constructor(gl) {
        super(gl);

        var color = vec3.fromValues(.1, .1, .1);

        // //temp example of the booster
        // let booster = new PolygonalPrism(gl, {
        //     topRadius: .05,
        //     bottomRadius: .2,
        //     numSides: 15,
        //     height: .3,
        //     topColor: color,
        //     bottomColor: color
        // });
        //
        // mat4.translate(booster.coordFrame, booster.coordFrame, vec3.fromValues(0, 0, 0));
        //
        // this.group.push(booster);


        let leftBoosterGroup = new ObjectGroup(gl);
        let centerBoosterGroup = new ObjectGroup(gl);
        let rightBoosterGroup = new ObjectGroup(gl);

        leftBoosterGroup = this.makeBoosterArray(0,0);
        centerBoosterGroup = this.makeBoosterArray(0,0);
        rightBoosterGroup = this.makeBoosterArray(0,0);

        /*
          TODO: We should consider adding the leftBoosterGroup to a group we make for the leftCylinder or something.
          TODO:-- This way we would have only 3 groups that make up the main group
        */
        // Push all three booster groups to main Falcon Heavy Group (this).
        this.group.push(leftBoosterGroup, centerBoosterGroup, rightBoosterGroup);

        // Translate booster groups so all in a line side by side
        mat4.translate(leftBoosterGroup.coordFrame, leftBoosterGroup.coordFrame, vec3.fromValues(-1, 1, 0));
        mat4.translate(centerBoosterGroup.coordFrame, centerBoosterGroup.coordFrame, vec3.fromValues(0, 0, 0));
        mat4.translate(rightBoosterGroup.coordFrame, rightBoosterGroup.coordFrame, vec3.fromValues(1, -1, 0));


    }

    makeBoosterArray(x, y){

        // Group to hold all boosters from this call
        let boosterGroup = new ObjectGroup(gl);

        //grey
        var color = vec3.fromValues(.1, .1, .1);

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

    //TODO: Create a function that makes the Rocket cylinders. Maybe add all the little things to them in this function too?
}
