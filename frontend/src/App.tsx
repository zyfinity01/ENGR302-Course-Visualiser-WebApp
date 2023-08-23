import { toPng } from 'html-to-image';
import NavBar from './components/NavBar';
import { Routes, Route } from 'react-router-dom';
import Home from './views/Home'; // Import Home component

function MainComponent() {
  const handleExport = () => {
    const container = document.getElementById('react-flow-container');
    if (container) {
      toPng(container)
        .then((dataUrl) => {
          const link = document.createElement('a');
          link.download = 'graph.png';
          link.href = dataUrl;
          link.click();
        })
        .catch((err) => {
          console.error('Export failed:', err);
        });
    }
  };

  return (
    <div>
      <NavBar onExportClick={handleExport} />
      <Home onExportClick={handleExport} />
    </div>
  );
}

const App = () => {
  return (
    <Routes>
      <Route path="/" element={<MainComponent />} />
    </Routes>
  );
};

export default App;
