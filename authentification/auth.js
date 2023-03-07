const jwt = require('jsonwebtoken');

function auth(req, res, next) 
{
    const token = req.header('x-auth-token');
    if (!token) 
    {
        return res.status(401).json({ message: 'Aucun token, autorisation refusée' });
    }

    try 
    {
        const decoded = jwt.verify(token, "Tsanta");
        req.user = decoded;
        next();
    } 
    catch (err) 
    {
        console.log(err)
        res.status(400).json({ message: 'Token non valide' });
    }
}

module.exports = auth