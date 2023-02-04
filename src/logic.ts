import Holidays from 'date-holidays'

export interface PlaceToCover {
  country: string
  state?: string
  color: string
}

export interface YearsWorthOfHoliday {
  all: {
    id: number
    color: string
    name: string
    startDate: Date
    endDate: Date
    country: string
  }[]
  places: {
    country: string
    countryCode: string
    color: string
    holidays: {
      id: number
      color: string
      name: string
      startDate: Date
      endDate: Date
      country: string
    }[]
  }[]
}

export interface HolidayHighlight {
  id: number
  name: string
  country: string
  color: string
  date: Date
}

export const listAllPlacesAvailable = () => {
  const h = new Holidays('US', { timezone: 'utc' })
  const countries = h.getCountries('en-GB')
  var arr = []

  for (let key in countries) {
    if (countries.hasOwnProperty(key)) {
      arr.push({ label: countries[key], value: { country: key } })
    }
  }

  const ukRegions = h.getStates('GB', 'en-GB')
  for (let key in ukRegions) {
    if (ukRegions.hasOwnProperty(key)) {
      arr.push({ label: ukRegions[key], value: { country: 'GB', state: key } })
    }
  }

  return arr
}

let id = 0
export const holidaysFor = (year: number, country: string, color: string, includeAllTypes: boolean, holiday: Holidays) => {
  return holiday
    .getHolidays(year, 'en-GB')
    .filter((h) => includeAllTypes || ['public'].includes(h.type))
    .map((h) => {
      return {
        id: id++,
        color,
        name: h.name,
        startDate: h.start,
        endDate: h.start,
        country,
      }
    })
}

export const getHolidaysForYear = (year: number, includeAllTypes: boolean, placesToCover: PlaceToCover[]) => {
  // See https://www.npmjs.com/package/date-holidays

  const places = placesToCover.map((place: PlaceToCover) => {
    let h = new Holidays(place.country, { timezone: 'utc' })
    let name = h.getCountries('en-GB')[place.country]
    if (place.state) {
      h = new Holidays(place.country, place.state, { timezone: 'utc' })
      name = h.getStates(place.country)[place.state]
    }
    const countryCode = (place.country + (place.state ? '-' + place.state : '')).toLowerCase()
    const holidays = holidaysFor(year, name, place.color, includeAllTypes, h)
    return { country: name, countryCode, holidays: holidays, color: place.color }
  })

  return {
    all: places.map((s) => s.holidays).flat(),
    places,
  }
}
