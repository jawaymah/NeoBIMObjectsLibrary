class OvalDuct2 extends Duct {
    constructor(scene, length, material, width, height) {
        super(scene, length, material);
        this.width = width;
        this.height = height;
        this.properties.width = width;
        this.properties.height = height;
        this.createDuct();
    }

    createDuct2() {
        // Create a basic cylinder first
        this.ductMesh = BABYLON.MeshBuilder.CreateCylinder("ovalDuct", {
            height: this.length,
            diameter: 1, // Temporary diameter
            tessellation: 64 // Higher tessellation for a smoother ellipse
        }, this.scene);

        // Modify the vertices of the cylinder to create an elliptical cross-section
        let positions = this.ductMesh.getVerticesData(BABYLON.VertexBuffer.PositionKind);
        if (positions) {
            let numberOfPoints = positions.length / 3;
            for (let i = 0; i < numberOfPoints; i++) {
                positions[i * 3] *= this.width / 2;  // Scale X-coordinates
                positions[i * 3 + 1] *= this.height / 2; // Scale Y-coordinates
            }
            this.ductMesh.updateVerticesData(BABYLON.VertexBuffer.PositionKind, positions);
        }

        // Rotate to make horizontal
        this.ductMesh.rotation.z = Math.PI / 2; // 90 degrees
        this.ductMesh.properties = this.properties;

        this.updateMaterial(this.material);
    }

    createDuct3() {
        const pathArray = [];
        const ellipsePoints = 64; // Number of points in ellipse
        const pathPoints = 10; // Number of paths along the tube length

        // Create ellipse paths
        for (let p = 0; p < pathPoints; p++) {
            const path = [];
            for (let i = 0; i <= ellipsePoints; i++) {
                const angle = (Math.PI * 2 * i) / ellipsePoints;
                const x = (this.width / 2) * Math.cos(angle);
                const z = (this.height / 2) * Math.sin(angle);
                path.push(new BABYLON.Vector3(x, (this.length / (pathPoints - 1)) * p - this.length / 2, z));
            }
            pathArray.push(path);
        }

        // Create ribbon geometry for the duct
        this.ductMesh = BABYLON.MeshBuilder.CreateRibbon("ovalDuct", {
            pathArray: pathArray,
            sideOrientation: BABYLON.Mesh.DOUBLESIDE,
            updatable: false
        }, this.scene);

        // Apply material and additional properties as needed
    }

    createDuct4() {
        const pathArray = [];
        const ovalPoints = 64; // Number of points in oval
        const pathPoints = 10; // Number of paths along the tube length

        // Create oval paths
        for (let p = 0; p < pathPoints; p++) {
            const path = [];
            for (let i = 0; i <= ovalPoints; i++) {
                const angle = (Math.PI * 2 * i) / ovalPoints;
                let x, z;

                if (angle <= Math.PI / 2 || angle > 3 * Math.PI / 2) {
                    // Right side of the oval - use full width
                    x = (this.width / 2) * Math.cos(angle);
                    z = (this.height / 2) * Math.sin(angle);
                } else {
                    // Left side of the oval - use reduced width to create the oval effect
                    x = (this.width / 4) * Math.cos(angle); // Change the divisor to control the oval's shape
                    z = (this.height / 2) * Math.sin(angle);
                }

                path.push(new BABYLON.Vector3(x, (this.length / (pathPoints - 1)) * p - this.length / 2, z));
            }
            pathArray.push(path);
        }

        // Create ribbon geometry for the duct
        this.ductMesh = BABYLON.MeshBuilder.CreateRibbon("ovalDuct", {
            pathArray: pathArray,
            sideOrientation: BABYLON.Mesh.DOUBLESIDE,
            updatable: false
        }, this.scene);

        // Apply material and additional properties as needed
    }

    createDuct() {
        const pathArray = [];
        const pathPoints = 10; // Number of paths along the tube length
        const cornerPoints = 16; // Points for each rounded corner

        // Calculate dimensions for the straight sections
        const straightWidth = this.width / 2; // Half the width for the straight section
        const straightHeight = this.height / 2; // Half the height for the straight section

        // Create oval paths
        for (let p = 0; p < pathPoints; p++) {
            const path = [];

            // Bottom straight line
            for (let i = 0; i <= straightWidth; i++) {
                path.push(new BABYLON.Vector3(i - straightWidth / 2, (this.length / (pathPoints - 1)) * p - this.length / 2, -straightHeight / 2));
            }

            // Right arc
            for (let i = 0; i <= cornerPoints; i++) {
                const angle = Math.PI / 2 * i / cornerPoints;
                const x = straightWidth / 2 + (this.height / 4) * Math.cos(angle);
                const z = -straightHeight / 2 + (this.height / 4) * Math.sin(angle);
                path.push(new BABYLON.Vector3(x, (this.length / (pathPoints - 1)) * p - this.length / 2, z));
            }

            // Top straight line
            for (let i = 0; i <= straightWidth; i++) {
                path.push(new BABYLON.Vector3(straightWidth / 2 - i, (this.length / (pathPoints - 1)) * p - this.length / 2, straightHeight / 2));
            }

            // Left arc
            for (let i = 0; i <= cornerPoints; i++) {
                const angle = Math.PI / 2 + Math.PI / 2 * i / cornerPoints;
                const x = -straightWidth / 2 + (this.height / 4) * Math.cos(angle);
                const z = straightHeight / 2 + (this.height / 4) * Math.sin(angle);
                path.push(new BABYLON.Vector3(x, (this.length / (pathPoints - 1)) * p - this.length / 2, z));
            }

            pathArray.push(path);
        }

        // Create ribbon geometry for the duct
        this.ductMesh = BABYLON.MeshBuilder.CreateRibbon("ovalDuct", {
            pathArray: pathArray,
            sideOrientation: BABYLON.Mesh.DOUBLESIDE,
            updatable: false
        }, this.scene);

        // Apply material and additional properties as needed
    }

    // Additional oval duct-specific methods...
}

class OvalDuct extends Duct {
    constructor(scene, length, material, width, height, cornerRadius) {
        super(scene, length, material);
        this.width = width;      // Width of the rectangle
        this.height = height;    // Height of the rectangle
        this.cornerRadius = cornerRadius; // Radius of the corners
        this.createDuct();
    }

    createDuct() {
        const pathArray = [];
        const pathPoints = 10; // Number of paths along the tube length
        const cornerPoints = 10; // Points for each rounded corner

        for (let p = 0; p < pathPoints; p++) {
            const path = [];
            const zPos = (this.length / (pathPoints - 1)) * p - this.length / 2;

            // Bottom side
            for (let i = -this.width / 2 + this.cornerRadius; i <= this.width / 2 - this.cornerRadius; i++) {
                path.push(new BABYLON.Vector3(i, -this.height / 2, zPos));
            }
            // Right bottom corner
            for (let i = 0; i <= cornerPoints; i++) {
                const angle = Math.PI / 2 * i / cornerPoints;
                path.push(new BABYLON.Vector3(
                    this.width / 2 - this.cornerRadius + this.cornerRadius * Math.cos(angle),
                    -this.height / 2 + this.cornerRadius * Math.sin(angle),
                    zPos
                ));
            }
            // Right side
            for (let i = -this.height / 2 + this.cornerRadius; i <= this.height / 2 - this.cornerRadius; i++) {
                path.push(new BABYLON.Vector3(this.width / 2, i, zPos));
            }
            // Right top corner
            for (let i = 0; i <= cornerPoints; i++) {
                const angle = Math.PI / 2 + Math.PI / 2 * i / cornerPoints;
                path.push(new BABYLON.Vector3(
                    this.width / 2 - this.cornerRadius * Math.cos(angle),
                    this.height / 2 - this.cornerRadius + this.cornerRadius * Math.sin(angle),
                    zPos
                ));
            }
            // Top side
            for (let i = this.width / 2 - this.cornerRadius; i >= -this.width / 2 + this.cornerRadius; i--) {
                path.push(new BABYLON.Vector3(i, this.height / 2, zPos));
            }
            // Left top corner
            for (let i = 0; i <= cornerPoints; i++) {
                const angle = Math.PI + Math.PI / 2 * i / cornerPoints;
                path.push(new BABYLON.Vector3(
                    -this.width / 2 + this.cornerRadius - this.cornerRadius * Math.cos(angle),
                    this.height / 2 - this.cornerRadius * Math.sin(angle),
                    zPos
                ));
            }
            // Left side
            for (let i = this.height / 2 - this.cornerRadius; i >= -this.height / 2 + this.cornerRadius; i--) {
                path.push(new BABYLON.Vector3(-this.width / 2, i, zPos));
            }
            // Left bottom corner
            for (let i = 0; i <= cornerPoints; i++) {
                const angle = -Math.PI / 2 * i / cornerPoints;
                path.push(new BABYLON.Vector3(
                    -this.width / 2 + this.cornerRadius * Math.cos(angle),
                    -this.height / 2 + this.cornerRadius - this.cornerRadius * Math.sin(angle),
                    zPos
                ));
            }

            pathArray.push(path);
        }

        this.ductMesh = BABYLON.MeshBuilder.CreateRibbon("rectangularDuct", {
            pathArray: pathArray,
            sideOrientation: BABYLON.Mesh.DOUBLESIDE,
            updatable: false,
            closeArray: true
        }, this.scene);
    }

    // ... additional methods ...
}
