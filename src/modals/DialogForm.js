import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import { useMemo, useState } from "react";
import Form from "react-bootstrap/Form";
import InputGroup from "react-bootstrap/InputGroup";
import { useDispatch, useSelector } from "react-redux";
import { addEmployes, updateEmployes } from "../features/EmployesSlice";
import { Flip, toast } from "react-toastify";
import { v4 as uuidv4 } from "uuid";
export default function DialogForm({ showModal, setShowModal }) {
  const EmpDefault = {
    nom: "",
    grade: "",
    salaire: null,
    sexe: "",
  };
  const { employes } = useSelector((state) => state.employes);
  const dispatch = useDispatch();
  const [employe, setEmploye] = useState(EmpDefault);
  const [errors, setErrors] = useState(false);

  useMemo(() => {
    if (showModal.id) {
      let emp = employes.filter((d) => d.id === showModal.id)[0];
      setEmploye(emp);
    } else {
      setEmploye(EmpDefault);
    }
  }, [showModal]);

  const handelClickAdd = () => {
    if (!validation()) {
      toast.error(
        "Veuillez remplir correctement tous les champs obligatoires !",
        {
          position: "top-center",
          autoClose: 3000,
          theme: "light",
          transition: Flip,
          closeOnClick: true,
        }
      );
      return;
    }

    if (showModal.id) {
      let updateStatu = dispatch(updateEmployes(employe)).unwrap();
      toast.promise(updateStatu, {
        pending: "Mise à jour de l’employé…",
        success: "Employé mis à jour avec succès !",
        error: "Erreur lors de la mise à jour de l’employé",
      });
    } else {
      if (isExist(employe)) {
        toast.warning("L'employé existe déjà.");
        return
      } 
        let addStatus = dispatch(
          addEmployes({ ...employe, id: uuidv4() })
        ).unwrap();
        toast.promise(addStatus, {
          pending: "Ajout de l’employé…",
          success: "Employé ajouté avec succès !",
          error: "Erreur lors de l’ajout de l’employé",
        });
      
    }
    setShowModal({ show: false, id: null });
    setEmploye(EmpDefault);
  };

  const hadnelChange = (e) => {
    setEmploye((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const validation = () => {
    let tempErrors = {};
    if (employe.nom === "") tempErrors.nom = "Le nom est obligatoire !";
    if (employe.grade === "") tempErrors.grade = "Le grade est obligatoire !";
    if (employe.salaire === null || isNaN(employe.salaire))
      tempErrors.salaire =
        "Le salaire est obligatoire et doit être un nombre valide !";
    if (employe.sexe === "") tempErrors.sexe = "Le sexe est obligatoire !";
    setErrors(tempErrors);
    return Object.keys(tempErrors).length === 0;
  };

  const isExist = (emp) => {
    let check = employes.some(
      (e) =>
        e.nom.trim() === emp.nom.trim() &&
        e.grade.trim() === emp.grade.trim() &&
        Number(e.salaire) === Number(emp.salaire)
    );

    return check;
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
          <InputGroup.Text>Nom : </InputGroup.Text>
          <Form.Control
            value={employe.nom}
            onChange={hadnelChange}
            name="nom"
            isInvalid={!!errors.nom}
          />
          <Form.Control.Feedback type="invalid">
            {errors.nom}
          </Form.Control.Feedback>
        </InputGroup>

        <br />

        <InputGroup size="lg">
          <InputGroup.Text>Grade :</InputGroup.Text>
          <Form.Control
            value={employe.grade}
            onChange={hadnelChange}
            name="grade"
            isInvalid={!!errors.grade}
          />
          <Form.Control.Feedback type="invalid">
            {errors.grade}
          </Form.Control.Feedback>
        </InputGroup>

        <br />
        <InputGroup size="lg">
          <InputGroup.Text>Sexe : </InputGroup.Text>
          <Form.Select
            isInvalid={!!errors.sexe}
            name="sexe"
            value={employe.sexe}
            onChange={hadnelChange}
          >
            <option value={""}>choisir le sexe</option>
            <option value="f">female</option>
            <option value="m">male</option>
          </Form.Select>

          <Form.Control.Feedback type="invalid">
            {errors.sexe}
          </Form.Control.Feedback>
        </InputGroup>

        <br />

        <InputGroup size="lg">
          <InputGroup.Text>Salaire :</InputGroup.Text>
          <Form.Control
            value={employe.salaire}
            onChange={hadnelChange}
            name="salaire"
            type="number"
            isInvalid={!!errors.salaire}
          />
          <Form.Control.Feedback type="invalid">
            {errors.salaire}
          </Form.Control.Feedback>
        </InputGroup>
      </Modal.Body>
      <Modal.Footer>
        <Button
          onClick={() => {
            setShowModal({ show: false, id: null });
            setErrors([]);
          }}
        >
          Close
        </Button>
        <Button onClick={() => handelClickAdd()}>Ajouter Employe</Button>
      </Modal.Footer>
    </Modal>
  );
}
