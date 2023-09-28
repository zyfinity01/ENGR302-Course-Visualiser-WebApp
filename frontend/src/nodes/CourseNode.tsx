import { Handle, Position } from "reactflow"
import { Course, CourseStatus } from "../models/course"
import { faWarning, faInfoCircle } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { Popover, PopoverContent, PopoverHandler, Tooltip, Typography } from "@material-tailwind/react"
import { memo } from "react"

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

export const CourseNode = memo(({ data: { label, course }, isConnectable }: { data: { label: string, course: Course }, isConnectable: boolean }) => {
    return (
        //div className="py-2 px-10 rounded z-0 max-w-50" style={statusToStyle(course.status)} id={course.id}
        <>
            {/* Left edge connection */}
            <Handle
                type="target"
                position={Position.Left}
                style={{ background: '#555' }}
                isConnectable={isConnectable}
            />

            <div className="w-40 p-3 rounded text-center" style={statusToStyle(course.status)}>
                {course.id}

                {/* <a href={`https://www.wgtn.ac.nz/courses/${course.id.replace(' ', '/')}`} target="_blank" className="pl-2"> */}
                <Tooltip
                    placement="bottom"
                    className="border border-blue-gray-50 bg-white px-4 py-3 shadow-xl shadow-black/10"
                    content={
                        <div className="w-80">
                            <Typography color="blue-gray" className="font-medium">
                                {course.name}
                            </Typography>
                            <Typography
                                variant="small"
                                color="blue-gray"
                                className="font-normal opacity-80"
                            >
                                {course.description}
                            </Typography>
                        </div>
                    }>
                        <FontAwesomeIcon icon={faInfoCircle} className="ml-2" />
                    </Tooltip>
                {/* </a> */}

                { course.status === CourseStatus.Ineligible && (
                    <Tooltip
                    placement="bottom"
                    className="border border-blue-gray-50 bg-white px-4 py-3 shadow-xl shadow-black/10"
                    content={
                        <div className="w-80">
                            <Typography color="blue-gray" className="font-medium">
                                Required Courses
                            </Typography>
                            <Typography
                                variant="small"
                                color="blue-gray"
                                className="font-normal opacity-80"
                            >
                                .... must be completed before taking this course
                            </Typography>
                        </div>
                    }>
                        <FontAwesomeIcon icon={faWarning} className="ml-2" />
                    </Tooltip>

                )}
                
            </div>

            {/* Right edge connection */}
            <Handle
                type="source"
                position={Position.Right}
                isConnectable={isConnectable}
            />
        </>
    );
});
