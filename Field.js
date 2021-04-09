import Config from "./Config.js"
import Point from "./Point.js"
import Vector from "./lib/Vector.js"

export default class Field {
	constructor(canvasElement, nPoints = 100){
		this.canvasElement = canvasElement
		this.nPoints = nPoints
		
		this.points = []
		for(let i = 0; i < this.nPoints; i++){
			this.points.push(new Point(this))
		}
	}
	
	update(dt){
		for(const point of this.points) point.update(dt)
	}
	
	randomPosition(){
		return new Vector(
			Math.random()*this.canvasElement.width,
			Math.random()*this.canvasElement.height
		)
	}
	
	getNeighbours(p){
		let neighbours = []
		const detectionSq = Config.detectionRadius**2
		for(const point of this.points){
			if(point != p && Vector.distSq(point.pos, p.pos) <= detectionSq){
				neighbours.push(point)
			}
		}
		return neighbours
	}
	
	getClosestPoint(v){
		let minPoint
		let minDist
		for(const point of this.points){
			const dist = Vector.distSq(point.pos, v)
			if(!minDist || dist < minDist){
				minDist = dist
				minPoint = point
			}
		}
		return minPoint
	}
	
}
