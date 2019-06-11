var renderer, scene, camera;
var raycaster = new THREE.Raycaster();
var mouse = new THREE.Vector2();
var gparent = new THREE.Object3D();
var gridSize = 19;
var intervalID;
var agent_orientation = 1;
gparent.name = "text_parent";

var lavaArray = JSON.stringify([
  [1, 1],
  [1, 2],
  [1, 3],
  [1, 4],
  [1, 5],
  [1, 6],
  [1, 7],
  [1, 8],
  [1, 9],
  [1, 10],
  [1, 11],
  [1, 12],
  [1, 13],
  [1, 14],
  [1, 15],
  [1, 16],
  [1, 17],
  [2, 1],
  [3, 1],
  [4, 1],
  [5, 1],
  [6, 1],
  [7, 1],
  [8, 1],
  [9, 1],
  [10, 1],
  [11, 1],
  [12, 1],
  [13, 1],
  [14, 1],
  [2, 17],
  [3, 17],
  [4, 17],
  [5, 17],
  [6, 17],
  [7, 17],
  [8, 17],
  [9, 17],
  [10, 17],
  [11, 17],
  [12, 17],
  [13, 17],
  [14, 17],
  [13, 6],
  [13, 7],
  [13, 8],
  [13, 9],
  [13, 10],
  [13, 11],
  [13, 12],
  [4, 6],
  [5, 6],
  [6, 6],
  [7, 6],
  [8, 6],
  [9, 6],
  [10, 6],
  [11, 6],
  [12, 6],
  [13, 6],
  [4, 12],
  [5, 12],
  [6, 12],
  [7, 12],
  [8, 12],
  [9, 12],
  [10, 12],
  [11, 12],
  [12, 12],
  [13, 12]
]);
var terminalState = JSON.stringify([
  [0, 9]
]);

init();
animate();

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function runDefaultEpisode(init = false) {
  var csvfile = getURL("coords", 7400);
  csvData = getData(csvfile);
  if (!init) {
    addStats(csvData);
  } else {
    updateStats(csvData);
  }
  scene.getObjectByName("text_parent").visible = false;
  intervalID = setInterval(runEvaluations, 300, csvData);
}

function switchOpacity() {
  if (scene.getObjectByName("cells").getObjectByName("0").material.transparent) {
    for (var i = 0; i < gridSize; i++) {
      for (var j = 0; j < gridSize; j++) {
        scene.getObjectByName("cells").getObjectByName((j + i * 19).toString()).material.transparent = false;
        scene.getObjectByName("cells").getObjectByName((j + i * 19).toString()).material.opacity = 1;
      }
    }
  } else {
    for (var i = 0; i < gridSize; i++) {
      for (var j = 0; j < gridSize; j++) {
        scene.getObjectByName("cells").getObjectByName((j + i * 19).toString()).material.transparent = true;
        scene.getObjectByName("cells").getObjectByName((j + i * 19).toString()).material.opacity = 0.95;
      }
    }
  }
}

//Set black color for all the normal cells
function paintBoard(state) {
  for (var i = 0; i < gridSize; i++) {
    for (var j = 0; j < gridSize; j++) {
      if (lavaArray.indexOf(JSON.stringify([i, j])) != -1) {
        scene.getObjectByName("cells").getObjectByName((j + i * 19).toString()).material.color = new THREE.Color('gray');
      } else if (terminalState.indexOf(JSON.stringify([i, j])) != -1) {
        scene.getObjectByName("cells").getObjectByName((j + i * 19).toString()).material.color = new THREE.Color('white');
      } else {
        scene.getObjectByName("cells").getObjectByName((j + i * 19).toString()).material.color = new THREE.Color('black');
      }
    }
  }
  scene.getObjectByName("cells").getObjectByName((state[0] * 19 + state[1]).toString()).material.color = new THREE.Color('silver');;
}

function changeCSV(epoch) {
  epoch = (parseInt(epoch) * 200 + 1200).toString();
  clearInterval(intervalID);
  csvfile = getURL("coords", epoch);
  csvData = getData(csvfile);
  updateStats(csvData);
  changeValues(epoch);
  intervalID = setInterval(runEvaluations, 250, csvData);

}

function getURL(data, epoch) {
  url = "src/csvdata/" + data + "/2.2.1/"
  return url.concat(epoch).concat('.csv');
}

function getData(csv_file) {
  var url = csv_file;
  var request = new XMLHttpRequest();
  request.open("GET", url, false);
  request.send(null);

  var csvData = new Array();
  var jsonObject = request.responseText.split(/\r?\n|\r/);
  for (var t = 0; t < jsonObject.length; t++) {
    csvData.push(jsonObject[t].split(','));
  }
  return csvData;
}


function init() {
  renderer = new THREE.WebGLRenderer({
    antialias: true
  });
  var width = window.innerWidth;
  var height = window.innerHeight;

  renderer.setSize(width, height);
  renderer.setClearColor('#151515', 1);
  document.body.appendChild(renderer.domElement);

  scene = new THREE.Scene();
  camera = new THREE.PerspectiveCamera(55, width / height, 1, 10000);
  camera.position.set(0, 100, 200);
  camera.name = "camera";
  scene.add(camera)

  //LIGHTNING
  light = new THREE.PointLight(0xffffff, 1, 4000);
  light.position.set(100, 100, -150);
  light_two = new THREE.PointLight(0xffffff, 1, 4000);
  light_two.position.set(-100, 100, -50);
  lightAmbient = new THREE.AmbientLight('white');
  scene.add(light, light_two, lightAmbient);

  // OBJECTS
  showStats();
  showBoard();
  showAgent();
  addButtons();
  addEpochs();
  scene.add(gparent);
  counter = 1;
  runDefaultEpisode();
  addStateValues();

  document.addEventListener('click', onDocumentMouseDown, false);
  controls = new THREE.OrbitControls(camera, renderer.domElement);
  window.addEventListener('resize', onWindowResize, false);
}

function onWindowResize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  renderer.setSize(window.innerWidth, window.innerHeight);
  camera.updateProjectionMatrix();
};


function showBoard() {
  cells = new THREE.Object3D();
  cells.name = 'cells';
  for (var i = 0; i < gridSize; i++) {
    for (var j = 0; j < gridSize; j++) {
      var rotate = false,
        offset = 0;

      if (lavaArray.indexOf(JSON.stringify([i, j])) != -1) {
        lava = getLava();
        cell = lava[0];
        material = lava[1];
        rotate = true;
        offset = 5;
      } else if (terminalState.indexOf(JSON.stringify([i, j])) != -1) {
        var cell = new THREE.BoxGeometry(10, 2, 10);
        var material = new THREE.MeshPhongMaterial({
          color: 'white',
          flatShading: THREE.FlatShading
        });
      } else {
        var cell = new THREE.BoxGeometry(10, 2, 10);
        var material = new THREE.MeshPhongMaterial({
          color: 'black',
          flatShading: THREE.FlatShading
        });
      }

      var edges = new THREE.EdgesGeometry(cell);
      var line = new THREE.LineSegments(edges, new THREE.LineBasicMaterial({
        color: 'black'
      }));

      var b = new THREE.Mesh(cell, material);

      b.name = (j + i * 19).toString();
      if (rotate) {
        b.rotation.x = Math.PI / 2;
      }
      b.position.x = -95 + i * 10 - offset;
      b.position.y = 0;
      b.position.z = -95 + j * 10 - offset;
      b.add(line);
      cells.add(b);
    }
  }
  scene.add(cells);
}

function showAgent() {
  // var geometry = new THREE.SphereGeometry(5, 12, 6, 4, 6.3, 1, 6.3);
  // var material = new THREE.MeshBasicMaterial({
  // 	color: 0xFFDEB2
  // });
  // var sphere = new THREE.Mesh(geometry, material);
  // var edges = new THREE.EdgesGeometry(geometry);
  // var line = new THREE.LineSegments(edges, new THREE.LineBasicMaterial({
  // 	color: 'black'
  // }));
  // sphere.name = 'agent';
  // sphere.add(line);
  // scene.add(sphere);
  // sphere.position.set(45, 4, 45);


  const objLoader = new THREE.OBJLoader2();
  objLoader.loadMtl('models/bb8/bb-unit.mtl', null, (materials) => {
    objLoader.setMaterials(materials);
    objLoader.load('models/bb8/bb-unit.obj', (event) => {
      const root = event.detail.loaderRootNode;
      root.scale.set(2.4, 2.4, 2.4);
			root.name = 'agent';
			root.position.set(45, -50, 200);
			scene.add(root);
    });
  });
}

function onDocumentMouseDown(event) {
  event.preventDefault();
  mouse.x = (event.clientX / renderer.domElement.clientWidth) * 2 - 1;
  mouse.y = -(event.clientY / renderer.domElement.clientHeight) * 2 + 1;

  raycaster.setFromCamera(mouse, camera);
  var intersects1 = raycaster.intersectObjects(scene.children);
  var intersects2 = raycaster.intersectObjects(scene.getObjectByName('text_parent').children);
  if (intersects2.length > 0) {
    intersects = raycaster.intersectObjects(scene.getObjectByName('text_parent').children);
    if (buttons.indexOf(intersects[0].object.name) != -1) {
      backtoGreen();
      intersects[0].object.material.color.set("red");
      changeCSV(intersects[0].object.name);
    }
  } else if (intersects1.length > 0) {
    if (intersects1[0].object.name == 'switch') {
      var current = scene.getObjectByName("text_parent").visible;
      switchOpacity();
      scene.getObjectByName("text_parent").visible = !current;
      if (current) {
        intersects1[0].object.material.color.set('grey');
        clearInterval(intervalID);
        runDefaultEpisode(true);
        backtoGreen();
        resetValues();
      } else {
        intersects1[0].object.material.color.set('white');
        moveCamera(0, 36, 280, 1000);
      }
    }
  }
}

function animate() {
  requestAnimationFrame(animate);
  controls.update();
  TWEEN.update();
  render();
}

function render() {
  renderer.render(scene, camera);

}
