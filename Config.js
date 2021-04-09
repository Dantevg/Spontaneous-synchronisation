import Colour from "./lib/Colour.js"

export default class Config {
	static bg = new Colour(0x00)
	static fg = new Colour(0x11)
	static accent = new Colour(0xFF)
	static secondary = new Colour(0x22)
	static radius = 10
	static drawClosestPoint = true
	static drawDetectionRadius = true
	static drawGraphs = true
	static graphLength = 200
	static graphZoom = 1
	static synchronisationTreshold = 0.05
	
	static speed = 5
	static maxSpeed = 50
	static detectionRadius = 500
	static period = 50
	static refractoryPeriod = 10
	static timerIncrement = 0.3
}
