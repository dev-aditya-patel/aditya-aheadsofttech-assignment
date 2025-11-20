import { StrictMode, } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Route, RouterProvider, Routes } from 'react-router'
import './index.css'
import 'bootstrap/dist/css/bootstrap.min.css';
import App from './App.jsx'
import FormsLoad from './pages/FormsLoad.jsx'
import AdminDashboard from './pages/admin/AdminDashboard.jsx'
import FormCreate from './pages/admin/FormCreate.jsx'
import FormEdit from './pages/admin/FormEdit.jsx';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route index element={<App />} />
        <Route path='admin'>
          <Route index element = { <AdminDashboard />}></Route>
          <Route path='form-create' element={<FormCreate />} />
          <Route path='form-edit/:id' element={<FormEdit />} />

        </Route>
        <Route path='form-load/:id' element={<FormsLoad />} />
      </Routes>
    </BrowserRouter>
  </StrictMode>
)
