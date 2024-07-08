import * as THREE from "three";
import * as React from "react";
import { useRef, useState, useEffect } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { useLoader } from "@react-three/fiber";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader.js';
import { Html} from "@react-three/drei";

function File() {
  const ref = useRef<THREE.Group>(null!);
  // Use a configuration function to set up the DRACO loader for the GLTFLoader
  const gltf = useLoader(GLTFLoader, "/document_file_folder/scene.gltf", loader => {
    const dracoLoader = new DRACOLoader();
    dracoLoader.setDecoderPath("/draco/");
    loader.setDRACOLoader(dracoLoader);
  });

  const anim: any = gltf.animations.find(
    (animation: { name: string; }) => animation.name === "Anim"
  );

  const mixer = useRef<THREE.AnimationMixer | null>(null);
  const action = useRef<THREE.AnimationAction | null>(null);
  
  const [isClosed, setIsClosed] = useState(true);
  const { camera } = useThree();

  // State to determine if the device is mobile
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  // Update isMobile on window resize
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  
  // Define coordinates based on device type
  const originalCameraPosition = isMobile ? new THREE.Vector3(0, 10, 60) : new THREE.Vector3(0, 30, 15);
  const targetCameraPosition = isMobile ? new THREE.Vector3(0, 35, 0) : new THREE.Vector3(0, 20, -0);

  const originalDocumentPosition = isMobile ? new THREE.Vector3(0, -70, -35) : new THREE.Vector3(45, -15, -38);
  const targetDocumentPosition = isMobile ? new THREE.Vector3(0, 3, 15) : new THREE.Vector3(3, 0, 0);
  const [position, SetPosition] = useState(originalDocumentPosition);

  const duration = (anim.duration / 4) * 1000;
  
  const toggleAnimation = () => {
    // Toggle camera position
    const startCamera = isClosed ? originalCameraPosition : targetCameraPosition;
    const endCamera = isClosed ? targetCameraPosition : originalCameraPosition;

    const startDocument = isClosed ? originalDocumentPosition : targetDocumentPosition;
    const endDocument = isClosed ? targetDocumentPosition : originalDocumentPosition;

    const startTime = Date.now();
  
    const animateCamera = () => {
      const now = Date.now();
      const progress = Math.min((now - startTime) / duration, 1);

      // Animate camera position
      const newCameraPosition = new THREE.Vector3().copy(startCamera).lerp(endCamera, progress);
      camera.position.copy(newCameraPosition);
      camera.lookAt(new THREE.Vector3(0, 0, 0));

      // Animate document position
      const newDocumentPosition = new THREE.Vector3().copy(startDocument).lerp(endDocument, progress);
      ref.current.position.copy(newDocumentPosition);

      if (
        position.x === originalDocumentPosition.x &&
        position.y === originalDocumentPosition.y &&
        position.z === originalDocumentPosition.z
      ) {
        SetPosition(targetDocumentPosition);
      } else {
        SetPosition(originalDocumentPosition);
      }
      
      // Pause the animation if it's completed
      if (progress >= 1) {
        console.log("paused");
        if (action.current) {
          action.current.paused = true;
        }
      } else {
        // Continue the animation
        requestAnimationFrame(animateCamera);
        if (action.current) {
          action.current.timeScale = 2;
          action.current.paused = false;
        }
        setIsClosed(!isClosed);
      }
    };
  
    animateCamera();
  
    // Initialize mixer and action if not already initialized
    if (!mixer.current && gltf.scene) {
      mixer.current = new THREE.AnimationMixer(gltf.scene);
      const animAction = mixer.current.clipAction(anim);
      animAction.play();
      animAction.paused = true;
      action.current = animAction;
    }
};

useEffect(() => {
  // Initialize object position
  if (ref.current) {
    ref.current.position.copy(originalDocumentPosition);
  }
}, []);

  useFrame((state, delta) => {
    if (mixer.current) {
      mixer.current.update(delta);
    }
  });

  const [isVisible, setIsVisible] = useState(true);
  useEffect(() => {
    const intervalId = setInterval(() => {
      setIsVisible(prevState => !prevState);
    }, 5000); // Change visibility every 5 seconds

    return () => clearInterval(intervalId); // Clean up interval on component unmount
  }, []);

  return (
    <group ref={ref} onClick={toggleAnimation}>
      <primitive object={gltf.scene} scale={[8, 8, 8]} />
      <Html position={isMobile ? [0, 0.5, 0] : [0, 0.9, 0]} rotation={[-1.575, 0, 0]} transform occlude>
        <div>
          <iframe
            title="external-content"
            src="https://www.tusharpuri.com/"
            style={{ width: "500px", height: "800px" , scale: "1.2"}}
          ></iframe>
        </div>
      </Html>
      <Html position={[-10, 2, 8]}>
        <div className="w-12 h-12">
          {isClosed && isVisible && <img src="/hand-apple.gif" alt="" />}
        </div>
      </Html>
    </group>
  );
}

export default function Document() {
  // State to determine if the device is mobile
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  // Update isMobile on window resize
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);
  return (
    <Canvas
      style={{ height: "100vh", background: "transparent", position: "absolute", zIndex: "10" }}
      camera={{ position: isMobile ? [0, 10, 60] : [0, 30, 15] }}
    >
      <pointLight
        intensity={6000}
        position={[5, 50, -10]}
        color="white"
      />
      <pointLight
        intensity={400}
        position={isMobile ? [-12, -50, -30] : [35,2,-30]}//35, 2, -30
        color="white"
      />
      <File />
    </Canvas>
  );
}
