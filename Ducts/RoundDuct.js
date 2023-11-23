class RoundDuct extends Duct {
    constructor(scene, startPoint, endPoint, material, diameter) {
        const length = BABYLON.Vector3.Distance(startPoint, endPoint);
        super(scene, length, material);
        this.diameter = diameter;
        this.properties.diameter = diameter;
        this.startPoint = startPoint;
        this.endPoint = endPoint;
        this.createDuct();
    }

    createDuct() {
        // Create a basic cylinder
        this.ductMesh = BABYLON.MeshBuilder.CreateCylinder("roundDuct", {
            height: this.length,
            diameter: this.diameter,
            tessellation: 64
        }, this.scene);

        // Position and orient the duct
        this.positionAndOrientDuct();
        this.ductMesh.properties = this.properties;
        this.updateMaterial(this.material);
        this.ductMesh.mepObject = this; 
    }

    positionAndOrientDuct() {
        // Position the duct at the midpoint between start and end points
        this.ductMesh.position = this.startPoint.add(this.endPoint).scale(0.5);

        // Calculate the orientation based on start and end points
        const direction = this.endPoint.subtract(this.startPoint).normalize();
        const up = new BABYLON.Vector3(0, 1, 0);
        const axis = BABYLON.Vector3.Cross(up, direction).normalize();
        const angle = Math.acos(BABYLON.Vector3.Dot(up, direction));

        // Rotate the duct to align with the direction
        this.ductMesh.rotationQuaternion = BABYLON.Quaternion.RotationAxis(axis, angle);
    }

    
    updateDiameter(newDiameter) {
        if (this.ductMesh) {
            this.ductMesh.dispose();
        }
        this.diameter = newDiameter;
        this.createDuct();
    }

    updateLength(newLength) {
        if (this.ductMesh) {
            this.ductMesh.dispose();
        }
        let vectorAB = this.endPoint.subtract(this.startPoint).normalize();
        //const ductDirection = this.endPoint.subtract(this.startPoint).normalize();
        this.length = parseFloat(newLength);
       
        // Scale the normalized direction by the distance
        let scaledDirection = vectorAB.scale(this.length);

        // Add the scaled direction to the base point to get the new point
        this.endPoint = this.startPoint.add(scaledDirection);

        this.createDuct();
    }
    // Additional round duct-specific methods...
}
