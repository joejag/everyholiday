import 'tippy.js/dist/tippy.css'

import React from 'react'
import { Typeahead } from 'react-bootstrap-typeahead'
import { Option } from 'react-bootstrap-typeahead/types/types'
import Card from 'react-bootstrap/Card'
import Col from 'react-bootstrap/Col'
import Container from 'react-bootstrap/Container'
import Form from 'react-bootstrap/Form'
import Navbar from 'react-bootstrap/Navbar'
import Row from 'react-bootstrap/Row'
import tippy from 'tippy.js'

import Calendar from './Calendar'
import { getHolidaysForYear, listAllPlacesAvailable, YearsWorthOfHoliday } from './logic'

const COLORS = [
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
  '#e6194b',
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

const HolidayList = ({ country, holidays }: { country: string; holidays: any }) => {
  return (
    <Col>
      <Card>
        <Card.Header>{country}</Card.Header>
        <Card.Body>
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
        </Card.Body>
      </Card>
    </Col>
  )
}

let tooltip: any = null

function App() {
  const [countrySelection, setCountrySelection] = React.useState<Option[]>([
    { label: 'United States of America', value: 'US' },
    { label: 'United Kingdom', value: 'GB' },
    { label: 'Portugal', value: 'PT' },
    { label: 'Romania', value: 'RO' },
  ])
  const [year, setYear] = React.useState(new Date().getFullYear())
  const [holidaysThisYear, setHolidaysThisYear] = React.useState<YearsWorthOfHoliday>({ all: [], places: [] })

  React.useEffect(() => {
    let colorIndex = 0
    const placesToCover = countrySelection.map((c: any) => {
      return { country: c.value, color: COLORS[colorIndex++ % COLORS.length] }
    })

    setHolidaysThisYear(getHolidaysForYear(year, placesToCover))
  }, [year, countrySelection])

  const showHolidayAssociatedWithDate = (e: any) => {
    if (e.events.length > 0) {
      let popupMessage = ''

      for (var i in e.events) {
        const ev = e.events[i]
        popupMessage += `<span style="color:${ev.color}">${ev.country}</span>: ${ev.name} <br />`
      }

      if (tooltip !== null) {
        tooltip.destroy()
        tooltip = null
      }

      tooltip = tippy(e.element, {
        content: popupMessage,
        placement: 'bottom',
        animation: 'shift-away',
        arrow: true,
        allowHTML: true,
      })
      tooltip.show()
    }
  }

  return (
    <>
      <Navbar bg="dark" variant="dark">
        <Container>
          <Navbar.Brand href="/">Every public holiday</Navbar.Brand>
        </Container>
      </Navbar>

      <Container>
        <div style={{ marginTop: '0.7em' }}>
          <Form.Group style={{ marginBottom: '1em' }}>
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
            onYearChanged={({ currentYear }: any) => {
              setYear(currentYear)
            }}
          />
        </div>

        <div style={{ margin: '1.6em' }}>
          <Row xs={1} md={2} className="g-4">
            {holidaysThisYear.places.map((h) => {
              return <HolidayList key={h.country} country={h.country} holidays={h.holidays} />
            })}
          </Row>
        </div>
      </Container>
    </>
  )
}

export default App
