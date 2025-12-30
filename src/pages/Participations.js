import { useSelector, useDispatch } from "react-redux";
import {
  deleteParticipations,
  selectFilteredParticipations,
} from "../features/ParticipationSlice";
import { useMemo, useState } from "react";
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
import Form from "react-bootstrap/Form";
import DialogParticipations from "../modals/DialogParticipations";
import { toast } from "react-toastify";
import Modal from "react-bootstrap/Modal";

export default function Formations() {
  const { data, loading, error, errorMessage } = useSelector(
    (state) => state.participations
  );
  const { employes } = useSelector((state) => state.employes);
  const { formations } = useSelector((state) => state.formations);
  const [activePage, setActivePage] = useState(1);
  const [showModal, setShowModal] = useState({ show: false, id: null });
  const [searchFormation, setSearchFormation] = useState(-1);
  const [searchEmploye, setSearchEmploye] = useState(-1);
  const [showConfirme, setShowConfirme] = useState({ show: false, id: null });

  const dispatch = useDispatch();

  //   ### filter and get details ======================================
  const filterParams = useMemo(
    () => ({
      searchFormation,
      searchEmploye,
    }),
    [searchFormation, searchEmploye]
  );

  const finalParticipations = useSelector((state) =>
    selectFilteredParticipations(state, filterParams)
  );

  const handelDeleteClick = (id) => {
    let deleteStatus = dispatch(deleteParticipations(id.toString())).unwrap();
    toast.promise(deleteStatus, {
      pending: "Suppression de la participation...",
      success: "Participation supprimée avec succès !",
      error: "Erreur lors de la suppression de la participation",
    });
    setShowConfirme({ show: false, id: null });
  };

  // logic of pagination ======================================
  let nbItemsVisible = 6;
  let nbPage = Math.ceil(finalParticipations.length / nbItemsVisible);
  let active = activePage > nbPage ? 1 : activePage;
  let startIndex = (active - 1) * nbItemsVisible;
  let endIndex = startIndex + nbItemsVisible;
  let visibleData = finalParticipations.slice(startIndex, endIndex);

  const showData = () => {
    if (loading) {
      return (
        <tr>
          <td colSpan={6}>
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
          <td colSpan={6} align="center">
            <XOctagon size={30} color="red" />
            &nbsp;&nbsp;&nbsp; {errorMessage}
          </td>
        </tr>
      );
    } else if (visibleData.length !== 0) {
      return visibleData.map((d, index) => (
        <tr key={startIndex + index + 1}>
          <td>{startIndex + index + 1}</td>
          <td>{d.employe}</td>
          <td>{d.formation}</td>
          <td>{d.datedebut}</td>
          <td>{d.datefin}</td>
          <td>
            <Button
              onClick={() => setShowConfirme({ show: true, id: d.id })}
              variant="outline-danger"
              className="mx-3"
            >
              Supprimer
            </Button>
            <Button
              onClick={() => setShowModal({ show: true, id: d.id })}
              variant="outline-success"
            >
              Mise à jour
            </Button>
          </td>
        </tr>
      ));
    }
    if (finalParticipations.length === 0) {
      return (
        <tr>
          <td colSpan={6} align="center">
            <ExclamationOctagon size={30} color="red" />
            &nbsp;&nbsp;&nbsp; Aucun donnée trouvée.
          </td>
        </tr>
      );
    }
  };

  return (
    <Container className="mt-5 pt-2">
      <DialogParticipations showModal={showModal} setShowModal={setShowModal} />
      <Alert
        variant="primary"
        className="p-3 d-flex align-items-center justify-content-between"
      >
        <h4>Participaions : {data.length}</h4>
        <div className="d-flex gap-3">
          <InputGroup size="md">
            <InputGroup.Text>Formation : </InputGroup.Text>
            <Form.Select
              value={searchFormation}
              onChange={(e) => setSearchFormation(e.target.value)}
            >
              <option value={-1}>Filtrer par formation</option>
              {formations.map((e) => (
                <option key={e.id} value={e.sujet}>
                  {e.sujet}
                </option>
              ))}
            </Form.Select>
          </InputGroup>

          <InputGroup size="md">
            <InputGroup.Text>Employe : </InputGroup.Text>
            <Form.Select
              value={searchEmploye}
              onChange={(e) => setSearchEmploye(e.target.value)}
            >
              <option value={-1}>Filtrer par employe</option>
              {employes.map((e) => (
                <option key={e.id} value={e.nom}>
                  {e.nom}
                </option>
              ))}
            </Form.Select>
          </InputGroup>
        </div>
        <Button
          onClick={() => setShowModal({ show: true, id: null })}
          variant="outline-dark"
        >
          ajouter participation
        </Button>
      </Alert>

      <Table striped hover variant="white">
        <thead>
          <tr>
            <th>#</th>
            <th>Employes</th>
            <th>Formations</th>
            <th>Date de début</th>
            <th>Date de fin</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>{showData()}</tbody>
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
          <Modal.Title>Delete participation</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Êtes-vous sûr de vouloir supprimer cet participation ?
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
