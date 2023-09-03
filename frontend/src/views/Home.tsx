import { Select, Option, Button } from '@material-tailwind/react'
import Graph from '../components/Graph'
import { useEffect, useMemo, useState } from 'react'
import CourseAPI from '../services/CourseAPI'
import CourseToGraph from '../services/CourseToGraph'

const Home = () => {
  const degrees = useMemo(() => ['B.Sc.', 'B.A.'], [])
  const completedCourses = useMemo(() => ['SWEN 301', 'ENGR 301'], [])

  const [graphData, setGraphData] = useState<any>(null)

  useEffect(() => {
    async function fetchData() {
      CourseAPI.getPathwayData(completedCourses)
        .then((data) => {
          const graphData = CourseToGraph.convertToReactFlowFormat(data)
          setGraphData(graphData)
        })
        .catch((error) => {
          console.log(error)
        })
    }

    fetchData()
  }, [completedCourses])

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
      <div className="w-full h-[calc(100vh-4rem)] sm:h-[calc(100vh-1rem)] md:h-[calc(100vh-8rem)] lg:h-[calc(100vh-16rem)]">
        <Graph initialEdges={initialEdges} initialNodes={initialNodes} />
      </div>
    </>
  )
}

export default Home
