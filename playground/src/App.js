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

    // Default to FPP
    this.switchFPP()
    this.state = {
      cubeRotation: new THREE.Euler(),
      camera: {
        x: -0.2,
        y: -0.2,
        z: 3
      },
      lookAt: {
        x: 0,
        y: 0,
        z: 0
      }
    }

    this._onAnimate = () => {
      // we will get this callback every frame

      // pretend cubeRotation is immutable.
      // this helps with updates and pure rendering.
      // React will be sure that the rotation has now updated.
      this.setState(state => {
        cubeRotation: new THREE.Euler(
          state.cubeRotation.x,
          state.cubeRotation.y + 0.1,
          0
        )
      })
    }
  }

  componentDidMount() {
    if (window) window.addEventListener('keypress', this.handleKeyDown)

    this.scene.add(
      this.createVideoMesh(testVideo, 5, 5, { x: 0, y: 0, z: 0.1 })
    )
  }

  handleKeyDown = evt => {
    const key = evt.key.toLowerCase()
    const changeVal = 0.2

    if (key === 'a') {
      this.setState(state => ({
        camera: {
          x: state.camera.x - changeVal,
          y: state.camera.y,
          z: state.camera.z
        }
      }))
    } else if (key === 'd') {
      this.setState(state => ({
        camera: {
          x: state.camera.x + changeVal,
          y: state.camera.y,
          z: state.camera.z
        }
      }))
    } else if (key === 'w') {
      this.setState(state => ({
        camera: {
          x: state.camera.x,
          y: state.camera.y + changeVal,
          z: state.camera.z
        }
      }))
    } else if (key === 's') {
      this.setState(state => ({
        camera: {
          x: state.camera.x,
          y: state.camera.y - changeVal,
          z: state.camera.z
        }
      }))
    } else if (key === 'q') {
      this.setState(state => ({
        camera: {
          x: state.camera.x,
          y: state.camera.y,
          z: state.camera.z + changeVal
        }
      }))
    } else if (key === 'e') {
      this.setState(state => ({
        camera: {
          x: state.camera.x,
          y: state.camera.y,
          z: state.camera.z - changeVal
        }
      }))
    } else if (key === '1') {
      this.switchFPP()
    } else if (key === '2') {
      this.switchTPP()
    }
    console.log('keydown', evt.keyCode)
  }

  switchFPP = () => {
    this.setState({
      camera: {
        x: 0,
        y: -0.4,
        z: 1.5
      },
      lookAt: {
        x: 0,
        y: 15,
        z: 0
      }
    })
  }

  switchTPP = () => {
    this.setState({
      camera: {
        x: 0,
        y: 0,
        z: 10
      },
      lookAt: {
        x: 0,
        y: 0,
        z: 0
      }
    })
  }

  createVideoMesh = (src, width, height, position = null) => {
    const video = document.createElement('video')
    video.width = 640
    video.height = 360
    video.loop = true
    video.muted = true
    video.src = src
    video.setAttribute('webkit-playsinline', 'webkit-playsinline')
    video.play()

    const texture = new THREE.VideoTexture(video)
    texture.minFilter = THREE.LinearFilter
    texture.format = THREE.RGBFormat

    const material = new THREE.MeshBasicMaterial({
      map: texture,
      overdraw: true,
      side: THREE.DoubleSide
    })

    const mesh = new THREE.Mesh(
      new THREE.PlaneGeometry(width, height),
      material
    )

    if (position !== null) {
      mesh.position.set(position.x, position.y, position.z)
    }

    return mesh
  }

  render() {
    const { camera, lookAt } = this.state
    const cameraPosition = new THREE.Vector3(camera.x, camera.y, camera.z)
    const lookAtPositon = new THREE.Vector3(lookAt.x, lookAt.y, lookAt.z)

    const width = window.innerWidth // canvas width
    const height = window.innerHeight // canvas height

    return (
      <div className="app">
        <div className="panel">
          <h5>Panel</h5>
          <p>Camera: {`(${camera.x}, ${camera.y}, ${camera.z})`}</p>
          <p>Look at: {`(${lookAt.x}, ${lookAt.y}, ${lookAt.z})`}</p>
          <div>
            <button onClick={this.switchFPP}>First Person Perspective</button>
            <button onClick={this.switchTPP}>Third Person Perspective</button>
          </div>
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
          <scene ref={r => (this.scene = r)}>
            <perspectiveCamera
              name="camera"
              fov={80}
              aspect={width / height}
              near={0.1}
              far={1000}
              lookAt={lookAtPositon}
              position={cameraPosition}
            />
            <ambientLight color={0xffffff} intensity={1.5} />

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
            <mesh
              rotation={this.state.cubeRotation}
              position={{ x: 0, y: 0, z: 1.5 }}
            >
              <boxGeometry width={1} height={1} depth={1} />
              <meshStandardMaterial
                roughness={0.5}
                metalness={0.5}
                emissive={0}
              >
                <texture url={alex} />
              </meshStandardMaterial>
            </mesh>
            <mesh position={{ x: lookAt.x, y: lookAt.y, z: lookAt.z }}>
              <boxGeometry width={0.5} height={0.5} depth={0.5} />
              <meshLambertMaterial color={0xff0000} />
            </mesh>
          </scene>
        </React3>
      </div>
    )
  }
}
export default App
