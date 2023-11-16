import { useRoutes } from 'react-router-dom'
import 'react-toastify/dist/ReactToastify.css'
import Dashboard from './pages/Dashboard'
import Books from './pages/Books'
import AddBook from './pages/AddBook'
import About from './pages/About'
import NotFound from './pages/NotFound'
import MainLayout from './layouts/MainLayout'
import { ToastContainer } from 'react-toastify'

function App() {
  const elements = useRoutes([
    {
      path: '/',
      element: <Dashboard />
    },
    {
      path: '/books',
      element: <Books />
    },
    {
      path: '/reads/:id',
      element: <AddBook />
    },
    {
      path: '/books/add',
      element: <AddBook />
    },
    {
      path: '/about',
      element: <About />
    },
    {
      path: '*',
      element: <NotFound />
    }
  ])

  return (
    <div className='App'>
      <ToastContainer />
      <MainLayout>{elements}</MainLayout>
    </div>
  )
}

export default App
