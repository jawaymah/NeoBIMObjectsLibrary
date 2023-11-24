class OvalDuct extends Duct {

    constructor(scene, startPoint, endPoint, material, width, height, cornerRadius) {
        super(scene, BABYLON.Vector3.Distance(startPoint, endPoint), material);
        this.width = width;
        this.height = height;
        this.properties.width = width;
        this.properties.height = height;
        this.startPoint = startPoint;
        this.endPoint = endPoint;
        this.cornerRadius = cornerRadius;   

        this.createDuct();
    }

    createOvalPath(width, height, cornerRadius) {
        const pathArray = [];
        const pathPoints = 2;
        const cornerPoints = 20; // Number of points to define each corner's arc

        for (let p = 0; p < pathPoints; p++) {
            const path = [];
            const zPos = ((this.length / (pathPoints - 1)) * p - this.length / 2.0 );
      
            // Ensure the corner radius is not larger than half of the width or height
            cornerRadius = Math.min(cornerRadius, width / 2, height / 2);
        
            // Function to add an arc
            const addArc = (startAngle, centerX, centerY) => {
                for (let i = 0; i <= cornerPoints; i++) {
                    const angle = startAngle + (Math.PI / 2) * (i / cornerPoints);
                    const x = centerX + cornerRadius * Math.cos(angle);
                    const y = centerY + cornerRadius * Math.sin(angle);
                    path.push(new BABYLON.Vector3(x, y, zPos));
                }
            };
        
            // Bottom left corner arc
            addArc(Math.PI, -width / 2 + cornerRadius, -height / 2 + cornerRadius);
        
            // Bottom side
            for (let i = 1; i < cornerPoints; i++) {
                const x = -width / 2 + cornerRadius + (i / cornerPoints) * (width - 2 * cornerRadius);
                path.push(new BABYLON.Vector3(x, -height / 2, zPos));
            }
        
            // Bottom right corner arc
            addArc(-Math.PI / 2, width / 2 - cornerRadius, -height / 2 + cornerRadius);
        
            // Right side
            for (let i = 1; i < cornerPoints; i++) {
                const y = -height / 2 + cornerRadius + (i / cornerPoints) * (height - 2 * cornerRadius);
                path.push(new BABYLON.Vector3(width / 2, y, zPos));
            }
        
            // Top right corner arc
            addArc(0, width / 2 - cornerRadius, height / 2 - cornerRadius);
        
            // Top side
            for (let i = 1; i < cornerPoints; i++) {
                const x = width / 2 - cornerRadius - (i / cornerPoints) * (width - 2 * cornerRadius);
                path.push(new BABYLON.Vector3(x, height / 2, zPos));
            }
        
            // Top left corner arc
            addArc(Math.PI / 2, -width / 2 + cornerRadius, height / 2 - cornerRadius);
        
            // Left side
            for (let i = 1; i < cornerPoints; i++) {
                const y = height / 2 - cornerRadius - (i / cornerPoints) * (height - 2 * cornerRadius);
                path.push(new BABYLON.Vector3(-width / 2, y, zPos));
            }
            path.push(path[0]); // Close the path by repeating the first corner
            pathArray.push(path);
        }
        return pathArray;
    }

    createOvalPathwithZpos(width, height, cornerRadius, zPos) {
        const pathArray = [];
        const pathPoints = 1;
        const cornerPoints = 20; // Number of points to define each corner's arc

        for (let p = 0; p < pathPoints; p++) {
            const path = [];
            // Ensure the corner radius is not larger than half of the width or height
            cornerRadius = Math.min(cornerRadius, width / 2, height / 2);
        
            // Function to add an arc
            const addArc = (startAngle, centerX, centerY) => {
                for (let i = 0; i <= cornerPoints; i++) {
                    const angle = startAngle + (Math.PI / 2) * (i / cornerPoints);
                    const x = centerX + cornerRadius * Math.cos(angle);
                    const y = centerY + cornerRadius * Math.sin(angle);
                    path.push(new BABYLON.Vector3(x, y, zPos));
                }
            };
        
            // Bottom left corner arc
            addArc(Math.PI, -width / 2 + cornerRadius, -height / 2 + cornerRadius);
        
            // Bottom side
            for (let i = 1; i < cornerPoints; i++) {
                const x = -width / 2 + cornerRadius + (i / cornerPoints) * (width - 2 * cornerRadius);
                path.push(new BABYLON.Vector3(x, -height / 2, zPos));
            }
        
            // Bottom right corner arc
            addArc(-Math.PI / 2, width / 2 - cornerRadius, -height / 2 + cornerRadius);
        
            // Right side
            for (let i = 1; i < cornerPoints; i++) {
                const y = -height / 2 + cornerRadius + (i / cornerPoints) * (height - 2 * cornerRadius);
                path.push(new BABYLON.Vector3(width / 2, y, zPos));
            }
        
            // Top right corner arc
            addArc(0, width / 2 - cornerRadius, height / 2 - cornerRadius);
        
            // Top side
            for (let i = 1; i < cornerPoints; i++) {
                const x = width / 2 - cornerRadius - (i / cornerPoints) * (width - 2 * cornerRadius);
                path.push(new BABYLON.Vector3(x, height / 2, zPos));
            }
        
            // Top left corner arc
            addArc(Math.PI / 2, -width / 2 + cornerRadius, height / 2 - cornerRadius);
        
            // Left side
            for (let i = 1; i < cornerPoints; i++) {
                const y = height / 2 - cornerRadius - (i / cornerPoints) * (height - 2 * cornerRadius);
                path.push(new BABYLON.Vector3(-width / 2, y, zPos));
            }
            path.push(path[0]); // Close the path by repeating the first corner
            pathArray.push(path);
        }
        return pathArray;
    }
    
    createDuct() {
        const ovalPath = this.createOvalPath(this.width, this.height, this.cornerRadius);

        // Create ribbon geometry for the duct
        this.ductMesh = BABYLON.MeshBuilder.CreateRibbon("rectangularDuct", {
            pathArray: ovalPath,
            sideOrientation: BABYLON.Mesh.DOUBLESIDE,
            updatable: false
        }, this.scene);

        // Position and orient the duct
        this.ductMesh.position = this.startPoint.add(this.endPoint).scale(0.5);
        this.ductMesh.lookAt(this.endPoint);

        this.addRectangularEndCaps(this.width, this.height, length);

    }

    addRectangularEndCaps(width, height, length) {
        //const zPos1 = ((this.length / (2 - 1)) * 1 - length / 2) + this.startPoint.z;
        const zPos1 = this.startPoint.z;
        //const zPos2 = ((this.length / (2 - 1)) * 2 - length / 2) + this.endPoint.z;
        const zPos2 = this.endPoint.z;
      
        const ovalPath1 =this.createOvalPathwithZpos(width, height, this.cornerRadius, zPos1);
        const ovalPath2 =this.createOvalPathwithZpos(width, height, this.cornerRadius, zPos2);

        const frontCap =  BABYLON.MeshBuilder.CreateRibbon("customPlane", {
            pathArray: ovalPath1,
            sideOrientation: BABYLON.Mesh.DOUBLESIDE,
            updatable: false
        }, scene);
        frontCap.position.z = this.startPoint.z;
        //frontCap.rotation.Z = Math.PI / 2;
        const backCap =  BABYLON.MeshBuilder.CreateRibbon("customPlane", {
            pathArray: ovalPath2,
            sideOrientation: BABYLON.Mesh.DOUBLESIDE,
            updatable: false
        }, scene);
        backCap.position.z = this.endPoint.z;
        //backCap.rotation.Z = -Math.PI / 2;
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