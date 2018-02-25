/**
 * Let's make a rocket
 */
class FalconHeavy extends ObjectGroup {
    constructor(gl) {
        super(gl);

        var color = vec3.fromValues(.1, .1, .1);

        //temp example of the booster
        let booster = new PolygonalPrism(gl, {
            topRadius: .05,
            bottomRadius: .2,
            numSides: 15,
            height: .3,
            topColor: color,
            bottomColor: color
        });

        mat4.translate(booster.coordFrame, booster.coordFrame, vec3.fromValues(0, 0, 0));

        this.group.push(booster);


        this.makeBoosterArray(0,0);
        //two other calls for the other two rockets
    }

    makeBoosterArray(x, y){

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

            this.group.push(booster);
        }
    }
}
