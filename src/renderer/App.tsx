import { MemoryRouter as Router, Routes, Route } from 'react-router-dom';
import icon from '../../assets/icon.svg';
import './App.css';
import * as THREE from 'three';
import { Line } from '@react-three/drei';
import { Canvas, useFrame } from '@react-three/fiber';
import { MutableRefObject, useEffect, useRef, useState } from 'react';
import { Line2 } from 'three-stdlib';
import { BufferAttribute, Clock, Vector3 } from 'three';

type ThreeCanvasProps = {
  audioRef: MutableRefObject<HTMLAudioElement>
}

function ThreeCanvas({ audioRef } : ThreeCanvasProps) {
  // const clock = useRef<Clock>(new Clock(true));
  const audioCtx = useRef<AudioContext>(new AudioContext());
  const audioAnalyser = useRef(audioCtx.current.createAnalyser());
  const lineRefs = useRef<Array<Line2 | null>>(new Array<Line2 | null>());
  useFrame(({clock}) => {
    if(lineRefs.current != null) {
      const dataArray = new Uint8Array(audioAnalyser.current.frequencyBinCount);
      audioAnalyser.current.getByteFrequencyData(dataArray);
      lineRefs.current.forEach((value, index) => {
        value!.scale.y = dataArray[index] / 255;
      });
      console.log(dataArray);
    }
  });

  // Ready
  useEffect(() => {
    audioAnalyser.current.fftSize = 256;
    const source = audioCtx.current.createMediaElementSource(audioRef.current);
    source.connect(audioAnalyser.current);
    audioAnalyser.current.connect(audioCtx.current.destination);
    return () => {
      audioAnalyser.current.disconnect();
      audioCtx.current.close();
    }
  });

  function createBars() {
    lineRefs.current = new Array<Line2>();
    const bars = [];
    const count = 50;
    const distance = 0.05;
    const lineHeight = 2;
    for (let i = 0; i < count; i++) {
      const xOffset = distance * (i) - distance * count / 2;
      bars.push(<Line key={i} 
        ref={(el : Line2) => {
          lineRefs.current.push(el);
        }} 
        points={[[xOffset, 0, 0], [xOffset, lineHeight, 0]]}
        scale={[1, 1, 1]} 
        linewidth={2} />);
    }
    return bars;
  }

  return (
    <>
      {createBars()}
    </>
  );
}

function Hello() {
  const audioRef = useRef<HTMLAudioElement>(null!);
  return (
    <>
      <input type="file" onChange={(e) => {
        if (e.target.files != null){
          audioRef.current.src = URL.createObjectURL(e.target.files[0]);
        }
      }}/>
      <audio ref={audioRef} controls/>
      <Canvas style={{width: "100vw", height: "100vh"}}>
        <ThreeCanvas audioRef={audioRef}/>
      </Canvas>
    </>
  );
}

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Hello />} />
      </Routes>
    </Router>
  );
}
function sin(arg0: number) {
  throw new Error('Function not implemented.');
}

