import React, { useRef } from "react";
import { useLoader, useFrame, useThree } from "@react-three/fiber";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";

const GltfModel = ({ modelPath }) => {
  const ref = useRef();
  const gltf = useLoader(GLTFLoader, modelPath);

  // Subscribe this component to the render-loop, rotate the mesh every frame
  useFrame(() => (ref.current.rotation.y += 0.001));

  // Here, we can access the camera via the useThree hook
  useThree(({ camera }) => {
    camera.position.y = 30;
    camera.lookAt(0, 0, 0);
  });

  return (
    <>
      <primitive ref={ref} object={gltf.scene} scale={"6"} />
    </>
  );
};

export default GltfModel;
