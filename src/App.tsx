import 'tippy.js/dist/tippy.css'

import React from 'react'
import { Token, Typeahead } from 'react-bootstrap-typeahead'
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
  '#4363d8',
  '#f58231',
  '#f032e6',
  '#fabebe',
  '#008080',
  '#e6beff',
  '#9a6324',
  '#fffac8',
  '#bcf60c',
  '#800000',
  '#ffe119',
  '#46f0f0',
  '#aaffc3',
  '#808000',
  '#ffd8b1',
  '#000075',
  '#808080',
  '#911eb4',
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

const HolidayList = ({ country, countryCode, holidays }: { country: string; countryCode: string; holidays: any }) => {
  return (
    <Col>
      <Card>
        <Card.Header>
          <img src={`/flags/${countryCode}.svg`} width={30} height={30} alt="flag" />{' '}
          <strong style={{ verticalAlign: 'middle' }}>{country}</strong>
        </Card.Header>
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
    { label: 'United States of America', value: { country: 'US' } },
    { label: 'Scotland', value: { country: 'GB', state: 'SCT' } },
    { label: 'Portugal', value: { country: 'PT' } },
    { label: 'Romania', value: { country: 'RO' } },
  ])
  const [year, setYear] = React.useState(new Date().getFullYear())
  const [holidaysThisYear, setHolidaysThisYear] = React.useState<YearsWorthOfHoliday>({ all: [], places: [] })
  const [includeAllTypes, setIncludeAllTypes] = React.useState(false)

  React.useEffect(() => {
    let colorIndex = 0
    const placesToCover = countrySelection.map((c: any) => {
      return { ...c.value, color: COLORS[colorIndex++ % COLORS.length] }
    })
    setHolidaysThisYear(getHolidaysForYear(year, includeAllTypes, placesToCover))
  }, [year, countrySelection, includeAllTypes])

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
          <Navbar.Brand href="/">
            <img
              alt=""
              src="data:image/png;base64,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"
              width="30"
              height="30"
              className="d-inline-block align-top"
              style={{ marginRight: '0.5em' }}
            />
            Every Public Holiday
          </Navbar.Brand>
        </Container>
      </Navbar>

      <Container>
        <div style={{ marginTop: '0.7em' }}>
          <Form.Group style={{ marginBottom: '1em' }}>
            <Typeahead
              id="country-chooser"
              labelKey="label"
              multiple
              onChange={setCountrySelection}
              options={options}
              placeholder="Choose a country"
              selected={countrySelection}
              clearButton
              renderToken={(option: any, props, index) => {
                return (
                  <Token
                    key={option.label}
                    option={option}
                    disabled={props.disabled}
                    onRemove={props.onRemove}
                    style={{ color: 'white', backgroundColor: COLORS[index % COLORS.length] }}
                  >
                    {option.label}
                  </Token>
                )
              }}
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
          <Form.Check
            className="mt-2"
            type="switch"
            id="custom-switch"
            label="Include other observed days"
            onChange={(e) => {
              setIncludeAllTypes(e.target.checked)
            }}
          />
        </div>

        <Row xs={1} md={2} className="g-4 mt-2">
          {holidaysThisYear.places.map((h) => {
            return <HolidayList key={h.country} country={h.country} countryCode={h.countryCode} holidays={h.holidays} />
          })}
        </Row>
      </Container>
    </>
  )
}

export default App
