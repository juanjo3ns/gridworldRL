function showStats() {
	var sw_b = new THREE.BoxGeometry(10, 2, 10);
	var material_b = new THREE.MeshPhongMaterial({
		color: 'gray',
		flatShading: THREE.FlatShading
	});
	var swch = new THREE.Mesh(sw_b, material_b);
	swch.name = 'switch';

	swch.position.x = 0;
	swch.position.y = 57;
	swch.position.z = -105;
	swch.rotation.x = Math.PI/2;

	scene.add(swch);
	var fontLoader = new THREE.FontLoader();
	fontLoader.load('https://cdn.rawgit.com/redwavedesign/ccb20f24e7399f3d741e49fbe23add84/raw/402bcf913c55ad6b12ecfdd20c52e3047ff26ace/bebas_regular.typeface.js', function(font) {
		var fontMaterial = new THREE.MeshPhongMaterial({
			color: 'white'
		});
		var textt = new THREE.TextGeometry("dev     mode", {
			font: font,
			size: 5,
			height: 1,
			curveSegments: 2
		});
		var sw = new THREE.Mesh(textt, fontMaterial);

		sw.position.x = 10;
		sw.position.y = 55;
		sw.position.z = -105;

		scene.add(sw);

		var textt2 = new THREE.TextGeometry("how     to     escape     the    death    star\nusing     Reinforcement     learning", {
			font: font,
			size: 7,
			height: 3,
			curveSegments: 2
		});
		var sw = new THREE.Mesh(textt2, fontMaterial);

		sw.position.x = -80;
		sw.position.y = 80;
		sw.position.z = -105;

		scene.add(sw);
	});
}
