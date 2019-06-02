function getLava(){

	var length = 10, width = 10;
	var shape = new THREE.Shape();
	shape.moveTo( 0,0 );
	shape.lineTo( 0, width );
	shape.lineTo( length, width );
	shape.lineTo( length, 0 );
	shape.lineTo( 0, 0 );
	var extrudeSettings = {
		steps: 1,
		depth: 1,
		bevelEnabled: true,
		bevelThickness: 3,
		bevelSize: 2,
		bevelOffset: -2,
		bevelSegments: 5
	};
	var cell = new THREE.ExtrudeGeometry(shape, extrudeSettings);
	var material = new THREE.MeshPhongMaterial({
		color: 'red',
		flatShading: THREE.FlatShading
	});
	return [cell, material]
}
