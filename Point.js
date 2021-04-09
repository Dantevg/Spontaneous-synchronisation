import Colour from "./lib/Colour.js"
import Config from "./Config.js"
import Timer from "./Timer.js"
import Vector from "./lib/Vector.js"

export default class Point extends Timer {
	constructor(field, pos){
		super(field, Config.period, Config.refractoryPeriod)
		
		this.pos = pos ?? field.randomPosition()
		this.vel = new Vector(Math.random() - 0.5, Math.random() - 0.5)
		this.acc = new Vector(0, 0)
	}
	
	update(dt){
		this.acc.set((Math.random()-0.5)*Config.speed, (Math.random()-0.5)*Config.speed)
		this.vel.add(this.acc)
		if(this.vel.length() > Config.maxSpeed) this.vel.normalize().multiply(Config.maxSpeed)
		this.pos.add(Vector.multiply(this.vel, dt/1000))
		
		// Bounce off edges
		if(this.pos.x < 0 || this.pos.x >= this.field.canvasElement.width){
			this.pos.x = Math.max(0, Math.min(this.pos.x, this.field.canvasElement.width))
			this.vel.x = -this.vel.x
		}
		if(this.pos.y < 0 || this.pos.y >= this.field.canvasElement.height){
			this.pos.y = Math.max(0, Math.min(this.pos.y, this.field.canvasElement.height))
			this.vel.y = -this.vel.y
		}
		
		this.step()
	}
	
	draw(canvas){
		canvas.fillStyle = Colour.lerp(Config.fg, Config.accent, this.brightness)
		canvas.beginPath()
		canvas.arc(this.pos.x, this.pos.y, Config.radius, 0, Math.PI*2)
		canvas.fill()
	}
	
}
