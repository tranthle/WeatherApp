export const ICON_MAP = new Map()


addMapping([0,1],"sun")
addMapping([2], "cloudy")
addMapping([3], "overcast")
addMapping([45,48],"fog(1)")
addMapping([51,53,55,56,57],"drizzle")
addMapping([61,63,66,67,80,81,82],"rain")
addMapping([71,73,75,77,85,86],"snow")
addMapping([95,96,99],"thunder-storm")


function addMapping(values, icon){
    values.forEach(value =>{
    ICON_MAP.set(value, icon)

    })
}