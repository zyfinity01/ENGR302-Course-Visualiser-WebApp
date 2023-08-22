import { Select, Option, Button } from '@material-tailwind/react'
import Graph, { Node, Edge } from '../components/Graph'

const Home = () => {
  const degrees = ['B.Sc.', 'B.A.']
  const completedCourses = ['Course 1', 'Course 2']

  const initialNodes: Node[] = [
    {
      id: '1',
      type: 'input',
      data: { label: 'COMP301' },
    },
    {
      id: '2',
      data: { label: 'CYBR371' },
    },
    {
      id: '3',
      data: { label: 'ENGR301' },
    },
    {
      id: '4',
      data: { label: 'ENGR302' },
    },
  ]

  const initialEdges: Edge[] = [
    {
      id: 'e3-2',
      source: '3',
      target: '4',
      type: 'smoothstep',
      animated: true,
    },
    { id: 'e1-3', source: '1', target: '3', type: 'smoothstep' },
  ]

  return (
    <>
      {/*Select Menu*/}
      <div className="flex flex-col space-y-2 md:space-y-0 md:flex-row md:space-x-2 pt-2 mx-5">
        {/* Degree Selector */}
        <Select label="Degree">
          {degrees.map((degree, index) => (
            <Option value={degree} key={index}>
              {degree}
            </Option>
          ))}
        </Select>

        {/* Completed Courses */}
        <Select label="Completed Courses">
          {completedCourses.map((degree, index) => (
            <Option value={degree} key={index}>
              {degree}
            </Option>
          ))}
        </Select>

        {/* Generate Button */}
        <Button
          size="md"
          variant="outlined"
          className="px-2 md:w-40 md:py-0 border border-blue-gray-300 text-blue-gray-600 font-semi overflow-none"
        >
          Generate
        </Button>
      </div>

      {/* Graph */}
      <div className="w-full h-[calc(100vh-8rem)]">
        <Graph initialEdges={initialEdges} initialNodes={initialNodes} />
      </div>
    </>
  )
}

export default Home
