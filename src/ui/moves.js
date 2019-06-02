function moveAgent(x,y,z, time, delay){
	new TWEEN.Tween(scene.getObjectByName("agent").position)
	.to(scene.getObjectByName("agent").position.clone().set(x,y,z), time)
	.delay(delay)
	.easing(TWEEN.Easing.Quadratic.Out)
	.start();

}
function moveValue(y, time, value){
	new TWEEN.Tween(scene.getObjectByName("vvalues").getObjectByName(value).position)
	.to(scene.getObjectByName("vvalues").getObjectByName(value).position.clone().setY(y), time)
	.easing(TWEEN.Easing.Quadratic.Out)
	.start();

}
function moveCamera(x,y,z, time){
	new TWEEN.Tween(scene.getObjectByName("camera").position)
	.to(scene.getObjectByName("camera").position.clone().set(x,y,z), time)
	.easing(TWEEN.Easing.Quadratic.Out)
	.start();

}
function rotateSteps(time){
	new TWEEN.Tween(scene.getObjectByName("steps").position)
	.to(scene.getObjectByName("steps").position.clone().set(0,-85,0), time)
	.delay(1000)
	.easing(TWEEN.Easing.Quadratic.Out)
	.start();

}
