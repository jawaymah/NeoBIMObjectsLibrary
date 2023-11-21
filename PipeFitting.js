
class PipeFitting {
    constructor(scene, position, rotation) {
        this.scene = scene;
        this.position = position;
        this.rotation = rotation;
        this.properties = {
            type: 'Pipe',
            diameter: this.calculateDiameter(radiusFunction)
            // Add other properties as needed
        };
        this.createFitting();


    }

    createFitting() {
        const elbow = BABYLON.MeshBuilder.CreateTorus("elbow", {
            diameter: 1,
            thickness: 0.2,
            tessellation: 325
        }, this.scene);
        elbow.position = this.position;
        elbow.rotation = this.rotation;

        elbow.properties = this.properties;
        this.mesh = this.elbow;
    }

    // Define the calculateDiameter method
    calculateDiameter() {
        // Example implementation, adjust based on how your pipe's diameter is defined
        return 3; // Diameter is 2 times the radius
    }
}
