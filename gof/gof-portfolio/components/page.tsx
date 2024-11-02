'use client'

import { Fira_Code } from 'next/font/google'
import { Github, Linkedin, Mail } from 'lucide-react'
import { useState, useEffect, useCallback, useRef } from 'react'

const firaCode = Fira_Code({ subsets: ['latin'] })

export function Page() {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  return (
    <div className={`min-h-screen text-gray-100 ${firaCode.className}`}>
      {mounted && <GameOfLife />}

      <div className="relative z-10">
        <header className="sticky top-0 bg-gray-900/80 backdrop-blur-sm">
          <nav className="container mx-auto px-6 py-4">
            <ul className="flex justify-center space-x-8">
              <li><a href="#about" className="text-gray-300 hover:text-blue-400 transition-colors">About</a></li>
              <li><a href="#skills" className="text-gray-300 hover:text-green-400 transition-colors">Skills</a></li>
              <li><a href="#projects" className="text-gray-300 hover:text-purple-400 transition-colors">Projects</a></li>
              <li><a href="#contact" className="text-gray-300 hover:text-red-400 transition-colors">Contact</a></li>
            </ul>
          </nav>
        </header>

        <main className="container mx-auto px-6 pt-24">
          <section className="py-20 text-center">
            <h1 className="text-4xl font-bold mb-4 relative inline-block">
              Jane Doe
              <span className="absolute -bottom-2 left-0 w-full h-1 bg-gradient-to-r from-blue-500 via-green-500 to-purple-500"></span>
            </h1>
            <p className="text-xl text-gray-300">Computer Science Student | AI Enthusiast | Cryptography Explorer</p>
          </section>

          <section id="about" className="py-20">
            <h2 className="text-3xl font-semibold mb-6 text-blue-500">About Me</h2>
            <p className="text-lg text-gray-300 leading-relaxed">
              I'm a passionate computer science student with a keen interest in the intersection of artificial intelligence, 
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
                title="Secure Messaging App" 
                description="Created an end-to-end encrypted messaging application using modern cryptographic protocols."
                color="green"
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
              <a href="https://github.com" target="_blank" rel="noopener noreferrer" className="text-gray-700 hover:text-blue-500 transition-colors">
                <Github size={24} />
                <span className="sr-only">GitHub</span>
              </a>
              <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="text-gray-700 hover:text-green-500 transition-colors">
                <Linkedin size={24} />
                <span className="sr-only">LinkedIn</span>
              </a>
              <a href="mailto:jane@example.com" className="text-gray-700 hover:text-purple-500 transition-colors">
                <Mail size={24} />
                <span className="sr-only">Email</span>
              </a>
            </div>
          </section>
        </main>

        <footer className="bg-gray-900/50 py-6 mt-20">
          <div className="container mx-auto px-6 text-center text-gray-400">
            <p>&copy; {new Date().getFullYear()} Jane Doe. All rights reserved.</p>
          </div>
        </footer>
      </div>
    </div>
  )
}

function SkillCard({ title, items, color }: { title: string, items: string[], color: string }) {
  return (
    <div className={`bg-gray-900/30 backdrop-blur-md p-6 rounded-lg shadow-sm border border-gray-700 transition-all duration-300 hover:shadow-md hover:scale-105`}>
      <h3 className={`text-xl font-semibold mb-4 text-${color}-500`}>{title}</h3>
      <ul className="list-disc list-inside text-gray-300">
        {items.map((item, index) => (
          <li key={index}>{item}</li>
        ))}
      </ul>
    </div>
  )
}

function ProjectCard({ title, description, color }: { title: string, description: string, color: string }) {
  return (
    <div className={`bg-gray-900/30 backdrop-blur-md p-6 rounded-lg shadow-sm border border-gray-700 transition-all duration-300 hover:shadow-md hover:scale-105`}>
      <h3 className={`text-xl font-semibold mb-2 text-${color}-500`}>{title}</h3>
      <p className="text-gray-300">{description}</p>
    </div>
  )
}

function GameOfLife() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [grid, setGrid] = useState<[number, number, number][][]>([])
  const [isRunning, setIsRunning] = useState(true)

  const rows = 50
  const cols = 50

  const baseColors = [
    [59, 130, 246],   // blue
    [16, 185, 129],   // green
    [139, 92, 246],   // purple
    [239, 68, 68],    // red
    [245, 158, 11],   // yellow
  ]

  const initialize = () => {
    const newGrid = Array(rows).fill(null).map(() => 
      Array(cols).fill(null).map(() => 
        Math.random() > 0.7 ? baseColors[Math.floor(Math.random() * baseColors.length)] : [0, 0, 0]
      )
    )
    setGrid(newGrid)
  }

  const mixColors = (colors: [number, number, number][]) => {
    const avgColor = colors.reduce(
      (acc, color) => [acc[0] + color[0], acc[1] + color[1], acc[2] + color[2]],
      [0, 0, 0]
    )
    return avgColor.map(c => Math.round(c / colors.length)) as [number, number, number]
  }

  const runSimulation = useCallback(() => {
    if (!isRunning) return
    setGrid(g => {
      const newGrid = g.map((row, i) =>
        row.map((cell, j) => {
          const neighbors = [
            [-1, -1], [-1, 0], [-1, 1],
            [0, -1],           [0, 1],
            [1, -1], [1, 0], [1, 1]
          ]
          const liveNeighbors = neighbors.reduce((acc, [x, y]) => {
            const newI = (i + x + rows) % rows
            const newJ = (j + y + cols) % cols
            return g[newI][newJ][0] !== 0 || g[newI][newJ][1] !== 0 || g[newI][newJ][2] !== 0 ? acc + 1 : acc
          }, 0)

          const neighborColors = neighbors
            .map(([x, y]) => g[(i + x + rows) % rows][(j + y + cols) % cols])
            .filter(color => color[0] !== 0 || color[1] !== 0 || color[2] !== 0)

          if (liveNeighbors < 2 || liveNeighbors > 3) return [0, 0, 0]
          if (liveNeighbors === 3) return neighborColors.length > 0 ? mixColors(neighborColors) : baseColors[Math.floor(Math.random() * baseColors.length)]
          return cell[0] !== 0 || cell[1] !== 0 || cell[2] !== 0 ? cell : [0, 0, 0]
        })
      )
      return newGrid
    })
  }, [isRunning])

  useEffect(() => {
    initialize()
  }, [])

  useEffect(() => {
    const intervalId = setInterval(runSimulation, 200)
    return () => clearInterval(intervalId)
  }, [runSimulation])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const cellSize = Math.min(window.innerWidth, window.innerHeight) / rows

    canvas.width = cols * cellSize
    canvas.height = rows * cellSize

    ctx.clearRect(0, 0, canvas.width, canvas.height)

    grid.forEach((row, i) => {
      row.forEach((cell, j) => {
        ctx.beginPath()
        ctx.rect(j * cellSize, i * cellSize, cellSize, cellSize)
        ctx.fillStyle = `rgba(${cell[0]}, ${cell[1]}, ${cell[2]}, 0.7)`
        ctx.fill()
      })
    })
  }, [grid])

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 w-full h-full z-0"
    />
  )
}