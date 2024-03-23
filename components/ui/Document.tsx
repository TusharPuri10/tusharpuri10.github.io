import * as THREE from "three";
import * as React from "react";
import { useRef, useState, useEffect } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { useLoader } from "@react-three/fiber";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { Html, OrbitControls } from "@react-three/drei";

function File() {
  const ref = useRef<THREE.Group>(null!);
  const gltf = useLoader(GLTFLoader, "/document_file_folder/scene.gltf");

  const anim: any = gltf.animations.find(
    (animation: { name: string; }) => animation.name === "Anim"
  );

  const mixer = useRef<THREE.AnimationMixer | null>(null);
  const action = useRef<THREE.AnimationAction | null>(null);
  
  const [isClosed, setIsClosed] = useState(true);
  const { camera } = useThree();
  
  const originalCameraPosition = new THREE.Vector3(0, 30, 15);
  const targetCameraPosition = new THREE.Vector3(0, 20, -0);

  const originalDocumentPosition = new THREE.Vector3(45, -15, -38);
  const targetDocumentPosition = new THREE.Vector3(3, 0, 0);
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

  return (
    <group ref={ref} onClick={toggleAnimation}>
      <primitive object={gltf.scene} scale={[8, 8, 8]} />
      <Html position={[0, 0.9, 0]} rotation={[-1.575, 0, 0]} transform occlude>
        <div>
          <iframe
            title="external-content"
            src="https://portfolio-tusharpuri10.vercel.app/"
            style={{ width: "600px", height: "900px" }}
          ></iframe>
        </div>
      </Html>
    </group>
  );
}

export default function Document() {
  return (
    <Canvas
      style={{ height: "100vh", background: "transparent", position: "absolute", zIndex: "10" }}
      camera={{ position: [0, 30, 15] }}
    >
      <pointLight
        intensity={6000}
        position={[5, 50, -10]}
        color="white"
      />
      <pointLight
        intensity={400}
        position={[35, 2, -30]}
        color="white"
      />
      <File />
    </Canvas>
  );
}
