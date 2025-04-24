"use client"
import { Fira_Code } from 'next/font/google'
import { Github, Linkedin, Mail } from 'lucide-react'
import { useState, useEffect, useCallback, useRef } from 'react'

const firaCode = Fira_Code({ subsets: ['latin'] })

export default function Home() {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  return (
    <div className={`min-h-screen bg-gray-50 text-gray-900 ${firaCode.className}`}>
      {mounted && <GameOfLife />}

      <div className="relative z-10">
        <header className="sticky z-30 top-0 bg-gray-50/80 backdrop-blur-sm">
          <nav className="container mx-auto px-6 py-4">
            <ul className="flex justify-center space-x-8">
              <li><a href="#about" className="hover:text-blue-500 transition-colors">About</a></li>
              <li><a href="#skills" className="hover:text-green-500 transition-colors">Skills</a></li>
              <li><a href="#projects" className="hover:text-purple-500 transition-colors">Projects</a></li>
              <li><a href="#contact" className="hover:text-red-500 transition-colors">Contact</a></li>
            </ul>
          </nav>
        </header>

        <main className="container mx-auto px-6 pt-24">
          <section className="py-20 text-center">
            <h1 className="text-4xl font-bold mb-4 relative inline-block">
              Shishir
              <span className="absolute -bottom-2 left-0 w-full h-1 bg-gradient-to-r from-blue-500 via-green-500 to-purple-500"></span>
            </h1>
            <p className="text-xl text-gray-600">Computer Science Student | AI Enthusiast | Cryptography Explorer</p>
          </section>

          <section id="about" className="py-20">
            <h2 className="text-3xl font-semibold mb-6 text-blue-500">About Me</h2>
            <p className="text-lg text-gray-700 leading-relaxed">
              I&aposm a passionate computer science student with a keen interest in the intersection of artificial intelligence,
              mathematics, and cryptography. My goal is to leverage these fields to create innovative solutions for complex problems.
            </p>
          </section>

          <section id="skills" className="py-20">
            <h2 className="text-3xl font-semibold mb-6 text-green-500">Skills & Interests</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <SkillCard title="Artificial Intelligence" items={["Machine Learning", "Neural Networks", "Natural Language Processing"]} color="blue" />
              <SkillCard title="Mathematics" items={["Linear Algebra", "Calculus", "Probability & Statistics"]} color="green" />
              <SkillCard title="Cryptography" items={["Public Key Cryptography", "Hash Functions", "Blockchain Technology"]} color="purple" />
            </div>
          </section>

          <section id="projects" className="py-20">
            <h2 className="text-3xl font-semibold mb-6 text-purple-500">Projects</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <ProjectCard
                title="AI-Powered Chess Engine"
                description="Developed a chess engine using deep learning techniques to evaluate positions and suggest optimal moves."
                color="blue"
              />
              <ProjectCard
                title="Music Generation AI Model"
                description="Created music generation tool using the concepts of large language models"
                color="purple"
              />
              <ProjectCard
                title="Mathematical Visualization Tool"
                description="Built an interactive web application for visualizing complex mathematical concepts and equations."
                color="purple"
              />
              <ProjectCard
                title="Blockchain-based Voting System"
                description="Implemented a secure and transparent voting system using blockchain technology."
                color="red"
              />
            </div>
          </section>

          <section id="contact" className="py-20">
            <h2 className="text-3xl font-semibold mb-6 text-red-500">Get in Touch</h2>
            <div className="flex justify-center space-x-6">
              <a href="https://github.com/ibixina" target="_blank" rel="noopener noreferrer" className="text-gray-700 hover:text-blue-500 transition-colors">
                <Github size={24} />
                <span className="sr-only">GitHub</span>
              </a>
              <a href="https://www.linkedin.com/in/shishir-shrestha-7759b5331/" target="_blank" rel="noopener noreferrer" className="text-gray-700 hover:text-green-500 transition-colors">
                <Linkedin size={24} />
                <span className="sr-only">LinkedIn</span>
              </a>
              <a href="mailto:theshishir01@gmail.com" className="text-gray-700 hover:text-purple-500 transition-colors">
                <Mail size={24} />
                <span className="sr-only">Email</span>
              </a>
            </div>
          </section>
        </main>

        <footer className="bg-gray-100 py-6 mt-20">
          <div className="container mx-auto px-6 text-center text-gray-600">
            <p> {new Date().getFullYear()} ibixina.</p>
          </div>
        </footer>
      </div>
    </div>
  )
}

function SkillCard({ title, items, color }: { title: string, items: string[], color: string }) {
  return (
    <div className={`bg-white/80 backdrop-blur-sm p-6 rounded-lg shadow-sm border border-gray-100 transition-all duration-300 hover:shadow-md hover:scale-105`}>
      <h3 className={`text-xl font-semibold mb-4 text-${color}-500`}>{title}</h3>
      <ul className="list-disc list-inside text-gray-700">
        {items.map((item, index) => (
          <li key={index}>{item}</li>
        ))}
      </ul>
    </div>
  )
}

function ProjectCard({ title, description, color }: { title: string, description: string, color: string }) {
  return (
    <div className={`bg-white/80 backdrop-blur-sm p-6 rounded-lg shadow-sm border border-gray-100 transition-all duration-300 hover:shadow-md hover:scale-105`}>
      <h3 className={`text-xl font-semibold mb-2 text-${color}-500`}>{title}</h3>
      <p className="text-gray-700">{description}</p>
    </div>
  )
}

function GameOfLife() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [grid, setGrid] = useState<number[][]>([])
  const [isRunning] = useState(true)

  // Fixed dimensions for the game board
  const FIXED_WIDTH = 2000  // Larger than typical viewport
  const FIXED_HEIGHT = 2000
  const CELL_SIZE = 35      // Fixed cell size

  const rows = Math.floor(FIXED_HEIGHT / CELL_SIZE)
  const cols = Math.floor(FIXED_WIDTH / CELL_SIZE)

  const colors = [
    'rgba(59, 130, 246, 0.5)',  // blue
    'rgba(16, 185, 129, 0.5)',  // green
    'rgba(139, 92, 246, 0.5)',  // purple
    'rgba(239, 68, 68, 0.5)',   // red
    'rgba(245, 158, 11, 0.5)',  // yellow

  ]

  const initialize = useCallback(() => {
    const newGrid = Array(rows).fill(null).map(() =>
      Array(cols).fill(null).map(() => Math.random() > 0.7 ? Math.floor(Math.random() * colors.length) + 1 : 0)
    )
    setGrid(newGrid)
  }, [rows, cols])

  const runSimulation = useCallback(() => {
    if (!isRunning) return
    setGrid(g => {
      const newGrid = g.map((row, i) =>
        row.map((cell, j) => {
          const neighbors = [
            [-1, -1], [-1, 0], [-1, 1],
            [0, -1], [0, 1],
            [1, -1], [1, 0], [1, 1]
          ].reduce((acc, [x, y]) => {
            const newI = (i + x + rows) % rows
            const newJ = (j + y + cols) % cols
            return acc + (g[newI][newJ] !== 0 ? 1 : 0)
          }, 0)

          if (neighbors < 2 || neighbors > 3) return 0
          if (neighbors === 3) return cell || Math.floor(Math.random() * colors.length) + 1
          return cell
        })
      )
      return newGrid
    })
  }, [isRunning, rows, cols])

  useEffect(() => {
    initialize()
  }, [initialize])

  useEffect(() => {
    const intervalId = setInterval(runSimulation, 500)
    return () => clearInterval(intervalId)
  }, [runSimulation])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    // Set fixed dimensions for the canvas
    canvas.width = FIXED_WIDTH
    canvas.height = FIXED_HEIGHT

    ctx.clearRect(0, 0, canvas.width, canvas.height)

    grid.forEach((row, i) => {
      row.forEach((cell, j) => {
        ctx.beginPath()
        ctx.rect(j * CELL_SIZE, i * CELL_SIZE, CELL_SIZE, CELL_SIZE)
        ctx.fillStyle = cell ? colors[cell - 1] : 'rgba(229, 231, 235, 0.5)'
        ctx.fill()
      })
    })
  }, [grid, CELL_SIZE])

  return (
    <div className="fixed inset-0 overflow-hidden">
      <canvas
        ref={canvasRef}
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
        style={{
          width: `${FIXED_WIDTH}px`,
          height: `${FIXED_HEIGHT}px`,
        }}
      />
    </div>
  )
}
