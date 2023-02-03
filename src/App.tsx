import './App.css'

import React from 'react'

import Calendar from './Calendar'
import { getHolidaysForYear, HolidayHighlight, YearsWorthOfHoliday } from './logic'

const PLACES_TO_COVER = [
  { country: 'US', color: '#911eb4' },
  { country: 'GB', state: 'SCT', color: '#e6194B' },
  { country: 'PT', color: '#f58231' },
  { country: 'RO', color: '#469990' },
]

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
                {shortDate(h.startDate)}: {h.name}
              </>
            </li>
          )
        })}
      </ul>
    </>
  )
}

const shortDate = (date: Date) => {
  var options: Intl.DateTimeFormatOptions = {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
  }
  return new Intl.DateTimeFormat('en-GB', options).format(date)
}

function App() {
  const [year, setYear] = React.useState(new Date().getFullYear())
  const [holidaysThisYear, setHolidaysThisYear] =
    React.useState<YearsWorthOfHoliday>(
      getHolidaysForYear(year, PLACES_TO_COVER)
    )
  const [holidaysSelected, setHolidaysHere] = React.useState<
    HolidayHighlight[]
  >([])

  React.useEffect(() => {
    setHolidaysThisYear(getHolidaysForYear(year, PLACES_TO_COVER))
  }, [year])

  const showHolidayAssociatedWithDate = (e: any) => {
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
        onDayEnter={showHolidayAssociatedWithDate}
        onDayLeave={() => setHolidaysHere([])}
        onYearChanged={({ currentYear }: any) => {
          setYear(currentYear)
        }}
      />

      <div style={{ margin: '1.6em' }}>
        {holidaysSelected.map((h) => (
          <h2 key={h.id}>
            <span style={{ color: h.color }}>{h.country}</span>: {h.name}
          </h2>
        ))}
        {holidaysSelected.length === 0 && (
          <h2>
            <em>Hover over a date to see the holidays</em>
          </h2>
        )}

        {holidaysThisYear.places.map((h) => {
          return (
            <HolidayList
              key={h.country}
              country={h.country}
              holidays={h.holidays}
            />
          )
        })}
      </div>
    </div>
  )
}

export default App
