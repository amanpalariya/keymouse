import React, { useMemo } from "react";
import { ThreeCanvas } from "@remotion/three";
import { useCurrentFrame, useVideoConfig } from "remotion";
import { ExtrudeGeometry, Shape } from "three";
import { tween } from "./design";

// A real beveled solid, lit from three sides. All motion is frame deterministic.
export const Cursor3D: React.FC<{ outro?: boolean }> = ({ outro }) => {
  const { width, height, fps } = useVideoConfig();
  const t = useCurrentFrame() / fps;
  const geometry = useMemo(() => {
    const shape = new Shape();
    shape.moveTo(-1.1, 1.9);
    shape.lineTo(1.5, -0.2);
    shape.lineTo(0.35, -0.35);
    shape.lineTo(0.95, -1.65);
    shape.lineTo(0.3, -1.95);
    shape.lineTo(-0.35, -0.65);
    shape.lineTo(-1.1, -1.4);
    shape.closePath();
    const geo = new ExtrudeGeometry(shape, {
      depth: 0.38,
      bevelEnabled: true,
      bevelSegments: 5,
      steps: 1,
      bevelSize: 0.085,
      bevelThickness: 0.085,
    });
    geo.computeVertexNormals();
    return geo;
  }, []);
  const fly = tween(t, outro ? 2.8 : 3.45, outro ? 3.8 : 4, 0, 1);
  return (
    <ThreeCanvas
      width={width}
      height={height}
      camera={{ position: [0, 0, 11], fov: 36 }}
      gl={{ alpha: true, antialias: true }}
      style={{ position: "absolute", inset: 0, pointerEvents: "none" }}
    >
      <ambientLight intensity={1.1} />
      <directionalLight position={[-4, 6, 8]} intensity={4.5} color="#e7f5ff" />
      <directionalLight position={[7, -2, 4]} intensity={2.5} color="#5794ff" />
      <directionalLight position={[1, 4, -5]} intensity={5} color="#82e7ff" />
      <pointLight position={[0, -3, 4]} intensity={35} color="#2e79ff" />
      <group
        position={[
          tween(t, 0, 0.85, 7, 2.75) - fly * 1.7,
          0.2 + Math.sin(t * 1.35) * 0.13 + fly * 2.5,
          tween(t, 0, 0.85, -9, 0) + fly * 10,
        ]}
        rotation={[
          0.24 + Math.sin(t * 0.9) * 0.09 - fly * 0.8,
          -0.7 + Math.sin(t * 0.6) * 0.22 + fly * 0.8,
          -0.12 + Math.sin(t * 0.8) * 0.09 + fly * 0.4,
        ]}
        scale={outro ? 0.79 : 1}
      >
        <mesh geometry={geometry}>
          <meshPhysicalMaterial
            attach="material-0"
            color="#eaf5ff"
            metalness={0.48}
            roughness={0.22}
            clearcoat={1}
            clearcoatRoughness={0.15}
          />
          <meshPhysicalMaterial
            attach="material-1"
            color="#2761b6"
            metalness={0.8}
            roughness={0.22}
            clearcoat={1}
          />
        </mesh>
      </group>
    </ThreeCanvas>
  );
};
