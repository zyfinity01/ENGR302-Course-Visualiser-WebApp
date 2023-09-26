import Graph, { Edge, Node } from '../components/Graph'
import { useEffect, useState } from 'react'
import {
  convertToReactFlowFormat,
  getLayoutedElements,
} from '../services/CourseToGraph'
import Search from '../components/Search'
import Tutorial from '../components/Tutorial'
import useFetchCourseData from '../hooks/useFetchGraphData'
import { Button, Chip } from '@material-tailwind/react'
import { CourseStatus } from '../models/course'
import { Viewport, useReactFlow } from 'reactflow'

const Home = () => {
  const [selectedCourses, setSelectedCourses] = useState<Set<string>>(new Set())
  const [graphData, setGraphData] = useState<
    { nodes: Node[]; edges: Edge[] } | undefined
  >(undefined)
  const [viewport, setViewport] = useState<Viewport | undefined>(undefined)

  const { nodeEdgeData, setCompletedCourses } = useFetchCourseData([])
  const reactFlowInstance = useReactFlow()

  useEffect(() => updateGraphData(), [nodeEdgeData, selectedCourses])

  /**
   * Format and update the graph data.
   *
   */
  const updateGraphData = () => {
    if (!nodeEdgeData) return
    const newNodes = nodeEdgeData.nodes.map((node: any) =>
      selectedCourses.has(node.id)
        ? { ...node, course: { ...node.course, status: CourseStatus.Selected } }
        : node
    )

    const nodes = convertToReactFlowFormat({
      nodes: newNodes,
      edges: nodeEdgeData.edges,
    })
    setGraphData(getLayoutedElements(nodes.nodes, nodes.edges, 172, 36, 'LR'))
  }

  /**
   * Handle actions on the node.
   *
   */
  const handleNodeActions = (action: string, courseId?: string) => {
    switch (action) {
      case 'search':
        if (!focusNode(courseId!)) alert('Course not found!')
        break
      case 'click':
        setViewport(reactFlowInstance.getViewport())
        setSelectedCourses((prevSet) => new Set(prevSet).add(courseId!))
        break
      case 'remove':
        setSelectedCourses((prevSet) => {
          const newSet = new Set(prevSet)
          newSet.delete(courseId!)
          return newSet
        })
        break
      case 'generate':
        setViewport(undefined)
        setCompletedCourses(Array.from(selectedCourses))
        break
      case 'reset':
        setViewport(undefined)
        setSelectedCourses(new Set())
        setCompletedCourses([])
        break
      default:
        console.warn(`Unhandled action type: ${action}`)
    }
  }

  /**
   * Set the viewport (zoom into) to the node.
   *
   * @param id id of the course
   * @returns success status
   */
  const focusNode = (id: string) => {
    const node = graphData?.nodes.find((n) => n.id === id)
    if (node) {
      reactFlowInstance?.fitView({ nodes: [node] })
      setViewport(reactFlowInstance.getViewport())
    }
    return !!node
  }

  const { nodes } = nodeEdgeData || {}

  return (
    <>
      <Tutorial />

      <div className="w-full p-1 border-b border-1 flex space-x-3">
        <Search
          onSearch={(course) => handleNodeActions('search', course)}
          choices={nodes?.map((node) => node.id)}
        />
        <div className="flex w-1/2 overflow-x-scroll items-center">
          {Array.from(selectedCourses).map((courseId) => (
            <Chip
              size="sm"
              className="rounded-full h-8"
              value={courseId}
              onClose={() => handleNodeActions('remove', courseId)}
            />
          ))}
        </div>
        <Button
          variant="outlined"
          className="ml-auto"
          onClick={() => handleNodeActions('generate')}
        >
          Generate
        </Button>
        <Button variant="outlined" onClick={() => handleNodeActions('reset')}>
          Reset
        </Button>
      </div>

      {graphData && (
        <div className="w-full h-[calc(100vh-8rem)]" id="home-graph-container">
          <Graph
            {...graphData}
            onNodeClick={(courseId) => handleNodeActions('click', courseId)}
            fitView={!viewport}
            defaultViewport={viewport}
            key={JSON.stringify(graphData)}
          />
        </div>
      )}
    </>
  )
}

export default Home
