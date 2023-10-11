import Joyride, { CallBackProps, Step } from 'react-joyride'
import Cookies from 'js-cookie'
import { useEffect, useState } from 'react'

/**
 * How-to-use steps
 */
const tutorialSteps: Array<Step> = [
  {
    target: '#course-search-input',
    content: 'Find courses in the graph using the courses name such as ENGR302',
  },
  {
    target: '#home-graph-container',
    content: 'Select completed courses by clicking on course nodes',
  },
  {
    target: '#generate-pathway-button',
    content:
      "Once you've selected the completed courses, click here to see student pathway",
  },
  {
    target: '#export-graph-button',
    content:
      'Click here to export the graph that is currently within the viewport',
  },
]

interface TutorialProps {}

const Tutorial: React.FC<TutorialProps> = () => {
  const [runTutorial, setRunTutorial] = useState(false)

  useEffect(() => {
    // Run if not run before
    if (!Cookies.get('tutorialSeen')) {
      setRunTutorial(true)
    }
  }, [])

  const handleJoyrideCallback = ({ status }: CallBackProps) => {
    // Set run if the tutorial is finished or skipped
    if (['finished', 'skipped'].includes(status)) {
      Cookies.set('tutorialSeen', 'true')
      setRunTutorial(false)
    }
  }

  return (
    <Joyride
      steps={tutorialSteps}
      run={runTutorial}
      continuous={true}
      callback={handleJoyrideCallback}
    />
  )
}

export default Tutorial
