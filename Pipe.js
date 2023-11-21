
class Pipe {
    constructor(scene, path, radiusFunction, tessellation) {
        this.scene = scene;
        this.path = path;
        this.radiusFunction = radiusFunction;
        this.tessellation = tessellation;
        this.tube = null;
        this.properties = {
            type: 'Pipe',
            length: this.calculateLength(path),
            diameter: this.calculateDiameter(radiusFunction)
            // Add other properties as needed
        };
        this.createTube();

    }
    

    createTube() {
        this.tube = BABYLON.MeshBuilder.CreateTube("tube", {
            path: this.path,
            radiusFunction: this.radiusFunction, // Ensure this creates a hollow structure
            tessellation: this.tessellation,
            sideOrientation: BABYLON.Mesh.DOUBLESIDE, // Important for making inside visible
            updatable: true
        }, this.scene);

        this.tube.backFaceCulling = false; // Disable back-face culling
        this.tube.properties = this.properties;
        this.mesh = this.tube;
        return this.tube;
    }

    updateDiameter(newDiameter) {
        if (this.tube) {
            this.tube.dispose();
        }
        this.radiusFunction = (i, distance) => i === 0 ? newDiameter / 2 : newDiameter;
        this.createTube();
    }

    updatePath(newPath) {
        if (this.tube) {
            this.tube.dispose();
        }
        this.path = newPath;
        this.createTube();
    }

    calculateLength() {
        let length = 0;
        for (let i = 1; i < this.path.length; i++) {
            length += BABYLON.Vector3.Distance(this.path[i - 1], this.path[i]);
        }
        return length;
    }

    // Define the calculateDiameter method
    calculateDiameter() {
        // Example implementation, adjust based on how your pipe's diameter is defined
        return this.radiusFunction(0, 0) * 2; // Diameter is 2 times the radius
    }

    // Method to update the pipe length
    updateLength(newLength) {
        if (this.path && this.path.length > 1) {
            // Dispose of the old mesh if it exists
            if (this.tube) {
                this.tube.dispose();
            }

            // Assuming the pipe is along the x-axis; modify accordingly if different
            this.path[1].x = newLength;
            this.createTube(); // Recreate the tube with the updated path
        }
    }
}
