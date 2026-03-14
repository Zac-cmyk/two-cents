import { Routes, Route, Outlet } from 'react-router-dom';
// import Signin from "./auth/Signin"
// import Signup from "./auth/Signup"
import Home from './pages/Home'
import Shop from './pages/Shop'
import Layout from './Layout';
import Socials from './pages/Socials';
import Expenditure from './pages/Expenditure';
import Login from './pages/Login';

function WithLayout() {
  return (
    <Layout>
      <Outlet />
    </Layout>
  )
}

function Pages() {
  return (
    <>
      <Routes>
        <Route path="/login" element={<Login />} />
        {/* <Route path="/signup" element={<Signup />}/>
        <Route path="/signin" element={<Signin />}/> */}
        <Route element={<WithLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/shop" element={<Shop />} />
          <Route path="/socials" element={<Socials />} />
          <Route path="/expenditure" element={<Expenditure />} />
        </Route>
      </Routes> 
    </>
  );  
}

export default Pages; 