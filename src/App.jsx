import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import ErrorBoundary from './components/ErrorBoundary';

import ChessOwnerEntry from './pages/ChessOwnerEntry';
import ChessPlayerEntry from './pages/ChessPlayerEntry';
import ChessDashboard from './pages/ChessDashboard';
import ChessViewerEntry from './pages/ChessViewerEntry';
import ChessViewerRoom from './pages/ChessViewerRoom';
import ProfilePage from './pages/ProfilePage';

function App() {
  return (
    <Router>
      <ErrorBoundary>
        <div className="App">
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/profile" element={<ProfilePage />} />
            
            {/* Chess Routes */}
            <Route path="/chess-owner-entry" element={<ChessOwnerEntry />} />
            <Route path="/chess-player-entry" element={<ChessPlayerEntry />} />
            <Route path="/chess-dashboard" element={<ChessDashboard />} />
            <Route path="/chess-viewer-entry" element={<ChessViewerEntry />} />
            <Route path="/chess-viewer-room" element={<ChessViewerRoom />} />
            
            {/* Fallback 404 Route */}
            <Route path="*" element={
              <div style={{ textAlign: 'center', padding: '5rem', color: 'var(--text-main)' }}>
                <h1>404 - Page Not Found</h1>
                <p>The link you followed may be broken or mistyped.</p>
                <a href="/" style={{ color: 'var(--primary)', textDecoration: 'none', fontWeight: 'bold' }}>Return to Home</a>
              </div>
            } />
          </Routes>
        </div>
      </ErrorBoundary>
    </Router>
  );
}

export default App;
