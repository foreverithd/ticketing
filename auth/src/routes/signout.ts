import express from 'express';

const router = express.Router();

router.post('/api/users/signout', (req, res) => {
    res.send('signout Sri Hari');
});

export {
    router as signoutRouter
};