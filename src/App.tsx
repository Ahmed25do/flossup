import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Home from './pages/Home';
import Shop from './pages/Shop';
import Chat from './pages/Chat';
import Education from './pages/Education';
import Social from './pages/Social';
import Account from './pages/Account';
import LabServices from './pages/LabServices';

function App() {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/shop" element={<Shop />} />
          <Route path="/chat" element={<Chat />} />
          <Route path="/education" element={<Education />} />
          <Route path="/social" element={<Social />} />
          <Route path="/lab-services" element={<LabServices />} />
          <Route path="/account" element={<Account />} />
        </Routes>
      </Layout>
    </Router>
  );
}

export default App;