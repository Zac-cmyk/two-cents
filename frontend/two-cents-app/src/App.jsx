import Pages from './Pages'
import { BrowserRouter } from 'react-router-dom'
import './App.css'

function App() {
  return (
    <>
      <BrowserRouter>
        <div className='w-[400px] h-[600px] overflow-y-auto'>
          <Pages />
        </div>
      </BrowserRouter>
    </>
  )
}

export default App