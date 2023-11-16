import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { omit } from 'lodash'
import { useEffect, useState } from 'react'
import { Link, useMatch, useParams } from 'react-router-dom'
import { toast } from 'react-toastify'
import { Book } from 'src/types/book.type'
import { addBook, getBook, updateBook } from '~/apis/books.api'
import DateSelect from '~/apis/components/DateSelect'

type FormStateType = Omit<Book, '_id'> | Book

const initialFormState: FormStateType = {
  author: '',
  genre: '',
  description: '',
  language: '',
  price: '',
  publication_date: new Date(1990, 0, 1),
  publisher: '',
  title: ''
}

export default function AddBook() {
  const queryClient = useQueryClient()
  const [formState, setFormstate] = useState<FormStateType>(initialFormState)
  const [datePublication, setDatePublication] = useState(new Date(formState.publication_date as Date))
  console.log(datePublication, 'datePublication')

  const addMatch = useMatch('/books/add')
  const isAddMode = Boolean(addMatch)
  const { id } = useParams()

  const BookQuery = useQuery({
    queryKey: ['book', id],
    queryFn: () => getBook(id as string),
    enabled: id !== undefined,
    staleTime: 10 * 1000
  })

  useEffect(() => {
    if (BookQuery.data) {
      setFormstate(BookQuery.data.data)
      setDatePublication(new Date(BookQuery.data.data.publication_date as Date))
    }
  }, [BookQuery.data])
  useEffect(() => {
    setFormstate((prev) => ({ ...prev, publication_date: datePublication }))
  }, [datePublication])
  const addBooktMutation = useMutation({
    mutationFn: (body: FormStateType) => {
      return addBook(body)
    }
  })

  const updateBookMutation = useMutation({
    mutationFn: () => {
      return updateBook(id as string, omit(formState, ['_id']) as Book)
    },
    onSuccess: (data) => {
      queryClient.setQueryData(['book', id], data)
    }
  })

  const handleChange = (name: keyof FormStateType) => (event: React.ChangeEvent<HTMLInputElement>) => {
    setFormstate((prev) => ({ ...prev, publication_date: datePublication, [name]: event.target.value }))
    if (addBooktMutation.data || addBooktMutation.error) {
      addBooktMutation.reset()
    }
  }
  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (isAddMode) {
      addBooktMutation.mutate(formState, {
        onSettled: () => {
          setFormstate(initialFormState)
          setDatePublication(initialFormState.publication_date as Date)
          toast.success('Add Thành Công!')
        }
      })
    } else {
      updateBookMutation.mutate(undefined, {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        onSuccess: (_) => {
          toast.success('Update Thành Công!')
        }
      })
    }
  }
  return (
    <div>
      <h1 className='text-lg'>{isAddMode ? 'Add Book' : 'Edit Book'}</h1>

      <form className='mt-6' onSubmit={handleSubmit}>
        <div className='group relative z-0 mb-6 w-full'>
          <input
            name='title'
            id='title'
            className='peer block w-full appearance-none border-0 border-b-2 border-gray-300 bg-transparent py-2.5 px-0 text-sm text-gray-900 focus:border-blue-600 focus:outline-none focus:ring-0 dark:border-gray-600 dark:text-white dark:focus:border-blue-500'
            placeholder=' '
            value={formState.title}
            required
            onChange={handleChange('title')}
          />
          <label
            htmlFor='title'
            className='absolute top-3 -z-10 origin-[0] -translate-y-6 scale-75 transform text-sm text-gray-500 duration-300 peer-placeholder-shown:translate-y-0 peer-placeholder-shown:scale-100 peer-focus:left-0 peer-focus:-translate-y-6 peer-focus:scale-75 peer-focus:font-medium peer-focus:text-blue-600 dark:text-gray-400 peer-focus:dark:text-blue-500'
          >
            Title
          </label>
        </div>

        <div className='group relative z-0 mb-6 w-full'>
          <input
            type='text'
            name='author'
            id='author'
            className='peer block w-full appearance-none border-0 border-b-2 border-gray-300 bg-transparent py-2.5 px-0 text-sm text-gray-900 focus:border-blue-600 focus:outline-none focus:ring-0 dark:border-gray-600 dark:text-white dark:focus:border-blue-500'
            placeholder=' '
            value={formState.author}
            onChange={handleChange('author')}
            required
          />
          <label
            htmlFor='author'
            className='absolute top-3 -z-10 origin-[0] -translate-y-6 scale-75 transform text-sm text-gray-500 duration-300 peer-placeholder-shown:translate-y-0 peer-placeholder-shown:scale-100 peer-focus:left-0 peer-focus:-translate-y-6 peer-focus:scale-75 peer-focus:font-medium peer-focus:text-blue-600 dark:text-gray-400 peer-focus:dark:text-blue-500'
          >
            Author
          </label>
        </div>

        <div className='grid md:grid-cols-2 md:gap-6'>
          <div className='group relative z-0 mb-6 w-full'>
            <input
              type='text'
              name='genre'
              id='genre'
              value={formState.genre}
              className='peer block w-full appearance-none border-0 border-b-2 border-gray-300 bg-transparent py-2.5 px-0 text-sm text-gray-900 focus:border-blue-600 focus:outline-none focus:ring-0 dark:border-gray-600 dark:text-white dark:focus:border-blue-500'
              placeholder=' '
              onChange={handleChange('genre')}
              required
            />
            <label
              htmlFor='genre'
              className='absolute top-3 -z-10 origin-[0] -translate-y-6 scale-75 transform text-sm text-gray-500 duration-300 peer-placeholder-shown:translate-y-0 peer-placeholder-shown:scale-100 peer-focus:left-0 peer-focus:-translate-y-6 peer-focus:scale-75 peer-focus:font-medium peer-focus:text-blue-600 dark:text-gray-400 peer-focus:dark:text-blue-500'
            >
              Genre
            </label>
          </div>
          <div className='group relative z-0 mb-6 w-full'>
            <input
              type='text'
              name='language'
              id='language'
              value={formState.language}
              className='peer block w-full appearance-none border-0 border-b-2 border-gray-300 bg-transparent py-2.5 px-0 text-sm text-gray-900 focus:border-blue-600 focus:outline-none focus:ring-0 dark:border-gray-600 dark:text-white dark:focus:border-blue-500'
              placeholder=' '
              onChange={handleChange('language')}
              required
            />
            <label
              htmlFor='language'
              className='absolute top-3 -z-10 origin-[0] -translate-y-6 scale-75 transform text-sm text-gray-500 duration-300 peer-placeholder-shown:translate-y-0 peer-placeholder-shown:scale-100 peer-focus:left-0 peer-focus:-translate-y-6 peer-focus:scale-75 peer-focus:font-medium peer-focus:text-blue-600 dark:text-gray-400 peer-focus:dark:text-blue-500'
            >
              Language
            </label>
          </div>
        </div>
        <div className='grid md:grid-cols-2 md:gap-6'>
          <div className='group relative z-0 mb-6 w-full'>
            <input
              type='text'
              name='publisher'
              id='publisher'
              className='peer block w-full appearance-none border-0 border-b-2 border-gray-300 bg-transparent py-2.5 px-0 text-sm text-gray-900 focus:border-blue-600 focus:outline-none focus:ring-0 dark:border-gray-600 dark:text-white dark:focus:border-blue-500'
              placeholder=' '
              value={formState.publisher}
              onChange={handleChange('publisher')}
              required
            />
            <label
              htmlFor='publisher'
              className='absolute top-3 -z-10 origin-[0] -translate-y-6 scale-75 transform text-sm text-gray-500 duration-300 peer-placeholder-shown:translate-y-0 peer-placeholder-shown:scale-100 peer-focus:left-0 peer-focus:-translate-y-6 peer-focus:scale-75 peer-focus:font-medium peer-focus:text-blue-600 dark:text-gray-400 peer-focus:dark:text-blue-500'
            >
              Publisher
            </label>
          </div>
          <div className='group relative z-0 mb-6 w-full'>
            <input
              type='number'
              name='price'
              id='price'
              className='peer block w-full appearance-none border-0 border-b-2 border-gray-300 bg-transparent py-2.5 px-0 text-sm text-gray-900 focus:border-blue-600 focus:outline-none focus:ring-0 dark:border-gray-600 dark:text-white dark:focus:border-blue-500'
              placeholder=' '
              value={formState.price}
              onChange={handleChange('price')}
              required
            />
            <label
              htmlFor='price'
              className='absolute top-3 -z-10 origin-[0] -translate-y-6 scale-75 transform text-sm text-gray-500 duration-300 peer-placeholder-shown:translate-y-0 peer-placeholder-shown:scale-100 peer-focus:left-0 peer-focus:-translate-y-6 peer-focus:scale-75 peer-focus:font-medium peer-focus:text-blue-600 dark:text-gray-400 peer-focus:dark:text-blue-500'
            >
              Price
            </label>
          </div>
        </div>
        <div className='group relative z-0 mb-6 w-full'>
          <input
            type='text'
            name='description'
            id='description'
            className='peer block w-full appearance-none border-0 border-b-2 border-gray-300 bg-transparent py-2.5 px-0 text-sm text-gray-900 focus:border-blue-600 focus:outline-none focus:ring-0 dark:border-gray-600 dark:text-white dark:focus:border-blue-500'
            placeholder=' '
            value={formState.description}
            onChange={handleChange('description')}
            required
          />
          <label
            htmlFor='description'
            className='absolute top-3 -z-10 origin-[0] -translate-y-6 scale-75 transform text-sm text-gray-500 duration-300 peer-placeholder-shown:translate-y-0 peer-placeholder-shown:scale-100 peer-focus:left-0 peer-focus:-translate-y-6 peer-focus:scale-75 peer-focus:font-medium peer-focus:text-blue-600 dark:text-gray-400 peer-focus:dark:text-blue-500'
          >
            Description
          </label>
        </div>
        <div className='grid md:grid-cols-2 md:gap-6'>
          <div className='group relative z-0 mb-6 w-full'>
            <DateSelect value={datePublication} onChange={(value) => setDatePublication(value)} />
          </div>
        </div>
        <div className='flex  items-center'>
          <button
            type='submit'
            className='w-full rounded-lg bg-blue-700 px-5 py-2.5 text-center text-sm font-medium text-white hover:bg-blue-800 focus:outline-none focus:ring-4 focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800 sm:w-auto'
          >
            {isAddMode ? 'Add' : 'Update'}
          </button>
          <div className=''>
            <Link
              to='/books'
              className=' ml-4 rounded-lg bg-pink-500 px-5 py-3 text-sm font-medium text-white hover:bg-pink-700 focus:outline-none focus:ring-4 focus:ring-blue-300 dark:bg-blue-600'
            >
              Quay lại
            </Link>
          </div>
        </div>
      </form>
    </div>
  )
}
