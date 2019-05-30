var num_files = 10;
var buttons = new Array("0", "1","2", "3","4", "5","6", "7","8", "9");


function addButtons(){
	// Creation of 10 cubes and text to select which epoch to load
	var cube = new THREE.BoxGeometry( 3, 3, 3 );
	for(var j=0; j< 2; j++) {
		for(var i=0; i< num_files/2; i++) {
			var material = new THREE.MeshBasicMaterial({color: 0x00ff00});
			var mesh = new THREE.Mesh( cube, material);
			gparent.add(mesh);
			mesh.position.x = 15 + j*30;
			mesh.position.y = -i* 5 +25;
			mesh.position.z = -60;
			mesh.name=(i+j*5).toString();
		}
	}
}


function backtoGreen(){
	for (var i=0;i<buttons.length; i++){
		scene.getObjectByName(buttons[i]).material.color.set("green");
	}
}

function addEpochs(){
	var material1 = new THREE.MeshPhongMaterial({ color: 'green', specular: (20, 40, 80), shininess: 30 });
	var fontLoader = new THREE.FontLoader();
	fontLoader.load('https://cdn.rawgit.com/redwavedesign/ccb20f24e7399f3d741e49fbe23add84/raw/402bcf913c55ad6b12ecfdd20c52e3047ff26ace/bebas_regular.typeface.js', function (font) {
		for(var j=0; j< 2; j++) {
			for(var i=0; i< num_files/2; i++) {
				var text = new THREE.TextGeometry('Epoch--> '.concat((i+j*5).toString()), {font: font,size: 3,height: 1,curveSegments: 2});
				var mesh = new THREE.Mesh(text, material1);
				gparent.add(mesh);
				mesh.position.x = 18 +j*30;
				mesh.position.y = -i* 5 +23;
				mesh.position.z = -60;

			}
		}
	});
}
