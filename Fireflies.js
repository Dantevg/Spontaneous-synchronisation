import Config from "./Config.js"
import Vector from "./lib/Vector.js"
import Field from "./Field.js"
import Point from "./Point.js"

export default class Fireflies {
	constructor(canvasElement, nPoints){
		this.canvasElement = canvasElement
		this.canvas = this.canvasElement.getContext("2d")
		this.field = new Field(canvasElement, nPoints)
		
		this.graphs = []
		for(let i = 0; i < Config.graphLength * Config.graphZoom; i++){
			this.graphs[i] = {timer: 0, stddev: 0}
		}
		
		this.mouse = new Vector(0, 0)
		window.onmousemove = e => {
			this.mouse.x = e.clientX
			this.mouse.y = e.clientY
		}
		
		const origTimerIncrement = Config.timerIncrement
		Config.timerIncrement = 0
		window.onkeydown = e => {
			if(e.key == " ") Config.timerIncrement = origTimerIncrement
		}
		
		window.onmousedown = e => {
			this.field.points.push(new Point(
				this.field,
				new Vector(e.clientX, e.clientY)
			))
		}
	}
	
	draw(t){
		const dt = t - (this.prevTime ?? t)
		this.prevTime = t
		
		this.field.update(dt)
		
		this.canvas.fillStyle = Config.bg
		this.canvas.fillRect(0, 0, this.canvasElement.width, this.canvasElement.height)
		
		for(const point of this.field.points) point.draw(this.canvas)
		
		if(Config.drawClosestPoint) this.drawClosestPoint()
		if(Config.drawGraphs){
			this.calculateGraphs()
			this.drawGraphs()
		}
		
		this.canvas.fillStyle = Config.accent
		this.canvas.fillText(this.isSynchronised() ? "synchronised": "not in sync", 0, 10)
		
		window.requestAnimationFrame((t) => this.draw(t))
	}
	
	getAverageTimer(){
		return Fireflies.averageModulo(this.field.points.map(p => p.timer))
	}
	
	calculateGraphs(){
		this.graphs.shift()
		this.graphs.push({
			timer: this.field.points.reduce((a, p) => a + p.timer, 0) / this.field.points.length,
			stddev: this.getStandardDeviation(),
		})
	}
	
	getStandardDeviation(){
		const avg = this.getAverageTimer()
		const deviations = this.field.points.map(p => Math.abs(p.timer - avg)**2)
		return Math.sqrt(deviations.reduce((a,x) => a+x) / deviations.length)
	}
	
	isSynchronised(){
		return this.getStandardDeviation() < Config.synchronisationTreshold
	}
	
	drawClosestPoint(){
		const closest = this.field.getClosestPoint(this.mouse)
		this.canvas.strokeStyle = "#FFFFFF"
		this.canvas.beginPath()
		this.canvas.arc(closest.pos.x, closest.pos.y, Config.radius+0.5, 0, Math.PI*2)
		this.canvas.stroke()
		if(Config.drawDetectionRadius){
			this.canvas.strokeStyle = Config.fg
			this.canvas.beginPath()
			this.canvas.arc(closest.pos.x, closest.pos.y, Config.detectionRadius, 0, Math.PI*2)
			this.canvas.stroke()
		}
		this.canvas.fillStyle = closest.active ? "#44FF44" : "#FF4444"
		this.canvas.fillText(
			Math.floor(closest.timer*10)/10,
			closest.pos.x + Config.radius, closest.pos.y - Config.radius
		)
	}
	
	drawGraph(key, x, y){
		this.canvas.strokeStyle = Config.secondary
		this.canvas.beginPath()
		this.canvas.moveTo(x, y + (1-this.graphs[0][key]) * 100)
		for(let i = 0; i < this.graphs.length; i += Config.graphZoom){
			this.canvas.lineTo(x + i/Config.graphZoom, y + (1-this.graphs[i][key]) * 100)
		}
		this.canvas.stroke()
	}
	
	drawGraphs(){
		// Draw timer graph
		this.drawGraph("timer", 10, 10)
		this.drawGraph("stddev", 10, 110)
	}
	
	// Also works for negative numbers: https://stackoverflow.com/a/17323608
	static mod = (n, m) => ((n % m) + m) % m
	
	static averageModulo(values){
		const sin = values.map(v => Math.sin(v*2*Math.PI)).reduce((a,x) => a+x, 0)
		const cos = values.map(v => Math.cos(v*2*Math.PI)).reduce((a,x) => a+x, 0)
		const angle = Math.atan2(sin / values.length, cos / values.length)
		return Fireflies.mod(angle / (2*Math.PI), 1)
	}
	
}
