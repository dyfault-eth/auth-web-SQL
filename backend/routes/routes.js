const express = require('express');
const connectDB = require('../db/connectDB');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const moment = require('moment');

const router = express.Router();

router.post('/login', async(req, res) => {
    const con = connectDB();
    const { username, password } = req.body;
    console.log()

    const userExistsQuery = 'SELECT * FROM users WHERE username = ?';
    con.query(userExistsQuery, [username], async(err, results) => {
        if (err) {
            console.error(err);
            return res.status(500).send("Erreur lors de la vérification de l'existence de l'utilisateur.");
        }

        if (results.length === 0) {
            return res.status(404).send('Utilisateur non trouvé.');
        }

        const user = results[0];

        const passwordMatch = await bcrypt.compare(password, user.password_hash);

        if (passwordMatch) {

            const token = jwt.sign({ userId: user.id, username: user.username }, process.env.SECRET_KEY, {
                expiresIn: '1h',
            });

            const expirationTimestamp = new Date().getTime() + 60 * 60 * 1000;

            return res.status(200).json({ message: 'Connexion réussie', user, token, expiration: expirationTimestamp });
        } else {
            return res.status(401).send('Mot de passe incorrect.');
        }
    });
});

router.post('/signup', async(req, res) => {
    const username = req.body.username;
    const password = req.body.password;
    const saltRounds = 10;
    let userExists = false;

    const con = connectDB();

    const selectAllUsersQuery = `SELECT * FROM users`;

    con.query(selectAllUsersQuery, function(err, results) {
        if (err) throw err;

        for (const user of results) {
            if (user.username === username) {
                userExists = true;
                return res.status(401).send({ message: `${username} already exists` });
            }
        }

        if (userExists) {
            return;
        }

        const salt = bcrypt.genSaltSync(saltRounds);
        const hashedPassword = bcrypt.hashSync(password, salt);

        const insertValueQuery = `INSERT INTO users (username, password_hash) VALUES ('${username}', '${hashedPassword}')`;

        con.query(insertValueQuery, function(err, result) {
            if (err) {
                console.error(err);
                return res.status(500).send({ error: 'Internal server error' });
            }

            return res.status(200).send({ message: "Nouvelle valeur ajoutée avec succès!", result });
        });
    });
})

router.get('/user-info', async(req, res) => {
    const token = req.headers.authorization;

    if (!token) {
        return res.status(401).json({ error: 'Token non fourni.' });
    }

    try {
        const decodedToken = jwt.verify(token, process.env.SECRET_KEY);
        const userId = decodedToken.userId;

        const con = connectDB();
        const userExistsQuery = `SELECT * FROM users WHERE id = ?`;

        con.query(userExistsQuery, [userId], function(err, results) {
            if (err) {
                console.error(err);
                return res.status(500).json({ error: 'Erreur lors de la récupération des informations des utilisateurs.' });
            }

            if (results.length === 0) {
                return res.status(404).json({ error: 'Utilisateur non trouvé.' });
            }

            res.json(results[0]);
        });
    } catch (error) {
        console.error('Erreur de vérification du token :', error);
        return res.status(401).json({ error: 'Token invalide.' });
    }
});


router.post('/update-email/:userId', async(req, res) => {
    const newEmail = req.body.newEmail;
    const token = req.headers.authorization;

    if (!token) {
        return res.status(401).json({ error: 'Token non fourni.' });
    }

    try {
        const decodedToken = jwt.verify(token, process.env.SECRET_KEY);
        const userId = decodedToken.userId;

        const con = connectDB();

        const userExistsQuery = `SELECT * FROM users WHERE id = ?`;
        con.query(userExistsQuery, [userId], function(err, results) {
            if (err) {
                console.error(err);
                return res.status(500).send('Erreur lors de la vérification de l\'existence de l\'utilisateur.');
            }

            if (results.length === 0) {
                return res.status(404).send('Utilisateur non trouvé.');
            }

            const updateEmailQuery = `UPDATE users SET email = ? WHERE id = ?`;
            con.query(updateEmailQuery, [newEmail, userId], function(err, updateResult) {
                if (err) {
                    console.error(err);
                    return res.status(500).send('Erreur lors de la mise à jour de l\'adresse e-mail.');
                }

                res.status(200).json({ message: 'Adresse e-mail mise à jour avec succès.', newEmail });
            });
        });
    } catch (e) {
        console.error('Erreur de vérification du token :', error);
        return res.status(401).json({ error: 'Token invalide.' });
    }
});

router.post('/update-password', async(req, res) => {
    const newPassword = req.body.newPassword;
    const token = req.headers.authorization;

    if (!token) {
        return res.status(401).json({ error: 'Token non fourni.' });
    }

    try {
        const decodedToken = jwt.verify(token, process.env.SECRET_KEY);
        const userId = decodedToken.userId;

        const con = connectDB();

        const userExistsQuery = `SELECT * FROM users WHERE id = ?`;
        con.query(userExistsQuery, [userId], function(err, results) {
            if (err) {
                console.error(err);
                return res.status(500).send('Erreur lors de la vérification de l\'existence de l\'utilisateur.');
            }

            if (results.length === 0) {
                return res.status(404).send('Utilisateur non trouvé.');
            }
            const updatePasswordQuery = `UPDATE users SET password = ? WHERE id = ?`;
            con.query(updateEmailQuery, [newEmail, userId], function(err, updateResult) {
                if (err) {
                    console.error(err);
                    return res.status(500).send('Erreur lors de la mise à jour de l\'adresse e-mail.');
                }

                res.status(200).json({ message: 'Adresse e-mail mise à jour avec succès.', newEmail });
            });
        });
    } catch (e) {
        console.error('Erreur de vérification du token :', error);
        return res.status(401).json({ error: 'Token invalide.' });
    }
})

router.post('/counter', async(req, res) => {
    const token = req.headers.authorization;
    const { value: count } = req.body;

    if (!token) {
        return res.status(401).json({ error: 'Token non fourni.' });
    }

    if (!count || isNaN(count)) {
        return res.status(400).json({ error: 'Valeur de compteur invalide.' });
    }

    try {
        const decodedToken = jwt.verify(token, process.env.SECRET_KEY);
        const userId = decodedToken.userId;

        const con = connectDB();

        const userExistsQuery = `SELECT * FROM users WHERE id = ?`;

        con.query(userExistsQuery, [userId], function(err, results) {
            if (err) {
                console.error(err);
                return res.status(500).send('Erreur lors de la vérification de l\'existence de l\'utilisateur.');
            }

            if (results.length === 0) {
                return res.status(404).send('Utilisateur non trouvé.');
            }

            const insertCounterQuery = `INSERT INTO counter (user_id, count) VALUES (?, ?) ON DUPLICATE KEY UPDATE count = VALUES(count)`;

            con.query(insertCounterQuery, [userId, count], function(err, results) {
                if (err) {
                    console.error(err);
                    return res.status(500).send('Erreur lors de l\'ajout du compteur.');
                }

                return res.status(200).json({ message: 'Compteur ajouté avec succès.' });
            });
        });
    } catch (e) {
        console.log(e);
        return res.status(500).send('Erreur lors de la vérification du token.');
    }
});

router.post('/add-meeting', async(req, res) => {
    const token = req.headers.authorization;
    const date = req.body.date;

    if (!token) {
        return res.status(401).json({ error: 'Token non fourni.' });
    }

    try {
        const decodedToken = jwt.verify(token, process.env.SECRET_KEY);
        const userId = decodedToken.userId;

        const con = connectDB();

        const userExistsQuery = `SELECT * FROM users WHERE id = ?`;

        con.query(userExistsQuery, [userId], function(err, results) {
            if (err) {
                console.error(err);
                return res.status(500).send('Erreur lors de la vérification de l\'existence de l\'utilisateur.');
            }

            if (results.length === 0) {
                return res.status(404).send('Utilisateur non trouvé.');
            }

            const startDate = moment(date).format('YYYY-MM-DD HH:mm:ss');

            const endDate = moment(date).add(30, 'minutes');
            const formattedEndDate = moment(endDate).format('YYYY-MM-DD HH:mm:ss');

            const insertCounterQuery = `INSERT INTO meeting (user_id, start_time, end_time) VALUES (?, ?, ?)`;

            con.query(insertCounterQuery, [userId, startDate, formattedEndDate], function(err, results) {
                if (err) {
                    console.error(err);
                    return res.status(500).send('Erreur lors de l\'ajout de la date.');
                }

                return res.status(200).json({ message: 'Date ajouté avec succès.' });
            });
        });
    } catch (e) {
        console.log(e);
        return res.status(500).send('Erreur lors de la vérification du token.');
    }
});

router.get('/get-all-meeting', async (req, res) => {
    const token = req.headers.authorization;

    if (!token) {
        return res.status(401).json({ error: 'Token non fourni.' });
    }

    try {
        const decodedToken = jwt.verify(token, process.env.SECRET_KEY);
        const userId = decodedToken.userId;

        const con = connectDB();

        const userExistsQuery = `SELECT * FROM users WHERE id = ?`;

        con.query(userExistsQuery, [userId], function (err, results) {
            if (err) {
                console.error(err);
                return res.status(500).send('Erreur lors de la vérification de l\'existence de l\'utilisateur.');
            }

            if (results.length === 0) {
                return res.status(404).send('Utilisateur non trouvé.');
            }

            const getMeetingsQuery = `SELECT * FROM meeting`;

            con.query(getMeetingsQuery, [userId], function (err, meetings) {
                if (err) {
                    console.error(err);
                    return res.status(500).send('Erreur lors de la récupération des rendez-vous.');
                }

                return res.status(200).json({ meetings });
            });
        });
    } catch (e) {
        console.log(e);
        return res.status(500).send('Erreur lors de la vérification du token.');
    }
});

module.exports = (app) => {
    app.use('/api', router);
};