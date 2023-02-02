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
const usHolidays = holidaysFor(
  '#911eb4',
  new Holidays('US', { timezone: 'utc' })
)
const ukHolidays = holidaysFor(
  '#e6194B',
  new Holidays('GB', 'SCT', { timezone: 'utc' })
)
const roHolidays = holidaysFor(
  '#f58231',
  new Holidays('RO', { timezone: 'utc' })
)
const ptHolidays = holidaysFor(
  '#469990',
  new Holidays('PT', { timezone: 'utc' })
)

const allHolidays = [...usHolidays, ...ukHolidays, ...roHolidays, ...ptHolidays]

function App() {
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
      />

      <div style={{ margin: '1.6em' }}>
        <p>
          Legend: <span style={{ color: '#911eb4' }}>US</span>{' '}
          <span style={{ color: '#e6194B' }}>GB</span>{' '}
          <span style={{ color: '#f58231' }}>RO</span>{' '}
          <span style={{ color: '#469990' }}>PT</span>{' '}
        </p>

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
    </div>
  )
}

export default App
