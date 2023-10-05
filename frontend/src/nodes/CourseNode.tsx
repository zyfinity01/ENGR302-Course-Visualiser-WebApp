import { Handle, Position } from 'reactflow'
import { Course, CourseStatus } from '../models/course'
import { faWarning, faInfoCircle } from '@fortawesome/free-solid-svg-icons'
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

export const CourseNode = memo(
  ({
    data: { label, course },
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
            className="border border-blue-gray-50 bg-white px-4 py-3 shadow-xl shadow-black/10"
            content={
              <div className="w-80">
                <Typography color="blue-gray" className="font-medium">
                  {course.name}
                </Typography>
                <Typography color="blue-gray" className="font-bold">
                  {course.points} points
                </Typography>
                <Typography
                  variant="small"
                  color="blue-gray"
                  className="font-normal opacity-80"
                >
                  {course.description}
                </Typography>
              </div>
            }
          >
            <FontAwesomeIcon icon={faInfoCircle} className="ml-2" />
          </Tooltip>
        </div>

        {/* Right edge connection */}
        <Handle
          type="source"
          position={Position.Right}
          isConnectable={isConnectable}
        />
      </>
    )
  }
)
