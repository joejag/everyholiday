import './App.css'

import Holidays from 'date-holidays'
import React from 'react'

import Calendar from './Calendar'

const currentYear = 2023

let id = 0
const holidaysFor = (color: string, holiday: Holidays) => {
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
      }
    })
}

// See https://www.npmjs.com/package/date-holidays
const usHolidays = holidaysFor('blue', new Holidays('US', { timezone: 'utc' }))
const ukHolidays = holidaysFor(
  'green',
  new Holidays('GB', 'SCT', { timezone: 'utc' })
)
const roHolidays = holidaysFor(
  'yellow',
  new Holidays('RO', { timezone: 'utc' })
)
const ptHolidays = holidaysFor('red', new Holidays('PT', { timezone: 'utc' }))

const allHolidays = [...usHolidays, ...ukHolidays, ...roHolidays, ...ptHolidays]

function App() {
  return (
    <div>
      <h2 style={{ textAlign: 'center' }}>
        2023 holidays in US, UK, Romania and Portugal
      </h2>

      <Calendar
        year={currentYear}
        language="en"
        weekStart={1}
        dataSource={allHolidays}
        displayHeader={false}
      />

      <h3>US Holidays</h3>
      <ul>
        {usHolidays.map((h) => {
          return (
            <li key={h.id}>
              <>
                {h.startDate.toDateString()}: {h.name}
              </>
            </li>
          )
        })}
      </ul>

      <h3>UK Holidays (Scotland)</h3>
      <ul>
        {ukHolidays.map((h) => {
          return (
            <li key={h.id}>
              <>
                {h.startDate.toDateString()}: {h.name}
              </>
            </li>
          )
        })}
      </ul>

      <h3>Romania Holidays</h3>
      <ul>
        {roHolidays.map((h) => {
          return (
            <li key={h.id}>
              <>
                {h.startDate.toDateString()}: {h.name}
              </>
            </li>
          )
        })}
      </ul>

      <h3>Portugal Holidays</h3>
      <ul>
        {ptHolidays.map((h) => {
          return (
            <li key={h.id}>
              <>
                {h.startDate.toDateString()}: {h.name}
              </>
            </li>
          )
        })}
      </ul>
    </div>
  )
}

export default App
