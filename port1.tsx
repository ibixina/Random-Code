'use client'

import { useState, useEffect, useMemo } from 'react'
import { motion, useAnimationFrame } from 'framer-motion'
import { Lock, Music, Brain, Mail } from 'lucide-react'

export default function Portfolio() {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })

  useEffect(() => {
    const updateMousePosition = (ev: MouseEvent) => {
      setMousePosition({ x: ev.clientX, y: ev.clientY })
    }
    window.addEventListener('mousemove', updateMousePosition)
    return () => {
      window.removeEventListener('mousemove', updateMousePosition)
    }
  }, [])

  const numbers = useMemo(() => {
    return Array.from({ length: 100 }, () => ({
      x: Math.random() * 100,
      y: Math.random() * 100,
      fontSize: Math.random() * 16 + 8,
      value: Math.floor(Math.random() * 10),
    }))
  }, [])

  const [backgroundNumbers, setBackgroundNumbers] = useState(numbers)

  useAnimationFrame((t) => {
    setBackgroundNumbers((prev) =>
      prev.map((number) => ({
        ...number,
        x: (number.x + Math.sin(t * 0.001 + number.y) * 0.1) % 100,
        y: (number.y + Math.cos(t * 0.001 + number.x) * 0.1) % 100,
      }))
    )
  })

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {/* Hero Section with optimized background effect */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          {backgroundNumbers.map((number, i) => (
            <div
              key={i}
              className="absolute text-blue-500 text-opacity-20 font-mono"
              style={{
                left: `${number.x}%`,
                top: `${number.y}%`,
                fontSize: `${number.fontSize}px`,
              }}
            >
              {number.value}
            </div>
          ))}
        </div>
        <div className="z-10 text-center">
          <motion.h1
            initial={{ y: -50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8 }}
            className="text-5xl font-bold mb-4"
          >
            Jane Doe
          </motion.h1>
          <motion.p
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-xl text-gray-300"
          >
            Computer Science Undergraduate
          </motion.p>
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.5, delay: 0.5 }}
            className="mt-8 flex justify-center space-x-4"
          >
            <Brain className="w-8 h-8 text-purple-500" />
            <Lock className="w-8 h-8 text-green-500" />
            <Music className="w-8 h-8 text-pink-500" />
          </motion.div>
        </div>
      </section>

      {/* About Section */}
      <section className="py-20 bg-gray-800">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold mb-8 text-center">About Me</h2>
          <p className="text-lg text-gray-300 max-w-2xl mx-auto text-center">
            I'm a passionate computer science student with a keen interest in artificial intelligence, cryptography, and music technology. My goal is to combine these fields to create innovative solutions that push the boundaries of what's possible.
          </p>
        </div>
      </section>

      {/* Skills Section */}
      <section className="py-20 bg-gray-900">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold mb-12 text-center">Skills</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <SkillCard
              icon={<Brain className="w-12 h-12 text-purple-500" />}
              title="Artificial Intelligence"
              description="Machine learning, neural networks, and natural language processing"
            />
            <SkillCard
              icon={<Lock className="w-12 h-12 text-green-500" />}
              title="Cryptography"
              description="Encryption algorithms, blockchain technology, and secure communication protocols"
            />
            <SkillCard
              icon={<Music className="w-12 h-12 text-pink-500" />}
              title="Music Technology"
              description="Digital signal processing, audio synthesis, and music information retrieval"
            />
          </div>
        </div>
      </section>

      {/* Projects Section */}
      <section className="py-20 bg-gray-800">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold mb-12 text-center">Projects</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <ProjectCard
              title="AI-Powered Music Composer"
              description="An application that uses machine learning to generate original music compositions based on user preferences and existing musical styles."
            />
            <ProjectCard
              title="Secure Chat Application"
              description="A end-to-end encrypted messaging app that uses advanced cryptographic techniques to ensure user privacy and data security."
            />
            <ProjectCard
              title="Emotion Recognition in Music"
              description="A machine learning model that analyzes audio features to detect and classify emotions in music tracks."
            />
            <ProjectCard
              title="Blockchain-based Music Licensing"
              description="A decentralized platform for managing music rights and royalties using blockchain technology and smart contracts."
            />
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-20 bg-gray-900">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-8">Get in Touch</h2>
          <p className="text-lg text-gray-300 mb-8">
            Interested in collaborating or learning more about my work? Feel free to reach out!
          </p>
          <a
            href="mailto:jane.doe@example.com"
            className="inline-flex items-center px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition duration-300"
          >
            <Mail className="w-5 h-5 mr-2" />
            Contact Me
          </a>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-6 bg-gray-800 text-center">
        <p className="text-gray-400">© 2023 Jane Doe. All rights reserved.</p>
      </footer>
    </div>
  )
}

function SkillCard({ icon, title, description }) {
  return (
    <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
      <div className="flex justify-center mb-4">{icon}</div>
      <h3 className="text-xl font-semibold mb-2 text-center">{title}</h3>
      <p className="text-gray-400 text-center">{description}</p>
    </div>
  )
}

function ProjectCard({ title, description }) {
  return (
    <div className="bg-gray-900 p-6 rounded-lg shadow-lg border border-gray-700">
      <h3 className="text-xl font-semibold mb-4">{title}</h3>
      <p className="text-gray-400">{description}</p>
    </div>
  )
}
