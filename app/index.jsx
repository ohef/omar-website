import React, {useEffect} from "react"
import ReactDOM from "react-dom"

import dat from "dat.gui"

import * as THREE from "three"
import styled from "styled-components"

import _ from "lodash"
import fragmentShader from "./shaders/test.glsl"
import vertexShader from "./shaders/defaultVertex.glsl"
import App from './App'
import {timer, generate, of} from "rxjs";
import {concatMap, delay, finalize, flatMap, map, switchMap, tap} from "rxjs/operators";

window.THREE = THREE

const Web = (props) => {
    let canvasRef;

    useEffect(() => {

        let config = {
            color : "#0000FF"
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

        let renderer = new THREE.WebGLRenderer({ canvas: canvasRef });
        renderer.setSize(window.innerWidth, window.innerHeight);

        const onWindowResize = () => {
            camera = new THREE.OrthographicCamera(window.innerWidth / -2, window.innerWidth / 2, window.innerHeight / 2, window.innerHeight / -2, 1, 1000)
            camera.position.z = 5
            renderer.setSize(window.innerWidth, window.innerHeight);
        };
        window.addEventListener('resize', onWindowResize )

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
            .pipe(map(createParticle), map((particleMesh) => {

                let randomAngle = _.random(0, 360) * (Math.PI / 180);
                let direction = new THREE.Vector3(Math.cos(randomAngle), Math.sin(randomAngle));

                return {particleMesh, direction}
            }))
            .subscribe(({particleMesh, direction}) => {
                scene.add(particleMesh);
                generate(0.0, i => i <= 1.0, i => i + 0.008)
                    .pipe(
                        concatMap(x => of(x).pipe(delay(10))),
                        finalize(() => {
                            scene.remove(particleMesh);
                        })
                    )
                    .subscribe(i => {
                        particleMesh.material.uniforms.transparency.value = i;
                        particleMesh.translateOnAxis(direction, 3);
                        // particleMesh.position.y -= 0.5
                    })
            });

        window.scene = scene

        let animate = function () {
            requestAnimationFrame(animate);

            const timeNow = (Date.now() - startTime) * 0.001

            // _.zip(_.range(0, planes.length), planes).map(([i, plane]) => {
            //     const timeNow = (Date.now() - startTime) * 0.001
            //     plane.position.x = 200 * Math.sin(timeNow + 0.25 * .5 * .5 * i);
            //     plane.position.y = 200 * Math.cos(timeNow + 0.25 * .5 * .5 * i);
            // })

            renderer.render(scene, camera);
        };

        animate();

        return () => {
            particleSub.unsubscribe();
            document.removeEventListener('mousemove', updateMousePosition)
            window.removeEventListener('resize', onWindowResize)
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