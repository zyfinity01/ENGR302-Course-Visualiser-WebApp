import { useState } from 'react'
import { useAuth0 } from '@auth0/auth0-react'
import { Button, Form, Input } from 'reactstrap'

const Importer = () => {
  const [file, setFile] = useState(null)
  const { getAccessTokenSilently } = useAuth0()

  /**
   * Set file reference to file selected in input
   */
  const handleFileChange = (event: any /* fix me */) => {
    setFile(event.target.files[0])
  }

  /**
   * On submit handler
   */
  const handleSubmit = async (event: any /* fix me */) => {
    event.preventDefault()

    // Check file has been selected
    if (!file) {
      console.log('No file selected')
      return
    }

    // Create form data
    const formData = new FormData()
    formData.append('file', file)

    // Get authentication token
    const token = await getAccessTokenSilently({
      authorizationParams: {
        audience: process.env.REACT_APP_AUTH_AUDIENCE,
        /* scope: "write:courses" */
      },
    })

    // Upload
    upload(formData, token)
      .then
      // todo: success message
      ()
      .catch
      // todo: fail message
      ()
  }

  /**
   * Upload CSV to API
   */
  const upload = async (data: FormData, token: string) => {
    const res = await fetch('http://localhost:8080/api/import/csv', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: data,
    })

    if (res.ok) {
      return res
    }

    throw new Error('Something went wrong')
  }

  return (
    <Form onSubmit={handleSubmit}>
      <Input type="file" onChange={handleFileChange} />
      <Button type="submit">Submit</Button>
    </Form>
  )
}

export default Importer
