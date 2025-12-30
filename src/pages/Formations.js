import { useSelector, useDispatch } from "react-redux";
import { useEffect, useMemo, useState } from "react";
import {
  Alert,
  Button,
  Container,
  InputGroup,
  Spinner,
  Table,
} from "react-bootstrap";
import { ExclamationOctagon, XOctagon } from "react-bootstrap-icons";
import TablePagination from "../components/TablePagination";
import DialogFormations from "../modals/DialogFormations";
import Form from "react-bootstrap/Form";
import { Link, useParams } from "react-router-dom";
import { Flip, toast } from "react-toastify";
import Modal from "react-bootstrap/Modal";

// redux ==============
import {

  deleteFormations,
  filterFormationsByIdEmpAndDateAndEtat,
} from "../features/FormationSlice";
import {
  deleteParticipations,
} from "../features/ParticipationSlice";

export default function Formations() {
  const { formations, loading, error, errorMessage } = useSelector(
    (state) => state.formations
  );
  const { data: participations } = useSelector((state) => state.participations);
  const { employes } = useSelector((state) => state.employes);
  const [activePage, setActivePage] = useState(1);
  const [showModal, setShowModal] = useState({ show: false, id: null });
  const [searchEtat, setSearchEtat] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const dispatch = useDispatch();
  const { idEmp } = useParams();
  const [showConfirme, setShowConfirme] = useState({ show: false, id: null });

  // get employe name when idEm !== undefined 
  const empName = useMemo(() => {
    if (idEmp === undefined) return "";
    let emp = employes.find((e) => e.id.toString() === idEmp.toString());
    return emp ? emp.nom : "";
  }, [idEmp, employes]);

  
  // filtrations by idEmp and date and etat ======================================
  let searchParams = {
    idEmp: idEmp,
    searchEtat: searchEtat,
    startDate: startDate,
    endDate: endDate,
  };

  let filterByDate = useSelector((state) =>
    filterFormationsByIdEmpAndDateAndEtat(state, searchParams)
  );

  useEffect(() => {
    if (!!startDate && !!endDate && startDate > endDate) {
      toast.error("La date de début doit être inférieure à la date de fin.", {
        position: "top-center",
        theme: "light",
        transition: Flip,
      });
      setEndDate("");
      setStartDate("");
    }
  }, [startDate, endDate]);

  // ### filtrations by idEmp and date and etat ======================================

  // delete Formations and all prtisipations

  const handelDeleteClick = (id) => {
    try {
      let partToDelete = participations
        .filter((p) => p.idform.toString() === id.toString())
        .map((ele) => dispatch(deleteParticipations(ele.id)).unwrap());
      let deleteFrom = dispatch(deleteFormations(id)).unwrap();

      let allPromises = Promise.all([...partToDelete, deleteFrom]);

      toast.promise(allPromises, {
        pending: "Suppression de la formation…",
        success: "Formation supprimée avec succès !",
        error: "Erreur lors de la suppression de la formation",
      });

      setShowConfirme({ show: false, id: null });
    } catch (e) {
      console.log("error : " + e);
    }

    setShowConfirme({ show: false, id: null });
  };

  // logic of pagination ======================================
  let nbItemsVisible = 6;
  let nbPage = Math.ceil(filterByDate.length / nbItemsVisible);
  let active = activePage > nbPage ? 1 : activePage;
  let startIndex = (active - 1) * nbItemsVisible;
  let endIndex = startIndex + nbItemsVisible;
  let visibleformations = filterByDate.slice(startIndex, endIndex);
  // ### Logic of pagination ======================================

  // show the list of employes or get error =======================================
  const showformations = () => {
    if (loading) {
      return (
        <tr>
          <td colSpan={7}>
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                padding: "15px 0",
              }}
            >
              <Spinner animation="border" variant="warning" />
            </div>
          </td>
        </tr>
      );
    } else if (error) {
      return (
        <tr>
          <td colSpan={7} align="center">
            <XOctagon size={30} color="red" />
            &nbsp;&nbsp;&nbsp; {errorMessage}
          </td>
        </tr>
      );
    } else if (visibleformations.length === 0) {
      return (
        <tr>
          <td colSpan={7} align="center">
            <ExclamationOctagon size={30} color="red" />
            &nbsp;&nbsp;&nbsp; Aucun donnée trouvée.
          </td>
        </tr>
      );
    } else {
      return visibleformations.map((d, index) => (
        <tr key={startIndex + index + 1}>
          <td>{startIndex + index + 1}</td>
          <td>{d.sujet}</td>
          <td>{d.datedebut}</td>
          <td>{d.datefin}</td>
          <td>{d.etat}</td>
          <td>
            {
              participations.filter(
                (p) => p.idform.toString() === d.id.toString()
              ).length
            }
          </td>
          <td>
            <Button
              onClick={() => setShowConfirme({ show: true, id: d.id })}
              variant="outline-danger"
            >
              Supprimer
            </Button>
            <Button
              className="mx-3"
              onClick={() => setShowModal({ show: true, id: d.id })}
              variant="outline-success"
            >
              Mise à jour
            </Button>
            <Link to={"/employes/" + d.id}>
              <Button variant="outline-warning">Participants</Button>
            </Link>
          </td>
        </tr>
      ));
    }
  };
  // ### show the list of employes or get error =======================================

  return (
    <Container className="mt-5 pt-2">
      <DialogFormations showModal={showModal} setShowModal={setShowModal} />
      <Alert
        variant="primary"
        className="p-3 d-flex align-items-center justify-content-between"
      >
        {empName !== "" ? <h5>Employe : {empName}</h5> : ""}
        <h5>
          Formations : {idEmp ? visibleformations.length : formations.length}
        </h5>
        <div className="d-flex gap-3">
          <InputGroup>
            <InputGroup.Text id="basic-addon1">Du</InputGroup.Text>
            <Form.Control
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              min={"2025-01-01"}
            />
          </InputGroup>

          <InputGroup>
            <InputGroup.Text id="basic-addon1">Au</InputGroup.Text>
            <Form.Control
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              min={startDate}
            />
          </InputGroup>

          <InputGroup size="md">
            <InputGroup.Text>Etat</InputGroup.Text>
            <Form.Select
              name="etat"
              value={searchEtat}
              onChange={(e) => setSearchEtat(e.target.value)}
            >
              <option value={""}>Tous</option>
              <option value="en cours">en cours</option>
              <option value="terminée">terminée</option>
              <option value="programmée">programmée</option>
            </Form.Select>
          </InputGroup>
        </div>

        <div className="align-items-center g-3 justify-content-between">
          <div className="">
            <Button
              onClick={() => setShowModal({ show: true, id: null })}
              variant="outline-dark"
            >
              ajouter formation
            </Button>
          </div>
        </div>
      </Alert>

      <Table className="" striped hover variant="white">
        <thead>
          <tr>
            <th>#</th>
            <th>Sujet</th>
            <th>Date de début</th>
            <th>Date de fin</th>
            <th>Etat</th>
            <th>N° Participants</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>{showformations()}</tbody>
      </Table>

      <TablePagination
        nbPage={nbPage}
        active={active}
        setActive={setActivePage}
      />

      <Modal
        show={showConfirme.show}
        onHide={() => setShowConfirme({ show: false, id: null })}
        backdrop="static"
        keyboard={false}
      >
        <Modal.Header closeButton>
          <Modal.Title>
            Delete formation :{" "}
            {formations.find((f) => f.id === showConfirme.id)?.sujet}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          La suppression de cette formation entraînera la suppression de toutes
          les participations associées !!.
        </Modal.Body>
        <Modal.Footer>
          <Button
            variant="secondary"
            onClick={() => setShowConfirme({ show: false, id: null })}
          >
            No
          </Button>
          <Button
            variant="primary"
            onClick={() => handelDeleteClick(showConfirme.id)}
          >
            Supprimer
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
}
