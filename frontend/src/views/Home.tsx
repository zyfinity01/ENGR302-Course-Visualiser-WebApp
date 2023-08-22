import React from 'react'
import { Container } from 'reactstrap'

const Home = () => (
  <div
    style={{
      flexGrow: 1,
      backgroundColor: 'white',
      color: 'black',
      width: '100vw',
    }}
  >
    <Container>
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <h2 className="text-left" style={{ margin: '0' }}>
            Degree:
          </h2>
          <select
            className="form-select"
            style={{ marginLeft: '10px', border: '2px solid black' }}
          >
            <option value="bsc">B.Sc.</option>
            <option value="ba">B.A.</option>
            {/* Add other options */}
          </select>
        </div>

        <div style={{ display: 'flex', alignItems: 'center' }}>
          <h2 className="text-center" style={{ margin: '0' }}>
            Completed Courses:
          </h2>
          <select
            className="form-select"
            style={{ marginLeft: '10px', border: '2px solid black' }}
          >
            <option value="course1">Course 1</option>
            <option value="course2">Course 2</option>
            {/* Add other options */}
          </select>
        </div>

        <button
          className="btn generate"
          style={{
            backgroundColor: 'white',
            color: 'black',
            border: '2px solid black',
            borderRadius: '8px',
            padding: '10px',
            marginRight: '20px',
          }}
        >
          Generate
        </button>
      </div>
    </Container>
  </div>
)

export default Home
