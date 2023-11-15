import React, { Suspense } from "react";
import { Canvas } from "@react-three/fiber";
import GltfModel from "./GLTFModel";
import {useGLTF, Stage, PresentationControls, OrbitControls} from '@react-three/drei';


export default function ModelViewer({ modelPath }) {
  return (
      <Canvas>
        <spotLight position={[20, 15, 10]} angle={0.45} penumbra={1} />
        <pointLight position={[-10, -10, -10]} />
        <Suspense fallback={null}>
          <GltfModel modelPath={modelPath} />
          <OrbitControls />
        </Suspense>
      </Canvas>
  );
}
