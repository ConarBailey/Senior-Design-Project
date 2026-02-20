import Register from './Register';
import Login from './Login';
import Welcome from './Welcome';

import Layout from './Layout';
// import Home from './Home';
// import NewPost from './NewPost';
// import PostPage from './PostPage';
import About from './About';
import Admin from './Admin';
import FoodLog from './FoodLog';
import Log from './Log';
import Missing from './Missing';
import {Route,Routes,useNavigate} from 'react-router-dom';
import {useState,useEffect} from 'react';
import {format} from 'date-fns';

function App() {

return (
    <Routes>
      <Route path="/" element={<Layout/>}>
        <Route index element={<Welcome/>}/>
        <Route path="about" element={<About/>}/>
        <Route path="log" element={<Log/>}/>
        <Route path="foodLog" element={<FoodLog/>}/>
        <Route path="admin" element={<Admin/>}/>
        <Route path="*" element={<Missing/>}/>
        <Route path="register" element={<Register/>}/>
        <Route path="login" element={<Login/>}/>
        <Route path="welcome" element={<Welcome/>}/>
      </Route>
    </Routes>
  );
}

export default App;
