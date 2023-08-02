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

import { useAuth0 } from '@auth0/auth0-react'

const NavBar = () => {
  const [isOpen, setIsOpen] = useState(false)
  const { user, isAuthenticated, loginWithRedirect, logout } = useAuth0()
  const toggle = () => setIsOpen(!isOpen)

  const logoutWithRedirect = () =>
    logout({
      logoutParams: {
        returnTo: window.location.origin,
      },
    })

  return (
    <div className="nav-container mb-4">
      <Navbar color="light" light expand="md" container={false}>
        <Container>
          <NavbarBrand href="/">Course Visualiser</NavbarBrand>
          <NavbarToggler onClick={toggle} />

          <Collapse isOpen={isOpen} navbar>
            <Nav className="me-auto" navbar>
              {/* Links to go here */}
            </Nav>

            <Nav navbar>
              {isAuthenticated && (
                <NavItem>
                  <NavLink tag={Link} to="admin">
                    Admin Panel
                  </NavLink>
                </NavItem>
              )}
              {!isAuthenticated ? (
                <NavItem>
                  <Button onClick={() => loginWithRedirect()}>
                    Admin Login
                  </Button>
                </NavItem>
              ) : (
                <UncontrolledDropdown nav inNavbar>
                  <DropdownToggle nav caret id="profileDropDown">
                    <img
                      src={user?.picture}
                      alt="Profile"
                      className="nav-user-profile rounded-circle"
                      width="25"
                    />
                  </DropdownToggle>
                  <DropdownMenu>
                    <DropdownItem header>{user?.name}</DropdownItem>
                    <DropdownItem onClick={() => logoutWithRedirect()}>
                      <FontAwesomeIcon icon="power-off" className="mr-3" />{' '}
                      Logout
                    </DropdownItem>
                  </DropdownMenu>
                </UncontrolledDropdown>
              )}
            </Nav>
          </Collapse>
        </Container>
      </Navbar>
    </div>
  )
}

export default NavBar
