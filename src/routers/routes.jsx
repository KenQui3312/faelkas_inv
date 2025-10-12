import { Routes, Route } from "react-router-dom";
import {Home} from "../index.js";
export function MyRoutes() {
  return (

      <Routes>
        <Route path="/" element={<Home/>}/>
      </Routes>
      
 );
}