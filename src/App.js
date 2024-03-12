import logo from './logo.svg';
import './App.css';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <h3>Mehmet Çopur'dan mesajınız var...</h3>
        <p>
          Tebrikler, projeyi çalıştırarak büyük bir kısmı tamamlamış bulunmaktasınız. Başarılar :)) 
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
      </header>
    </div>
  );
}

export default App;
