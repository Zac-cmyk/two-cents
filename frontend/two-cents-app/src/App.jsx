import Pages from './Pages'
import { BrowserRouter } from 'react-router-dom'
import './App.css'

function App() {
  return (
    <>
      <BrowserRouter>
        <div className='relative w-100 h-150 overflow-hidden bg-[#2a2852]'>
          <Pages />
        </div>
      </BrowserRouter>
    </>
  )
}

export default App