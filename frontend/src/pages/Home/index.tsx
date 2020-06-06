import React from 'react';
import { Link } from 'react-router-dom'; 
import { FiLogIn as LoginIcon } from 'react-icons/fi';

import './styles.css';

import logo from '../../assets/logo.svg';
import background from '../../assets/home-background.svg';

const Home = () => {
  return (
    <div id="page-home">
      <img id="background" src={background} alt="Background"/>

      <div className="content">
        <header>
          <img src={logo} alt="Ecoleta" />
        </header>

        <main>
          <h1>Seu marketplace de coleta de  resíduos</h1>
          <p>Ajudamos pessoas a encontrarem pontos de coleta de forma eficiente.</p>

          <Link to="/create-point">
            <span>
              <LoginIcon color="#fff" size={20} />
            </span>
            <strong>Cadastre um ponto de coleta</strong>
          </Link>
        </main>
      </div>
    </div>
  );
};

export default Home;
