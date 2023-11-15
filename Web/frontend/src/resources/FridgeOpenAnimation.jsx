import React from 'react'
import Navbar from '../components/Navbar';

import {useRef, useEffect} from 'react';
import {useGLTF, Stage, PresentationControls, OrbitControls, useScroll, ScrollControls} from '@react-three/drei';
import {Canvas} from '@react-three/fiber';
import { useLoader, useFrame, useThree } from '@react-three/fiber'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader'
import { Suspense,  } from 'react'
import ModelViewer from '../components/ModelViewer';
import * as THREE from 'three';
import {  useAnimations, SoftShadows } from "@react-three/drei"
import { EffectComposer, TiltShift2 } from "@react-three/postprocessing"

function Model(props){
  const {scene} = useGLTF("model.glb");
  let model = useLoader(GLTFLoader, "model.glb");
  let ref = useRef();

  scene.traverse(child => {
    if (child.isMesh) {
        child.castShadow = true
        child.receiveShadow = true
    }
  });

      // Here's the animation part
    // ************************* 
    // let mixer
    // if (model.animations.length) {
    //     mixer = new THREE.AnimationMixer(model.scene);
    //     model.animations.forEach(clip => {
    //         const action = mixer.clipAction(clip)
    //         action.play();
    //     });
    // }

    // useFrame((state, delta) => {
    //     mixer?.update(delta)
    // })
    // *************************
    // Take 001

    const scroll = useScroll();

    console.log(scroll.offset);

    let mixer = new THREE.AnimationMixer(model.scene);
    let clip = model.animations[0];
    const action = mixer.clipAction(clip);
  
    mixer.clipAction(clip).play();

    useFrame((state, delta) => (mixer?.update(delta)));

    useEffect(() => void (action.reset().play().paused = true), [])
    useFrame(() => (action.time = action.getClip().duration * scroll.offset))


  // const scroll = useScroll()
  // const { nodes, materials, animations } = useGLTF("modern_fridge.glb")
  // const { ref, actions } = useAnimations(animations)
  // useEffect(() => void (actions.jump.reset().play().paused = true), [])
  // useFrame(() => (actions.jump.time = actions.jump.getClip().duration * scroll.offset))

  // return <primitive object={scene} {...props} />;
  return (
    <primitive object={scene} {...props} />

  )
  // return (
  //   <group {...props} ref={ref}>
  //     <primitive object={nodes} />
  //   </group>
  // )
}


export default function Home(props) {

  // const [scrollY, setScrollY] = React.useState(0);

  // useEffect(() => {
  //   const handleScroll = () => {
  //     setScrollY(window.scrollY);
  //   };
  //   handleScroll();

  //   window.addEventListener("scroll", handleScroll);
  //   return () => {
  //     window.removeEventListener("scroll", handleScroll);
  //   };
  // });

  // useEffect(() => {

  //   // as the user scrolls, the "fridge" div will move to center of screen
  //   let fridge = document.getElementById('fridge');

  //   window.addEventListener('scroll', () => {

  //     // make it smooth 
  //     //       fridge.style.transform = "translateX(" + -midScreenX + "px)";
  //     // for every scrollY, move the fridge to the left by 1px
  //     let reachedAnimationStartPoint = false;
  //     for(let i = 0; i < scrollY; i++){
  //       if(scrollY < 450){
  //         if(reachedAnimationStartPoint){
  //           reachedAnimationStartPoint = false;
  //         }
  //         fridge.style.transform = "translateX(" + -i + "px) translateY(" + i + "px)";
  //       }else{
  //         if(!reachedAnimationStartPoint){
  //           reachedAnimationStartPoint = true;
  //           fridge.classList.add("absolute");
  //           fridge.classList.add("items-center");
  //           fridge.classList.add("justify-center");
  //           fridge.classList.add("w-full");
  //         }
  //       }
  //     }

  //   });

  // });

  return (
    
    <section className="h-screen">
        {/* <Navbar /> */}

        <Canvas camera={{fov: 70, position: [-180, 20, -160]}}>
              {/* <Suspense fallback={null}>
                <Stage>
                  <Model />
                      <OrbitControls enableZoom={false} />
                </Stage>
              </Suspense> */}
              <Suspense fallback={null}>
                <Stage>
                
                <ScrollControls damping={0.2} maxSpeed={0.5}>
                  <Model />
                  <OrbitControls enableZoom={false} makeDefault={true} />

                </ScrollControls>
                </Stage>
                
              </Suspense> 
            </Canvas>
        
        { /*
        <div className="flex items-center justify-center">
        <div className="flex flex-col w-full justify-center items-center h-screen">
          <div className="flex items-center bg-gray-300 w-full">
            <div className="flex flex-col">
                <h1 className="font-CreteRoundRegular text-5xl text-center md:text-left">KitchIN</h1>
                <p className="font-CreteRoundRegular text-xl text-center md:text-left">A smart fridge that helps you keep track of your food.</p>
            </div>
          </div>
          <div className="md:w-1/2 w-full h-5/6 bg-red-200" id="fridge">

          </div>
          </div>


        </div>
        <div className="flex h-screen">
            <h1>Hello</h1>
          </div>

          */ }
    </section>
  )
}

useGLTF.preload("modern_fridge.glb");

