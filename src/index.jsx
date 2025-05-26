import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import { Provider as ReduxProvider } from "react-redux";
import { redux } from "./store/redux";
import './index.css';
import { Layout } from './components/layout';
import { Login } from './components/login';
import { LoginRedirect } from './components/login.redirect'
import { TestPage } from './components/testpage';
import { Trade } from './components/Trade'
import { UsedSell } from './components/UsedSell';
import UsedCreate from './components/UsedCreate';
import { UsedShare } from './components/UsedShare';

function Home() {
  return <p></p>;
}

function App() {

  return (
    <BrowserRouter>
      {/* 리덕스 사용 */}
      <ReduxProvider store={redux}>
        {/* Layout 컴포넌트 안에 <Routes> </Routes> 내용들이 */}
        <Layout>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path='/login' element={<Login />} />
            <Route path='/login/redirect' element={<LoginRedirect />} />
            <Route path='/test' element={<Home />} />
            <Route path='/trade' element={<Trade />} />
            <Route path='/거래/벼룩해요' element={<UsedSell />} />
            <Route path='/거래/드림해요' element={<UsedShare />} />
            <Route path='/거래/글작성' element={<UsedCreate />} />
          </Routes>
        </Layout>
      </ReduxProvider>
    </BrowserRouter>
  );
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  // <React.StrictMode>
  <App />
  // </React.StrictMode>
);

