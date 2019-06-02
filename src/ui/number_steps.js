function addStepsBoard() {
  steps = new THREE.Object3D();
	steps.name = 'steps';
  for (var i = 0; i < 10; i++) {
    for (var j = 0; j < 10; j++) {
			var cell = new THREE.BoxGeometry(10, 2, 10);
      var material = new THREE.MeshPhongMaterial({
				transparent: true,
				opacity: 0.8,
        color: 'black',
        flatShading: THREE.FlatShading
      });


      var b = new THREE.Mesh(cell, material);
			b.name = i.toString()+j.toString();
      b.position.x = -45 + i * 10;
      b.position.y = 0;
      b.position.z = -45 + j * 10;
      steps.add(b);
    }
  }
	steps.visible=false;
  scene.add(steps);
}

function setSteps(epoch){
	file = getURL("steps", epoch);
	data = getData(file);
	for (var i = 0; i < 10; i++) {
    for (var j = 0; j < 10; j++) {
			color = parseFloat(data[i][j]);
			console.log(color);
			scene.getObjectByName("steps").getObjectByName(i.toString()+j.toString()).material.color.setRGB(1,color,0);
		}
	}
}
