import { Container } from 'reactstrap'
import { withAuthenticationRequired } from '@auth0/auth0-react'

import Loading from '../components/Loading'
import Importer from '../components/Importer'

export const AdminComponent = () => {
  return (
    <Container className="mb-5">
      <h1>Import Course Information</h1>
      <Importer />
    </Container>
  )
}

export default withAuthenticationRequired(AdminComponent, {
  onRedirecting: () => <Loading />,
})
