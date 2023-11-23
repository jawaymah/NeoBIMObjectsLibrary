class RectangleDuct extends Duct {
    constructor(scene, startPoint, endPoint, material, width, height) {
        super(scene, BABYLON.Vector3.Distance(startPoint, endPoint), material);
        this.width = width;
        this.height = height;
        this.properties.width = width;
        this.properties.height = height;
        this.startPoint = startPoint;
        this.endPoint = endPoint;
        this.createDuct();
    }

    createDuct() {
        const pathArray = [];
        const pathPoints = 10; // Number of paths along the tube length
        const ductDirection = this.endPoint.subtract(this.startPoint).normalize();
        const length = this.length;

        // Create paths
        for (let p = 0; p < pathPoints; p++) {
            const path = [];
            const zPos = (length / (pathPoints - 1)) * p - length / 2;

            // Define corners of the rectangle
            const corners = [
                new BABYLON.Vector3(-this.width / 2, -this.height / 2, zPos),
                new BABYLON.Vector3(this.width / 2, -this.height / 2, zPos),
                new BABYLON.Vector3(this.width / 2, this.height / 2, zPos),
                new BABYLON.Vector3(-this.width / 2, this.height / 2, zPos)
            ];

            corners.forEach(corner => {
                path.push(corner);
            });
            path.push(path[0]); // Close the path by repeating the first corner
            pathArray.push(path);
        }

        // Create ribbon geometry for the duct
        this.ductMesh = BABYLON.MeshBuilder.CreateRibbon("rectangularDuct", {
            pathArray: pathArray,
            sideOrientation: BABYLON.Mesh.DOUBLESIDE,
            updatable: false
        }, this.scene);

        // Position and orient the duct
        this.ductMesh.position = this.startPoint.add(this.endPoint).scale(0.5);
        this.ductMesh.lookAt(this.endPoint);

        this.addRectangularEndCaps(this.width, this.height, length);
    }

    addRectangularEndCaps(width, height, length) {

        // Create planes for each end
        const frontCap = BABYLON.MeshBuilder.CreatePlane("frontCap", {
            width: width,
            height: height,
            sideOrientation: BABYLON.Mesh.DOUBLESIDE 
        }, this.scene);
        frontCap.position.z = this.startPoint.z;
        frontCap.rotation.Z = Math.PI / 2;

        const backCap = BABYLON.MeshBuilder.CreatePlane("backCap", {
            width: width,
            height: height,
            sideOrientation: BABYLON.Mesh.DOUBLESIDE 
        }, this.scene);
        backCap.position.z = this.endPoint.z;
        backCap.rotation.Z = -Math.PI / 2;

        // Merge the tube with the end caps
        this.ductMesh = BABYLON.Mesh.MergeMeshes([this.ductMesh, frontCap, backCap], true, true, undefined, false, true);
        this.ductMesh.properties = this.properties;
        this.ductMesh.mepObject = this; 
    }

    updateWidth(newWidth) {
        if (this.ductMesh) {
            this.ductMesh.dispose();
        }
        this.width = newWidth;
        this.createDuct();
    }

    updateHeight(newHeight) {
        if (this.ductMesh) {
            this.ductMesh.dispose();
        }
        this.height = newHeight;
        this.createDuct();
    }

    updateLength(newLength) {
        if (this.ductMesh) {
            this.ductMesh.dispose();
        }
        let vectorAB = this.endPoint.subtract(this.startPoint).normalize();
        this.length = parseFloat(newLength);
        // Scale the normalized direction by the distance
        let scaledDirection = vectorAB.scale(this.length);

        // Add the scaled direction to the base point to get the new point
        this.endPoint = this.startPoint.add(scaledDirection);
        this.createDuct();
    }
    // Additional methods...
}
