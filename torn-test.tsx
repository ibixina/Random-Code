"use client"

import { useState, useMemo } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Slider } from "@/components/ui/slider"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Moon, Sun } from "lucide-react"

// Mock player data (replace this with actual API call in a real application)
const mockPlayerData = [
  { id: 1, name: "Player1", level: 50, totalBattleStats: 1000000, strength: 250000, speed: 250000, dexterity: 250000, defense: 250000, faction: "Crimson", activity: "Active" },
  { id: 2, name: "Player2", level: 75, totalBattleStats: 2000000, strength: 500000, speed: 500000, dexterity: 500000, defense: 500000, faction: "Cyan", activity: "Inactive" },
  { id: 3, name: "Player3", level: 100, totalBattleStats: 5000000, strength: 1250000, speed: 1250000, dexterity: 1250000, defense: 1250000, faction: "Viridian", activity: "Active" },
  // Add more mock data as needed
]

export default function PlayerData() {
  const [searchTerm, setSearchTerm] = useState("")
  const [factionFilter, setFactionFilter] = useState("All")
  const [activityFilter, setActivityFilter] = useState("All")
  const [minLevel, setMinLevel] = useState(0)
  const [minTotalStats, setMinTotalStats] = useState(0)
  const [isDarkMode, setIsDarkMode] = useState(true)

  const filteredPlayers = useMemo(() => {
    return mockPlayerData.filter((player) => {
      return (
        player.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
        (factionFilter === "All" || player.faction === factionFilter) &&
        (activityFilter === "All" || player.activity === activityFilter) &&
        player.level >= minLevel &&
        player.totalBattleStats >= minTotalStats
      )
    })
  }, [searchTerm, factionFilter, activityFilter, minLevel, minTotalStats])

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode)
  }

  return (
    <div className={`min-h-screen ${isDarkMode ? 'bg-gray-900 text-purple-100' : 'bg-purple-50 text-gray-900'}`}>
      <div className="container mx-auto p-4">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Card className={`mb-6 ${isDarkMode ? 'bg-gray-800 text-purple-100' : 'bg-white'}`}>
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle className="text-2xl font-bold">Torn.com Player Data</CardTitle>
                <button onClick={toggleDarkMode} className="p-2 rounded-full hover:bg-purple-700 transition-colors">
                  {isDarkMode ? <Sun className="w-6 h-6" /> : <Moon className="w-6 h-6" />}
                </button>
              </div>
              <CardDescription className={isDarkMode ? 'text-purple-300' : 'text-gray-600'}>
                View and filter player information and estimated battle stats
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
                <Input
                  placeholder="Search by name"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className={isDarkMode ? 'bg-gray-700 text-purple-100' : 'bg-white'}
                />
                <Select value={factionFilter} onValueChange={setFactionFilter}>
                  <SelectTrigger className={isDarkMode ? 'bg-gray-700 text-purple-100' : 'bg-white'}>
                    <SelectValue placeholder="Filter by faction" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="All">All Factions</SelectItem>
                    <SelectItem value="Crimson">Crimson</SelectItem>
                    <SelectItem value="Cyan">Cyan</SelectItem>
                    <SelectItem value="Viridian">Viridian</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={activityFilter} onValueChange={setActivityFilter}>
                  <SelectTrigger className={isDarkMode ? 'bg-gray-700 text-purple-100' : 'bg-white'}>
                    <SelectValue placeholder="Filter by activity" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="All">All Activities</SelectItem>
                    <SelectItem value="Active">Active</SelectItem>
                    <SelectItem value="Inactive">Inactive</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Minimum Level: {minLevel}</label>
                  <Slider
                    min={0}
                    max={100}
                    step={1}
                    value={[minLevel]}
                    onValueChange={(value) => setMinLevel(value[0])}
                    className={isDarkMode ? 'bg-gray-700' : 'bg-purple-200'}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Minimum Total Battle Stats: {minTotalStats.toLocaleString()}
                  </label>
                  <Slider
                    min={0}
                    max={10000000}
                    step={100000}
                    value={[minTotalStats]}
                    onValueChange={(value) => setMinTotalStats(value[0])}
                    className={isDarkMode ? 'bg-gray-700' : 'bg-purple-200'}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <Card className={isDarkMode ? 'bg-gray-800 text-purple-100' : 'bg-white'}>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className={isDarkMode ? 'text-purple-300' : 'text-gray-700'}>Name</TableHead>
                    <TableHead className={isDarkMode ? 'text-purple-300' : 'text-gray-700'}>Level</TableHead>
                    <TableHead className={isDarkMode ? 'text-purple-300' : 'text-gray-700'}>Total Battle Stats</TableHead>
                    <TableHead className={isDarkMode ? 'text-purple-300' : 'text-gray-700'}>Strength</TableHead>
                    <TableHead className={isDarkMode ? 'text-purple-300' : 'text-gray-700'}>Speed</TableHead>
                    <TableHead className={isDarkMode ? 'text-purple-300' : 'text-gray-700'}>Dexterity</TableHead>
                    <TableHead className={isDarkMode ? 'text-purple-300' : 'text-gray-700'}>Defense</TableHead>
                    <TableHead className={isDarkMode ? 'text-purple-300' : 'text-gray-700'}>Faction</TableHead>
                    <TableHead className={isDarkMode ? 'text-purple-300' : 'text-gray-700'}>Activity</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <AnimatePresence>
                    {filteredPlayers.map((player) => (
                      <motion.tr
                        key={player.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        transition={{ duration: 0.3 }}
                      >
                        <TableCell>{player.name}</TableCell>
                        <TableCell>{player.level}</TableCell>
                        <TableCell>{player.totalBattleStats.toLocaleString()}</TableCell>
                        <TableCell>{player.strength.toLocaleString()}</TableCell>
                        <TableCell>{player.speed.toLocaleString()}</TableCell>
                        <TableCell>{player.dexterity.toLocaleString()}</TableCell>
                        <TableCell>{player.defense.toLocaleString()}</TableCell>
                        <TableCell>{player.faction}</TableCell>
                        <TableCell>{player.activity}</TableCell>
                      </motion.tr>
                    ))}
                  </AnimatePresence>
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  )
}
