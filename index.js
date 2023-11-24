
const canvas = document.getElementById('renderCanvas');
const engine = new BABYLON.Engine(canvas, true);
const scene = new BABYLON.Scene(engine);
const camera = new BABYLON.ArcRotateCamera("Camera", 3 * Math.PI / 2, 3 * Math.PI / 8, 30, BABYLON.Vector3.Zero());
camera.attachControl(canvas, true);
const light = new BABYLON.HemisphericLight("hemi", new BABYLON.Vector3(0, 50, 0));


// Create a Pipe instance
const hollowTube = new PipeStraight(scene, 10, 3, 2.8, 32);
hollowTube.backFaceCulling = false;
hollowTube.addDraggablePoints();

//CreateElbow
const curvedPipe30 = new CurvedPipe(scene, 5, 3, 32, 30);  // 30-degree curve
curvedPipe30.backFaceCulling = false;

//Create Ducts
//const ovalDuct = new OvalDuct(scene, 10, 'Steel', 4, 2);
//const roundDuct = new RoundDuct(scene, 10, 'Aluminum', 3);
//const rectangleDuct = new RectangleDuct(scene, 10, 'PVC', 5, 3);

//const startPoint = new BABYLON.Vector3(0, 0, 10);
//const endPoint = new BABYLON.Vector3(0, 0, 30);
//const rectangularDuct = new RectangleDuct(scene, startPoint, endPoint, 'Steel', 6, 4);

const roundDuctstartPoint = new BABYLON.Vector3(0, -10, 0);
const roundDuctendPoint = new BABYLON.Vector3(10, -10, 0);
const roundDuct = new RoundDuct(scene, roundDuctstartPoint, roundDuctendPoint, 'Steel', 2);

const ovalDuctstartPoint = new BABYLON.Vector3(0, 0, 10);
const ovalDuctendPoint = new BABYLON.Vector3(0, 0, 30);
const ovalDuct = new OvalDuct(scene, ovalDuctstartPoint, ovalDuctendPoint, 'Steel', 6, 4, 3);


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
        const editableProperties = ['length', 'diameter', 'outerRadius', 'innerRadius', 'angle', 'width', 'height', 'cornerRadius']; // Example editable properties
        const dropdownProperties = { 'material': ['Copper', 'Cast Iron', 'PVC', 'Standard'] }; // Dropdown options
        const dropdownPropertiesKeys = ['material']; // Dropdown options
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
                }  else if (dropdownPropertiesKeys.includes(key)) {
                    // Create a dropdown cell for special properties
                    let select = document.createElement('select');
                    dropdownProperties[key].forEach(optionValue => {
                        let option = document.createElement('option');
                        option.value = option.text = optionValue;
                        select.appendChild(option);
                    });
                    select.value = properties[key];
                    select.onchange = (e) => {
                        properties[key] = e.target.value;
                        if (selectedObject && typeof selectedObject['update' + key.charAt(0).toUpperCase() + key.slice(1)] === 'function') {
                            selectedObject['update' + key.charAt(0).toUpperCase() + key.slice(1)](e.target.value);
                        }
                    };
                    row.insertCell(1).appendChild(select);
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