import { Routes, Route } from 'react-router-dom';
// import Signin from "./auth/Signin"
// import Signup from "./auth/Signup"
import Home from './pages/Home'
import Shop from './pages/Shop'

function Pages() {
  return (
    <>
      <Routes>
        {/* <Route path="/signup" element={<Signup />}/>
        <Route path="/signin" element={<Signin />}/> */}
        <Route path="/" element={<Home />}/>
        <Route path="/shop" element={<Shop />}/>
      </Routes> 
    </>
  );  
}

export default Pages; 