import express from 'express';

const router = express.Router();

router.get('/api/users/currentuser', (req, res) => {
    res.send('Sri Hari');
});

export {
    router as currentUserRouter
};