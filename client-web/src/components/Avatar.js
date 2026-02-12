"use client"
import React, { useEffect, useRef, useState } from 'react';
import { Canvas, useFrame, extend } from '@react-three/fiber';
import { Model } from './Model';
import { Effects, OrbitControls } from '@react-three/drei';
import { UnrealBloomPass } from "three-stdlib";
import { API_URL } from '../app/helpers/api';
import { nearLocVisited } from '../app/helpers/loc';
import { useUser } from "@clerk/nextjs";
extend({ UnrealBloomPass });


function Cube(props) {
  const meshRef = useRef();
  useFrame((_, delta) => {
    if (meshRef.current) {
      meshRef.current.rotation.y += delta;
    }
  });
  return (
    <mesh ref={meshRef} rotation={[0, 0, 0]}>
      <boxGeometry args={[1, 1, 1]} />
      <meshStandardMaterial color="red" />
    </mesh>
  );
}

function Avatar({ text, setText, closest, locs, fetchLoading, setFetchLoading, cameraPermission, visPlace, setVisPlace }) {
  const [fileCode, setFileCode] = useState(null);
  const [mouthTalk, setMouthTalk] = useState(null);
  const { user } = useUser();
  async function handleSubmit() {
    try {
      const email = String(user.emailAddresses[0].emailAddress);

      const res = await fetch(`${API_URL}/ai/talk`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "ngrok-skip-browser-warning": "true",
        },
        body: JSON.stringify({ text, closest, locs, email })
      });
      const resJson = await res.json();
      console.log(resJson);
      if (resJson.status === true) {
        const aiAns = resJson.aiRes;
        const mouthTalk = resJson?.lipSyncJson;
        const fileCode = resJson?.fileCode;
        setMouthTalk(mouthTalk);
        setFileCode(fileCode);
      }
    } catch (error) {
      console.log(error);
    }
    finally {
      setText("")
    }
  }
  useEffect(() => {
    if (cameraPermission && !fetchLoading && (text || closest)) {
      if (text) {
        setFetchLoading(true);
        handleSubmit();
        if (closest && visPlace.indexOf(closest) === -1) {
          const newVis = [...visPlace, closest];
          setVisPlace(newVis);
          let vis = window.localStorage.getItem("visited");
          if (vis) {
            vis = JSON.parse(vis);
          } else {
            vis = nearLocVisited;
          }
          for (let i = 0; i < vis.length; i++) {
            if (vis[i].spotId === closest) {
              vis[i].date = new Date().toLocaleString();
              vis[i].visited = true;
              break;
            }
          }
          window.localStorage.setItem("visited", JSON.stringify(vis));
        }
        return;
      }
      if (visPlace.indexOf(closest) === -1) {
        const newVis = [...visPlace, closest];
        setVisPlace(newVis);
        let vis = window.localStorage.getItem("visited");
        if (vis) {
          vis = JSON.parse(vis);
        } else {
          vis = nearLocVisited;
        }
        for (let i = 0; i < vis.length; i++) {
          if (vis[i].spotId === closest) {
            vis[i].date = new Date().toLocaleString();
            vis[i].visited = true;
            break;
          }
        }
        window.localStorage.setItem("visited", JSON.stringify(vis));
        setFetchLoading(true);
        handleSubmit();
        return;
      }
    }
  }, [text, closest, fetchLoading, cameraPermission, visPlace]);
  console.log("fetchLoading: ", fetchLoading);
  return (
    <>
      <Canvas
        camera={{ position: [0, 0, 2.5], fov: 50, far: 500000, near: 0.1 }} style={{ width: '100%', height: '100%', }}
        gl={{ alpha: true }}
      >
        <ambientLight />
        {/* <OrbitControls /> */}
        {/* <Effects disableGamma>
          <unrealBloomPass threshold={0.5} strength={1.0} radius={5} />
        </Effects> */}
        <pointLight intensity={50} position={[1, -2, 4]} />
        <group position={[0, -1.2, 1]} rotation={[Math.PI / 10, 0, 0]}>
          <group rotation={[-Math.PI / 2, 0, 0]}>
            <Model fileCode={fileCode} mouthTalk={mouthTalk}
              setFetchLoading={setFetchLoading} />
          </group>
        </group>
      </Canvas>
    </>
  );
}

export default Avatar;
