import { observer } from 'mobx-react-lite';
import { useContext, useEffect, useState } from 'react';
import { BrowserRouter } from 'react-router-dom';
import { Context } from '.';
import './scss/main.scss';
import AppRouter from './components/AppRouter';
import Navbar from './components/Navbar';
import Footer from './components/Footer/Footer';
import { check } from './http/userApi';
import Loader from './theme/Loader/Loader';

const App = observer(() => {
  const { user } = useContext(Context);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    check()
      .then((data) => {
        user.setUser(data);
        user.setIsAuth(true);
      })
      .catch((e) => {
        user.setUser({});
        user.setIsAuth(false);
        console.log(e);
      })
      .finally(() => setIsLoading(false));
  }, []);

  if (isLoading) {
    return <Loader />;
  }

  return (
    <BrowserRouter>
      <div className="wrapper">
        <Navbar />
        <main className="main">
          <AppRouter />
        </main>
        <Footer />
      </div>
    </BrowserRouter>
  );
});

export default App;
