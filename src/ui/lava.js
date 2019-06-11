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
		bevelThickness: 7,
		bevelSize: 0,
		bevelOffset: 0,
		bevelSegments: 1
	};
	var cell = new THREE.ExtrudeGeometry(shape, extrudeSettings);
	cell.translate( 0, 0, -7 );
	var material = new THREE.MeshPhongMaterial({
		color: 'gray'
		});
	return [cell, material]
}
