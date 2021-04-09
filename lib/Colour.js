import Vector from "./Vector.js"

export default class Colour extends Vector {
	constructor(r, g, b, a){
		if(typeof r == "string" && r.substring(0,1) == "#"){
			super( ...Colour.hexStringToRgb(r) )
			this.a = this.a ?? 1
		}else if(typeof r == "string"){
			const c = r.replace(/[^\d,]/g, "").split(",").map(x => parseInt(x))
			if(r.substring(0,3) == "rgb"){
				super( ...c )
				this.a = this.a ?? 1
			}else if(r.substring(0,3) == "hsl"){
				super( ...Colour.hslToRgb(c[0], c[1], c[2], c[3]) )
				this.a = this.a ?? 1
			}
		}else if(r instanceof Colour){
			return new Colour(r.r, r.g, r.b, r.a)
		}else if(typeof r == "object"){
			super(r)
			this.r = this.r ?? 0
			this.g = this.g ?? this.r
			this.b = this.b ?? this.g
			this.a = this.a ?? 1
		}else{
			super(r, g, b, a)
			this.r = this.r ?? 0
			this.g = this.g ?? this.r
			this.b = this.b ?? this.g
			this.a = this.a ?? 1
		}
	}
	
	get rgb(){
		return [this.r/255, this.g/255, this.b/255, this.a/255]
	}
	
	get rgb255(){
		return [this.r, this.g, this.b, this.a]
	}
	
	get hsl(){
		return Colour.rgbToHsl(this.r, this.g, this.b, this.a)
	}
	
	setAlpha(x){
		this.a = x
		return this
	}
	
	getBrightness(){
		return this.getAverage()
	}
	
	toRgbString(){
		return "rgba("+this.r+","+this.g+","+this.b+","+this.a+")"
	}
	
	toString(){
		return this.toRgbString()
	}
	
	static random(){
		return new Colour( Math.random(), Math.random(), Math.random() )
	}
	
	static valueToPercentage(x){
		return Math.floor(x*100/255) + "%"
	}
	
	static valueToDegrees(x){
		return Math.floor(x*360/255) + "deg"
	}
	
	// https://stackoverflow.com/a/39077686/3688140
	static hexStringToRgb(hex){
		return hex.replace( /^#?([a-f\d])([a-f\d])([a-f\d])$/i, (m, r, g, b) => '#' + r + r + g + g + b + b )
		.substring(1).match(/.{2}/g)
		.map( x => parseInt(x, 16) / 255 )
	}
	
	// Default colours
	static get WHITE(){ return new Colour(255) }
	static get BLACK(){ return new Colour(0) }
	static get RED(){ return new Colour(255,0,0) }
	static get GREEN(){ return new Colour(0,255,0) }
	static get BLUE(){ return new Colour(0,0,255) }
	static get YELLOW(){ return new Colour(255,255,0) }
	static get CYAN(){ return new Colour(0,255,255) }
	static get MAGENTA(){ return new Colour(255,0,255) }
	static get TRANSPARENT(){ return new Colour(0,0,0,0) }
	
}
