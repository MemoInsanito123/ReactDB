const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');

const app = express();



// Habilita CORS
app.use(cors()); // Usa cors para habilitarlo

// Configurar Express para recibir datos en formato JSON
app.use(express.json());

//Nombre de la Base de datos
let dataBaseName = 'databasecrud';

// Conexión a la base de datos MySQL
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'n0m3l0',
    database: dataBaseName
});

db.connect(err => {
    if (err) {
        console.error('Error al conectar con la base de datos (' + dataBaseName + '):', err);
        return;
    }else{
        console.log('Conexión a la base de datos establecida. ' + '(' + dataBaseName + ')');
    }
});

// Puerto de escucha del servidor
const PORT = 5000;
app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
});


// Crear un nuevo usuario
app.post('/usuario', (req, res) => {
    const { nombre, email, edad } = req.body;
    const query = 'INSERT INTO usuario (nombre, email, edad) VALUES (?, ?, ?)';
    
    db.query(query, [nombre, email, edad], (err, result) => {
        if (err) {
            console.error('Error al crear el usuario:', err);
            res.status(500).json({ error: 'Error al crear el usuario' });
        }else {
        res.status(201).json({ message: 'Usuario creado', id: result.insertId });
        }
    });
});

// Leer todos los usuarios
app.get('/usuario', (req, res) => {
    const query = 'SELECT * FROM usuario';
    
    db.query(query, (err, results) => {
        if (err) {
            console.error('Error al obtener usuarios:', err);
            res.status(500).json({ error: 'Error al obtener usuarios' });
        } else {
            res.status(200).json(results);
        }
    });
});

// Actualizar un usuario por ID
app.put('/usuario/:id', (req, res) => {
    const { id } = req.params;
    const { nombre, email, edad } = req.body;
    const query = 'UPDATE usuario SET nombre = ?, email = ?, edad = ? WHERE id = ?';
    
    db.query(query, [nombre, email, edad, id], (err, result) => {
        if (err) {
            console.error('Error al actualizar el usuario:', err);
            res.status(500).json({ error: 'Error al actualizar el usuario' });
        } else if (result.affectedRows === 0) {
            res.status(404).json({ message: 'Usuario no encontrado' });
        } else {
            res.status(200).json({ message: 'Usuario actualizado' });
        }
    });
}); 

// Eliminar un usuario por ID
app.delete('/usuario/:id', (req, res) => {
    const { id } = req.params;
    const query = 'DELETE FROM usuario WHERE id = ?';
    
    db.query(query, [id], (err, result) => {
        if (err) {
            console.error('Error al eliminar el usuario:', err);
            res.status(500).json({ error: 'Error al eliminar el usuario' });
        } else if (result.affectedRows === 0) {
            res.status(404).json({ message: 'Usuario no encontrado' });
        } else {
            res.status(200).json({ message: 'Usuario eliminado' });
        }
    });
});
