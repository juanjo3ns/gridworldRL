function addStateValues() {
  vvalues = new THREE.Object3D();
	vvalues.name = 'vvalues';
  for (var i = 0; i < 10; i++) {
    for (var j = 0; j < 10; j++) {
			var cell = new THREE.SphereGeometry( 3, 32, 32 );
      var material = new THREE.MeshPhongMaterial({
				transparent: true,
				opacity: 0.5,
        color: 'blue',
        flatShading: THREE.FlatShading
      });


      var b = new THREE.Mesh(cell, material);
			b.name = i.toString()+j.toString();
      b.position.x = -45 + i * 10;
      b.position.y = -26;
      b.position.z = -45 + j * 10;
      vvalues.add(b);
    }
  }
  gparent.add(vvalues);
}
function newPosition(y){

	return -25 -y*2;
}
function changeValues(epoch){
	file = getURL("vvalues", epoch);
	data = getData(file);

	for (var i = 0; i < 10; i++) {
    for (var j = 0; j < 10; j++) {
			moveValue(newPosition(data[i][j]),100,i.toString()+j.toString());
		}
	}
}
