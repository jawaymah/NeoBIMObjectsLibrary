class CurvedPipe {
    constructor(scene, curveRadius, tubeRadius, tessellation, angleDegrees) {
        this.scene = scene;
        this.curveRadius = curveRadius; // Radius of the curve (arc radius)
        this.tubeRadius = tubeRadius; // Radius of the tube itself
        this.tessellation = tessellation;
        this.angleDegrees = angleDegrees; // Angle of the curve in degrees
        this.tube = null;
        this.properties = {
            type: 'PipeFitting (Elbow)',
            angle: this.angleDegrees
            // Add other properties as needed
        };
        this.createCurvedTube();
    }

    createCurvedTube() {
        // Define a horizontal curved path based on the specified angle
        let path = [];
        const points = 60; // Number of points in the curve
        const angleRadians = BABYLON.Tools.ToRadians(this.angleDegrees); // Convert angle to radians

        for (let i = 0; i <= points; i++) {
            let angle = angleRadians * (i / points); // Use the specified angle
            let x = this.curveRadius * Math.cos(angle);
            let z = this.curveRadius * Math.sin(angle);

            path.push(new BABYLON.Vector3(x + 10, 0, z));
        }

        // Create the tube
        this.tube = BABYLON.MeshBuilder.CreateTube("curvedPipe", {
            path: path,
            radius: this.tubeRadius,
            tessellation: this.tessellation,
            sideOrientation: BABYLON.Mesh.DOUBLESIDE,
            updatable: true
        }, this.scene);
        this.tube.mepObject = this; 
        this.tube.properties = this.properties;
        this.tube.backFaceCulling = false; // Ensure inside of the tube is visible
    }

    updateAngle(newAngle) {
        this.angleDegrees = newAngle;
        if (this.tube) {
            this.tube.dispose(); // Dispose of the old mesh
        }
        this.createCurvedTube(); // Recreate the tube with the new angle
    }
}

class CurvedPipe2 {
    constructor(scene, curveRadius, outerRadius, innerRadius, tessellation, angleDegrees) {
        this.scene = scene;
        this.curveRadius = curveRadius;
        this.outerRadius = outerRadius;
        this.innerRadius = innerRadius;
        this.tessellation = tessellation;
        this.angleDegrees = angleDegrees;
        this.curvedPipeMesh = null;
        this.createCurvedPipe();
    }

    createCurvedPipe() {
        const outerPath = this.createCurvedPath(this.curveRadius + this.outerRadius);
        const innerPath = this.createCurvedPath(this.curveRadius - this.innerRadius);

        // Create outer and inner curved cylinders
        const outerCylinder = BABYLON.MeshBuilder.CreateTube("outerCylinder", {
            path: outerPath,
            radius: this.outerRadius,
            tessellation: this.tessellation,
            sideOrientation: BABYLON.Mesh.DOUBLESIDE,
            updatable: false
        }, this.scene);

        const innerCylinder = BABYLON.MeshBuilder.CreateTube("innerCylinder", {
            path: innerPath,
            radius: this.innerRadius,
            tessellation: this.tessellation,
            sideOrientation: BABYLON.Mesh.DOUBLESIDE,
            updatable: false
        }, this.scene);
        innerCylinder.scaling.y = -1; // Invert the inner cylinder

        // Perform CSG subtraction
        const outerCSG = BABYLON.CSG.FromMesh(outerCylinder);
        const innerCSG = BABYLON.CSG.FromMesh(innerCylinder);
        const curvedPipeCSG = outerCSG.subtract(innerCSG);
        this.curvedPipeMesh = curvedPipeCSG.toMesh("curvedPipeMesh", null, this.scene);

        // Clean up
        outerCylinder.dispose();
        innerCylinder.dispose();
    }

    createCurvedPath(radius) {
        let path = [];
        const points = 60; // Number of points in the curve
        const angleRadians = BABYLON.Tools.ToRadians(this.angleDegrees); // Convert angle to radians

        for (let i = 0; i <= points; i++) {
            let angle = angleRadians * (i / points);
            let x = radius * Math.cos(angle);
            let z = radius * Math.sin(angle);
            path.push(new BABYLON.Vector3(x, 0, z));
        }

        return path;
    }
}
