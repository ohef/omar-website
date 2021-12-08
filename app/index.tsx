import React, {useEffect} from "react"
import ReactDOM, {render} from "react-dom"

import dat from "dat.gui"

import * as THREE from "three"
import {Matrix4, Mesh, MeshBasicMaterial, PerspectiveCamera, PlaneGeometry, Vector3} from "three"
import styled from "styled-components"

import _ from "lodash"
import fragmentShader from "./shaders/test.glsl"
import vertexShader from "./shaders/defaultVertex.glsl"
import App from './App'
import {fromEvent, timer} from "rxjs";
import {bufferTime, debounceTime, map} from "rxjs/operators";
import DASCENE from "./scenes/untitled.fbx"
import {FBXLoader} from "three/examples/jsm/loaders/FBXLoader";

console.log(fragmentShader)
console.log(DASCENE)
console.log()

window.THREE = THREE

const Web = (props) => {
    let canvasRef;

    useEffect(() => {
        let config = {
            color : "#0000FF",
        };

        let gui = new dat.GUI();
        gui.addColor(config, 'color');

        let mousePosition = {x: 0, y: 0}
        let updateMousePosition = (evt) => {
            mousePosition = {x: evt.clientX, y: evt.clientY}
        }

        document.addEventListener('mousemove', updateMousePosition )

        let startTime = Date.now()

        let scene = new THREE.Scene();
        let camera = new THREE.OrthographicCamera(window.innerWidth / -2, window.innerWidth / 2, window.innerHeight / 2, window.innerHeight / -2, 1, 1000);
        camera.position.z = 5

        let renderer = new THREE.WebGLRenderer({canvas: canvasRef, alpha: false});
        renderer.setSize(window.innerWidth, window.innerHeight);

        const onWindowResize = () => {
            camera = new THREE.OrthographicCamera(window.innerWidth / -2, window.innerWidth / 2, window.innerHeight / 2, window.innerHeight / -2, 1, 1000)
            camera.position.z = 5
            renderer.setSize(window.innerWidth, window.innerHeight);
        };
        let resizeSubscription = fromEvent(window, 'resize')
            .pipe(debounceTime(100))
            .subscribe(onWindowResize);

        let planeGeometry = new THREE.PlaneGeometry(25, 25);

        function getShaderMaterial(opacityValue) {
            return new THREE.ShaderMaterial({
                vertexShader,
                fragmentShader,
                transparent: true,
                uniforms: {
                    color: new THREE.Uniform(new THREE.Color(...{color: [0, 255, 0]}.color)),
                    iTime: new THREE.Uniform((Date.now() - startTime) * 0.001),
                    iResolution: new THREE.Uniform(new THREE.Vector2(250.0, 250.0)),
                    transparency: new THREE.Uniform(opacityValue),
                }
            });
        }

        let particleSub = timer(0, 15)
            .pipe(
                map(createParticle),
                map((particleMesh) => {
                    let randomAngle = _.random(0, 360) * (Math.PI / 180);
                    let direction = new THREE.Vector3(Math.cos(randomAngle), Math.sin(randomAngle));
                    return {particleMesh, direction}
                }))
            .subscribe(({particleMesh, direction}) => {
                scene.add(particleMesh);
                let start;
                function helper(timestamp) {
                    if(start === undefined)
                        start = timestamp

                    const elapsed = timestamp - start;
                    const elapsedNormal = elapsed / (3. * 1000.);

                    if(elapsedNormal <= 1.0){
                        particleMesh.material.uniforms.transparency.value = elapsedNormal;
                        particleMesh.translateOnAxis(direction, 3);
                        requestAnimationFrame(helper);
                    }
                    else{
                        scene.remove(particleMesh)
                    }
                }
                requestAnimationFrame(helper);
            });

        window.scene = scene;

        let animate = function () {
            requestAnimationFrame(animate);
            renderer.render(scene, camera);
        };

        animate();

        return () => {
            particleSub.unsubscribe();
            document.removeEventListener('mousemove', updateMousePosition)
            resizeSubscription.unsubscribe()
        };

        function createParticle() {
            let shaderMaterial = new THREE.ShaderMaterial({
                vertexShader,
                fragmentShader,
                transparent: true,
                uniforms: {
                    color: new THREE.Uniform(new THREE.Color(config.color)),
                    iTime: new THREE.Uniform((Date.now() - startTime) * 0.001),
                    iResolution: new THREE.Uniform(new THREE.Vector2(250.0, 250.0)),
                    transparency: new THREE.Uniform(1.),
                }
            });

            return new THREE.Mesh(planeGeometry, shaderMaterial);
        }
    }, [])

    return (
        <div>
            <ReactCanvas ref={r => {canvasRef = r} } />
            <App />
        </div>)
}

const ReactCanvas = styled.canvas`
    margin: 0;
    padding: 0;
    position: fixed;
    width: calc(100% - 2px); /* for borders */
    height: calc(100% - 2px); /* for borders */
    top:0;
    left:0;
    z-index : -1;
`

const mountNode = document.createElement("div");
document.body.appendChild(mountNode);
ReactDOM.render(<Web/>, mountNode)