import { useSelector, useDispatch } from "react-redux";
import {
  deleteEmployes,
  selectEmployeesByFormationAndName,
} from "../features/EmployesSlice";
import {  useState } from "react";
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
import DialogForm from "../modals/DialogForm";
import Form from "react-bootstrap/Form";
import { Link, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import Modal from "react-bootstrap/Modal";

export default function Employes() {
  const { employes, loading, error, errorMessage } = useSelector(
    (state) => state.employes
  );
  const { data } = useSelector((state) => state.participations);
  const [activePage, setActivePage] = useState(1);
  const [showModal, setShowModal] = useState({ show: false, id: null });
  const [searchName, setSearchName] = useState("");
  const dispatch = useDispatch();
  const { idFrm } = useParams();
  const [showConfirme, setShowConfirme] = useState({ show: false, id: null });

  //  search by IdForm And Name ======================================
  let searchParams = {
    idFrm: idFrm,
    searchName: searchName,
  };

  const searchByIdFormAndName = useSelector((state) =>
    selectEmployeesByFormationAndName(state, searchParams)
  );

  const handelDeleteClick = (id) => {
    let check = data.some((part) => part.idemp.toString() === id.toString());
    setShowConfirme({ show: false, id: null });

    if (check) {
      toast.error(
        "Impossible de supprimer cet employé car il a des participations !",
        {
          position: "top-center",
          theme: "colored",
        }
      );
      return;
    }

    let deleteStatu = dispatch(deleteEmployes(id.toString())).unwrap();
    toast.promise(deleteStatu, {
      pending: "Suppression de l’employé…",
      success: "Employé supprimé avec succès !",
      error: "Erreur lors de la suppression de l’employé",
    });
  };

  // logic of pagination ======================================
  let nbItemsVisible = 6;
  let nbPage = Math.ceil(searchByIdFormAndName.length / nbItemsVisible);
  let active = activePage > nbPage ? 1 : activePage;
  let startIndex = (active - 1) * nbItemsVisible;
  let endIndex = startIndex + nbItemsVisible;
  let visibleemployes = searchByIdFormAndName.slice(startIndex, endIndex);
  // ### Logic of pagination ======================================

  // show the list of employes or get error =======================================
  const showemployes = () => {
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
    } else if (
      visibleemployes.length === 0 &&
      searchByIdFormAndName.length === 0
    ) {
      return (
        <tr>
          <td colSpan={7} align="center">
            <ExclamationOctagon size={30} color="red" />
            &nbsp;&nbsp;&nbsp; Aucun donnée trouvée.
          </td>
        </tr>
      );
    } else {
      return visibleemployes.map((d, index) => (
        <tr key={startIndex + index + 1}>
          <td>{startIndex + index + 1}</td>
          <td>{d.nom}</td>
          <td>{d.grade}</td>
          <td>
            {d.sexe === "f" ? "Female" : d.sexe === "m" ? "Male" : "----"}
          </td>
          <td>{d.salaire}</td>
          <td>
            {
              data.filter((part) => part.idemp.toString() === d.id.toString())
                .length
            }
          </td>
          <td>
            <Button
              onClick={() => setShowConfirme({ show: true, id: d.id })}
              variant="outline-danger"
            >
              supprimer
            </Button>

            <Button
              onClick={() => setShowModal({ show: true, id: d.id })}
              variant="outline-success"
              className="mx-3"
            >
              Mise à jour
            </Button>

            <Link to={"/formations/" + d.id}>
              <Button variant="outline-warning">Formations</Button>
            </Link>
          </td>
        </tr>
      ));
    }
  };
  // ### show the list of employes or get error =======================================

  return (
    <Container className="mt-5 pt-2">
      <DialogForm showModal={showModal} setShowModal={setShowModal} />
      <Alert
        variant="primary"
        className="p-3 d-flex align-items-center justify-content-between"
      >
        <h5>Employes : {idFrm ? visibleemployes.length : employes.length}</h5>
        <div className="w-50">
          <InputGroup>
            <InputGroup.Text>Recherche par nom</InputGroup.Text>
            <Form.Control
              value={searchName}
              onChange={(e) => setSearchName(e.target.value)}
            />
          </InputGroup>
        </div>
        <Button
          onClick={() => setShowModal({ show: true, id: null })}
          variant="outline-dark"
        >
          ajouter employe
        </Button>
      </Alert>
      <Table className="w-100 text-center" striped hover variant="white">
        <thead>
          <tr>
            <th className="col-1 ">#</th>
            <th className="col-1 ">Nom</th>
            <th className="col-1 ">Grade</th>
            <th className="col-1 ">Sexe</th>
            <th className="col-1 ">Salaire</th>
            <th className="col-1 ">N° Participations</th>
            <th className="col-3 ">Action</th>
          </tr>
        </thead>
        <tbody>{showemployes()}</tbody>
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
            Delete employe :{" "}
            {employes.find((e) => e.id === showConfirme.id)?.nom}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>Êtes-vous sûr d'avoir supprimé cet employé ?</Modal.Body>
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
