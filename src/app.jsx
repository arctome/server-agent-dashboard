import React from 'react';
import { Routes, Route } from "react-router-dom";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './styles/app.css';
// Pages
// const TerminalPage = React.lazy(() => import("./pages/servers/[id]"));
// const HomePage = React.lazy(() => import("./pages/home-page"))
// const NotFoundPage = React.lazy(() => import("./pages/not-found-page"))
import HomePage from './pages/home-page'
import TerminalPage from './pages/terminal'
import NotFoundPage from './pages/not-found-page'
import LoginPage from './pages/login'

function App() {
  return (
    <div className="App">
      <Routes>
        <Route path="/terminal" element={<TerminalPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/" element={<HomePage />} />
        <Route path="/*" element={<NotFoundPage />} />
      </Routes>
      <ToastContainer />
    </div>
  )
}

export default App
