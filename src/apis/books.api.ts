import { Book } from '~/types/book.type'
import http from '~/utils/http'

export const getBooks = (page: number | string, limit: number | string) =>
  http.get<Book[]>('reads', {
    params: {
      page,
      limit
    }
  })

export const getBook = (id: number | string) => http.get<Book>(`read/${id}`)
export const addBook = (book: Omit<Book, 'id'>) => http.post<Book>('/create', book)

export const updateBook = (id: number | string, book: Book) => http.put<Book>(`update/${id}`, book)
export const deleteBook = (id: number | string) => http.delete(`delete/${id}`)
