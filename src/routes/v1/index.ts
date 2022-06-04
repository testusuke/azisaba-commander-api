import express from "express"
import {router as registerRouter} from "./register"
import {router as loginRouter} from "./login"
import {router as logoutRouter} from "./logout"
import {router as meRouter} from "./me"
import {router as twoFARouter} from "./2fa"

export const router = express.Router();

router.use('/register', registerRouter)
router.use('/login', loginRouter)
router.use('/logout', logoutRouter)
router.use('/me', meRouter)
router.use('/2fa', twoFARouter)

router.get('/', (req, res) => {
    res.send('Server is Online!');
})