import { useState } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { Collapse, Navbar, NavbarToggler, Container } from 'reactstrap'

const NavBar = () => {
  const [isOpen, setIsOpen] = useState(false)

  const toggle = () => setIsOpen(!isOpen)

  return (
    <div className="nav-container mb-4">
      <Navbar
        style={{ backgroundColor: '#004b34' }}
        light
        expand="md"
        container={false}
      >
        <Container>
          <div
            style={{
              display: 'inline-flex',
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
              whiteSpace: 'nowrap',
            }}
          >
            <div
              style={{
                flex: '1',
                textAlign: 'left',
                paddingLeft: '5%',
                paddingRight: '45%',
              }}
            >
              <img
                src="/viclogo.png"
                alt="loading.svg"
                style={{
                  minWidth: '50px',
                  maxWidth: '200px',
                  height: 'auto',
                  padding: '5px',
                }}
              />
            </div>
            <h1
              style={{
                backgroundColor: '#004b34',
                color: 'white',
                margin: '0',
                padding: '10px',
                flex: '1',
                display: 'inline-block',
              }}
            >
              Course Visualiser
            </h1>
            <div
              style={{
                flex: '1',
                textAlign: 'right',
                paddingRight: '0px',
                paddingLeft: '50%',
              }}
            >
              <button
                style={{
                  backgroundColor: '#004b34',
                  color: 'white',
                  border: 'none',
                  padding: '0px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'flex-end',
                }}
              >
                Export
                <img
                  src="/exportSave.png"
                  alt="loading.svg"
                  style={{
                    maxWidth: '50px',
                    height: 'auto',
                    padding: '5px',
                    alignItems: 'right',
                  }}
                />
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
  )
}

export default NavBar
