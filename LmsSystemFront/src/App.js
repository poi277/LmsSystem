import './App.css';
import TodoApp from './components/todo/TodoApp';
import PoiApp from './components/poi/PoiApp';
import WelcomePoi from './components/poi/WelcomePoi';
import MarketAppNavi from './components/market/MarketAppNavi';
import StudentsAppNavi from './components/StudentsManageMent/StudentsAppNavi';

export default function App() {
  return (
    <div className="App">
      <StudentsAppNavi/>
    </div>
  );
}