import { Handle, Position } from 'reactflow'
import { Course, CourseStatus } from '../models/course'
import { faInfoCircle } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { Tooltip, Typography } from '@material-tailwind/react'
import { memo } from 'react'

export function statusToStyle(status: CourseStatus): any {
  switch (status) {
    case CourseStatus.Eligible:
      return {
        background: '#58e260',
        color: '#fff',
      }
    case CourseStatus.Ineligible:
      return {
        background: '#ff4c23',
        color: '#fff',
      }
    case CourseStatus.Selected:
      return {
        background: '#FFF',
        borderColor: '#AED8E6',
        borderWidth: '3px',
      }
    case CourseStatus.None:
      return {
        background: '#FFF',
        borderWidth: '1px',
      }
  }
}

function getCourseUrl(course: Course): string {
  const subject = course.id.substring(0, 4)
  const code = course.id.substring(5, 9)

  return `https://www.wgtn.ac.nz/courses/${subject}/${code}`
}

export const CourseNode = memo(
  ({
    data: { course },
    isConnectable,
  }: {
    data: { label: string; course: Course }
    isConnectable: boolean
  }) => {
    return (
      <>
        {/* Left edge connection */}
        <Handle
          type="target"
          position={Position.Left}
          style={{ background: '#555' }}
          isConnectable={isConnectable}
        />

        <div
          className="w-40 p-3 rounded text-center"
          style={statusToStyle(course.status)}
        >
          {course.id}

          <Tooltip
            placement="bottom"
            className="border border-blue-gray-50 bg-white shadow-xl shadow-black/10"
            content={
              <div>
                <div className="w-80 bg-gray-100 px-2 py-2 rounded">
                  <Typography color="blue-gray" className="font-medium">
                    {course.id} - {course.name}
                  </Typography>
                  <Typography color="blue-gray" className="font-bold">
                    {course.points} points
                  </Typography>
                </div>
                <div className="w-80 mt-2">
                  <Typography
                    variant="small"
                    color="blue-gray"
                    className="font-normal opacity-80"
                  >
                    {course.description}
                  </Typography>
                </div>
                {course.requirements && course.requirements !== '' && (
                  <div className="w-80 mt-2">
                    <Typography
                      variant="small"
                      color="blue-gray"
                      className="italic opacity-80"
                    >
                      {course.requirements}
                    </Typography>
                  </div>
                )}
              </div>
            }
          >
            <a
              href={getCourseUrl(course)}
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => {
                e.stopPropagation()
              }}
            >
              <FontAwesomeIcon icon={faInfoCircle} className="ml-2" />
            </a>
          </Tooltip>
        </div>

        <Handle
          type="source"
          position={Position.Bottom}
          isConnectable={isConnectable}
        />
        <Handle
          type="source"
          position={Position.Top}
          isConnectable={isConnectable}
        />
        <Handle
          type="source"
          position={Position.Left}
          isConnectable={isConnectable}
        />
        <Handle
          type="source"
          position={Position.Right}
          isConnectable={isConnectable}
        />
      </>
    )
  }
)
