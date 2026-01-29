import Header from './components/Header';
import Footer from './components/Footer';
import Register from './pages/Register';
import './App.css';

function App() {
  return (
    <div className="App">
      <Header />
      <main style={{ minHeight: '80vh' }}>
        <Register />
      </main>
      <Footer />
    </div>
  );
}

export default App;