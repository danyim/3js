import React, { Component } from 'react'
import './App.css'
// import * as uTHREE from 'three'
import React3 from 'react-three-renderer'
// import * as dg from 'dis-gui'
import stars from './stars.jpg'
import alex from './alex.jpg'
import testVideo from './test.mp4'
import bear from './teddybear.obj'
import THREE from './OBJLoader'

console.log('THREE', THREE)

class App extends Component {
  constructor(props, context) {
    super(props, context)

    // Default to FPP
    this.switchFPP()
    this.state = {
      cubeRotation: new THREE.Euler(),
      camera: {
        x: 0,
        y: 0,
        z: 10
      },
      lookAt: {
        x: 0,
        y: 0,
        z: 0
      },
      isVideoPlaying: false
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

    console.log('attempting to load ', bear)
    const loader = new THREE.OBJLoader()

    loader.load(
      bear,
      // Function when resource is loaded
      object => {
        object.traverse(child => {
          if (child instanceof THREE.Mesh) {
            child.material = new THREE.MeshStandardMaterial({
              roughness: 0.5,
              metalness: 0.5,
              emissive: 0,
              wireframe: true,
              color: 0xd2691e
            })
            child.scale.set(0.05, 0.05, 0.05)
          }
        })
        object.position.x = 0
        object.position.y = 0
        object.position.z = 1
        // object.up(new THREE.Vector3(0, 0, 1))
        object.lookAt(new THREE.Vector3(0, 15, -1))
        this.scene.add(object)
      }
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
    } else if (key === ' ') {
      this.setState(state => {
        if (state.isVideoPlaying) {
          this.video.pause()
        } else {
          this.video.play()
        }
        return {
          isVideoPlaying: !state.isVideoPlaying
        }
      })
    }
    // console.log('keydown', evt.keyCode)
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
    this.video = video

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

  handleClick = evt => {
    const { top, left, width, height } = this.container.getBoundingClientRect()

    const x = evt.nativeEvent.clientX
    const y = evt.nativeEvent.clientY

    const deltaX = width / 2 + left - x
    const deltaY = height / 2 + top - y
    // console.log('x diff', deltaX)
    // console.log('y diff', deltaY)

    if (deltaY > 0) {
      const msToPlay = 4000 * deltaY / (height / 2)
      console.log(`dist: ${deltaY}; playing for ${msToPlay.toFixed(0)}ms`)
      this.playVideoForNMilliseconds(msToPlay)
    }
  }

  playVideoForNMilliseconds = ms => {
    this.video.play()
    setTimeout(() => {
      this.video.pause()
      this.setState({
        isVideoPlaying: false
      })
    }, ms)
  }

  render() {
    const { camera, lookAt } = this.state
    const cameraPosition = new THREE.Vector3(camera.x, camera.y, camera.z)
    const lookAtPositon = new THREE.Vector3(lookAt.x, lookAt.y, lookAt.z)

    const width = window.innerWidth // canvas width
    const height = window.innerHeight // canvas height

    return (
      <div
        className="app"
        ref={ref => (this.container = ref)}
        onClick={this.handleClick}
      >
        <div className="panel">
          <h5>Panel</h5>
          <p>Camera: {`(${camera.x}, ${camera.y}, ${camera.z})`}</p>
          <p>Look at: {`(${lookAt.x}, ${lookAt.y}, ${lookAt.z})`}</p>
          <div>
            <button onClick={this.switchFPP}>First Person Perspective</button>
            <button onClick={this.switchTPP}>Third Person Perspective</button>
          </div>
          Press <strong>w, a, s, d</strong> to move the camera<br />
          <strong>q and r</strong> to change the Z-axis<br />
          <strong>space</strong> to pause/play the video<br />
          <p>
            Video is{' '}
            <strong>{this.state.isVideoPlaying ? 'playing' : 'paused'}</strong>
          </p>
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
            {/*
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
            */}
            <mesh position={{ x: lookAt.x, y: lookAt.y, z: lookAt.z }}>
              <boxGeometry width={0.15} height={0.15} depth={0.15} />
              <meshLambertMaterial color={0xff0000} />
            </mesh>
          </scene>
        </React3>
      </div>
    )
  }
}
export default App
