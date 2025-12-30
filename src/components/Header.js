
import Nav from 'react-bootstrap/Nav';
import { Link } from 'react-router-dom';

function Header() {
  return (
    <Nav justify variant="tabs" defaultActiveKey="link-1">
      <Nav.Item>
        <Nav.Link as={Link} to="/" eventKey="link-1" >    Employes</Nav.Link>
      </Nav.Item>
      <Nav.Item>
        <Nav.Link as={Link} eventKey="link-2" to="/formations" >Formations</Nav.Link>
      </Nav.Item>
      <Nav.Item>
        <Nav.Link as={Link} eventKey="link-3" to="/participations">Participations</Nav.Link>
      </Nav.Item>
    </Nav>
  );
}

export default Header;