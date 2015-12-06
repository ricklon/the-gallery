if(!(Detector.webgl)) //if no support for WebGL
{
	alert("Your browser does not support WebGL!");
}
else {
//////////////////////////////////////MAIN SCENE////////////////////////////////////////
	var gal = {
		/*
		gal.scene;
			gal.scene.fog;
		gal.camera;
		gal.renderer;
		gal.boot;
			gal.controls;
			gal.canvas;
		gal.pointerControls;
			gal.changeCallback;
			gal.errorCallback;
			gal.moveCallback;
			gal.toggleFullScreen;
		gal.movement;
		gal.create;
		gal.raycaster;
		gal.mouse;
		gal.raycastSetUp;
		gal.render;
		*/
		scene: new THREE.Scene(),
		camera: new THREE.PerspectiveCamera(75, window.innerWidth/window.innerHeight, 0.1, 1000),
		renderer: new THREE.WebGLRenderer({antialias: false}),

		boot: function() {
			gal.controls = new THREE.PointerLockControls(gal.camera);
			gal.scene.add( gal.controls.getObject());

			gal.scene.fog = new THREE.FogExp2(0x666666, 0.025);
			
			gal.renderer.setSize(window.innerWidth, window.innerHeight);
			gal.renderer.setClearColor(0xffffff, 1);
			document.body.appendChild(gal.renderer.domElement);

			//https://developer.mozilla.org/en-US/docs/Web/API/Document/querySelector
			gal.canvas = document.querySelector('canvas');
			gal.canvas.className = "gallery";

			//enabling/disabling menu based on pointer controls
			gal.menu = document.getElementById("menu");

			//only when pointer is locked will translation controls be allowed: gal.controls.enabled
			gal.moveVelocity = new THREE.Vector3();
			gal.jump = true;
			gal.moveForward = false;
			gal.moveBackward = false;
			gal.moveLeft = false;
			gal.moveRight = false;

			//renderer time delta
			gal.prevTime = performance.now();

			//Resize if window size change!
			window.addEventListener('resize', function() {
				gal.renderer.setSize(window.innerWidth, window.innerHeight);
				gal.camera.aspect = window.innerWidth / window.innerHeight;
				gal.camera.updateProjectionMatrix();
			});

		},

		pointerControls: function() {
			//////POINTER LOCK AND FULL SCREEN////////////
			//https://developer.mozilla.org/en-US/docs/Web/API/Pointer_Lock_API
			//gal.controls; 
			//if pointer lock supported in browser:
			if('pointerLockElement' in document || 'mozPointerLockElement' in document || 'webkitPointerLockElement' in document) {
				//assign the API functions for pointer lock based on browser
				gal.canvas.requestPointerLock = gal.canvas.requestPointerLock || gal.canvas.mozRequestPointerLock || gal.canvas.webkitRequestPointerLock;
				//run this function to escape pointer Lock
				gal.canvas.exitPointerLock =  gal.canvas.exitPointerLock || gal.canvas.mozExitPointerLock || gal.canvas.webkitExitPointerLock;
			
			
				//https://developer.mozilla.org/en-US/docs/Web/API/Fullscreen_API
				//https://developer.mozilla.org/en-US/docs/Web/API/EventTarget/addEventListener
				document.addEventListener("keydown", function(e) {
					if(e.keyCode === 102 || e.keyCode === 70) {//F/f for fullscreen hahaha 
						gal.toggleFullscreen(); 
						//refer to below event listener:
						gal.canvas.requestPointerLock();
					}
				});
	

				/*Order of executions:
				gal.canvas "click" -> "pointerlockchange" -> gl.changeCallback
				-> listen to mouse movement and locked

				ESC key -> "pointerlockchange" -> gl.changeCallback -> unlocked
				now listen to when the canvas is clicked on
				*/
				gal.canvas.addEventListener("click", function() {
					gal.canvas.requestPointerLock();
				});
				
				//pointer lock state change listener
				document.addEventListener('pointerlockchange', gal.changeCallback, false);
				document.addEventListener('mozpointerlockchange', gal.changeCallback, false);
				document.addEventListener('webkitpointerlockchange', gal.changeCallback, false);

				document.addEventListener('pointerlockerror', gal.errorCallback, false);
				document.addEventListener('mozpointerlockerror', gal.errorCallback, false);
				document.addEventListener('webkitpointerlockerror', gal.errorCallback, false);


			} else {
				alert("Your browser does not support the Pointer Lock API");
			}
		},

		changeCallback: function(event) {
			if(document.pointerLockElement === gal.canvas || document.mozPointerLockElement === gal.canvas || document.webkitPointerLockElement === gal.canvas) {
				//pointer is disabled by element
				gal.controls.enabled = true;
				//remove menu element from screen
				gal.menu.className += " hide";
				//start mouse move listener
				document.addEventListener("mousemove", gal.moveCallback, false);
				
			} else {
				//pointer is no longer disabled
				gal.controls.enabled = false;
				//remove hidden property from menu
				gal.menu.className = gal.menu.className.replace(/(?:^|\s)hide(?!\S)/g, '');
				document.removeEventListener("mousemove", gal.moveCallback, false);
			}
		},

		errorCallback: function(event) {
			alert("Pointer Lock Failed");
		},
		
		moveCallback: function(event) {
			//now that pointer disabled, we get the movement in x and y pos of the mouse
			var movementX = event.movementX || event.mozMovementX || event.webkitMovementX || 0;
			var movementY = event.movementY || event.mozMovementY || event.webkitMovementY || 0;
		},
	
		toggleFullscreen: function() {
			if (!document.fullscreenElement && !document.mozFullScreenElement && !document.webkitFullscreenElement && !document.msFullscreenElement ) {  // current working methods
				if (document.documentElement.requestFullscreen) {
					document.documentElement.requestFullscreen();
				} else if (document.documentElement.msRequestFullscreen) {
					document.documentElement.msRequestFullscreen();
				} else if (document.documentElement.mozRequestFullScreen) {
					document.documentElement.mozRequestFullScreen();
				} else if (document.documentElement.webkitRequestFullscreen) {
					document.documentElement.webkitRequestFullscreen(Element.ALLOW_KEYBOARD_INPUT);
				}
			} else {
				if (document.exitFullscreen) {
					document.exitFullscreen();
				} else if (document.msExitFullscreen) {
					document.msExitFullscreen();
				} else if (document.mozCancelFullScreen) {
					document.mozCancelFullScreen();
				} else if (document.webkitExitFullscreen) {
					document.webkitExitFullscreen();
				}
			}
		},
		
		movement: function() {
				document.addEventListener("keydown", function(e) {
					if(e.keyCode === 87 || e.keyCode === 38) { //w or UP
						gal.moveForward = true;	
					}
					else if(e.keyCode === 65 || e.keyCode === 37) { //A or LEFT
						gal.moveLeft = true;
					}
					else if(e.keyCode === 83 || e.keyCode === 40) { //S or DOWN 
						gal.moveBackward = true;
					}
					else if(e.keyCode === 68 || e.keyCode === 39) { //D or RIGHT
						gal.moveRight = true;	
					}
					else if(e.keyCode ===  32) { //Spacebar
						if(gal.jump) {
							gal.moveVelocity.y += 17;
							gal.jump = false;
						}
					}
				});
		
				document.addEventListener("keyup", function(e) {
					if(e.keyCode === 87 || e.keyCode === 38) { //w or UP
						gal.moveForward = false;
					}
					else if(e.keyCode === 65 || e.keyCode === 37) { //A or LEFT
						gal.moveLeft = false;
					}
					else if(e.keyCode === 83 || e.keyCode === 40) { //S or DOWN 
						gal.moveBackward = false;
					}
					else if(e.keyCode === 68 || e.keyCode === 39) { //D or RIGHT
						gal.moveRight = false;	
					}
				});
		},

		create: function() {

			//let there be light!
			gal.worldLight = new THREE.AmbientLight(0xffffff);
			gal.scene.add(gal.worldLight);

            //set the floor up
            gal.floorText = THREE.ImageUtils.loadTexture("img/Floor.jpg");
            gal.floorText.wrapS = THREE.RepeatWrapping;
            gal.floorText.wrapT = THREE.RepeatWrapping;
            gal.floorText.repeat.set(24,24);

            //Phong is for shiny surfaces
			gal.floorMaterial = new THREE.MeshPhongMaterial( {map: gal.floorText } );
			gal.floor = new THREE.Mesh(new THREE.PlaneGeometry(45,45), gal.floorMaterial);

			gal.floor.rotation.x = Math.PI/2;
            gal.floor.rotation.y = Math.PI;
			gal.scene.add(gal.floor);

			//Create the walls////
			gal.wallGroup = new THREE.Group();
			gal.scene.add(gal.wallGroup);

			gal.wallMaterial1 = new THREE.MeshLambertMaterial({color: 0xffffff});
			gal.wallMaterial2 = new THREE.MeshLambertMaterial({color: 0xffffff});
			gal.wallMaterial3 = new THREE.MeshLambertMaterial({color: 0xffffff});
			gal.wallMaterial4 = new THREE.MeshLambertMaterial({color: 0xffffff});
			//consider BufferGeometry for static objects in the future
			gal.wall1 = new THREE.Mesh(new THREE.PlaneGeometry(40,6), gal.wallMaterial1);
			gal.wall2 = new THREE.Mesh(new THREE.PlaneGeometry(6,6), gal.wallMaterial2);
			gal.wall3 = new THREE.Mesh(new THREE.PlaneGeometry(6,6), gal.wallMaterial3);
			gal.wall4 = new THREE.Mesh(new THREE.PlaneGeometry(40,6), gal.wallMaterial4);

			gal.wall1.position.z = -3;

			gal.wall2.position.x = -20;
			gal.wall2.rotation.y = Math.PI/2;
			
			gal.wall3.position.x = 20;
			gal.wall3.rotation.y = -Math.PI/2;

			gal.wall4.position.z = 3;
			gal.wall4.rotation.y = Math.PI;

			gal.wall1.name = "longWall1";
			gal.wall2.name = "shortWall1";
			gal.wall3.name = "shortWall2";
			gal.wall4.name = "longWall2";

			gal.wallGroup.add(gal.wall1);
			gal.wallGroup.add(gal.wall2);
			gal.wallGroup.add(gal.wall3);
			gal.wallGroup.add(gal.wall4);
    
            gal.intersectObjects = [];

            gal.intersectObjects.push(gal.wall1);
            gal.intersectObjects.push(gal.wall2);
            gal.intersectObjects.push(gal.wall3);
            gal.intersectObjects.push(gal.wall4);

			gal.wallGroup.position.y = 3;

			//Ceiling//
			//gal.ceilMaterial = new THREE.MeshLambertMaterial({color: 0x8DB8A7});
			gal.ceilMaterial = new THREE.MeshLambertMaterial({color: 0xeeeeee});
			gal.ceil = new THREE.Mesh(new THREE.PlaneGeometry(40,6), gal.ceilMaterial);
			gal.ceil.position.y = 6;
			gal.ceil.rotation.x = Math.PI/2;

			gal.scene.add(gal.ceil);

			///////Add Artworks~///////
			gal.artGroup = new THREE.Group();
           
            /*
            gal.intersectObjects = [];

            gal.intersectObjects.push(gal.wall1);
            gal.intersectObjects.push(gal.wall2);
            gal.intersectObjects.push(gal.wall3);
            gal.intersectObjects.push(gal.wall4);
            */

			//*
			gal.num_of_paintings = 30;
			gal.paintings = [];
			for(var i = 0; i < gal.num_of_paintings; i++){
				(function(index) {
					var artwork = new Image();
					var ratiow = 0;
					var ratioh = 0;

                    // ./img/Artwork/index.jpg
					var source = './img/Artworks/' + (index).toString() + '.jpg';
					artwork.src = source;

					var img = new THREE.MeshBasicMaterial({ 
					map:THREE.ImageUtils.loadTexture(artwork.src)
					});

					artwork.onload = function(){
						ratiow = artwork.width/300;
						ratioh = artwork.height/300;
						// plane for artwork
						var plane = new THREE.Mesh(new THREE.PlaneGeometry(ratiow, ratioh),img); //width, height
						plane.overdraw = true;
                        //-1 because index is 0 - n-1 but num of paintings is n 
						if(index <= Math.floor(gal.num_of_paintings/2)-1) //bottom half
						{
							//plane.rotation.z = Math.PI/2;
                            plane.position.set(2.5 * index - 17.5,2,-2.96); //y and z kept constant
						}
						else
						{
							//plane.rotation.z = Math.PI/2;
                            plane.position.set(2.5 * index - 55 ,2 ,2.96);
						//	plane.position.set(65*i - 75*Math.floor(gal.num_of_paintings/2) - 15*Math.floor(num_of_paintings/2), 48, 90);
							plane.rotation.y = Math.PI;
						}
						gal.scene.add(plane);
					}

					img.map.needsUpdate = true; //ADDED
				}(i))
			}
			//*/

		},
		raycaster: new THREE.Raycaster(),
		mouse: new THREE.Vector2(),
		raycastSetUp: function() {
			gal.mouse.x = (0.5) * 2 - 1;
			gal.mouse.y = (0.5) * 2 + 1;
		},
		
		render: function() {
			requestAnimationFrame(gal.render);

			if(gal.controls.enabled === true) {
				var currentTime = performance.now(); //returns time in milliseconds
				//accurate to the thousandth of a millisecond
				//want to get the most accurate and smallest change in time
				var delta = (currentTime-gal.prevTime)/1000;

				//there's a constant deceleration that needs to be applied
				//only when the object is currently in motion
				gal.moveVelocity.x -= gal.moveVelocity.x * 10.0 * delta;
				//for now
				gal.moveVelocity.y -= 9.8 * 7.0 * delta; // m/s^2 * kg * delta Time
				gal.moveVelocity.z -= gal.moveVelocity.z * 10.0 * delta;

				//need to apply velocity when keys are being pressed
				if(gal.moveForward) {
					gal.moveVelocity.z -= 38.0 * delta;
				}
				if(gal.moveBackward) {
					gal.moveVelocity.z += 38.0 * delta;
				}
				if(gal.moveLeft) {
					gal.moveVelocity.x -= 38.0 * delta;
				}
				if(gal.moveRight) {
					gal.moveVelocity.x += 38.0 * delta;
				}
				
				gal.controls.getObject().translateX(gal.moveVelocity.x * delta);
				gal.controls.getObject().translateY(gal.moveVelocity.y * delta);
				gal.controls.getObject().translateZ(gal.moveVelocity.z * delta);
				
				if(gal.controls.getObject().position.y < 1.75) {
						gal.jump = true;
						gal.moveVelocity.y = 0;

						gal.controls.getObject().position.y = 1.75;
				}

				gal.prevTime = currentTime;
			}


			//rayCaster
			gal.raycaster.setFromCamera(gal.mouse, gal.camera);

			//calculate objects interesting ray
			var intersects = gal.raycaster.intersectObjects(gal.intersectObjects);
			if(intersects.length !== 0) {
                //intersects[0].object.material.color.set(0xaaeeee);
				//console.log(intersects[0].distance);
				console.log(intersects[0].point);
			}

			gal.renderer.render(gal.scene, gal.camera);
			}
	};

	gal.boot();
	gal.pointerControls();
	gal.movement();
	gal.create();
	gal.raycastSetUp();
	gal.render();
} //closes else statement of webGL detector.
