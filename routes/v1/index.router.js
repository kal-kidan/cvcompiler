const express = require("express");
const router = express.Router()
const {hasPermission} = require('./../../middleware/authorization')
const IndexController = require('./../../controllers/IndexController')
const MigrationController = require('./../../controllers/MigrationController')
/**
 *  @swagger
 * 
 *  /v1/common/sections:
 *    get:
 *      security:
 *        - bearerAuth: []
 *      tags:
 *        - index
 *      description: get sections
 *      responses:
 *        200:
 *          description: array of sections
 *     
 */
router.get('/sections', IndexController.getSections)

/**
 *  @swagger
 * 
 *  /v1/common/user/me:
 *    get:
 *      security:
 *        - bearerAuth: []
 *      tags:
 *        - index
 *      description: get user info
 *      responses:
 *        200:
 *          description: Json object containing user information
 *     
 */
router.get('/user/me', IndexController.me)


/**
 *  @swagger
 * 
 *  /v1/common/migrate:
 *    post:
 *      security:
 *        - bearerAuth: []
 *      tags:
 *        - index
 *      description: data migration
 *      responses:
 *        200:
 *          description: data migrated successfuly
 */
router.post('/migrate', MigrationController.migrate)
module.exports = router