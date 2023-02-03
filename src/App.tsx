import React from 'react'
import { Typeahead } from 'react-bootstrap-typeahead'
import { Option } from 'react-bootstrap-typeahead/types/types'
import Container from 'react-bootstrap/Container'
import Form from 'react-bootstrap/Form'
import Navbar from 'react-bootstrap/Navbar'

import Calendar from './Calendar'
import {
    getHolidaysForYear, HolidayHighlight, listAllPlacesAvailable, PlaceToCover, YearsWorthOfHoliday
} from './logic'

const COLORS = [
  '#e6194b',
  '#3cb44b',
  '#ffe119',
  '#4363d8',
  '#f58231',
  '#911eb4',
  '#46f0f0',
  '#f032e6',
  '#bcf60c',
  '#fabebe',
  '#008080',
  '#e6beff',
  '#9a6324',
  '#fffac8',
  '#800000',
  '#aaffc3',
  '#808000',
  '#ffd8b1',
  '#000075',
  '#808080',
]

const options = listAllPlacesAvailable()

const shortDate = (date: Date) => {
  var options: Intl.DateTimeFormatOptions = {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
  }
  return new Intl.DateTimeFormat('en-GB', options).format(date)
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
                {shortDate(h.startDate)}: {h.name}
              </>
            </li>
          )
        })}
      </ul>
    </>
  )
}

function App() {
  const [countrySelection, setCountrySelection] = React.useState<Option[]>([
    { label: 'United States of America', value: 'US' },
    { label: 'United Kingdom', value: 'GB' },
    { label: 'Portugal', value: 'PT' },
    { label: 'Romania', value: 'RO' },
  ])
  const [year, setYear] = React.useState(new Date().getFullYear())
  const [holidaysThisYear, setHolidaysThisYear] =
    React.useState<YearsWorthOfHoliday>({ all: [], places: [] })
  const [holidaysSelected, setHolidaysHere] = React.useState<
    HolidayHighlight[]
  >([])

  React.useEffect(() => {
    let colorIndex = 0
    const placesToCover = countrySelection.map((c: any) => {
      return { country: c.value, color: COLORS[colorIndex++] }
    })

    setHolidaysThisYear(getHolidaysForYear(year, placesToCover))
  }, [year, countrySelection])

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
    <>
      <Navbar bg="dark" variant="dark">
        <Container>
          <Navbar.Brand href="/">Public holidays</Navbar.Brand>
        </Container>
      </Navbar>

      <Container>
        <div style={{ marginTop: '1em' }}>
          <Form.Group style={{ marginTop: '20px' }}>
            <Typeahead
              id="basic-typeahead-multiple"
              labelKey="label"
              multiple
              onChange={setCountrySelection}
              options={options}
              placeholder="Choose a country"
              selected={countrySelection}
            />
          </Form.Group>

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
        </div>

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
      </Container>
    </>
  )
}

export default App
