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

const currentYear = 2023

let id = 0
const holidaysFor = (country: string, color: string, holiday: Holidays) => {
  return holiday
    .getHolidays(currentYear)
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

// See https://www.npmjs.com/package/date-holidays
const usHolidays = holidaysFor(
  'USA',
  '#911eb4',
  new Holidays('US', { timezone: 'utc' })
)
const ukHolidays = holidaysFor(
  'Scotland',
  '#e6194B',
  new Holidays('GB', 'SCT', { timezone: 'utc' })
)
const roHolidays = holidaysFor(
  'Romania',
  '#f58231',
  new Holidays('RO', { timezone: 'utc' })
)
const ptHolidays = holidaysFor(
  'Portugal',
  '#469990',
  new Holidays('PT', { timezone: 'utc' })
)

const allHolidays = [...usHolidays, ...ukHolidays, ...roHolidays, ...ptHolidays]

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
  const [holidaysHere, setHolidaysHere] = React.useState<HolidayHighlight[]>([])
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
        2023 public holidays in US, UK, Romania and Portugal
      </h2>

      <Calendar
        year={currentYear}
        language="en"
        weekStart={1}
        dataSource={allHolidays}
        displayHeader={false}
        onDayEnter={mousey}
        onDayLeave={() => setHolidaysHere([])}
      />

      <div style={{ margin: '1.6em' }}>
        <p>
          {holidaysHere.map((h) => (
            <h2 key={h.id}>
              {h.country}: {h.name}
            </h2>
          ))}
          {holidaysHere.length === 0 && (
            <h2>Hover over a date to see the holidays</h2>
          )}
        </p>

        <p>
          Legend: <span style={{ color: '#911eb4' }}>US</span>{' '}
          <span style={{ color: '#e6194B' }}>GB</span>{' '}
          <span style={{ color: '#f58231' }}>RO</span>{' '}
          <span style={{ color: '#469990' }}>PT</span>{' '}
        </p>

        <HolidayList country="US" holidays={usHolidays} />
        <HolidayList country="Scotland" holidays={ukHolidays} />
        <HolidayList country="Romania" holidays={roHolidays} />
        <HolidayList country="Portugal" holidays={ptHolidays} />
      </div>
    </div>
  )
}

export default App
