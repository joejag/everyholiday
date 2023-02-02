import './App.css'

import Holidays from 'date-holidays'
import React from 'react'

import Calendar from './Calendar'

const niceDate = (date: Date) => {
  var options: Intl.DateTimeFormatOptions = {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
  }
  return new Intl.DateTimeFormat('en-GB', options).format(date)
}

let id = 0
const holidaysFor = (
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

const getHolidaysForYear = (year: number) => {
  // See https://www.npmjs.com/package/date-holidays
  const usHolidays = holidaysFor(
    year,
    'USA',
    '#911eb4',
    new Holidays('US', { timezone: 'utc' })
  )
  const ukHolidays = holidaysFor(
    year,
    'Scotland',
    '#e6194B',
    new Holidays('GB', 'SCT', { timezone: 'utc' })
  )
  const roHolidays = holidaysFor(
    year,
    'Romania',
    '#f58231',
    new Holidays('RO', { timezone: 'utc' })
  )
  const ptHolidays = holidaysFor(
    year,
    'Portugal',
    '#469990',
    new Holidays('PT', { timezone: 'utc' })
  )
  const allHolidays = [
    ...usHolidays,
    ...ukHolidays,
    ...roHolidays,
    ...ptHolidays,
  ]

  return {
    all: allHolidays,
    places: [
      { country: 'USA', holidays: usHolidays, color: '#911eb4' },
      { country: 'Scotland', holidays: ukHolidays, color: '#e6194B' },
      { country: 'Romania', holidays: roHolidays, color: '#f58231' },
      { country: 'Portugal', holidays: ptHolidays, color: '#469990' },
    ],
  }
}

interface YearsWorthOfHoliday {
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

const HolidayList = ({
  country,
  holidays,
}: {
  country: string
  holidays: any
}) => {
  return (
    <>
      <h3>{country} Holidays</h3>
      <ul>
        {holidays.map((h: any) => {
          return (
            <li key={h.id}>
              <>
                {niceDate(h.startDate)}: {h.name}
              </>
            </li>
          )
        })}
      </ul>
    </>
  )
}

interface HolidayHighlight {
  id: number
  name: string
  country: string
  color: string
  date: Date
}

function App() {
  const [year, setYear] = React.useState(new Date().getFullYear())
  const [holidaysThisYear, setHolidaysThisYear] =
    React.useState<YearsWorthOfHoliday>(getHolidaysForYear(year))
  const [holidaysHere, setHolidaysHere] = React.useState<HolidayHighlight[]>([])

  React.useEffect(() => {
    setHolidaysThisYear(getHolidaysForYear(year))
  }, [year])

  const mousey = (e: any) => {
    if (e.events.length > 0) {
      const content: HolidayHighlight[] = []

      for (var i in e.events) {
        const ev = e.events[i]
        content.push({
          id: ev.id,
          country: ev.country,
          name: ev.name,
          color: ev.color,
          date: ev.startDate,
        })
      }
      setHolidaysHere(content)
    }
  }

  return (
    <div>
      <h2 style={{ textAlign: 'center' }}>
        Public holidays in US, UK, Romania and Portugal
      </h2>

      <Calendar
        year={year}
        language="en"
        weekStart={1}
        dataSource={holidaysThisYear.all}
        onDayEnter={mousey}
        onDayLeave={() => setHolidaysHere([])}
        onYearChanged={({ currentYear }: any) => {
          setYear(currentYear)
        }}
      />

      <div style={{ margin: '1.6em' }}>
        <p>
          {holidaysHere.map((h) => (
            <h2 key={h.id}>
              {h.country}: {h.name}
            </h2>
          ))}
          {holidaysHere.length === 0 && (
            <h2>
              <em>Hover over a date to see the holidays</em>
            </h2>
          )}
        </p>

        <p>
          Legend:{' '}
          {holidaysThisYear.places.map((h) => {
            return (
              <>
                <span style={{ color: h.color }}>{h.country}</span>{' '}
              </>
            )
          })}
        </p>

        {holidaysThisYear.places.map((h) => {
          return <HolidayList country={h.country} holidays={h.holidays} />
        })}
      </div>
    </div>
  )
}

export default App
