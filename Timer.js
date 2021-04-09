export default class Timer {
	constructor(field, period, refractoryPeriod){
		this.field = field
		this.period = period
		this.refractoryPeriod = refractoryPeriod
		this.timer = Math.random()
		this.brightness = Math.random()
	}
	
	tick(){
		if(this.brightness > 0) return
		this.timer += this.timer / 10
	}
	
	activate(){
		const neighbours = this.field.getNeighbours(this)
		for(const neighbour of neighbours){
			neighbour.tick()
		}
		this.timer = 0
		this.brightness = 1
	}
	
	step(){
		if(this.brightness > 0){
			this.brightness = Math.max(0, this.brightness - 1/this.refractoryPeriod)
		}else{
			this.timer += 1/this.period
			if(this.timer >= 1) this.activate()
		}
	}
	
}
