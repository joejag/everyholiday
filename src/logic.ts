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

  for (var key in countries) {
    if (countries.hasOwnProperty(key)) {
      //   arr.push({ value: key, label: countries[key] })
      const stuff: Record<string, { value: string; label: string }> = {
        key: { value: key, label: countries[key] },
      }
      arr.push({ value: key, label: countries[key] })
    }
  }

  return arr
}

let id = 0
export const holidaysFor = (
  year: number,
  country: string,
  color: string,
  holiday: Holidays
) => {
  return holiday
    .getHolidays(year)
    .filter((h) => ['public'].includes(h.type))
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

export const getHolidaysForYear = (
  year: number,
  placesToCover: PlaceToCover[]
) => {
  // See https://www.npmjs.com/package/date-holidays

  const places = placesToCover.map((place: PlaceToCover) => {
    let h = new Holidays(place.country, { timezone: 'utc' })
    let name = h.getCountries()[place.country]
    if (place.state) {
      h = new Holidays(place.country, place.state, { timezone: 'utc' })
      name = h.getStates(place.country)[place.state]
    }
    const holidays = holidaysFor(year, name, place.color, h)
    return { country: name, holidays: holidays, color: place.color }
  })

  return {
    all: places.map((s) => s.holidays).flat(),
    places,
  }
}
