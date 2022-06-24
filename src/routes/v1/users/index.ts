import express from "express"
import {router as permissionsRouter} from "./permissions"
import {router as groupRouter} from "./group"
import * as userUtil from "../../../util/users"
import {validateAndGetSession} from "../../../util/util"

const debug = require('debug')('azisaba-commander-api:route:v1:users:index')

export const router = express.Router();

//  User

/**
 * Get a list of users
 * Require group: admin
 *
 * Response:
 *
 */
router.get('/', async (req, res) => {
    const session = await validateAndGetSession(req)
    if (!session) {
        return res.status(401).send({ "error": "not_authorized"})
    }
    if (!await userUtil.isAdmin(session.user_id)) {
        return res.status(403).send({ "error": "forbidden" })
    }
    //  get all user
    const users = await userUtil.getAllUser()
    return res.status(200).send(
        {
            "message": "ok",
            "users": users
        }
    )
})

/**
 * Get a user profile
 * Require group: admin
 *
 * Parameters:
 * - id: user id
 */
router.get('/:id', async (req, res) => {
    const session = await validateAndGetSession(req)
    if (!session) {
        return res.status(401).send({ "error": "not_authorized"})
    }
    //  permission check
    if (!await userUtil.isAdmin(session.user_id)) {
        return res.status(403).send({ "error": "forbidden" })
    }
    //  param check
    const id = +req.params.id
    if (!id) {
        return res.status(400).send({ "error": "invalid_params"})
    }

    const user = await userUtil.getUser(id)

    return res.status(200).send(user)
})

/**
 * delete a user
 * Require group: admin
 *
 * Parameters:
 * - id: user id
 */
router.delete('/:id', async (req, res) => {
    const session = await validateAndGetSession(req)
    if (!session) {
        return res.status(401).send({ "error": "not_authorized"})
    }
    if (!await userUtil.isAdmin(session.user_id)) {
        return res.status(403).send({ "error": "forbidden" })
    }
    //  param check
    const id = +req.params.id
    if (!id) {
        return res.status(400).send({ "error": "invalid_params"})
    }

    //  delete
    await userUtil.deleteUser(id)

    return res.status(200).send({ "message": "ok" })
})

//  Permission
router.use(
    '/:id/permissions',
    (req, res, next) => {
        // @ts-ignore
        req.userId = req.params.id
        next()
    },
    permissionsRouter
)
//  Group
router.use(
    '/:id/group',
    (req, res, next) => {
        // @ts-ignore
        req.userId = req.params.id
        next()
    },
    groupRouter
)

