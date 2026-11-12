import { Navigate, Route, Routes } from 'react-router-dom';
import Layout from './components/layout/Layout';
import ProtectedRoute from './routes/ProtectedRoute';
import Login from './pages/Login';
import Landing from './pages/Landing';
import Dashboard from './pages/Dashboard';
import UsersList from './pages/UsersList';
import Results from './pages/Results';
import LaboratorioHub from './pages/LaboratorioHub';
import Recursos from './pages/Recursos';
import Exam from './pages/Exam';
import Sesiones from './pages/Sesiones';
import Foro from './pages/Foro';
import Evidencias from './pages/Evidencias';
import Introduccion from './pages/simulations/Introduccion';
import Vista from './pages/simulations/Vista';
import Oido from './pages/simulations/Oido';
import OlfatoGusto from './pages/simulations/OlfatoGusto';
import Tacto from './pages/simulations/Tacto';
import IntegracionSensorial from './pages/simulations/IntegracionSensorial';

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />

      <Route element={<ProtectedRoute />}>
        <Route element={<Layout />}>
          <Route path="/landing" element={<Landing />} />
          <Route path="/sesiones" element={<Sesiones />} />
          <Route path="/foro/:session" element={<Foro />} />
          <Route path="/evidencias" element={<Evidencias />} />
          <Route path="/resultados" element={<Results />} />
          <Route path="/laboratorio" element={<LaboratorioHub />} />
          <Route path="/laboratorio/introduccion" element={<Introduccion />} />
          <Route path="/laboratorio/vista" element={<Vista />} />
          <Route path="/laboratorio/oido" element={<Oido />} />
          <Route path="/laboratorio/olfato-gusto" element={<OlfatoGusto />} />
          <Route path="/laboratorio/tacto" element={<Tacto />} />
          <Route path="/laboratorio/integracion-sensorial" element={<IntegracionSensorial />} />
          <Route path="/laboratorio/:id/evaluacion" element={<Exam />} />
          <Route path="/pretest" element={<Exam examId="pretest" />} />
          <Route path="/postest" element={<Exam examId="postest" />} />
          <Route path="/recursos" element={<Recursos />} />

          <Route element={<ProtectedRoute adminOnly />}>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/usuarios" element={<UsersList />} />
          </Route>
        </Route>
      </Route>

      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
}

