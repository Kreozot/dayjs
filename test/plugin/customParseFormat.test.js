import MockDate from 'mockdate'
import moment from 'moment'
import dayjs from '../../src'
import customParseFormat from '../../src/plugin/customParseFormat'
import uk from '../../src/locale/uk'

dayjs.extend(customParseFormat)
const oldLocale = dayjs().$locale()

beforeEach(() => {
  MockDate.set(new Date())
})

afterEach(() => {
  MockDate.reset()
  dayjs.locale(oldLocale)
})

it('does not break the built-in parsing', () => {
  const input = '2018-05-02 01:02:03.004'
  expect(dayjs(input).valueOf()).toBe(moment(input).valueOf())
})

it('parse padded string', () => {
  const input = '2018-05-02 01:02:03.004 AM +01:00'
  const format = 'YYYY-MM-DD HH:mm:ss.SSS A Z'
  expect(dayjs(input, format).valueOf()).toBe(moment(input, format).valueOf())
})

it('parse unpadded string', () => {
  const input = '2.5.18 1:2:3.4 PM -0100'
  const format = 'D.M.YY H:m:s.S A ZZ'
  expect(dayjs(input, format).valueOf()).toBe(moment(input, format).valueOf())
})

it('parse time zone abbreviation', () => {
  const input = '05/02/69 1:02:03.004 AM +01:00 (CET)'
  const format = 'MM/DD/YY h:mm:ss.SSS A Z (z)'
  expect(dayjs(input, format).valueOf()).toBe(moment(input, format).valueOf())
})

it('parse time zone abbreviation2', () => {
  const input = '05/02/69 1:02:03.04 AM +01:00 (CET)'
  const format = 'MM/DD/YY h:mm:ss.SS A Z (z)'
  expect(dayjs(input, format).valueOf()).toBe(moment(input, format).valueOf())
})

it('recognizes midnight in small letters', () => {
  const input = '2018-05-02 12:00 am'
  const format = 'YYYY-MM-DD hh:mm a'
  expect(dayjs(input, format).valueOf()).toBe(moment(input, format).valueOf())
})

it('recognizes noon in small letters', () => {
  const input = '2018-05-02 12:00 pm'
  const format = 'YYYY-MM-DD hh:mm a'
  expect(dayjs(input, format).valueOf()).toBe(moment(input, format).valueOf())
})

it('leaves non-token parts of the format intact', () => {
  const input = '2018-05-02 12:00 +0000 S:/-.() SS h '
  const format = 'YYYY-MM-DD HH:mm ZZ [S]:/-.()[ SS h ]'
  expect(dayjs(input, format).valueOf()).toBe(moment(input, format).valueOf())
})

it('timezone with no hour', () => {
  const input = '2018-05-02 +0000'
  const format = 'YYYY-MM-DD ZZ'
  expect(dayjs(input, format).valueOf()).toBe(moment(input, format).valueOf())
})

it('fails with an invalid format', () => {
  const input = '2018-05-02 12:00 PM'
  const format = 'C'
  expect(dayjs(input, format).format().toLowerCase())
    .toBe(moment(input, format).format().toLowerCase())
})

it('parse month from string', () => {
  const input = '2018 February 03'
  const format = 'YYYY MMMM DD'
  expect(dayjs(input, format).valueOf()).toBe(moment(input, format).valueOf())
})

it('parse month from short string', () => {
  const input = '2018 Feb 03'
  const format = 'YYYY MMM DD'
  expect(dayjs(input, format).valueOf()).toBe(moment(input, format).valueOf())
})

it('parse month from short string in other locales', () => {
  const input = '2018 May 03'
  const inputUk = '2018 трав 03'
  const format = 'YYYY MMM DD'
  dayjs.locale(uk)
  expect(dayjs(inputUk, format).valueOf()).toBe(moment(input, format).valueOf())
})

it('return Invalid Date when parse corrupt string', () => {
  const input = '2018 Februaru 03'
  const format = 'YYYY MMMM DD'
  expect(dayjs(input, format).format()).toBe('Invalid Date')
})

it('return Invalid Date when parse corrupt short string', () => {
  const input = '2018 Fev 03'
  const format = 'YYYY MMM DD'
  expect(dayjs(input, format).format()).toBe('Invalid Date')
})

it('correctly parse month from string after changing locale', () => {
  const input = '2018 February 03'
  const inputUk = '2018 лютий 03'
  const format = 'YYYY MMMM DD'

  dayjs.locale(uk)
  expect(dayjs(inputUk, format).valueOf()).toBe(moment(input, format).valueOf())

  dayjs.locale(oldLocale)
  expect(dayjs(input, format).valueOf()).toBe(moment(input, format).valueOf())
})
