import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import { useMemo, useState } from "react";
import Form from "react-bootstrap/Form";
import InputGroup from "react-bootstrap/InputGroup";
import { useDispatch, useSelector } from "react-redux";
import { Spinner } from "react-bootstrap";
import { updateFormations, addFormations } from "../features/FormationSlice";
import { Flip, toast } from "react-toastify";
import { v4 as uuidv4 } from "uuid";

export default function DialogFormations({ showModal, setShowModal }) {
  const frmDefault = {
    sujet: "",
    datedebut: "",
    datefin: "",
    etat: "programmée",
  };
  const { formations, isAdd } = useSelector((state) => state.formations);
  const dispatch = useDispatch();
  const [formation, setFormation] = useState(frmDefault);
  const [errors, setErrors] = useState([]);

  useMemo(() => {
    if (showModal.id) {
      let emp = formations.filter((d) => d.id === showModal.id)[0];
      setFormation(emp);
    } else {
      setFormation(frmDefault);
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
      let updateStatus = dispatch(updateFormations(formation)).unwrap();
      toast.promise(updateStatus, {
        pending: "Mis à jour de la formation...",
        success: "Formation mis à jour avec succès !",
        error: "Erreur lors de mis à jour de la formation",
      });
    } else {
      if (isExist(formation)) {
        toast.warning("la formation existe déjà.");
        return;
      }
      let addStatus = dispatch(
        addFormations({ ...formation, id: uuidv4() })
      ).unwrap();
      toast.promise(addStatus, {
        pending: "Ajout de la formation...",
        success: "Formation ajouté avec succès !",
        error: "Erreur lors de l’ajout de la formation",
      });
    }
    setFormation(frmDefault);
    setShowModal({ show: false, id: null });
  };

  const hadnelChange = (e) => {
    setFormation((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const validation = () => {
    let tempErrors = {};
    let startDate = formation.datedebut
      ? new Date(formation.datedebut).getTime()
      : "";
    let endDate = formation.datefin
      ? new Date(formation.datefin).getTime()
      : "";

    if (formation.sujet.trim() === "") {
      tempErrors.sujet = "Sujet is required";
    }
    if (formation.datedebut === "") {
      tempErrors.datedebut = "Date de début is required";
    }else if (formation.datefin === "") {
      tempErrors.datefin = "Date de fin is required";
    }else if (startDate > endDate) {
      tempErrors.datedebut =
        "La date de début doit être antérieure à la date de fin !!";
      tempErrors.datefin =
        "La date d'expiration doit être postérieure à la date de début !!";
    }
    setErrors(tempErrors);
    return Object.keys(tempErrors).length === 0;
  };

 const isExist = (form) => {

  return formations.some((e) => {
    const sujetMatch = e.sujet.trim().toLowerCase() === form.sujet.trim().toLowerCase();
    
    const startMatch = e.datedebut === form.datedebut;
    const endMatch = e.datefin === form.datefin;

    return sujetMatch && startMatch && endMatch;
  });
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
          <InputGroup.Text>Sujet : </InputGroup.Text>
          <Form.Control
            value={formation.sujet}
            onChange={hadnelChange}
            name="sujet"
            isInvalid={!!errors.sujet}
          />
          <Form.Control.Feedback type="invalid">
            {errors.sujet}
          </Form.Control.Feedback>
        </InputGroup>
        <br />

        <InputGroup size="lg">
          <InputGroup.Text> Date de début :</InputGroup.Text>
          <Form.Control
            value={formation.datedebut}
            onChange={hadnelChange}
            name="datedebut"
            type="date"
            min={new Date().toISOString().split("T")[0]}
            isInvalid={!!errors.datedebut}
          />
          <Form.Control.Feedback type="invalid">
            {errors.datedebut}
          </Form.Control.Feedback>
        </InputGroup>
        <br />

        <InputGroup size="lg">
          <InputGroup.Text>Date de fin :</InputGroup.Text>
          <Form.Control
            onChange={hadnelChange}
            name="datefin"
            type="date"
            required={true}
            value={formation.datefin}
            disabled={formation.datedebut ? false : true}
            min={formation.datedebut}
            isInvalid={!!errors.datefin}
          />
          <Form.Control.Feedback type="invalid">
            {errors.datefin}
          </Form.Control.Feedback>
        </InputGroup>

        <br />

        <InputGroup size="lg">
          <InputGroup.Text>Etat : </InputGroup.Text>
          <Form.Select
            disabled={formation.id ? false : true}
            name="etat"
            value={formation.etat}
            onChange={hadnelChange}
          >
            <option value="en cours">en cours</option>
            <option value="terminée">terminée</option>
            <option value="programmée">programmée</option>
          </Form.Select>
        </InputGroup>
      </Modal.Body>
      <Modal.Footer>
        <Button onClick={() => setShowModal({ ...showModal, show: false })}>
          Close
        </Button>
        <Button onClick={() => handelClickAdd()}>
          Ajouter Formation
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
