import React from "react";
import { Routes, Route } from "react-router-dom";
import Login from "./Auth/Login";
import Signup from "./Auth/Signup";
import ResetPassword from "./Auth/ResetPassword";
import Home from "./Dashboard/Home";
import DisplaySubject from "./pages/Subject/DisplayAllSubject";
import AddSubject from "./pages/Subject/AddSubject";
import DisplayBooks from "./pages/Book/DisplayBooks";
import AddBook from "./pages/Book/AddBook";
import DisplayAuthor from "./pages/Author/DisplayAuthor";
import AddAuthor from "./pages/Author/AddAuthor";
import PrivateRoute from "./context/PrivateRoute";

const App = () => {
  return (
    <div>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Signup />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route
          path="/dashboard"
          element={<PrivateRoute element={<Home />} />}
        />
        <Route
          path="/displaysubject"
          element={<PrivateRoute element={<DisplaySubject />} />}
        />
        <Route
          path="/addsubject"
          element={<PrivateRoute element={<AddSubject />} />}
        />
        <Route
          path="/displaybooks"
          element={<PrivateRoute element={<DisplayBooks />} />}
        />
        <Route
          path="/addbook"
          element={<PrivateRoute element={<AddBook />} />}
        />
        <Route
          path="/displayauthors"
          element={<PrivateRoute element={<DisplayAuthor />} />}
        />
        <Route
          path="/addauthors"
          element={<PrivateRoute element={<AddAuthor />} />}
        />
      </Routes>
    </div>
  );
};

export default App;
