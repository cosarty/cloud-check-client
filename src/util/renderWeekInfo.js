export const WEEK_DAY_ENMU = {
	1: '一',
	2: '二',
	3: '三',
	4: '四',
	5: '五',
	6: '六',
	7: '日',
}

class RenderWeekInfo {
	constructor() {
		// 1.初始化当前日期
		this.date = this.getDate(new Date())

		// 2.获取选中的日期
		this.selected = []

		// 3.缓存已经生成的周列表
		this.weeks = []

		// 4.当前的周列表
		this.currentWeek = []

		this.setDate(this.date)
	}
	
	checkDate(date) {
		return (
			typeof date === 'number' ||
			date instanceof Date ||
			/\d+([\\\/-])\d+(\1)\d+/.test(date)
		)
	}
	
	get getCurentMonth(){
		// 计算当前月份
	const analysis =this.currentWeek.reduce((p,n)=>{
		const key = `${n.year}-${n.month}`
		if(p.hasOwnProperty(key)){
			p[key]++
		}else{
			p[key] = 1
		}
	return p
	},{})
	return Object.entries(analysis).sort((a,b)=>b[1]-a[1])[0]
	}
	
	// addCount 是跨几周的意思
	// 假如是这周五那么加一周应该是下周一而不是下周五 这个根据addCount来叠加
	getDate(date, addCount = 0) {
		if (!this.checkDate(date)) {
			// 如果用户输入违规数据直接返回当天数据回去
			date = new Date()
			addCount = 0
		}
		
		date = new Date(date)

		date.setDate(date.getDate() + addCount * 7)
		const y = date.getFullYear()

		const m =
			date.getMonth() + 1 < 10 ?
			'0' + (date.getMonth() + 1) :
			date.getMonth() + 1 // 获取当前月份的日期，不足10补0
		const d = date.getDate() < 10 ? '0' + date.getDate() : date.getDate() // 获取当前几号，不足10补0
		const day = date.getDay() === 0 ? 7 : date.getDay()
		return {
			fullDate: `${y}-${m}-${d}`,
			year: y,
			month: m,
			date: d,
			day,
		}
	}
	setDate(date) {
		this.selected = this.getDate(date)
		this._getWeek(this.selected.fullDate)
	}

	// 默认是从当前周获取下一周
	// 跨几周
	acrossWeek(count = 1) {
		// count = count>=0 ?count + 1:count
		// 先从缓存获取
		// 判断技巧 获取当前周的周一 然后加7天 然后和缓存里面的去匹配
		const {
			fullDate
		} = this.getDate(this.currentWeek[0].fullDate, count)
		//  重新设置当前周
		this._getWeek(fullDate)
	}

	// 当前时间的前几天
	lastWeek(date, surplus) {
		const cdd = new Date(date).getDate()
		return [...new Array(surplus - 1)].reduce(
			(p, _, i) => [this.getDate(new Date(date).setDate(cdd - i - 1)), ...p],
			[]
		)
	}

	// 当前时间的后几天
	nextWeek(date, surplus) {
		const cdd = new Date(date).getDate()
		return [...new Array(surplus)].reduce(
			(p, _, i) => [...p, this.getDate(new Date(date).setDate(cdd + i + 1))],
			[]
		)
	}

	_getWeek(dd) {
		dd = this.getDate(dd)

		// 判断时间是不是当前周  如果是 就不重新生成了
		if (this.currentWeek.length !== 0) {
			const exist = this.currentWeek.find((wk) => wk.fullDate === dd.fullDate)
			// 如果是当前周我们就不生成了
			if (exist) return
		}

		// 判断在不在缓存的周列表里面如果在就不重新生成了
		if (this.weeks.length !== 0) {
			// 如果在缓存里面 直接赋值给当前周然后渲染出来
			const existWeek = this.weeks.find((cwk) =>
				cwk.find((wk) => wk.fullDate === dd.fullDate)
			)
			if (existWeek) {
				this.currentWeek = existWeek
				return
			}
		}
		// 我要判断是选中的时间是周几 然后取他的前几天和后几天
		//  保存当前周的天数数据
		let week = [dd]
		if (dd.day !== 7) {
			const next = this.nextWeek(dd.fullDate, 7 - dd.day)
			week = [...week, ...next]
		}
		if (dd.day !== 1) {
			const last = this.lastWeek(dd.fullDate, dd.day)
			week = [...last, ...week]
		}

		this.weeks.push(week)
		this.currentWeek = week
	}
}


export default RenderWeekInfo
