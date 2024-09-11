function init() {
    var scene = new THREE.Scene();
    var gui = new dat.GUI();
    
    var sphereMaterial = getMaterial('rgb(255, 245, 245)');
    var sphereGrid = getSphereGrid(10, 3, sphereMaterial);
    var planeMaterial = getMaterial('rgb(255, 255, 255)');
    var plane = getPlane(planeMaterial, 30);
    
    var lightLeft = getSpotLight(1, 'rgb(255, 220, 180)');
    
    sphereGrid.position.y = 0;
    plane.rotation.x = Math.PI / 2;
    lightLeft.position.x = -5;
    lightLeft.position.y = 4;
    lightLeft.position.z = -4;
    
    var loader = new THREE.TextureLoader();
    sphereMaterial.map = loader.load('/resource_lab10/assets/textures/concrete.jpg');
    planeMaterial.map = loader.load('/resource_lab10/assets/textures/checkerboard.jpg');
    
    var folder1 = gui.addFolder('light_1');
    folder1.add(lightLeft, 'intensity', 0, 10);
    folder1.add(lightLeft.position, 'x', -5, 30);
    folder1.add(lightLeft.position, 'y', -5, 30);
    folder1.add(lightLeft.position, 'z', -5, 30);

    var folder2 = gui.addFolder('materials');
    folder2.add(sphereMaterial, 'roughness', 0, 1);
    folder2.add(planeMaterial, 'roughness', 0, 1);
    folder2.add(sphereMaterial, 'metalness', 0, 1);
    folder2.add(planeMaterial, 'metalness', 0, 1);
    folder2.open();
    
    scene.add(sphereGrid);
    scene.add(plane);
    scene.add(lightLeft);
    
    var camera = new THREE.PerspectiveCamera(
        45, // field of view
        window.innerWidth / window.innerHeight, // aspect ratio
        1, // near clipping plane
        1000 // far clipping plane
    );
    camera.position.z = 15;
    camera.position.x = -2;
    camera.position.y = 10;
    camera.lookAt(new THREE.Vector3(0, 0, 0));
    
    var renderer = new THREE.WebGLRenderer();
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.shadowMap.enabled = true;
    document.getElementById('webgl').appendChild(renderer.domElement);

    var controls = new THREE.OrbitControls(camera, renderer.domElement);

    update(renderer, scene, camera, controls);
}

function getSphere(material, size, segments) {
    var geometry = new THREE.SphereGeometry(size, segments, segments);
    var obj = new THREE.Mesh(geometry, material);
    obj.castShadow = true;
    return obj;
}

function getMaterial(color) {
    var selectedMaterial;
    var materialOptions = {
        color: color === undefined ? 'rgb(255, 255, 255)' : color,
    };
    selectedMaterial = new THREE.MeshStandardMaterial(materialOptions);
    return selectedMaterial;
}

function getSpotLight(intensity, color) {
    color = color === undefined ? 'rgb(255, 255, 255)' : color;
    var light = new THREE.SpotLight(color, intensity);
    light.castShadow = true;
    light.penumbra = 0.5;
    //Set up shadow properties for the light
    light.shadow.mapSize.width = 2048; // default: 512
    light.shadow.mapSize.height = 2048; // default: 512
    light.shadow.bias = 0.001;
    return light;
}

function getPlane(material, size) {
    var geometry = new THREE.PlaneGeometry(size, size);
    material.side = THREE.DoubleSide;
    var obj = new THREE.Mesh(geometry, material);
    obj.receiveShadow = true;
    return obj;
}

function getSphereGrid(amount, separationMultiplier, sphereMaterial) {
    var group = new THREE.Group(); //an object for grouping two or more objects
    
    for (var i = 0; i < amount; i++) {
        for (var j = 0; j < amount; j++) {
            var sphere = getSphere(sphereMaterial, 1, 24);
            sphere.position.x = i * separationMultiplier;
            sphere.position.y = sphere.geometry.parameters.radius; // Use radius for vertical positioning
            sphere.position.z = j * separationMultiplier;
            group.add(sphere);
        }
    }

    group.position.x = -(separationMultiplier * (amount - 1)) / 2;
    group.position.z = -(separationMultiplier * (amount - 1)) / 2;
    
    return group;
}

function update(renderer, scene, camera, controls) {
    controls.update();
    renderer.render(scene, camera);
    requestAnimationFrame(function () {
        update(renderer, scene, camera, controls);
    });
}

init();