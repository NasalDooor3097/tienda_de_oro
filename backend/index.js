require('dotenv').config();
const express = require("express");
const app = express();
const port = 4000;
const mysql = require("mysql");
const cors = require("cors");
const multer = require("multer");
const path = require("path");
const Stripe = require('stripe');
const nodemailer = require("nodemailer");



app.use(cors());
app.use(express.json());
const stripe = new Stripe('sk_test_51RQJ37Fyh2gjo7qx1pfVQs5HPg5wsbZ9KXD7HUmBR4UK9A8iWi0gKkQA0izCeFSd5VQw9pz5MgEmkQoSaY9aDIpk00xZBPxKRM'); 


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
    const consulta = `INSERT INTO usuarios (user_name, email, password, tipo, cuenta_bancaria) VALUES (?, ?, ?, "usuario", "0")`;
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




app.post("/SearchAllProductTechnology", (req, res) => {
    const consulta = `SELECT * FROM productos WHERE tipo = 'Tecnologia' AND status = 1`;
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



app.post("/SearchAllProductRopa", (req, res) => {
    const consulta = `SELECT * FROM productos WHERE tipo = 'Ropa' AND status = 1`;
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




app.post("/SearchAllProductJoyas", (req, res) => {
    const consulta = `SELECT * FROM productos WHERE tipo = 'Accesorios' AND status = 1`;
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


app.post("/SearchAllProductPerfumes", (req, res) => {
    const consulta = `SELECT * FROM productos WHERE tipo = 'Perfumes' AND status = 1`;
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



app.post("/SearchAllProductJuguetes", (req, res) => {
    const consulta = `SELECT * FROM productos WHERE tipo = 'Juguetes' AND status = 1`;
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



app.post("/SearchAllProductZapatos", (req, res) => {
    const consulta = `SELECT * FROM productos WHERE tipo = 'Zapatos' AND status = 1`;
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
    const { id_producto, id_user, cantidad, id_direccion } = req.body;
    const consulta = `INSERT INTO pedidos (id_user, id_producto, cantidad, id_direccion) VALUES (?, ?, ?, ?)`;
    pool.query(consulta, [id_user, id_producto, cantidad, id_direccion], (err, results) => {
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



// Ruta para buscar todos los pedidos para terminarlos
app.post("/SearchAllOrdersAdministrado", (req, res) => {
    console.log("Entrando a la ruta de búsqueda de pedidos 0000000000000000000000000000000000000000000000000000000000000");
    const consulta = `SELECT * FROM pedidos WHERE status = 1`;
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










//Ruta para buescar los pedidos que no se han completado

app.post("/SearchOrder", (req, res) => {


    
    const { id_user } = req.body;
    const consultaPedidos = `SELECT id_producto, cantidad, id_direccion FROM pedidos WHERE id_user = ? AND status = 0 OR status = 1`;

    pool.query(consultaPedidos, [id_user], (errPedidos, resultsPedidos) => {
        if (errPedidos) {
            console.error("Error al buscar pedidos:", errPedidos);
            return res.status(500).send("Error al buscar pedidos");
            
        }
    
        if (resultsPedidos.length > 0) {
            const productosInfo = [];
            let itemsProcesados = 0; 
            
            resultsPedidos.forEach(pedido => {
            
                const consultaProducto = `SELECT * FROM productos WHERE id = ?`;
                
                const consultaDireccion = `SELECT * FROM direcciones WHERE id = ?`;
                
                Promise.all([
                    new Promise((resolve, reject) => {
                        pool.query(consultaProducto, [pedido.id_producto], (errProduct, resultsProduct) => {
                            if (errProduct) return reject(errProduct);
                            resolve(resultsProduct[0]);
                        });
                    }),
                    new Promise((resolve, reject) => {
                        
                        if (pedido.id_direccion) {
                            pool.query(consultaDireccion, [pedido.id_direccion], (errAddress, resultsAddress) => {
                                if (errAddress) return reject(errAddress);
                                resolve(resultsAddress[0]); 
                            });
                        } else {
                            resolve(null); 
                        }
                    })
                ])
                .then(([producto, direccion]) => {
                    if (producto) {
                        productosInfo.push({
                            ...producto,
                            cantidad: pedido.cantidad,
                            direccion: direccion ? direccion : null 
                        });
                    }
                    itemsProcesados++;
                    if (itemsProcesados === resultsPedidos.length) {
                        if (productosInfo.length > 0) {
                            
                            res.json(productosInfo);
                            console.log(productosInfo);
                        } else {
                            console.log("No se encontró información de los productos en los pedidos.");
                            res.send([]);
                        }
                    }
                })
                .catch(error => {
                    console.error("Error al buscar producto o dirección:", error);
                    itemsProcesados++; 
                    if (itemsProcesados === resultsPedidos.length) {
                        if (productosInfo.length > 0) {
                            res.json(productosInfo);
                        } else {
                            res.status(500).send("Error al obtener algunos detalles del pedido.");
                        }
                    }
                });
            });

        } else {
            console.log("No hay pedidos para este usuario");
            res.send([]);
        }
    });
});


















app.post("/MarcarPedidoEnviado", (req, res ) =>{

    const { id_pedido } = req.body;
    const consulta = `UPDATE pedidos SET status = 1 WHERE id = ?`;

    pool.query(consulta, [id_pedido], (err, results) => {
        if (err) {
            console.error("Error al marcar pedido como enviado:", err);
            res.status(500).send("Error al marcar pedido como enviado");
        } else {
            if (results.affectedRows === 0) {
                console.log("No se pudo marcar el pedido como enviado");
                res.send("No se pudo marcar el pedido como enviado");
            } else {
                console.log("Pedido marcado como enviado exitosamente");
                res.send("Pedido marcado como enviado");
            }
        }
    });

})



















//Ruta para buscar los pedidos completos 
app.post("/SearchOrderCompleted", (req, res) => {
    const { id_user } = req.body;
    const consultaPedidos = `SELECT id_producto, cantidad, id_direccion FROM pedidos WHERE id_user = ? AND status = 2`;

    pool.query(consultaPedidos, [id_user], (errPedidos, resultsPedidos) => {
        if (errPedidos) {
            console.error("Error al buscar pedidos:", errPedidos);
            return res.status(500).send("Error al buscar pedidos");
        }

        if (resultsPedidos.length > 0) {
            const productosInfo = [];
            let itemsProcesados = 0; 

            resultsPedidos.forEach(pedido => {
            
                const consultaProducto = `SELECT * FROM productos WHERE id = ?`;
                
                const consultaDireccion = `SELECT * FROM direcciones WHERE id = ?`;
                
                Promise.all([
                    new Promise((resolve, reject) => {
                        pool.query(consultaProducto, [pedido.id_producto], (errProduct, resultsProduct) => {
                            if (errProduct) return reject(errProduct);
                            resolve(resultsProduct[0]);
                        });
                    }),
                    new Promise((resolve, reject) => {
                        
                        if (pedido.id_direccion) {
                            pool.query(consultaDireccion, [pedido.id_direccion], (errAddress, resultsAddress) => {
                                if (errAddress) return reject(errAddress);
                                resolve(resultsAddress[0]); 
                            });
                        } else {
                            resolve(null); 
                        }
                    })
                ])
                .then(([producto, direccion]) => {
                    if (producto) {
                        productosInfo.push({
                            ...producto,
                            cantidad: pedido.cantidad,
                            direccion: direccion ? direccion : null 
                        });
                    }
                    itemsProcesados++;
                    if (itemsProcesados === resultsPedidos.length) {
                        if (productosInfo.length > 0) {
                            
                            res.json(productosInfo);
                        } else {
                            console.log("No se encontró información de los productos en los pedidos.");
                            res.send([]);
                        }
                    }
                })
                .catch(error => {
                    console.error("Error al buscar producto o dirección:", error);
                    itemsProcesados++; 
                    if (itemsProcesados === resultsPedidos.length) {
                        if (productosInfo.length > 0) {
                            res.json(productosInfo);
                        } else {
                            res.status(500).send("Error al obtener algunos detalles del pedido.");
                        }
                    }
                });
            });

        } else {
            console.log("No hay pedidos para este usuario");
            res.send([]);
        }
    });
});











app.post("/PedidosDelVendedor", async (req, res) => {
    const { id_user } = req.body;

  
    if (!id_user || isNaN(id_user)) {
        console.error("Error: id_user es inválido o está ausente.");
        return res.status(400).send("ID de usuario no proporcionado o inválido.");
    }

    const consulta = `
        SELECT
            pedidos.*,
            productos.titulo,
            productos.new_price,
            productos.old_price,
            productos.img1,
            productos.id_user AS id_vendedor,
            direcciones.calle,
            direcciones.numero_exterior,
            direcciones.vivienda,
            direcciones.colonia,
            direcciones.ciudad,
            direcciones.estado,
            direcciones.codigo_postal
        FROM pedidos
        JOIN productos ON pedidos.id_producto = productos.id
        LEFT JOIN direcciones ON pedidos.id_direccion = direcciones.id
        WHERE productos.id_user = ? And pedidos.status = 0
    `;




    pool.query(consulta, [id_user], (err, results) => {
        if (err) {
            console.error("Error al buscar pedidos del vendedor:", err);

            res.status(500).send("Error al buscar pedidos del vendedor.");
        } else {
            if (results.length === 0) {
                console.log("No se encontraron pedidos para este vendedor.");
                res.status(200).send([]); 
            } else {
                console.log("Pedidos encontrados para el vendedor.");
            
                res.status(200).send(results);
                
            }
        }
    });
});














app.post("/TerminarPedido", (req, res) => {
    const { id_pedido, message } = req.body;

    if (!id_pedido || !message) {
        return res.status(400).send("Faltan datos requeridos.");
    }

    const consultaCorreo = `
        SELECT usuarios.email 
        FROM pedidos 
        JOIN usuarios ON pedidos.id_user = usuarios.id 
        WHERE pedidos.id = ?
    `;

    pool.query(consultaCorreo, [id_pedido], (err, results) => {
        if (err) {
            console.error("Error al buscar el correo del usuario:", err.sqlMessage);
            return res.status(500).send("Error al buscar el correo del usuario.");
        }

        if (results.length === 0) {
            console.log("No se encontró el correo del usuario.");
            return res.status(404).send("No se encontró el correo del usuario.");
        }

        const email = results[0].email;
        console.log("Correo encontrado:", email);

        const consultaActualizar = "UPDATE pedidos SET status = 2 WHERE id = ?";
        pool.query(consultaActualizar, [id_pedido], (err2) => {
            if (err2) {
                console.error("Error al actualizar el pedido:", err2.sqlMessage);
                return res.status(500).send("Error al actualizar el pedido.");
            }

            // Configuración de Nodemailer SIN .env
            const transporter = nodemailer.createTransport({
                service: "gmail",
                auth: {
                    user: "goldenexpressexpressexpresa@gmail.com",
                    pass: "lqsr zspt crpk xrbu" 
                },
            });

            const mailOptions = {
                from: "goldenexpressexpressexpresa@gmail.com",
                to: email,
                subject: "Llegó tu pedido",
                text: message,
            };

            transporter.sendMail(mailOptions, (error, info) => {
                if (error) {
                    console.error("Error al enviar el correo:", error);
                    return res.status(500).send("Error al enviar el correo.");
                }

                console.log("Correo enviado:", info.response);
                res.status(200).send("Pedido actualizado y correo enviado correctamente.");
            });
        });
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





// Ruta para eliminar una dirección
app.post("/EliminarDireccion", (req, res) =>{
    const {id_direccion} = req.body;
    const consulta = `DELETE FROM direcciones WHERE id = ?`;
    pool.query(consulta, [id_direccion], (err, results) => {
        if (err) {
            console.error("Error al eliminar dirección:", err);
            res.status(500).send("Error al eliminar dirección");
        } else {
            if (results.affectedRows === 0) {
                console.log("No se pudo eliminar la dirección");
                res.send("No se pudo eliminar la dirección");
            } else {
                console.log("Dirección eliminada exitosamente");
                res.send("Dirección eliminada exitosamente");
            }
        }
    });
})







// Ruta para procesar el pago con Stripe
app.post('/process-payment-intent', async (req, res) => {
    const { amount, currency, paymentMethodId } = req.body;

    try {
        const paymentIntent = await stripe.paymentIntents.create({
            amount: amount,
            currency: currency,
            payment_method: paymentMethodId,
            confirm: true,
            automatic_payment_methods: {
                enabled: true,
                allow_redirects: 'never',
            },
        });

        res.json({ success: true, paymentIntent });
    } catch (error) {
        console.error('Error al crear PaymentIntent:', error);
        res.json({ success: false, error: error.message });
    }
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

