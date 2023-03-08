import { Outlet } from "react-router";
import Header from "./Component/AppBar/Header";
import Home from "./Component/Common/Home";

export const config = {
  endpoint: `https://63e5bc6f7eef5b2233785df2.mockapi.io/api/v1`,
};

function App() {
  return (
    <>
      <Header />
      <Outlet />
    </>
  );
}

export default App;
