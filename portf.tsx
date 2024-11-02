import { Fira_Code } from 'next/font/google'
import { Github, Linkedin, Mail } from 'lucide-react'
import { useState, useEffect } from 'react'

const firaCode = Fira_Code({ subsets: ['latin'] })

export default function Home() {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  return (
    <div className={`min-h-screen bg-gray-50 text-gray-900 ${firaCode.className}`}>
      <div className="fixed inset-0 z-0 opacity-20">
        <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="smallGrid" width="20" height="20" patternUnits="userSpaceOnUse">
              <path d="M 20 0 L 0 0 0 20" fill="none" stroke="gray" strokeWidth="0.5" />
            </pattern>
            <pattern id="grid" width="100" height="100" patternUnits="userSpaceOnUse">
              <rect width="100" height="100" fill="url(#smallGrid)" />
              <path d="M 100 0 L 0 0 0 100" fill="none" stroke="gray" strokeWidth="1" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid)" />
        </svg>
      </div>

      <header className="fixed top-0 left-0 right-0 z-50 bg-gray-50/80 backdrop-blur-sm">
        <nav className="container mx-auto px-6 py-4">
          <ul className="flex justify-center space-x-8">
            <li><a href="#about" className="hover:text-blue-500 transition-colors">About</a></li>
            <li><a href="#skills" className="hover:text-green-500 transition-colors">Skills</a></li>
            <li><a href="#projects" className="hover:text-purple-500 transition-colors">Projects</a></li>
            <li><a href="#contact" className="hover:text-red-500 transition-colors">Contact</a></li>
          </ul>
        </nav>
      </header>

      <main className="container mx-auto px-6 pt-24 relative z-10">
        <section className="py-20 text-center">
          <h1 className="text-4xl font-bold mb-4 relative inline-block">
            Jane Doe
            <span className="absolute -bottom-2 left-0 w-full h-1 bg-gradient-to-r from-blue-500 via-green-500 to-purple-500"></span>
          </h1>
          <p className="text-xl text-gray-600">Computer Science Student | AI Enthusiast | Cryptography Explorer</p>
        </section>

        <section id="about" className="py-20">
          <h2 className="text-3xl font-semibold mb-6 text-blue-500">About Me</h2>
          <p className="text-lg text-gray-700 leading-relaxed">
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

      <footer className="bg-gray-100 py-6 mt-20 relative z-10">
        <div className="container mx-auto px-6 text-center text-gray-600">
          <p>&copy; {new Date().getFullYear()} Jane Doe. All rights reserved.</p>
        </div>
      </footer>

      {mounted && <ColorfulShapes />}
    </div>
  )
}

function SkillCard({ title, items, color }: { title: string, items: string[], color: string }) {
  return (
    <div className={`bg-white p-6 rounded-lg shadow-sm border border-gray-100 transition-all duration-300 hover:shadow-md hover:scale-105`}>
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
    <div className={`bg-white p-6 rounded-lg shadow-sm border border-gray-100 transition-all duration-300 hover:shadow-md hover:scale-105`}>
      <h3 className={`text-xl font-semibold mb-2 text-${color}-500`}>{title}</h3>
      <p className="text-gray-700">{description}</p>
    </div>
  )
}

function ColorfulShapes() {
  return (
    <div className="fixed inset-0 z-0 pointer-events-none">
      <div className="absolute top-1/4 left-1/4 w-32 h-32 bg-blue-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob"></div>
      <div className="absolute top-1/3 right-1/3 w-32 h-32 bg-green-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-2000"></div>
      <div className="absolute bottom-1/4 left-1/2 w-32 h-32 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-4000"></div>
      <div className="absolute bottom-1/3 right-1/4 w-32 h-32 bg-red-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-6000"></div>
    </div>
  )
}
