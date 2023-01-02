import { BrowserRouter, Route, Routes } from "react-router-dom";
import Home from "./Routes/Home";
import Layout from "./Routes/Layout";
import Search from "./Routes/Search";
import Tv from "./Routes/Tv";

const Router = () => {
  return (
    <BrowserRouter basename={process.env.PUBLIC_URL}>
      <Routes>
        <Route path={"/"} element={<Layout />}>
          <Route path={"/"} element={<Home />} />
          <Route path='/tv' element={<Tv />} />
          <Route path='/search' element={<Search />} />
          <Route path={"/movies/:movieId"} element={<Home />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
};
export default Router;
