import './style.css'
import * as THREE from 'three';
import { PointerLockControls } from 'three/examples/jsm/controls/PointerLockControls';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';

let moveForward = false;
let moveBackward = false;
let moveLeft = false;
let moveRight = false;
let prevTime = performance.now();
let camera, scene, renderer, controls, raycaster;

const velocity = new THREE.Vector3();
const direction = new THREE.Vector3();

init();
animate();

function init () {
    scene = new THREE.Scene()

    const ambientLight = new THREE.AmbientLight( 0xcccccc, 1 );
    scene.add( ambientLight );

    camera = new THREE.PerspectiveCamera(
        75,
        window.innerWidth / window.innerHeight,
        0.1,
        1000
    )
    camera.position.y = 40
    camera.position.x = 100
    camera.position.z = 10
    camera.rotation.y = Math.PI / 2

    renderer = new THREE.WebGLRenderer()
    renderer.setSize(window.innerWidth, window.innerHeight)
    document.body.appendChild(renderer.domElement)

    const menuPanel = document.getElementById('menuPanel')
    const startButton = document.getElementById('startButton')

    startButton.addEventListener(
        'click',
        function () {
            controls.lock()
        },
        false
    )
    const loader = new GLTFLoader();
    loader.load('scene.gltf', function ( gltf ) {

        // gltf.scene.position.set(0, -1.5, -2);
        // const model = gltf.scene.children[6];

        // model.material.metalness = 0;
        // model.children[1].material.metalness = 0;

        scene.add( gltf.scene );

    }, undefined, function ( error ) {

        console.error( error );

    });

    controls = new PointerLockControls(camera, renderer.domElement)

    controls.addEventListener('lock', () => (menuPanel.style.display = 'none'))
    controls.addEventListener('unlock', () => (menuPanel.style.display = 'block'))

    scene.add( controls.getObject() );

    raycaster = new THREE.Raycaster( new THREE.Vector3(), new THREE.Vector3( 0, - 1, 0 ), 0, 10 );

    const onKeyDown = function ( event ) {

        switch ( event.code ) {

            case 'ArrowUp':
            case 'KeyW':
                moveForward = true;
                break;

            case 'ArrowLeft':
            case 'KeyA':
                moveLeft = true;
                break;

            case 'ArrowDown':
            case 'KeyS':
                moveBackward = true;
                break;

            case 'ArrowRight':
            case 'KeyD':
                moveRight = true;
                break;
        }
    };

    const onKeyUp = function ( event ) {
        switch ( event.code ) {

            case 'ArrowUp':
            case 'KeyW':
                moveForward = false;
                break;

            case 'ArrowLeft':
            case 'KeyA':
                moveLeft = false;
                break;

            case 'ArrowDown':
            case 'KeyS':
                moveBackward = false;
                break;

            case 'ArrowRight':
            case 'KeyD':
                moveRight = false;
                break;
        }
    };

    document.addEventListener('keydown', onKeyDown);
    document.addEventListener('keyup', onKeyUp);
    window.addEventListener('resize', onWindowResize);
}

function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight
    camera.updateProjectionMatrix()
    renderer.setSize(window.innerWidth, window.innerHeight)
    render()
}

function animate() {
    requestAnimationFrame(animate);

    const time = performance.now();

    if ( controls.isLocked === true ) {

        const delta = ( time - prevTime ) / 1000;

        velocity.x -= velocity.x * 10.0 * delta;
        velocity.z -= velocity.z * 10.0 * delta;

        direction.z = Number( moveForward ) - Number( moveBackward );
        direction.x = Number( moveRight ) - Number( moveLeft );

        direction.normalize(); // this ensures consistent movements in all directions

        if ( moveForward || moveBackward ) velocity.z -= direction.z * 400.0 * delta;
        if ( moveLeft || moveRight ) velocity.x -= direction.x * 400.0 * delta;
        // console.log(-velocity.x * delta);
        controls.moveRight( - velocity.x * delta * 2 );
        controls.moveForward( - velocity.z * delta * 2 );

    }

    prevTime = time;

    render()
}

function render() {
    renderer.render(scene, camera);
}
