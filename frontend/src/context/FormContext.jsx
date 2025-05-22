import React, { createContext, useState, useEffect } from 'react';

// Crear el contexto
export const FormContext = createContext();

// Proveedor del contexto
const FormProvider = ({ children }) => {
    const [nombre, setNombre] = useState('');
    const [correo, setCorreo] = useState('');
    const [password, setPassword] = useState('');
    const [userlist, setUser] = useState([]);
    const [cardlist, setCard] = useState([]);
    const [stateProduct, SetStateProduct] = useState([]);
    const [userAuthenticated, setUserAuthenticated] = useState(false);

    // Función para guardar el usuario y persistir en localStorage
    const setUserAndPersist = (user) => {
        setUser(user);
        localStorage.setItem('userlist', JSON.stringify(user));
    };

    // Cargar datos desde localStorage al montar el componente
    useEffect(() => {
        const storedUserList = localStorage.getItem('userlist');
        if (storedUserList) {
            setUser(JSON.parse(storedUserList));
            setUserAuthenticated(true);
        }
    }, []);

    const logout = () => {
        setUser([]);
        setUserAuthenticated(false);
        localStorage.removeItem('userlist');
    };

    return (
        <FormContext.Provider value={{ nombre, setNombre, correo, setCorreo, password, setPassword, userlist, setUser: setUserAndPersist, cardlist, setCard, logout }}>
            {children}
        </FormContext.Provider>
    );
};

export default FormProvider;
