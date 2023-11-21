
const canvas = document.getElementById('renderCanvas');
const engine = new BABYLON.Engine(canvas, true);
const scene = new BABYLON.Scene(engine);
//scene.debugLayer.show();
//const camera = new BABYLON.ArcRotateCamera("Camera", alpha, beta, radius, target, scene);
//const camera = new BABYLON.ArcRotateCamera("Camera", Math.PI / 2, Math.PI / 2, 2, BABYLON.Vector3.Zero(), scene);
//camera.attachControl(canvas, true);
//const light = new BABYLON.HemisphericLight("light", new BABYLON.Vector3(0, 1, 0), scene);

const camera = new BABYLON.ArcRotateCamera("Camera", 3 * Math.PI / 2, 3 * Math.PI / 8, 30, BABYLON.Vector3.Zero());
camera.attachControl(canvas, true);
const light = new BABYLON.HemisphericLight("hemi", new BABYLON.Vector3(0, 50, 0));


// Sample path for pipe
const path = [new BABYLON.Vector3(0, 0, 0), new BABYLON.Vector3(10, 0, 0)];
const radiusFunction = (i, distance) => i === 0 ? 0.5 : 1;

// Create a Pipe instance
const hollowTube = new PipeStraight(scene, 10, 3, 2.8, 32);
hollowTube.backFaceCulling = false;
hollowTube.addDraggablePoints();
//const curvedPipe = new CurvedPipe(scene, 5, 0.5, 32);
//const curvedPipe30 = new CurvedPipe(scene, 5, 0.5, 32, 30);  // 30-degree curve
const curvedPipe30 = new CurvedPipe(scene, 5, 3, 32, 30);  // 30-degree curve
//const curvedPipe30 = new CurvedPipe2(scene, 5, 0.5, 0.4, 32, 90); // Example: curve radius of 5, outer tube radius 0.5, inner tube radius 0.4, 90-degree curve
curvedPipe30.backFaceCulling = false;
//const curvedPipe60 = new CurvedPipe(scene, 5, 0.5, 32, 60);  // 60-degree curve
//const curvedPipe90 = new CurvedPipe(scene, 5, 0.5, 32, 90);  // 90-degree curve
//const curvedPipe120 = new CurvedPipe(scene, 5, 0.5, 32, 120); // 120-degree curve

engine.runRenderLoop(() => {
    scene.render();
});

window.addEventListener('resize', () => {
    engine.resize();
});


function updatePropertiesTable(properties, selectedObject) {
    const table = document.getElementById('propertiesTable');
    table.innerHTML = ''; // Clear existing table contents

    if (properties) {
        // Define which properties are editable
        const editableProperties = ['length', 'diameter', 'material', 'outerRadius', 'innerRadius', 'angle']; // Example editable properties

        // Create table headers
        let header = table.insertRow();
        header.insertCell(0).innerHTML = '<b>Property</b>';
        header.insertCell(1).innerHTML = '<b>Value</b>';

        // Add rows for each property
        for (const key in properties) {
            if (properties.hasOwnProperty(key)) {
                let row = table.insertRow();
                row.insertCell(0).innerHTML = key;

                if (editableProperties.includes(key)) {
                    // Create an input cell for editable properties
                    let input = document.createElement('input');
                    input.type = 'text';
                    input.value = properties[key];
                    input.onchange = (e) => {
                        properties[key] = e.target.value; // Update the property value
                        if (selectedObject && typeof selectedObject['update' + key.charAt(0).toUpperCase() + key.slice(1)] === 'function') {
                            selectedObject['update' + key.charAt(0).toUpperCase() + key.slice(1)](e.target.value);
                        }
                        // Add additional code here to handle changes to the property
                    };
                    row.insertCell(1).appendChild(input);
                } else {
                    // Create a regular cell for read-only properties
                    row.insertCell(1).innerHTML = properties[key];
                }
            }
        }
    }
}

let selectedObject = null;
scene.onPointerObservable.add((pointerInfo) => {
    if (pointerInfo.type === BABYLON.PointerEventTypes.POINTERPICK) {
        const mesh = pointerInfo.pickInfo.pickedMesh;
        selectedObject = mesh.mepObject;
        if (mesh) {
            // Assuming each mesh has a 'properties' field
            updatePropertiesTable(mesh.properties, selectedObject);
        }
    }
});