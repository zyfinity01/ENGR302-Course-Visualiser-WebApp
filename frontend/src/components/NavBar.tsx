import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Collapse, Navbar, NavbarToggler, Container } from 'reactstrap';
import { faFileExport } from '@fortawesome/free-solid-svg-icons';

const NavBar = () => {
  const [isOpen, setIsOpen] = useState(false);

  const toggle = () => setIsOpen(!isOpen);

  return (
    <div className="nav-container mb-4">
      <Navbar style={{ backgroundColor: '#004b34' }} light expand="md">
        <Container>
          <div className="d-flex justify-content-between align-items-center">
            <div className="flex-grow-0">
              <img src="/viclogo.png" alt="loading.svg" className="img-fluid" style={{ maxWidth: '150px' }} />
            </div>
            <h1 className="flex-grow-1 text-white p-1 text-center ml-8 offset-md-2" style={{ backgroundColor: 'black' }}>
              Course Visualiser
            </h1>
            <div className="flex-grow-1">
              <button className="text-white border-0 text-center offset-md-8" style={{ backgroundColor: '#004b34' }}>
                Export <FontAwesomeIcon icon={faFileExport} className="ml-2" />
              </button>
            </div>
          </div>
          <NavbarToggler onClick={toggle} />
          <Collapse isOpen={isOpen} navbar>
            {/* Nav content here */}
          </Collapse>
        </Container>
      </Navbar>
    </div>
  );
};

export default NavBar;
