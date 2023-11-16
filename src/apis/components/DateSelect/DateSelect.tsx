import { range } from 'lodash'
import React, { useState } from 'react'

interface Props {
  onChange?: (value: Date) => void
  value?: Date
}

export default function DateSelect({ onChange, value }: Props) {
  const [date, setDate] = useState({
    date: value?.getDate() || 1,
    month: value?.getMonth() || 0,
    year: value?.getFullYear() || 1990
  })

  const handleChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const { value: valueSelect, name } = event.target

    const newDate = {
      date: value?.getDate() || date.date,
      month: value?.getMonth() || date.month,
      year: value?.getFullYear() || date.year,
      [name]: Number(valueSelect)
    }

    setDate(newDate)
    onChange && onChange(new Date(newDate.year, newDate.month, newDate.date))
  }

  return (
    <div className='mt-3 flex flex-col flex-wrap sm:flex-row'>
      <div className='text-md absolute top-3 -z-10 origin-[0] -translate-y-6 scale-75 transform text-gray-500 duration-300 peer-placeholder-shown:translate-y-0 peer-placeholder-shown:scale-100 peer-focus:left-0 peer-focus:-translate-y-6 peer-focus:scale-75 peer-focus:font-medium peer-focus:text-blue-600 dark:text-gray-400 peer-focus:dark:text-blue-500'>
        Publication date
      </div>
      <div className='sm:w-[100%] '>
        <div className='flex justify-between'>
          <select
            onChange={handleChange}
            name='date'
            className='hover:border-orange h-10 w-[32%] cursor-pointer rounded-sm border border-black/10 px-3'
            value={value?.getDate() || date.date}
          >
            <option disabled>Ngày</option>
            {range(1, 32).map((item) => (
              <option value={item} key={item}>
                {item}
              </option>
            ))}
          </select>
          <select
            name='month'
            className='hover:border-orange h-10 w-[32%] cursor-pointer rounded-sm border border-black/10 px-3'
            onChange={handleChange}
            value={value?.getMonth() || date.month}
          >
            <option disabled>Tháng</option>
            {range(0, 12).map((item) => (
              <option value={item} key={item}>
                {item + 1}
              </option>
            ))}
          </select>
          <select
            name='year'
            className='hover:border-orange h-10 w-[32%] cursor-pointer rounded-sm border border-black/10 px-3'
            onChange={handleChange}
            value={value?.getFullYear() || date.year}
          >
            <option disabled>Năm</option>
            {range(1990, 2024).map((item) => (
              <option value={item} key={item}>
                {item}
              </option>
            ))}
          </select>
        </div>
        {/* <div className='mt-1 min-h-[1.25rem] text-sm text-red-600'>{errorMessage}</div> */}
      </div>
    </div>
  )
}
