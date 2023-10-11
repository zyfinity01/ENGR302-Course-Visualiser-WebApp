import Graph, { Edge, Node } from '../components/Graph'
import { useEffect, useState } from 'react'
import {
  convertToReactFlowFormat,
  getLayoutedElements,
} from '../services/CourseToGraph'
import Search from '../components/Search'
import Tutorial from '../components/Tutorial'
import useFetchCourseData from '../hooks/useFetchGraphData'
import { Button, Checkbox, Chip } from '@material-tailwind/react'
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

  const [showEdges, setShowEdges] = useState(false)

  useEffect(() => updateGraphData(), [nodeEdgeData, selectedCourses, showEdges])

  /**
   * Format and update the graph data.
   *
   */
  const updateGraphData = () => {
    if (!nodeEdgeData) return
    const newNodes = nodeEdgeData.nodes.map((node: any) =>
      selectedCourses.has(node.course.id)
        ? { ...node, course: { ...node.course, status: CourseStatus.Selected } }
        : node
    )

    const { nodes, edges } = convertToReactFlowFormat({
      nodes: newNodes,
      edges: showEdges ? nodeEdgeData.edges : [],
    })
    setGraphData(getLayoutedElements(nodes, edges, 172, 36, 'LR'))
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
        if (selectedCourses.has(courseId!)) {
          handleNodeActions('remove', courseId)
        } else {
          setSelectedCourses((prevSet) => new Set(prevSet).add(courseId!))
        }
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

        <Checkbox
          crossOrigin=""
          color="blue"
          label={<div className="w-30">Links</div>}
          className="w-5"
          id="show-edges-checkbox"
          checked={showEdges}
          onChange={() => setShowEdges((prev) => !prev)}
        />

        <div className="flex w-full overflow-x-scroll items-center">
          {Array.from(selectedCourses).map((courseId) => (
            <Chip
              size="sm"
              className="rounded-full h-8 pl-5 mr-2"
              value={courseId}
              onClose={() => handleNodeActions('remove', courseId)}
            />
          ))}
        </div>

        <Button
          variant="outlined"
          className="ml-auto min-w-fit"
          id="generate-pathway-button"
          onClick={() => handleNodeActions('generate')}
        >
          Generate
        </Button>

        <Button variant="outlined" onClick={() => handleNodeActions('reset')}>
          Reset
        </Button>
      </div>

      {graphData && (
        <div
          className="w-full h-[calc(100vh-8rem)] min-w-fit"
          id="home-graph-container"
        >
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
