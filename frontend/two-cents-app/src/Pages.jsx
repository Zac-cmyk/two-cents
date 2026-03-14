import { Routes, Route } from 'react-router-dom';
// import Signin from "./auth/Signin"
// import Signup from "./auth/Signup"
import Home from './pages/Home'
import Shop from './pages/Shop'
import Social from './pages/Social'

function Pages() {
  return (
    <>
      <Routes>
        {/* <Route path="/signup" element={<Signup />}/>
        <Route path="/signin" element={<Signin />}/> */}
        <Route path="/" element={<Home />}/>
        <Route path="/shop" element={<Shop />}/>
        <Route path="/social" element={<Social />}/>
      </Routes> 
    </>
  );  
}

export default Pages; 