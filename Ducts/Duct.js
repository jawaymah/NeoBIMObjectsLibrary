class Duct {
    constructor(scene, length, material) {
        this.scene = scene;
        this.length = length;
        this.material = material;
        this.ductMesh = null;
        this.properties = {
            type: 'Duct',
            length: this.length,
            slope: 0,
            wallThickness: '49/256"',
            size: '6"',
            pipeSegment: 'Copper - K',
            material: 'Copper' // Material of the pipe
            // Add other properties as needed
        };
    }

    createDuct() {
        // Common duct creation logic (if any)
    }

    updateMaterial(newMaterial) {
        this.material = newMaterial;
        // Update material logic
    }

    updateProperty(propertyName, value) {
        if (propertyName in this.properties) {
            this.properties[propertyName] = value;
            // Add logic to update the duct based on the property change
        }
    }

    // Method to update the pipe length
    updateLength(newLength) {
        // Dispose of the old mesh if it exists
        if (this.ductMesh) {
            this.ductMesh.dispose();
        }

        // Assuming the pipe is along the x-axis; modify accordingly if different
        this.length = newLength;
        this.createDuct(); // Recreate the tube with the updated path
    }

    // Additional common methods...
}