class PipeStraight {
        constructor(scene, length, outerRadius, innerRadius, tessellation) {
            this.scene = scene;
            this.length = length; // Length of the pipe
            this.outerRadius = outerRadius; // Outer radius of the pipe
            this.innerRadius = innerRadius; // Inner radius of the pipe, should be smaller than outer radius
            this.tessellation = tessellation;
            this.pipeMesh = null;
            this.properties = {
                type: 'Pipe',
                length: this.length,
                innerRadius: this.innerRadius,
                outerRadius: this.outerRadius,
                slope: 0,
                wallThickness: '49/256"',
                size: '6"',
                pipeSegment: 'Copper - K',
                
                // Add other properties as needed
            };
            this.createPipe();
        }
    
        createPipe() {
            // Create outer cylinder
            const outerCylinder = BABYLON.MeshBuilder.CreateCylinder("outerCylinder", {
                height: this.length,
                diameter: this.outerRadius * 2,
                tessellation: this.tessellation
            }, this.scene);
    
            // Create inner cylinder
            const innerCylinder = BABYLON.MeshBuilder.CreateCylinder("innerCylinder", {
                height: this.length + 0.2, // Slightly longer for clean subtraction
                diameter: this.innerRadius * 2,
                tessellation: this.tessellation
            }, this.scene);
    
            // Convert to CSG for subtraction
            const outerCSG = BABYLON.CSG.FromMesh(outerCylinder);
            const innerCSG = BABYLON.CSG.FromMesh(innerCylinder);
    
            // Subtract inner from outer
            const pipeCSG = outerCSG.subtract(innerCSG);
    
            // Convert back to a mesh
            this.pipeMesh = pipeCSG.toMesh("pipeMesh", null, this.scene);
            this.pipeMesh.mepObject = this; 
            // Rotate to make horizontal
            this.pipeMesh.rotation.z = Math.PI / 2; // 90 degrees
            this.pipeMesh.properties = this.properties;
            // Clean up temporary meshes
            outerCylinder.dispose();
            innerCylinder.dispose();
        }
    
        addDraggablePoints() {
            // Create points at the start and end of the pipe
            this.startPoint = BABYLON.MeshBuilder.CreateSphere("startPoint", { diameter: 0.5 }, this.scene);
            this.endPoint = BABYLON.MeshBuilder.CreateSphere("endPoint", { diameter: 0.5 }, this.scene);
    
            let startPosition = this.pipeMesh.position.clone();
            startPosition.x -= this.length / 2;
            this.startPoint.position = startPosition;
            let endPosition = this.pipeMesh.position.clone();
            endPosition.x += this.length / 2;
            this.endPoint.position = endPosition;
            // Make points draggable
            [this.startPoint, this.endPoint].forEach(point => {
                const dragBehavior = new BABYLON.PointerDragBehavior({ dragAxis: new BABYLON.Vector3(1, 0, 0) });
                point.addBehavior(dragBehavior);
    
                dragBehavior.onDragObservable.add(() => {
                    // Update the pipe's path based on new positions
                    this.updatePipeLength();
                });
            });
        }

        updatePath(newlength) {
            if (this.pipeMesh) {
                this.pipeMesh.dispose();
            }
            this.length = newlength;
            this.createPipe();
        }

        updatePipeLength() {

            // Calculate new length based on the positions of start and end points
            let newlen = this.endPoint.position.x - this.startPoint.position.x;

            //let potentialNewLength = Math.abs(this.endPoint.position.x - this.startPoint.position.x);

            if (newlen > 2) {
                if (this.pipeMesh) {
                    this.pipeMesh.dispose();
                }
                this.length = newlen;
                this.createPipe(); 
                // Update only if length > 5
            } else {
                // Optionally, reset positions if length <= 2
                let startPosition = this.pipeMesh.position.clone();
                startPosition.x -= this.length / 2;

                let endPosition = this.pipeMesh.position.clone();
                endPosition.x += this.length / 2;

                this.startPoint.position = startPosition;
                this.endPoint.position = endPosition;
            }
            // Update cylinder length and reposition it
            //this.cylinder.scaling.x = newLength / this.originalLength; // Assuming originalLength is stored
            //this.cylinder.position.x = (this.startPoint.position.x + this.endPoint.position.x) / 2;
        }


    
        // Method to update the pipe length
        updateLength(newLength) {
                // Dispose of the old mesh if it exists
                if (this.pipeMesh) {
                    this.pipeMesh.dispose();
                }
    
                // Assuming the pipe is along the x-axis; modify accordingly if different
                this.length = newLength;
                this.createPipe(); // Recreate the tube with the updated path
        }

        updateDiameter(newDiameter) {
            if (this.pipeMesh) {
                this.pipeMesh.dispose();
            }
            this.innerRadius = newDiameter;
            this.outerRadius = this.innerRadius + 0.2;
            this.createPipe();
        }
        updateInnerRadius(newDiameter) {
            if (this.pipeMesh) {
                this.pipeMesh.dispose();
            }
            this.innerRadius = newDiameter;
            this.createPipe();
        }
        updateOuterRadius(newDiameter) {
            if (this.pipeMesh) {
                this.pipeMesh.dispose();
            }
            this.outerRadius = newDiameter;
            this.createPipe();
        }
    }
    