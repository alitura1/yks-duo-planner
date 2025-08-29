export const todayKey = () => new Date().toISOString().slice(0,10)

export const genWeek = () => {
  const arr: { key: string, label: string }[] = []
  const base = new Date()
  base.setHours(0,0,0,0)
  for(let i=0;i<7;i++){
    const d = new Date(base)
    d.setDate(base.getDate()+i)
    arr.push({ key: d.toISOString().slice(0,10), label: d.toLocaleDateString('tr-TR',{ weekday:'long'}) })
  }
  return arr
}

export const fmtRelative = (t?: number|null) => {
  if(!t) return '—'
  const sec = Math.max(1, Math.floor((Date.now()-t)/1000))
  const m = Math.floor(sec/60), h=Math.floor(m/60), d=Math.floor(h/24)
  if(sec<60) return `${sec} sn önce`
  if(m<60) return `${m} dk önce`
  if(h<24) return `${h} sa önce`
  return `${d} gün önce`
}