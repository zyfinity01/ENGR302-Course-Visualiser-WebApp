import { Select, Option, Button } from '@material-tailwind/react'

const Home = () => {
  const degrees = ['B.Sc.', 'B.A.']
  const completedCourses = ['Course 1', 'Course 2']

  return (
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
  )
}

export default Home
