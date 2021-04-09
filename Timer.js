export default class Timer {
	static period = 50
	static refractoryPeriod = 10
	static doSynchronise = true
	
	constructor(field, period, refractoryPeriod){
		this.field = field
		this._period = period
		this._refractoryPeriod = refractoryPeriod
		this.timer = Math.random()
		this.brightness = Math.random()
	}
	
	get period(){
		return this._period ?? Timer.period
	}
	get refractoryPeriod(){
		return this._refractoryPeriod ?? Timer.refractoryPeriod
	}
	set period(x){
		this._period = x
	}
	set refractoryPeriod(x){
		this._refractoryPeriod = x
	}
	
	tick(){
		if(this.brightness > 0) return
		this.timer += this.timer / 10
	}
	
	activate(){
		if(Timer.doSynchronise){
			this.field.getNeighbours(this).forEach(n => n.tick())
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
