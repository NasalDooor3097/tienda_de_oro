const express = require("express");
const app = express();
const port = 4000;
const mysql = require("mysql");
const cors = require("cors");
const multer = require("multer");
const path = require("path");

app.use(cors());
app.use(express.json());

const pool = mysql.createPool({
    connectionLimit: 20, // Aumenta este valor según tus necesidades
    host: "localhost",
    user: "root",
    password: "",
    database: "24_kilates"
});

pool.on('acquire', function (connection) {
    console.log('Connection %d acquired', connection.threadId);
});

pool.on('release', function (connection) {
    console.log('Connection %d released', connection.threadId);
});

pool.on('enqueue', function () {
    console.log('Waiting for available connection slot');
});

app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname));
    }
});

const upload = multer({ storage: storage });

// Ruta para crear un nuevo usuario
app.post("/create", (req, res) => {
    const { nombre, correo, password } = req.body;
    const consulta = `INSERT INTO usuarios (user_name, email, password) VALUES (?, ?, ?)`;
    pool.query(consulta, [nombre, correo, password], (err, results) => {
        if (err) {
            console.error("Error al crear usuario:", err);
            res.status(500).send("Error al crear usuario");
        } else {
            console.log("Registro exitoso");
            res.send("Registro exitoso");
        }
    });
});

// Ruta para eliminar un usuario
app.post("/EliminarUsuario", (req, res) => {
    const { id } = req.body;
    const consulta = `DELETE FROM usuarios WHERE id = ?`;
    pool.query(consulta, [id], (err, results) => {
        if (err) {
            console.error("Error al eliminar usuario:", err);
            res.status(500).send("Error al eliminar usuario");
        } else {
            if (results.affectedRows === 0) {
                console.log("No se pudo eliminar el usuario");
                res.send("No se pudo eliminar el usuario");
            } else {
                console.log("Usuario eliminado exitosamente");
                res.send("Usuario eliminado");
            }
        }
    });
});

// Ruta para crear un nuevo producto
app.post("/CreateProduct", upload.single('photo'), (req, res) => {
    const { titulo, new_price, old_price, id_user, tipo } = req.body;
    const img1 = req.file ? `uploads/${req.file.filename}` : null;
    if (img1) {
        const consulta = `INSERT INTO productos (titulo, new_price, old_price, img1, id_user, tipo) VALUES (?, ?, ?, ?, ?, ?)`;
        pool.query(consulta, [titulo, new_price, old_price, img1, id_user, tipo], (err, results) => {
            if (err) {
                console.error("Error al crear producto:", err);
                res.status(500).send('Error al crear producto');
            } else {
                console.log("Producto creado exitosamente");
                res.send("Producto creado exitosamente");
            }
        });
    } else {
        res.status(400).send('No se subió ningún archivo.');
    }
});

// Ruta para buscar un usuario
app.post("/search", (req, res) => {
    const { nombre, correo, password } = req.body;
    const consulta = `SELECT * FROM usuarios WHERE email = ? AND password = ? AND user_name = ?`;
    pool.query(consulta, [correo, password, nombre], (err, results) => {
        if (err) {
            console.error("Error al buscar usuario:", err);
            res.status(500).send("Error al buscar usuario");
        } else {
            if (results.length === 0) {
                console.log("No se encontró el usuario");
                res.send([]);
            } else {
                console.log("Login exitoso");
                res.send(results);
            }
        }
    });
});

// Ruta para validar un usuario
app.post("/Valid", (req, res) => {
    const { nombre, correo } = req.body;
    const consulta = `SELECT * FROM usuarios WHERE email = ?`;
    pool.query(consulta, [correo], (err, results) => {
        if (err) {
            console.error("Error al validar usuario:", err);
            res.status(500).send("Error al validar usuario");
        } else {
            if (results.length === 0) {
                const consulta2 = `SELECT * FROM usuarios WHERE user_name = ?`;
                pool.query(consulta2, [nombre], (err, results2) => {
                    if (err) {
                        console.error("Error al validar usuario:", err);
                        res.status(500).send("Error al validar usuario");
                    } else {
                        if (results2.length === 0) {
                            res.send("exito");
                        } else {
                            res.send("fallo");
                        }
                    }
                });
            } else {
                res.send("fallo");
            }
        }
    });
});

// Ruta para buscar productos por usuario
app.post("/SearchProduct", (req, res) => {
    const { id_user } = req.body;
    const consulta = `SELECT * FROM productos WHERE id_user = ?`;
    pool.query(consulta, [id_user], (err, results) => {
        if (err) {
            console.error("Error al buscar productos:", err);
            res.status(500).send("Error al buscar productos");
        } else {
            if (results.length === 0) {
                console.log("No se encontraron productos");
                res.send([]);
            } else {
                console.log("Productos encontrados");
                res.send(results);
            }
        }
    });
});

// Ruta para buscar todos los productos
app.post("/SearchAllProduct", (req, res) => {
    const consulta = `SELECT * FROM productos`;
    pool.query(consulta, (err, results) => {
        if (err) {
            console.error("Error al buscar productos:", err);
            res.status(500).send("Error al buscar productos");
        } else {
            if (results.length > 0) {
                res.send(results);
            } else {
                console.log("No hay productos");
                res.send([]);
            }
        }
    });
});



app.post("/SearchAllProductShop", (req, res) => {
    const consulta = `SELECT * FROM productos WHERE status = 1`;
    pool.query(consulta, (err, results) => {
        if (err) {
            console.error("Error al buscar productos:", err);
            res.status(500).send("Error al buscar productos");
        } else {
            if (results.length > 0) {
                res.send(results);
            } else {
                console.log("No hay productos");
                res.send([]);
            }
        }
    });
});


app.post("/SearchAllProductAdmin", (req, res) => {
    const consulta = `SELECT * FROM productos WHERE status = 0`;
    pool.query(consulta, (err, results) => {
        if (err) {
            console.error("Error al buscar productos:", err);
            res.status(500).send("Error al buscar productos");
        } else {
            if (results.length > 0) {
                res.send(results);
            } else {
                console.log("No hay productos");
                res.send([]);
            }
        }
    });
});




app.post("/AprovarProducto", (req, res) => {
    const { id } = req.body;

    const actualizarConsulta = `UPDATE productos SET status = 1 WHERE id = ?`;
    pool.query(actualizarConsulta, [id], (err) => {
        if (err) {
            console.error("Error al actualizar el producto:", err);
            res.status(500).send("Error al actualizar el producto");
        } else {
            const consulta = `SELECT * FROM productos WHERE id = ?`;
            pool.query(consulta, [id], (err, results) => {
                if (err) {
                    console.error("Error al buscar el producto actualizado:", err);
                    res.status(500).send("Error al buscar el producto actualizado");
                } else {
                    res.send(results);
                }
            });
        }
    });
});


// Ruta para buscar todos los productos que contienen "Oro" en el nombre del producto

app.post("/TitleProduct", (req, res) => {
    const { producto } = req.body;
    const consulta = `SELECT * FROM productos WHERE titulo LIKE ?`;
    const valorBusqueda = `%${producto}%`;
  
    pool.query(consulta, [valorBusqueda], (err, results) => {
      if (err) {
        console.error("Error al buscar productos:", err);
        res.status(500).send("Error al buscar productos");
      } else {
        if (results.length === 0) {
          console.log("No se encontraron productos");
          res.send("false");
        } else {
          console.log("Productos encontrados");
          res.send(results);
        }
      }
    });

    console.log(consulta);
  });
  

  



// Ruta para buscar todos los usuarios
app.post("/SearchAllUsers", (req, res) => {
    const consulta = `SELECT * FROM usuarios`;
    pool.query(consulta, (err, results) => {
        if (err) {
            console.error("Error al buscar usuarios:", err);
            res.status(500).send("Error al buscar usuarios");
        } else {
            if (results.length > 0) {
                res.send(results);
            } else {
                console.log("No hay usuarios");
                res.send([]);
            }
        }
    });
});

// Ruta para eliminar un producto
app.post("/EliminarProducto", (req, res) => {
    const { id } = req.body;
    const consulta = `DELETE FROM productos WHERE id = ?`;
    pool.query(consulta, [id], (err, results) => {
        if (err) {
            console.error("Error al eliminar producto:", err);
            res.status(500).send("Error al eliminar producto");
        } else {
            if (results.affectedRows === 0) {
                console.log("No se pudo eliminar el producto");
                res.send("No se pudo eliminar el producto");
            } else {
                console.log("Producto eliminado exitosamente");
                res.send("Producto eliminado");
            }
        }
    });
});

// Ruta para crear un pedido
app.post("/CrearPedido", (req, res) => {
    const { id_producto, id_user, tamaño, cantidad, direccion, tipo_pago, precio } = req.body;
    const consulta = `INSERT INTO pedidos (id_user, id_producto, tamaño, cantidad, direccion, tipo_pago, precio) VALUES (?, ?, ?, ?, ?, ?, ?)`;
    pool.query(consulta, [id_user, id_producto, tamaño, cantidad, direccion, tipo_pago, precio], (err, results) => {
        if (err) {
            console.error("Error al crear pedido:", err);
            res.status(500).send('Error al crear pedido');
        } else {
            console.log("Pedido creado exitosamente");
            res.send("Verdadero");
        }
    });
});

// Ruta para obtener pedidos por vendedor
app.post("/GetPedidosByVendedor", (req, res) => {
    const { id_user } = req.body;
    const consulta = `
      SELECT pedidos.*, productos.titulo, productos.new_price, productos.old_price, productos.img1 
      FROM pedidos
      JOIN productos ON pedidos.id_producto = productos.id
      WHERE productos.id_user = ?
    `;
    pool.query(consulta, [id_user], (err, results) => {
        if (err) {
            console.error("Error al obtener pedidos por vendedor:", err);
            res.status(500).send("Error al obtener pedidos");
        } else {
            res.send(results);
        }
    });
});
// Ruta para buscar todos los pedidos
app.post("/SearchAllOrders", (req, res) => {
    const consulta = `SELECT * FROM pedidos`;
    pool.query(consulta, (err, results) => {
        if (err) {
            console.error("Error al buscar todos los pedidos:", err);
            res.status(500).send("Error al buscar todos los pedidos");
        } else {
            if (results.length > 0) {
                res.send(results);
            } else {
                console.log("No hay pedidos");
                res.send([]);
            }
        }
    });
});

// Ruta para buscar un pedido específico del usuario
app.post("/SearchOrder", (req, res) => {
    const { id_user } = req.body;
    const consulta = `SELECT * FROM pedidos WHERE id_user = ?`;
    pool.query(consulta, [id_user], (err, results) => {
        if (err) {
            console.error("Error al buscar pedido:", err);
            res.status(500).send("Error al buscar pedido");
        } else {
            if (results.length > 0) {
                res.send(results);
            } else {
                console.log("No hay pedidos para este usuario");
                res.send([]);
            }
        }
    });
});

// Ruta para eliminar un pedido
app.post("/EliminarPedido", (req, res) => {
    const { id } = req.body;
    const consulta = `DELETE FROM pedidos WHERE id = ?`;
    pool.query(consulta, [id], (err, results) => {
        if (err) {
            console.error("Error al eliminar pedido:", err);
            res.status(500).send("Error al eliminar pedido");
        } else {
            if (results.affectedRows === 0) {
                console.log("No se pudo eliminar el pedido");
                res.send("No se pudo eliminar el pedido");
            } else {
                console.log("Pedido eliminado exitosamente");
                res.send("Pedido eliminado");
            }
        }
    });
});

// Ruta para agregar una nueva tarjeta de crédito
app.post("/AgregarTarjeta", (req, res) => {
    const { Nombre, Numero, Expiracion, CVV, id_user } = req.body;
    const consulta = `INSERT INTO tarjeta (cardnumber, cardname, expirydate, cvv, id_user) VALUES (?, ?, ?, ?, ?)`;
    pool.query(consulta, [Numero, Nombre, Expiracion, CVV, id_user], (err, results) => {
        if (err) {
            console.error("Error al registrar tarjeta:", err);
            res.status(500).send('No se registró la tarjeta');
        } else {
            console.log("Tarjeta registrada exitosamente");
            res.send("Tarjeta registrada exitosamente");
        }
    });
});

// Ruta para eliminar una tarjeta de crédito
app.post("/EliminarTarjeta", (req, res) => {
    const { id } = req.body;
    const consulta = `DELETE FROM tarjeta WHERE id = ?`;
    pool.query(consulta, [id], (err, results) => {
        if (err) {
            console.error("Error al eliminar tarjeta:", err);
            res.status(500).send("Error al eliminar tarjeta");
        } else {
            if (results.affectedRows === 0) {
                console.log("No se pudo eliminar la tarjeta");
                res.send("No se pudo eliminar la tarjeta");
            } else {
                console.log("Tarjeta eliminada exitosamente");
                res.send("Tarjeta eliminada exitosamente");
            }
        }
    });
});

// Ruta para buscar una tarjeta de crédito
app.post("/SearchCard", (req, res) => {
    const { id_user } = req.body;
    const consulta = `SELECT * FROM tarjeta WHERE id_user = ?`;
    pool.query(consulta, [id_user], (err, results) => {
        if (err) {
            console.error("Error al buscar tarjeta:", err);
            res.status(500).send("Error al buscar tarjeta");
        } else {
            if (results.length === 0) {
                console.log("SIN TARJETA");
                res.send([]);
            } else {
                console.log("Tiene tarjeta");
                res.send(results);
            }
        }
    });
});

// Ruta para buscar un administrador
app.post("/SearchAdmin", (req, res) => {
    const { nombre, correo, password } = req.body;
    const consulta = `SELECT * FROM admin WHERE email = ? AND password = ? AND user_name = ?`;
    pool.query(consulta, [correo, password, nombre], (err, results) => {
        if (err) {
            console.error("Error al buscar administrador:", err);
            res.status(500).send("Error al buscar administrador");
        } else {
            if (results.length === 0) {
                console.log("No se encontró el administrador");
                res.send([]);
            } else {
                console.log("Login exitoso");
                res.send(results);
            }
        }
    });
});


//Ruta para guardar una direccion

app.post("/GuardarDireccion", (req, res) => {
    const { id_user, calle, numero_exterior, colonia, ciudad, estado, codigo_postal, vivienda, numero_departamento } = req.body;
    const consulta = `INSERT INTO direcciones (id_user, calle, numero_exterior, colonia, ciudad, estado, codigo_postal, vivienda, numero_departamento) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`;
    pool.query(consulta, [id_user, calle, numero_exterior, colonia, ciudad, estado, codigo_postal, vivienda, numero_departamento], (err, results) => {
        if (err) {
            console.error("Error al guardar dirección:", err);
            res.status(500).send('Error al guardar dirección');
            console.log("error al guardar dirección");
        } else {
            console.log("Dirección guardada exitosamente");
            res.send("Dirección guardada exitosamente");
        }
    });
})

// Ruta para bucar tus direcciones 
app.post("/BuscarDirecciones", (req, res) => {
    const {id_user}  = req.body;
    const consulta = `SELECT * FROM direcciones WHERE id_user = ${id_user}`; 
    
    
    pool.query(consulta,(err, results) => {
        if (err) {
            console.error("Error al buscar direcciones:", err);
            res.status(500).send("Error al buscar direcciones");
        } else {
            if (results.length === 0) {
                res.status(404).send("No se encontraron direcciones para este usuario");
                console.log(consulta)
            } else {
                res.send(results);
                console.log(consulta)
            }
        }
    });
});


// Iniciar el servidor
app.listen(port, (err) => {
    if (!err) {
        console.log(`El servidor está corriendo en http://localhost:${port}`);
    } else {
        console.error("Error al iniciar el servidor:", err);
        throw err;
    }
});
