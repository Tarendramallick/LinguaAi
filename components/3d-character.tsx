"use client"

import { useRef, useState } from "react"
import { Canvas, useFrame } from "@react-three/fiber"
import { OrbitControls, Environment, PerspectiveCamera, Html } from "@react-three/drei"
import type * as THREE from "three"

interface Character3DProps {
  tutorId: string
  isActive: boolean
  isSpeaking: boolean
  tutorColor: string
  tutorName: string
}

// 3D Character Model Component
function CharacterModel({
  tutorId,
  isActive,
  isSpeaking,
  tutorColor,
}: {
  tutorId: string
  isActive: boolean
  isSpeaking: boolean
  tutorColor: string
}) {
  const headRef = useRef<THREE.Mesh>(null)
  const leftEyeRef = useRef<THREE.Mesh>(null)
  const rightEyeRef = useRef<THREE.Mesh>(null)
  const mouthRef = useRef<THREE.Mesh>(null)
  const bodyRef = useRef<THREE.Group>(null)

  const [blinkTimer, setBlinkTimer] = useState(0)
  const [speakTimer, setSpeakTimer] = useState(0)

  // Character color scheme based on tutor
  const getCharacterColors = (tutorId: string) => {
    const colorMap: { [key: string]: { skin: string; hair: string; clothes: string } } = {
      maria: { skin: "#FDBCB4", hair: "#8B4513", clothes: "#FF6B6B" },
      jean: { skin: "#F5DEB3", hair: "#DAA520", clothes: "#4ECDC4" },
      hiroshi: { skin: "#FFE4B5", hair: "#2F4F4F", clothes: "#9B59B6" },
      anna: { skin: "#FAEBD7", hair: "#CD853F", clothes: "#2ECC71" },
      luigi: { skin: "#FDBCB4", hair: "#654321", clothes: "#E67E22" },
      chen: { skin: "#FFDBAC", hair: "#1C1C1C", clothes: "#F39C12" },
    }
    return colorMap[tutorId] || colorMap.maria
  }

  const colors = getCharacterColors(tutorId)

  // Animation loop
  useFrame((state) => {
    if (!headRef.current || !bodyRef.current) return

    const time = state.clock.getElapsedTime()

    // Breathing animation
    if (!isSpeaking && !isActive) {
      bodyRef.current.scale.y = 1 + Math.sin(time * 2) * 0.02
      bodyRef.current.position.y = Math.sin(time * 2) * 0.01
    }

    // Head movement when thinking
    if (isActive && !isSpeaking) {
      headRef.current.rotation.y = Math.sin(time * 3) * 0.1
      headRef.current.rotation.x = Math.sin(time * 2) * 0.05
    }

    // Speaking animation
    if (isSpeaking) {
      headRef.current.rotation.y = Math.sin(time * 8) * 0.05
      if (mouthRef.current) {
        mouthRef.current.scale.y = 1 + Math.sin(time * 15) * 0.3
        mouthRef.current.scale.x = 1 + Math.sin(time * 12) * 0.2
      }
    } else {
      if (mouthRef.current) {
        mouthRef.current.scale.y = 1
        mouthRef.current.scale.x = 1
      }
    }

    // Blinking animation
    setBlinkTimer((prev) => {
      const newTimer = prev + 0.016 // ~60fps
      if (newTimer > 3 + Math.random() * 2) {
        // Blink every 3-5 seconds
        if (leftEyeRef.current && rightEyeRef.current) {
          leftEyeRef.current.scale.y = 0.1
          rightEyeRef.current.scale.y = 0.1
          setTimeout(() => {
            if (leftEyeRef.current && rightEyeRef.current) {
              leftEyeRef.current.scale.y = 1
              rightEyeRef.current.scale.y = 1
            }
          }, 150)
        }
        return 0
      }
      return newTimer
    })
  })

  return (
    <group ref={bodyRef} position={[0, -1, 0]}>
      {/* Body */}
      <mesh position={[0, 0, 0]}>
        <cylinderGeometry args={[0.6, 0.8, 1.5, 8]} />
        <meshStandardMaterial color={colors.clothes} />
      </mesh>

      {/* Neck */}
      <mesh position={[0, 1, 0]}>
        <cylinderGeometry args={[0.25, 0.3, 0.4, 8]} />
        <meshStandardMaterial color={colors.skin} />
      </mesh>

      {/* Head */}
      <mesh ref={headRef} position={[0, 1.6, 0]}>
        <sphereGeometry args={[0.5, 16, 16]} />
        <meshStandardMaterial color={colors.skin} />
      </mesh>

      {/* Hair */}
      <mesh position={[0, 2, 0]}>
        <sphereGeometry args={[0.52, 16, 8, 0, Math.PI * 2, 0, Math.PI * 0.6]} />
        <meshStandardMaterial color={colors.hair} />
      </mesh>

      {/* Eyes */}
      <mesh ref={leftEyeRef} position={[-0.15, 1.7, 0.4]}>
        <sphereGeometry args={[0.08, 8, 8]} />
        <meshStandardMaterial color="#000000" />
      </mesh>
      <mesh ref={rightEyeRef} position={[0.15, 1.7, 0.4]}>
        <sphereGeometry args={[0.08, 8, 8]} />
        <meshStandardMaterial color="#000000" />
      </mesh>

      {/* Eye whites */}
      <mesh position={[-0.15, 1.7, 0.35]}>
        <sphereGeometry args={[0.12, 8, 8]} />
        <meshStandardMaterial color="#FFFFFF" />
      </mesh>
      <mesh position={[0.15, 1.7, 0.35]}>
        <sphereGeometry args={[0.12, 8, 8]} />
        <meshStandardMaterial color="#FFFFFF" />
      </mesh>

      {/* Nose */}
      <mesh position={[0, 1.55, 0.45]}>
        <coneGeometry args={[0.05, 0.15, 4]} />
        <meshStandardMaterial color={colors.skin} />
      </mesh>

      {/* Mouth */}
      <mesh ref={mouthRef} position={[0, 1.4, 0.4]}>
        <sphereGeometry args={[0.08, 8, 4, 0, Math.PI * 2, 0, Math.PI * 0.5]} />
        <meshStandardMaterial color="#8B0000" />
      </mesh>

      {/* Arms */}
      <mesh position={[-0.9, 0.3, 0]} rotation={[0, 0, 0.3]}>
        <cylinderGeometry args={[0.15, 0.12, 1.2, 8]} />
        <meshStandardMaterial color={colors.skin} />
      </mesh>
      <mesh position={[0.9, 0.3, 0]} rotation={[0, 0, -0.3]}>
        <cylinderGeometry args={[0.15, 0.12, 1.2, 8]} />
        <meshStandardMaterial color={colors.skin} />
      </mesh>

      {/* Hands */}
      <mesh position={[-1.2, -0.3, 0]}>
        <sphereGeometry args={[0.15, 8, 8]} />
        <meshStandardMaterial color={colors.skin} />
      </mesh>
      <mesh position={[1.2, -0.3, 0]}>
        <sphereGeometry args={[0.15, 8, 8]} />
        <meshStandardMaterial color={colors.skin} />
      </mesh>

      {/* Status indicator above head */}
      {(isActive || isSpeaking) && (
        <Html position={[0, 2.8, 0]} center>
          <div className="bg-white rounded-full px-3 py-1 shadow-lg border">
            <div className="flex items-center gap-2">
              {isSpeaking ? (
                <>
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                  <span className="text-xs font-medium">Speaking</span>
                </>
              ) : (
                <>
                  <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
                  <span className="text-xs font-medium">Thinking</span>
                </>
              )}
            </div>
          </div>
        </Html>
      )}
    </group>
  )
}

// Floating particles for ambiance
function FloatingParticles() {
  const particlesRef = useRef<THREE.Points>(null)

  useFrame((state) => {
    if (particlesRef.current) {
      particlesRef.current.rotation.y = state.clock.getElapsedTime() * 0.05
    }
  })

  const particleCount = 50
  const positions = new Float32Array(particleCount * 3)

  for (let i = 0; i < particleCount; i++) {
    positions[i * 3] = (Math.random() - 0.5) * 10
    positions[i * 3 + 1] = Math.random() * 5
    positions[i * 3 + 2] = (Math.random() - 0.5) * 10
  }

  return (
    <points ref={particlesRef}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" count={particleCount} array={positions} itemSize={3} />
      </bufferGeometry>
      <pointsMaterial size={0.02} color="#ffffff" transparent opacity={0.6} />
    </points>
  )
}

export function Character3D({ tutorId, isActive, isSpeaking, tutorColor, tutorName }: Character3DProps) {
  return (
    <div className="w-full h-80 rounded-lg overflow-hidden bg-gradient-to-b from-blue-100 to-blue-200">
      <Canvas>
        <PerspectiveCamera makeDefault position={[0, 1, 4]} />

        {/* Lighting */}
        <ambientLight intensity={0.6} />
        <directionalLight position={[5, 5, 5]} intensity={0.8} castShadow />
        <pointLight position={[-5, 5, 5]} intensity={0.4} />

        {/* Environment */}
        <Environment preset="studio" />

        {/* Character */}
        <CharacterModel tutorId={tutorId} isActive={isActive} isSpeaking={isSpeaking} tutorColor={tutorColor} />

        {/* Floating particles */}
        <FloatingParticles />

        {/* Controls */}
        <OrbitControls
          enablePan={false}
          enableZoom={true}
          minDistance={2}
          maxDistance={6}
          minPolarAngle={Math.PI / 4}
          maxPolarAngle={Math.PI / 2}
        />
      </Canvas>

      {/* 3D Controls overlay */}
      <div className="absolute bottom-2 right-2 bg-black bg-opacity-50 text-white text-xs px-2 py-1 rounded">
        Drag to rotate • Scroll to zoom
      </div>
    </div>
  )
}
