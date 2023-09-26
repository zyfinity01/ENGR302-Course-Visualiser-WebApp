import Graph, { Edge, NonPositionalNode } from '../components/Graph'
import { useEffect, useState } from 'react'
import { convertToReactFlowFormat } from '../services/CourseToGraph'
import Search from '../components/Search'
import Tutorial from '../components/Tutorial'
import useFetchCourseData from '../hooks/useFetchGraphData'

const Home = () => {
  const [completedCourses, setCompletedCourses] = useState<string[]>([])
  const [graphData, setGraphData] = useState<
    { nodes: NonPositionalNode[]; edges: Edge[] } | undefined
  >(undefined)
  let focusNodeFunction: (id: string) => boolean = () => false

  const { nodeEdgeData } = useFetchCourseData(completedCourses)

  useEffect(() => {
    if (!nodeEdgeData) return
    setGraphData(convertToReactFlowFormat(nodeEdgeData))
  }, [nodeEdgeData])

  const handleSearch = (course: string) => {
    const found = focusNodeFunction(course)
    if (!found) {
      alert('Course not found!')
    }
  }

  return (
    <>
      <Tutorial />

      <div className="w-full p-1 border-b border-1">
        <Search
          onSearch={handleSearch}
          choices={nodeEdgeData?.nodes.map((node) => node.id)}
        />
      </div>

      {/* Graph */}
      {graphData && (
        <div className="w-full h-[calc(100vh-8rem)]" id="home-graph-container">
          <Graph
            initialEdges={graphData.edges}
            initialNodes={graphData.nodes}
            focusNodeRef={(fn) => {
              focusNodeFunction = fn
            }}
          />
        </div>
      )}
    </>
  )
}

export default Home
