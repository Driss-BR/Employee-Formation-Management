import { Route, Routes } from "react-router-dom";
import Header from "./components/Header";
import Employes from "./pages/Employes";
import Formations from "./pages/Formations";
import Participations from "./pages/Participations";
import { ToastContainer } from "react-toastify";
import { useDispatch } from "react-redux";
import { fetchFormations } from "./features/FormationSlice";
import { fetchParticipations } from "./features/ParticipationSlice";
import { fetchEmployes } from "./features/EmployesSlice";
import { useEffect } from "react";

function App() {
  const dispatch = useDispatch()
    useEffect(() => {
      dispatch(fetchFormations());
      dispatch(fetchParticipations());
      dispatch(fetchEmployes());
    }, [dispatch]);
  return (
    <div className="App">
      <ToastContainer
        position="top-right"
        autoClose={3000}
        theme="colored"
      />
      <Header />

      <Routes>
        <Route index element={<Employes />} />

        <Route path="/formations" element={<Formations />} />
        <Route path="/formations/:idEmp" element={<Formations />} />

        <Route path="/employes/:idFrm" element={<Employes />} />

        <Route path="/participations" element={<Participations />} />
      </Routes>
    </div>
  );
}

export default App;
