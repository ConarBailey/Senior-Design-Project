import Register from './Register';
import Login from './Login';
import Logout from './Logout';
import Welcome from './Welcome';


import Layout from './Layout';
import About from './About';
import Admin from './Admin';
import FoodLog from './FoodLog';
import Missing from './Missing';
import Unauthorized from './Unauthorized';
import RequireAuth from './RequireAuth';
import FoodId from './FoodId';
import FoodName from './FoodName';
import {Route,Routes,useNavigate} from 'react-router-dom';
import {useState} from 'react';
import {format} from 'date-fns';

const ROLES = {
  'User': 2001,
  'Editor': 1984,
  'Admin': 5150
}

function App() {
  const [search, setSearch] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const navigate = useNavigate();


return (
    <Routes>
      <Route path="/" element={<Layout
        search={search}
        setSearch={setSearch}
      />}>
        <Route index element={<Welcome/>}/>
        <Route path="welcome" element={<Welcome/>}/>
        <Route path="about" element={<About/>}/>
        <Route path="register" element={<Register/>}/>
        <Route path="login" element={<Login/>}/>
        <Route path="unauthorized" element={<Unauthorized />} />

        {/* we want to protect these routes */}
        <Route element={<RequireAuth allowedRoles={[ROLES.User]} />}>
          {/* <Route path="/" element={<Welcome />} /> */}
          <Route path="foodLog" element={<FoodLog/>}/>
          <Route path="logout" element={<Logout/>}/>
          <Route path="foodName" element={<FoodName/>}/>
          <Route path="foodID" element={<FoodId/>}/>
        </Route>

        <Route element={<RequireAuth allowedRoles={[ROLES.Editor]} />}>
          {/* <Route path="editor" element={<Editor />} /> */}
        </Route>


        <Route element={<RequireAuth allowedRoles={[ROLES.Admin]} />}>
          <Route path="admin" element={<Admin />} />
        </Route>

        <Route element={<RequireAuth allowedRoles={[ROLES.Editor, ROLES.Admin]} />}>
          {/* <Route path="lounge" element={<Lounge />} /> */}
        </Route>

        {/* catch all */}
        <Route path="*" element={<Missing />} />
      </Route>
    </Routes>
  );
}

export default App;
