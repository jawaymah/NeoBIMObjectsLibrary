class OvalDuct extends Duct {

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

        const direction = this.endPoint.subtract(this.startPoint).normalize();
        const upVector = new BABYLON.Vector3(0, 1, 0);
        const axis = BABYLON.Vector3.Cross(upVector, direction.normalize()).normalize();
        // Scale the normalized direction by the distance
        let widthscaledDirection = axis.scale(this.width/2.0);
        let heightscaledDirection = upVector.scale(this.height/2.0);

        // Add the scaled direction to the base point to get the new point
        //p1
        let p11 = this.startPoint.add(widthscaledDirection);
        p11 = p11.add(heightscaledDirection);
        let p21 = this.endPoint.add(widthscaledDirection);
        p21 = p21.add(heightscaledDirection);
        let quarterCylinder = this.createCylinderArc(1);
        this.positionAndOrientCylinder(p11,p21, quarterCylinder);

        let quarterCylinder2 = this.createCylinderArc(2);
        let p12 = this.startPoint.add(widthscaledDirection);
        p12 = p12.add(heightscaledDirection.scale(-1));
        let p22 = this.endPoint.add(widthscaledDirection);
        p22 = p22.add(heightscaledDirection.scale(-1));
        this.positionAndOrientCylinder(p12,p22, quarterCylinder2);

        let quarterCylinder3 = this.createCylinderArc(3);
        let p13 = this.startPoint.add(widthscaledDirection.scale(-1));
        p13 = p13.add(heightscaledDirection.scale(-1));
        let p23 = this.endPoint.add(widthscaledDirection.scale(-1));
        p23 = p23.add(heightscaledDirection.scale(-1));
        this.positionAndOrientCylinder(p13,p23, quarterCylinder3);

        let quarterCylinder4 = this.createCylinderArc(4);
        let p14 = this.startPoint.add(widthscaledDirection.scale(-1));
        p14 = p14.add(heightscaledDirection);
        let p24 = this.endPoint.add(widthscaledDirection.scale(-1));
        p24 = p24.add(heightscaledDirection);
        this.positionAndOrientCylinder(p14,p24, quarterCylinder4);

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
    createCylinderArc(corner) {
        // Create a quarter cylinder
        let quarterCylinder = BABYLON.MeshBuilder.CreateCylinder("quarterCylinder", {
            height: this.length,
            diameter: 2,
            tessellation: 64,
            arc: 0.25  // Quarter of a cylinder
        }, scene);

        // Rotate the cylinder around the X-axis by 90 degrees
        quarterCylinder.rotation.Z =(corner* Math.PI) / 2;
        return quarterCylinder;
    }

    positionAndOrientCylinder(point1, point2, cylinderMesh) {
        // Position the cylinder at the midpoint between start and end points
        cylinderMesh.position = point1.add(point2).scale(0.5);

        // Align the cylinder with the direction vector
        const direction = this.endPoint.subtract(this.startPoint).normalize();
        const upVector = new BABYLON.Vector3(0, 1, 0);
        const axis = BABYLON.Vector3.Cross(upVector, direction.normalize()).normalize();
        const angle = Math.acos(BABYLON.Vector3.Dot(upVector, direction.normalize()));

        // Apply rotation
        cylinderMesh.rotationQuaternion = BABYLON.Quaternion.RotationAxis(axis, angle);
    }

    // Additional methods...
}