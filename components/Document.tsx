import * as THREE from "three";
import * as React from "react";
import { useRef, useState } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { useLoader } from "@react-three/fiber";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";

function File() {
  const ref = useRef<THREE.Mesh>(null!);
  const gltf = useLoader(GLTFLoader, "/document_file_folder/scene.gltf");

  const anim: any = gltf.animations.find(
    (animation: { name: string; }) => animation.name === "Anim"
  );

  const mixer = useRef<THREE.AnimationMixer | null>(null);
  const action = useRef<THREE.AnimationAction | null>(null);
  
  const [isClosed, setIsClosed] = useState(true);
  const { camera } = useThree();
  
  const originalPosition = new THREE.Vector3(0, 4, 7.5);
  const targetPosition = new THREE.Vector3(0, 2.35, 0);
  const duration = (anim.duration / 4) * 1000;
  
  const toggleAnimation = () => {
    // Toggle camera position
    const start = isClosed ? originalPosition : targetPosition;
    const end = isClosed ? targetPosition : originalPosition;
    const startTime = Date.now();
  
    const animateCamera = () => {
      const now = Date.now();
      const progress = Math.min((now - startTime) / duration, 1);
      const newPosition = new THREE.Vector3().copy(start).lerp(end, progress);
      camera.position.copy(newPosition);
      camera.lookAt(new THREE.Vector3(0, 0, 0));
  
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
  
  

  useFrame((state, delta) => {
    if (mixer.current) {
      mixer.current.update(delta);
    }
  });

  return (
    <mesh ref={ref} onClick={toggleAnimation}>
      <primitive object={gltf.scene} />
    </mesh>
  );
}

export default function Document() {
  return (
    <Canvas
      style={{ height: "100vh", backgroundColor: "#000000" }}
      camera={{ position: [0, 4, 7.5] }}
    >
      <pointLight
        intensity={200}
        position={[1, 7, 0]}
        color="white"
      />
      <File />
    </Canvas>
  );
}
