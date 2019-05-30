function addStats(csvData) {
	var fontLoader = new THREE.FontLoader();
	fontLoader.load('https://cdn.rawgit.com/redwavedesign/ccb20f24e7399f3d741e49fbe23add84/raw/402bcf913c55ad6b12ecfdd20c52e3047ff26ace/bebas_regular.typeface.js', function(font) {
		var fontMaterial = new THREE.MeshPhongMaterial({
			color: 'white'
		});
		var t1 = new THREE.TextGeometry('', {
			font: font,
			size: 4,
			height: 1,
			curveSegments: 2
		});
		var t2 = new THREE.TextGeometry('Epoch-->'.concat(csvData[0][0]), {
			font: font,
			size: 3,
			height: 1,
			curveSegments: 2
		});
		var t3 = new THREE.TextGeometry('Accuracy-->'.concat(parseFloat(csvData[0][1]).toFixed(2).toString()).concat('%'), {
			font: font,
			size: 3,
			height: 1,
			curveSegments: 2
		});
		var t4 = new THREE.TextGeometry('Average_steps-->'.concat(csvData[0][3]), {
			font: font,
			size: 3,
			height: 1,
			curveSegments: 2
		});
		var t5 = new THREE.TextGeometry('Average_reward-->'.concat(csvData[0][2]), {
			font: font,
			size: 3,
			height: 1,
			curveSegments: 2
		});
		var tm1 = new THREE.Mesh(t1, fontMaterial);
		var tm2 = new THREE.Mesh(t2, fontMaterial);
		var tm3 = new THREE.Mesh(t3, fontMaterial);
		var tm4 = new THREE.Mesh(t4, fontMaterial);
		var tm5 = new THREE.Mesh(t5, fontMaterial);
		tm1.name = 'tm1';
		tm2.name = 'tm2';
		tm3.name = 'tm3';
		tm4.name = 'tm4';
		tm5.name = 'tm5';
		tm1.position.x = -50;
		tm1.position.y = 25;
		tm1.position.z = -55;
		tm2.position.x = -50;
		tm2.position.y = 20;
		tm2.position.z = -55;
		tm3.position.x = -50;
		tm3.position.y = 15;
		tm3.position.z = -55;
		tm4.position.x = -50;
		tm4.position.y = 10;
		tm4.position.z = -55;
		tm5.position.x = -50;
		tm5.position.y = 5;
		tm5.position.z = -55;
		scene.add(tm1);
		scene.add(tm2);
		scene.add(tm3);
		scene.add(tm4);
		scene.add(tm5);
	});
}

function showStats(csvData) {
	scene.remove(scene.getObjectByName('tm1'));
	scene.remove(scene.getObjectByName('tm2'));
	scene.remove(scene.getObjectByName('tm3'));
	scene.remove(scene.getObjectByName('tm4'));
	scene.remove(scene.getObjectByName('tm5'));
	addStats(csvData);
}
