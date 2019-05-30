var num_files = 10;

function addCallbacks(){
	
}

function addButtons(){
	// Creation of 10 cubes and text to select which epoch to load
	var meshes = new Array();
	var materials = new Array();
	var cube = new THREE.BoxGeometry( 3, 3, 3 );
	for (var i = 0; i < num_files; i++) {
		materials.push(new THREE.MeshBasicMaterial({color: 0x00ff00}));
		meshes.push(new THREE.Mesh( cube, materials[i]));
		scene.add(meshes[i]);
		meshes[i].position.x = 25;
		meshes[i].position.y = -i* 5 +50;
		meshes[i].position.z = -55;
		meshes[i].name="b"+i.toString();

	}
	addCallbacks();
}

function addEpochs(){
	var geometry_text = new Array();
	var meshes_text = new Array();

	var material1 = new THREE.MeshPhongMaterial({ color: 'green', specular: (20, 40, 80), shininess: 30 });
	var fontLoader = new THREE.FontLoader();
	fontLoader.load('https://cdn.rawgit.com/redwavedesign/ccb20f24e7399f3d741e49fbe23add84/raw/402bcf913c55ad6b12ecfdd20c52e3047ff26ace/bebas_regular.typeface.js', function (font) {
		for(var i=0; i< num_files; i++) {
			geometry_text.push(new THREE.TextGeometry('Epoch--> '.concat((i*10).toString()), {font: font,size: 3,height: 1,curveSegments: 2}));
			meshes_text.push(new THREE.Mesh(geometry_text[i], material1));
			scene.add(meshes_text[i]);
			meshes_text[i].position.x = 28;
			meshes_text[i].position.y = -i* 5 +48;
			meshes_text[i].position.z = -55;
		}
	});
}
