import { useState } from 'react'
import { Link } from 'react-router-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

import {
  Collapse,
  Navbar,
  NavbarToggler,
  NavbarBrand,
  Nav,
  NavItem,
  NavLink,
  Button,
  UncontrolledDropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
  Container,
} from 'reactstrap'



const NavBar = () => {
  const [isOpen, setIsOpen] = useState(false)
  
  const toggle = () => setIsOpen(!isOpen)

  return (
    <div className="nav-container mb-4">
      <Navbar style={{ backgroundColor: '#004b34' }} light expand="md" container={false}>
        
        <Container>
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <img 
              src="/viclogo.png" 
              alt="test.png"
              style={{ maxWidth: '200px', height: 'auto', padding: '5px' }}
            />
            
          </div>
          <div style={{ textAlign: 'center', backgroundColor: '#004b34', color: 'white', flex: 4 }}>
            <h1>Course Visualiser</h1>
          </div>

          <NavbarToggler onClick={toggle} />

          <Collapse isOpen={isOpen} navbar>
            <Nav className="me-auto" navbar>
              {/* Links to go here */}
            </Nav>

            <Nav navbar>
              
            </Nav>
          </Collapse>
        </Container>
      </Navbar>
      
    </div>
  )
}

export default NavBar
