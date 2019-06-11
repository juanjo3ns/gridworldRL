function addStateValues() {
  vvalues = new THREE.Object3D();
	vvalues.name = 'vvalues';
  for (var i = 0; i < gridSize; i++) {
    for (var j = 0; j < gridSize; j++) {
			var cell = new THREE.SphereGeometry( 3, 32, 32 );
      var material = new THREE.MeshPhongMaterial({
				transparent: true,
				opacity: 0.5,
        color: 'white',
        flatShading: THREE.FlatShading
      });


      var b = new THREE.Mesh(cell, material);
			b.name = (j+i*19).toString();
      b.position.x = -95 + i * 10;
      b.position.y = -36;
      b.position.z = -95 + j * 10;
      vvalues.add(b);
    }
  }
  gparent.add(vvalues);
}
function newPosition(y){

	return -50 -y*25;
}
function resetValues(){
	for (var i = 0; i < gridSize; i++) {
		for (var j = 0; j < gridSize; j++) {
			moveValue(newPosition(0),100,(j+i*19).toString());
		}
	}
}
function changeValues(epoch){
	file = getURL("vvalues", epoch);
	data = getData(file);

	for (var i = 0; i < gridSize; i++) {
    for (var j = 0; j < gridSize; j++) {
			moveValue(newPosition(data[i][j]),100,(j+i*19).toString());
		}
	}
}
