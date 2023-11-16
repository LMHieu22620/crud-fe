import { keepPreviousData, useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { Link } from 'react-router-dom'
import { toast } from 'react-toastify'
import { deleteBook, getBooks } from '~/apis/books.api'
import { Book } from '~/types/book.type'
import { formatCurrency, useQueryString } from '~/utils/utils'
const LIMIT = 1000

export default function Books() {
  const queryString: { page?: string } = useQueryString()
  const page = Number(queryString.page) || 1

  const queryClient = useQueryClient()
  const bookQuery = useQuery({
    queryKey: ['books', page],
    queryFn: () => getBooks(page, LIMIT),
    placeholderData: keepPreviousData
  })
  const deleteBookMutation = useMutation({
    mutationFn: (id: number | string) => {
      return deleteBook(id)
    },
    onSuccess: () => {
      toast.success('Delete Thành Công!')
      queryClient.invalidateQueries({ queryKey: ['books', page], exact: true })
    }
  })
  const handleChangeDelete = (id: number) => {
    deleteBookMutation.mutate(id)
  }

  return (
    <>
      <h1 className='text-lg'>Books</h1>
      <div className='mt-6'>
        <Link
          to='/books/add'
          className='rounded-lg bg-blue-700 px-5 py-2.5 text-sm font-medium text-white hover:bg-blue-800 focus:outline-none focus:ring-4 focus:ring-blue-300 dark:bg-blue-600'
        >
          Add Book
        </Link>
      </div>
      {bookQuery.isLoading && (
        <div role='status' className='mt-6 animate-pulse'>
          <div className='mb-4 h-4  rounded bg-gray-200 dark:bg-gray-700' />
          <div className='mb-2.5 h-10  rounded bg-gray-200 dark:bg-gray-700' />
          <div className='mb-2.5 h-10 rounded bg-gray-200 dark:bg-gray-700' />
          <div className='mb-2.5 h-10  rounded bg-gray-200 dark:bg-gray-700' />
          <div className='mb-2.5 h-10  rounded bg-gray-200 dark:bg-gray-700' />
          <div className='mb-2.5 h-10  rounded bg-gray-200 dark:bg-gray-700' />
          <div className='mb-2.5 h-10  rounded bg-gray-200 dark:bg-gray-700' />
          <div className='mb-2.5 h-10  rounded bg-gray-200 dark:bg-gray-700' />
          <div className='mb-2.5 h-10  rounded bg-gray-200 dark:bg-gray-700' />
          <div className='mb-2.5 h-10  rounded bg-gray-200 dark:bg-gray-700' />
          <div className='mb-2.5 h-10  rounded bg-gray-200 dark:bg-gray-700' />
          <div className='mb-2.5 h-10  rounded bg-gray-200 dark:bg-gray-700' />
          <div className='h-10  rounded bg-gray-200 dark:bg-gray-700' />
          <span className='sr-only'>Loading...</span>
        </div>
      )}
      {!bookQuery.isLoading && (
        <div className='relative mt-6 overflow-x-auto shadow-md sm:rounded-lg'>
          <table className='w-full text-left text-sm text-gray-500 dark:text-gray-400'>
            <thead className='bg-gray-50 text-xs uppercase text-gray-700 dark:bg-gray-700 dark:text-gray-400'>
              <tr>
                <th scope='col' className='py-3 px-6'>
                  #
                </th>
                <th scope='col' className='py-3 px-6'>
                  Title
                </th>
                <th scope='col' className='py-3 px-6'>
                  Author
                </th>
                <th scope='col' className='py-3 px-6'>
                  Publication date
                </th>
                <th scope='col' className='py-3 px-6'>
                  Genre
                </th>
                <th scope='col' className='py-3 px-6'>
                  Language
                </th>
                <th scope='col' className='py-3 px-6'>
                  Publisher
                </th>
                <th scope='col' className='py-3 px-6'>
                  Price
                </th>
                <th scope='col' className='py-3 px-6'>
                  Description
                </th>
                <th scope='col' className='py-3 px-6'>
                  <span className='sr-only'>Action</span>
                </th>
              </tr>
            </thead>
            {bookQuery.data?.data.map((book: Book, index: number) => {
              const date = new Date(book.publication_date as Date)

              const getYear = date.getFullYear()
              const getDate = date.getDate()
              const getMonth = date.getMonth() + 1

              return (
                <tbody>
                  <tr className='border-b bg-white hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:hover:bg-gray-600'>
                    <td className='py-4 px-6'>{index + 1}</td>
                    <th scope='row' className='whitespace-nowrap py-4 px-6 font-medium text-gray-900 dark:text-white'>
                      {book.title}
                    </th>
                    <td className='py-4 px-6'>{book.author}</td>
                    <td className='py-4 px-6'>{`${getDate}/${getMonth}/${getYear}`}</td>
                    <td className='py-4 px-6'>{book.genre}</td>
                    <td className='py-4 px-6'>{book.language}</td>
                    <td className='py-4 px-6'>{book.publisher}</td>
                    <td className='py-4 px-6'>{formatCurrency(book.price as unknown as number)}</td>

                    <td className='py-4 px-6 '>
                      <Link
                        to={`/reads/${book._id}`}
                        className='mr-5 font-medium text-blue-600 hover:underline dark:text-blue-500'
                      >
                        Edit
                      </Link>
                      <button
                        className='font-medium text-red-600 dark:text-red-500'
                        // eslint-disable-next-line @typescript-eslint/no-explicit-any
                        onClick={() => handleChangeDelete(book._id as any)}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                </tbody>
              )
            })}
          </table>
        </div>
      )}
    </>
  )
}
