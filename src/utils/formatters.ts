import moment from "moment"

export const formatCurrency = (
  value: number,
  currency: string = 'MWK', // change this to your preferred currency
) => {
  return value.toLocaleString('en-US', {
    style: 'currency',
    currency: currency,
  })
}

export const formatTextToCamelCase = (text: string) => {
  return text
    .replace(/([A-Z])/g, ' $1')
    .split(' ')
    .map((word: string) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ')
    .replace(/\./g, ' ')
}

export function calculatePercentage({
  part,
  whole,
  roundToNearestWholeNumber = false,
  roundDownToWholeNumber = false,
}: {
  part?: number
  whole?: number
  roundToNearestWholeNumber?: boolean
  roundDownToWholeNumber?: boolean
}): number {
  part = typeof part === 'number' ? part : 0
  whole = typeof whole === 'number' ? whole : 1
  if (whole === 0) {
    return 0
  }

  const percentage = (part / whole) * 100

  return roundToNearestWholeNumber
    ? Math.round(percentage)
    : roundDownToWholeNumber
      ? Math.floor(percentage)
      : percentage
}

export function formatNumber(num: number | string | null | undefined): string {
  if (num === null || num === undefined) {
    return '0'
  }

  // Attempt to parse the input as a number
  const parsedNum = typeof num === 'string' ? parseFloat(num) : num

  if (isNaN(parsedNum)) {
    // If parsing fails, return '0'
    return '0'
  }

  return parsedNum.toLocaleString('en-US')
}

export function toCamelCase(input: string): string {
  return input
    .replace(/(?:^\w|[A-Z]|\b\w)/g, (word: string, index: number) => {
      return index === 0 ? word.toLowerCase() : word.toUpperCase()
    })
    .replace(/\s+/g, '')
}

export function transformLabelToClassName(label: string): string {
  // Convert to lowercase
  const lowercaseLabel = label.toLowerCase()

  // Remove HTML tags using a regular expression
  const strippedLabel = lowercaseLabel.replace(/<\/?[^>]+(>|$)/g, '')

  // Replace spaces with hyphens
  const hyphenatedLabel = strippedLabel.replace(/\s+/g, '-')

  return hyphenatedLabel
}

export function sum(numbers: number[]): number {
  return numbers.reduce((acc: number, num: number | string | undefined) => {
    const parsedNum = typeof num === 'string' ? parseFloat(num) : (num ?? 0)
    return acc + (typeof parsedNum === 'number' ? parsedNum : 0)
  }, 0)
}

export function roundDownToWholeNumber(num: number): number {
  return Math.floor(num)
}

export function roundToNearestWholeNumber(num: number): number {
  return Math.round(num)
}

export function roundToPrecision({ value, precision }: RoundOptions): number {
  const rounded = Math.round(value * 10 ** precision) / 10 ** precision
  return rounded === 0 ? 0.0001 : rounded
}
export function statusClass(status: string = ''): string {
  const statusClasses = {
    'active': 'bg-green-200 text-green-800 dark:bg-green-900 dark:text-green-300',
    'inactive': 'bg-red-200 text-red-800 dark:bg-red-900 dark:text-red-300',
    'deleted': 'bg-gray-200 text-gray-800 dark:bg-gray-900 dark:text-gray-200',
  }

  return statusClasses[status as keyof typeof statusClasses] ||
         'bg-primary-200 text-primary-800 dark:bg-primary-900 dark:text-primary-300'
}

interface RoundOptions {
  value: number
  precision: number
}

export const formatDate = (date: string | Date, format: string = 'DD/MM/YYYY'): string => {
  if (!date) return ''
  return moment(date).format(format)
}

export const formatDateTime = (date: string | Date, format: string = 'DD/MM/YYYY HH:mm'): string => {
  if (!date) return ''
  return moment(date).format(format)
}

export const formatTime = (date: string | Date, format: string = 'HH:mm'): string => {
  if (!date) return ''
  return moment(date).format(format)
}

export const formatDateFromNow = (date: string | Date): string => {
  if (!date) return ''
  return moment(date).fromNow()
}

export const formatDateToCalendar = (date: string | Date): string => {
  if (!date) return ''
  return moment(date).calendar()
}

export const formatDateRange = (
  startDate: string | Date,
  endDate: string | Date,
  format: string = 'DD/MM/YYYY'
): string => {
  if (!startDate || !endDate) return ''
  return `${moment(startDate).format(format)} - ${moment(endDate).format(format)}`
}
