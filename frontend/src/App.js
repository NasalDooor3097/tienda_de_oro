import './App.css';
import Navbar from './componentes/navegacion/Navbar';
import React, { useContext, useState } from "react"; 
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Shop from './paginas/Shop';
import LoginSingnup from './paginas/LoginSingnup';
import Product from './paginas/Product';
import Cart from './paginas/Cart';

import Register from './paginas/Register';
import SellProduct from './componentes/SellProduct/SellProduct';
import Perfil from './paginas/Perfil';
import { FormContext } from './context/FormContext';
import Administracion from './componentes/Administracion/Administracion';
import LoginAdmin from './paginas/LoginAdmin';
import PginaTarjetaCredito from './componentes/PginaTarjetaCredito/PginaTarjetaCredito';
import Busqedas from './paginas/Busquedas/Busquedas';

import SobreNosotros from './componentes/Sobre_Nosotros/nosotros/SobreNosotros';
import PreguntasFrecuentes from './componentes/Sobre_Nosotros/PreguntasFrecuentes/PreguntasFrecuentes';
import Contacto from './componentes/Sobre_Nosotros/Contacto/Contacto';
import Blog from './componentes/Sobre_Nosotros/Blog/Blog';
import Direcciones from './componentes/Direcciones/Direcciones';

import { FaRobot } from "react-icons/fa";
import config from './Asistente/config';
import ActionProvider from './Asistente/ActionProvider';
import MessageParser from './Asistente/MessageParser';
import Chatbot from 'react-chatbot-kit';

import 'react-chatbot-kit/build/main.css';
import Draggable from 'react-draggable';

function App() {
  const { userlist } = useContext(FormContext);
  const isLoggedIn = Array.isArray(userlist) && userlist.length > 0;
  const isAdmin = userlist.some(user => user.role === "admin");

  const [showChat, setShowChat] = useState(false);

  return (
    <div>
      <BrowserRouter>
        <Navbar />

        {/* Botón flotante para abrir/cerrar el chatbot */}
        <button
          onClick={() => setShowChat(!showChat)}
          style={{
            position: "fixed",
            bottom: "20px",
            right: "20px",
            zIndex: 1000,
            padding: "10px 20px",
            backgroundColor: "#7a7a75",
            color: "white",
            border: "none",
            borderRadius: "5px",
            cursor: "pointer",
          }}
        >
               {showChat ?   <FaRobot size={24} color='black' /> :  <FaRobot size={22} /> }
        </button>

        {/* Contenedor flotante y movible del chatbot */}
        {showChat && (
          <Draggable>
            <div
              style={{
                position: "fixed",
                bottom: "450px",
                right: "20px",
                width: "250px",
                height: "100px",
                backgroundColor: "white",
                boxShadow: "0px 4px 10px rgba(0,0,0,0.2)",
                borderRadius: "10px",
                overflow: "",
                zIndex: 1000,
              }}
            >
              <Chatbot config={config} messageParser={MessageParser} actionProvider={ActionProvider} />
            </div>
          </Draggable>
        )}

        <Routes>
          <Route path='/' element={isLoggedIn && isAdmin ? <Navigate to="/admin" /> : <Shop />} />
          <Route path='product' element={<Product />}>
            <Route path=':productId' element={<Product />} />
          </Route>
          <Route path='/cart' element={isLoggedIn && !isAdmin ? <Cart /> : <Navigate to="/login" />} />
          <Route path='/login' element={ !isLoggedIn ? <LoginSingnup />  : <Navigate to="/" />} />
          <Route 
    path="/register" 
    element={!isLoggedIn ? <Register /> : <Navigate to="/perfil" replace />} 
  />

  {/* Ruta de perfil (solo para autenticados) */}
  <Route 
    path="/perfil" 
    element={isLoggedIn ? <Perfil /> : <Navigate to="/register" replace />} 
  />
          <Route path='/sell' element={<SellProduct />} />
          
          <Route path='/admin' element={isLoggedIn && !isAdmin ?  <Administracion /> : <Navigate to="/login" /> } />
          <Route path='/LogAdmin' element={<LoginAdmin />} />
          <Route path='/Busquedas' element={<Busqedas/>}/>
          <Route path='/CardRegister' element={<PginaTarjetaCredito />} />
          <Route path='/blog' element={<Blog />} />
          <Route path='/contacto' element={<Contacto />} />
          <Route path='/preguntas-frecuentes' element={<PreguntasFrecuentes />} />
        
          <Route path='/SobreNosotros' element={<SobreNosotros />} />
          <Route path='/direcciones' element={<Direcciones />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
