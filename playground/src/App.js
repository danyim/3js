import React, { Component } from 'react'
import './App.css'
import * as THREE from 'three'
import React3 from 'react-three-renderer'
// import * as dg from 'dis-gui'
import stars from './stars.jpg'
import alex from './alex.jpg'
import testVideo from './test.mp4'

class App extends Component {
  constructor(props, context) {
    super(props, context)

    // construct the position vector here, because if we use 'new' within render,
    // React will think that things have changed when they have not.
    this.cameraPosition = new THREE.Vector3(0, -5, 10)
    this.lookAtPositon = new THREE.Vector3(0, 0, 0)

    this.state = {
      cubeRotation: new THREE.Euler()
    }

    this._onAnimate = () => {
      // we will get this callback every frame

      // pretend cubeRotation is immutable.
      // this helps with updates and pure rendering.
      // React will be sure that the rotation has now updated.
      this.setState({
        cubeRotation: new THREE.Euler(
          this.state.cubeRotation.x + 0.01,
          this.state.cubeRotation.y + 0.01,
          0
        )
      })
    }
  }

  componentDidMount() {
    const videoTexture = new THREE.VideoTexture(this.video)
    videoTexture.minFilter = THREE.LinearFilter
    videoTexture.format = THREE.RGBFormat

    this.mesh.material = new THREE.MeshBasicMaterial({
      map: videoTexture,
      overdraw: true,
      side: THREE.DoubleSide
    })
  }

  render() {
    const width = window.innerWidth // canvas width
    const height = window.innerHeight // canvas height

    return (
      <div>
        <video
          id="video"
          width={640}
          height={360}
          autoPlay
          loop
          playsInline
          style={{ display: 'none' }}
          ref={r => (this.video = r)}
          src={testVideo}
        />
        <div>
          <h2>Panel</h2>
          {/*
          <dg.GUI>
            <dg.Number label="Camera X" value={0} />
            <dg.Number label="Camera Y" value={-5} />
            <dg.Number label="Camera Z" value={2} />
          </dg.GUI>
          */}
        </div>
        <React3
          mainCamera="camera" // this points to the perspectiveCamera which has the name set to "camera" below
          width={width}
          height={height}
          antialias={true}
          onAnimate={this._onAnimate}
        >
          <scene>
            <perspectiveCamera
              name="camera"
              fov={80}
              aspect={width / height}
              near={0.1}
              far={1000}
              lookAt={this.lookAtPositon}
              position={this.cameraPosition}
            />
            <ambientLight color={0xffffff} intensity={1.5} />

            <mesh name="screenPlane" ref={r => (this.mesh = r)}>
              <planeGeometry width={20} height={20} />
              <meshLambertMaterial color={'#fffff'} />
            </mesh>
            <mesh>
              <planeGeometry
                width={15}
                height={15}
                widthSegments={1}
                heightSegments={1}
              />
              <meshLambertMaterial>
                <texture url={stars} />
              </meshLambertMaterial>
            </mesh>
            <mesh rotation={this.state.cubeRotation}>
              <boxGeometry width={1} height={1} depth={1} />
              <meshStandardMaterial
                roughness={0.5}
                metalness={0.5}
                emissive={0}
              >
                <texture url={alex} />
              </meshStandardMaterial>
            </mesh>
          </scene>
        </React3>
      </div>
    )
  }
}
export default App
