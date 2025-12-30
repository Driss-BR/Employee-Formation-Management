import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import { useMemo, useState } from "react";
import Form from "react-bootstrap/Form";
import InputGroup from "react-bootstrap/InputGroup";
import { useDispatch, useSelector } from "react-redux";
import { Spinner } from "react-bootstrap";
import {
  addParticipations,
  updateParticipations,
} from "../features/ParticipationSlice";
import { Flip, toast } from "react-toastify";
import { v4 as uuidv4 } from "uuid";

export default function DialogParticipations({ showModal, setShowModal }) {
  const frmDefault = {
    id: null,
    idform: "",
    idemp: "",
  };
  const { data, isAdd } = useSelector((state) => state.participations);
  const dispatch = useDispatch();
  const { employes } = useSelector((state) => state.employes);
  const { formations } = useSelector((state) => state.formations);
  const [participation, setParticipation] = useState(frmDefault);
  const [errors, setErrors] = useState({});

  useMemo(() => {
    if (showModal.id) {
      let emp = data.filter((d) => d.id === showModal.id)[0];
      setParticipation(emp);
    } else {
      setParticipation(frmDefault);
    }
  }, [showModal]);

  const handelClickAdd = () => {
    if (!validation()) {
      toast.error(
        "Veuillez remplir correctement tous les champs obligatoires !",
        {
          position: "top-center",
          theme: "light",
          transition: Flip,
          closeOnClick: true,
        }
      );
      return;
    }
    if (showModal.id) {
      let updateStatus = dispatch(updateParticipations(participation)).unwrap();
      toast.promise(updateStatus, {
        pending: "Mis à jour de la participation...",
        success: "Participation mise à jour avec succès !",
        error: "Erreur lors de mis à jour de la participation",
      });
    } else {
      if (participation.idemp !== "" && participation.idform !== "") {
        if (isExist(participation)) {
          toast.warning("le participation existe déjà.");
          return;
        }
        let addStatus = dispatch(
          addParticipations({ ...participation, id: uuidv4() })
        ).unwrap();
        toast.promise(addStatus, {
          pending: "Ajout de la participation...",
          success: "Participation ajouté avec succès  !",
          error: "Erreur lors de l’ajout de la participation",
        });
      } else {
        toast.warning("Veuillez remplir tous les champs !");
      }
    }
    setParticipation(frmDefault);
    setShowModal({ show: false, id: null });
  };

  const hadnelChange = (e) => {
    setParticipation((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const validation = () => {
    let tempErrors = {};
    if (participation.idform === "") {
      tempErrors.idform = "Formation is required";
    }
    if (participation.idemp === "") {
      tempErrors.idemp = "Employe is required";
    }

    setErrors(tempErrors);
    return Object.keys(tempErrors).length === 0;
  };

  const isExist = (part) => {
    console.log(part.idform )
    console.log(part.idemp)
    return data.some(
      (e) =>
        e.idform === part.idform &&
        e.idemp === part.idemp
    );
  };
  return (
    <Modal
      show={showModal.show}
      size="lg"
      aria-labelledby="contained-modal-title-vcenter"
      centered
    >
      <Modal.Header>
        <Modal.Title>titleModal</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <InputGroup size="lg">
          <InputGroup.Text>Formation : </InputGroup.Text>
          <Form.Select
            name="idform"
            value={participation.idform}
            onChange={hadnelChange}
            isInvalid={!!errors.idform}
          >
            <option value={-1}>Choisir une formation</option>

            {formations.map((f) => (
              <option key={f.id} value={f.id}>
                {f.sujet}
              </option>
            ))}
          </Form.Select>
          <Form.Control.Feedback type="invalid">
            {errors.idform}
          </Form.Control.Feedback>
        </InputGroup>

        <br />

        <InputGroup size="lg">
          <InputGroup.Text>Employe : </InputGroup.Text>
          <Form.Select
            name="idemp"
            value={participation.idemp}
            onChange={hadnelChange}
            isInvalid={!!errors.idemp}
          >
            <option value={-1}>Choisir un employé</option>
            {employes.map((e) => (
              <option key={e.id} value={e.id}>
                {e.nom}
              </option>
            ))}
          </Form.Select>
          <Form.Control.Feedback type="invalid">
            {errors.idemp}
          </Form.Control.Feedback>
        </InputGroup>
      </Modal.Body>
      <Modal.Footer>
        <Button onClick={() => setShowModal({ ...showModal, show: false })}>
          Close
        </Button>
        <Button onClick={() => handelClickAdd()}>
          Ajouter Participation
          {isAdd ? (
            <Spinner
              className="mx-2"
              size="sm"
              animation="border"
              variant="warning"
            />
          ) : null}
        </Button>
      </Modal.Footer>
    </Modal>
  );
}
