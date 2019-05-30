function showStats() {
	var fontLoader = new THREE.FontLoader();
	fontLoader.load('https://cdn.rawgit.com/redwavedesign/ccb20f24e7399f3d741e49fbe23add84/raw/402bcf913c55ad6b12ecfdd20c52e3047ff26ace/bebas_regular.typeface.js', function(font) {
		var fontMaterial = new THREE.MeshPhongMaterial({
			color: 'white'
		});
		var textt = new THREE.TextGeometry("SHOW STATS", {
			font: font,
			size: 5,
			height: 1,
			curveSegments: 2
		});
		var sw = new THREE.Mesh(textt, fontMaterial);
		sw.name = 'switch';

		sw.position.x = -50;
		sw.position.y = 60;
		sw.position.z = -55;

		scene.add(sw);

	});
}
