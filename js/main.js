if(!(Detector.webgl)) //if no support for WebGL
{
	alert("Your browser does not support WebGL!");
}
else {
//////////////////////////////////////MAIN SCENE////////////////////////////////////////
	var gal = {
		scene: new THREE.Scene(),
		camera: new THREE.PerspectiveCamera(75, window.innerWidth/window.innerHeight, 0.1, 1000),
		renderer: new THREE.WebGLRenderer({antialias: false}),

		boot: function() {
			//1 unit === 1 meter
			gal.camera.position.z = 2.5;
			gal.camera.position.y = 1.7;
			//gal.camera.rotation.y = -Math.PI/2;

			gal.scene.fog = new THREE.FogExp2(0xdddddd, 0.0011);
			
			gal.renderer.setSize(window.innerWidth, window.innerHeight);
			gal.renderer.setClearColor(0xffffff, 1);
			document.body.appendChild(gal.renderer.domElement);

			//https://developer.mozilla.org/en-US/docs/Web/API/Document/querySelector
			gal.canvas = document.querySelector('canvas');
			gal.canvas.className = "gallery";


			//Resize if window size change!
			window.addEventListener('resize', function() {
				gal.renderer.setSize(window.innerWidth, window.innerHeight);
				gal.camera.aspect = window.innerWidth / window.innerHeight;
				gal.camera.updateProjectionMatrix();
			});

		},

		controls: function() {
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
					if(e.keyCode == 102 || e.keyCode == 70) {//F/f for fullscreen hahaha 
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
			if(document.pointerLockElement === gal.canvas || document.mozPointerLockElement === gal.canvas || document.webkitPointerLockElement) {
				//pointer is disabled by element
				gal.controls.enabled = true;
				//start mouse move listener
				document.addEventListener("mousemove", gal.moveCallback, false);
				
			} else {
				//pointer is no longer disabled
				gal.controls.enabled = false;
				document.removeEventListener("mousemove", gal.moveCallback, false);
				console.log("enabled");
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

		preload: function() {

		},

		create: function() {

			//let there be light!
			gal.worldLight = new THREE.AmbientLight(0xeeeeee);
			gal.scene.add(gal.worldLight);

			//Create the floor///
			gal.floorText = new THREE.ImageUtils.loadTexture("img/Floor.jpg");
			gal.floorText.wrapS = THREE.RepeatWrapping;
			gal.floorText.wrapT = THREE.RepeatWrapping;
			gal.floorText.repeat.set(600,600);

			gal.floorMaterial = new THREE.MeshPhongMaterial({map: gal.floorText});

			gal.floor = new THREE.Mesh(new THREE.PlaneGeometry(1000,1000), gal.floorMaterial);
			gal.floor.rotation.x = Math.PI/2;
			gal.floor.rotation.y = Math.PI;

			gal.scene.add(gal.floor);


			//Create the walls////
			gal.wallGroup = new THREE.Group();
			gal.scene.add(gal.wallGroup);

			gal.wallMaterial = new THREE.MeshBasicMaterial( {color: 0xffffff} );
			//consider BufferGeometry for static objects in the future
			gal.wall1 = new THREE.Mesh(new THREE.PlaneGeometry(15,5), gal.wallMaterial);
			gal.wall2 = new THREE.Mesh(new THREE.PlaneGeometry(5,5), gal.wallMaterial);
			gal.wall3 = new THREE.Mesh(new THREE.PlaneGeometry(5,5), gal.wallMaterial);
			gal.wall4 = new THREE.Mesh(new THREE.PlaneGeometry(15,5), gal.wallMaterial);

			gal.wall2.position.x = -7.5;
			gal.wall2.position.z = 2.5;
			gal.wall2.rotation.y = Math.PI/2;
			
			gal.wall3.position.x = 7.5;
			gal.wall3.position.z = 2.5;
			gal.wall3.rotation.y = -Math.PI/2;

			gal.wall4.position.z = 5;
			gal.wall4.rotation.y = Math.PI;

			gal.wallGroup.add(gal.wall1);
			gal.wallGroup.add(gal.wall2);
			gal.wallGroup.add(gal.wall3);
			gal.wallGroup.add(gal.wall4);

			gal.wallGroup.position.y = 2.5;

			//Ceiling//
			gal.ceilMaterial = new THREE.MeshBasicMaterial({color: 0xffffff});
			gal.ceil = new THREE.Mesh(new THREE.PlaneGeometry(15,5), gal.ceilMaterial);
			gal.ceil.position.y = 5;
			gal.ceil.position.z = 2.5;
			gal.ceil.rotation.x = Math.PI/2;

			gal.scene.add(gal.ceil);

			///////Add Artworks~///////
			gal.artGroup = new THREE.Group();

			/*
			gal.num_of_paintings = 1;
			gal.paintings = [];
			for(var i = 0; i < gal.num_of_paintings; i++){
				(function(i) {
					var artwork = new Image();
					var ratiow = 0;
					var ratioh = 0;

					artwork.onload = function(){

						ratiow = artwork.width/10;
						ratioh = artwork.height/10;
						// plane for artwork
						var plane = new THREE.Mesh(new THREE.PlaneGeometry(ratiow, ratioh),img); //width, height
						plane.overdraw = true;
						if(i <= Math.floor(gal.num_of_paintings/2))
						{
						}
						else
						{
						//	plane.position.set(65*i - 75*Math.floor(gal.num_of_paintings/2) - 15*Math.floor(num_of_paintings/2), 48, 90);
						//	plane.rotation.y = Math.PI;
						}

						gal.scene.add(plane);
					}
					var source = './img/Artwork/' + (i).toString() + '.jpg';
					artwork.src = source;
					var img = new THREE.MeshBasicMaterial({ //CHANGED to MeshBasicMaterial
					map:THREE.ImageUtils.loadTexture(artwork.src)
					});

					img.map.needsUpdate = true; //ADDED
				}(i))
			}
			//*/

		},

		render: function() {
			requestAnimationFrame(gal.render);


			gal.renderer.render(gal.scene, gal.camera);
		}
	};

	gal.boot();
	gal.controls();
	gal.preload();
	gal.create();
	gal.render();
} //closes else statement of webGL detector.
