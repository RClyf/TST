import logo from './logo.svg';
import './App.css';
import SignIn from './SignIn'; // Impor komponen SignIn

function App() {
  return (
    <div className="App">
      <header className="App-header">
        {/* Hapus konten yang lama dan gantikan dengan komponen SignIn */}
        <SignIn />
      </header>
    </div>
  );
}

export default App;
