import { BrowserRouter as Router } from 'react-router-dom'
import RoutesList from './route'

import './styles/app.scss'

function App() {
  return (
    <div className="App">
      <Router>
        <RoutesList />
      </Router>
    </div>
  )
}

export default App
