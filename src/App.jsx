import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import ErrorBoundary from './components/ErrorBoundary';

import ChessOwnerEntry from './pages/ChessOwnerEntry';
import ChessPlayerEntry from './pages/ChessPlayerEntry';
import ChessDashboard from './pages/ChessDashboard';
import ChessViewerEntry from './pages/ChessViewerEntry';
import ChessViewerRoom from './pages/ChessViewerRoom';

function App() {
  return (
    <Router>
      <ErrorBoundary>
        <div className="App">
          <Routes>
            <Route path="/" element={<LandingPage />} />
            
            {/* Chess Routes */}
            <Route path="/chess-owner-entry" element={<ChessOwnerEntry />} />
            <Route path="/chess-player-entry" element={<ChessPlayerEntry />} />
            <Route path="/chess-dashboard" element={<ChessDashboard />} />
            <Route path="/chess-viewer-entry" element={<ChessViewerEntry />} />
            <Route path="/chess-viewer-room" element={<ChessViewerRoom />} />
          </Routes>
        </div>
      </ErrorBoundary>
    </Router>
  );
}

export default App;
