/****************************************************************
 * Build Scenery, including ground, launchpad, scaffolding
 ***************************************************************/
class Scenery extends ObjectGroup{
    constructor(gl) {
        super(gl);

        // Grass Green
        let grass = vec3.fromValues(.23, .31, .14);

        // Launch Pad top Color
        let topPad = vec3.fromValues(0, 0, 0);

        //Launch Pad bottom color
        let botPad = vec3.fromValues(1, 1, 1);

        //Launch Platform color
        let plat = vec3.fromValues(192/256, 192/256, 192/256);


        // Create grass color cround
        let ground = new PolygonalPrism(gl,
            {
                topRadius: 50,          // required
                bottomRadius: 50,       // required
                numSides: 4,            // required
                height: 50,             // required
                topColor: grass,      // optional
                bottomColor: grass    // optional
            });

        // Position Ground
        mat4.translate(ground.coordFrame, ground.coordFrame, vec3.fromValues(0, 0, -52));


        // Create Launch pad
        let launchPad = new PolygonalPrism(gl,
            {
                topRadius: 10,          // required
                bottomRadius: 30,       // required
                numSides: 4,            // required
                height: 2,             // required
                topColor: topPad,      // optional
                bottomColor: botPad    // optional
            });

        // Position Launch Pad
        mat4.translate(launchPad.coordFrame, launchPad.coordFrame, vec3.fromValues(0, 0, -3 ));


        // Create Launch platform
        let launchPlatform = new PolygonalPrism(gl,
            {
                topRadius: 5,          // required
                bottomRadius: 5,       // required
                numSides: 4,            // required
                height: 0.2,             // required
                topColor: plat,      // optional
                bottomColor: plat    // optional
            });

        // Position launch Platform
        mat4.translate(launchPlatform.coordFrame, launchPlatform.coordFrame, vec3.fromValues(0, 0, -.3 ));


        // Create platform ploles
        let poles = this.createPoles();

        // Position poles
        mat4.rotateZ(poles.coordFrame, poles.coordFrame, glMatrix.toRadian(45));
        mat4.translate(poles.coordFrame, poles.coordFrame, vec3.fromValues(-3.5, -3.5, -.7 ));


        // Create Support Beams
        let supportBeam1 = new PolygonalPrism(gl,
            {
                topRadius: 0.5,          // required
                bottomRadius: 0.5,       // required
                numSides: 4,            // required
                height: 20,             // required
                topColor: plat,      // optional
                bottomColor: plat    // optional
            });

        let supportBeam2 = new PolygonalPrism(gl,
            {
                topRadius: 0.5,          // required
                bottomRadius: 0.5,       // required
                numSides: 4,            // required
                height: 20,             // required
                topColor: plat,      // optional
                bottomColor: plat    // optional
            });
        // Position support beams
        mat4.translate(supportBeam1.coordFrame, supportBeam1.coordFrame, vec3.fromValues(-4.5, 0, -.3 ));
        mat4.translate(supportBeam2.coordFrame, supportBeam2.coordFrame, vec3.fromValues(4.5, 0, -.3 ));


        let sceneryGroup = new ObjectGroup(gl);
        sceneryGroup.group.push(ground, launchPad, launchPlatform, poles, supportBeam1, supportBeam2);


        this.group.push(sceneryGroup);
    }

    createPoles(){

        //Launch Platform color
        let plat = vec3.fromValues(192/256, 192/256, 192/256);
        let pole;
        let poles = new ObjectGroup(gl);

        for(let x = 0; x < 15; x++){
            for(let y = 0; y < 15; y++){
                pole = new PolygonalPrism(gl,
                    {
                        topRadius: .02,          // required
                        bottomRadius: .02,       // required
                        numSides: 20,            // required
                        height: 1,             // required
                        topColor: plat,      // optional
                        bottomColor: plat    // optional
                    });

                mat4.translate(pole.coordFrame, pole.coordFrame, vec3.fromValues(x/2, y/2, -.5 ));

                poles.group.push(pole);
            }
        }

        return poles;
    }
}