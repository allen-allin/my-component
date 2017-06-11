class FullPage {
	constructor(options) {
		let defaultOpt = {
			el: '',
			duration: '1s',
			moveType: 'ease'
		}
		this.options = Object.assign({},defaultOpt,options)
		this.currIndex = 0
		this.scrolling = false
		this.checkOutOpts().initEl().bindWheelEvents()
	}
	checkOutOpts() {
		if (!this.options.el) {
			throw new Error('el is required')
		}
		return this
	}
	initEl() {
		this.options.el.style.overflow = 'hidden'
		for (var i = 0; i < this.options.el.children.length; i++) {
			this.options.el.children[i].style.transition = `transform ${this.options.duration} ${this.options.moveType}`
		}
		return this
	}
	bindWheelEvents() {
		this.options.el.addEventListener('wheel',e => {
			let targetIndex = this.currIndex + (e.deltaY > 0 ? 1 : -1)
			this.goSection(targetIndex)
			.then((res)=> {
				this.scrolling = false
				this.currIndex = targetIndex
			})
			.catch((res)=>{
				console.log('超出范围')
			})
		})
	}
	goSection(targetIndex) {
		return new Promise((resolve,reject) => {
			if (this.scrolling || targetIndex < 0 || targetIndex >= this.options.el.children.length) {
				reject()
			}else {
				console.log('翻页了')
				this.scrolling = true
				this.options.el.children[0].addEventListener('transitionend',function cb() {					
					this.removeEventListener('transitionend',cb)
					resolve()
				})
				for (var i = 0; i < this.options.el.children.length; i++) {
					this.options.el.children[i].style.transform = `translateY(-${ 100 * targetIndex}%)`
				}
			}
		})
	}
}
