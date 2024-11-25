/*
|--------------------------------------------------------------------------
| Routes file
|--------------------------------------------------------------------------
|
| The routes file is used for defining the HTTP routes.
|
*/

import { middleware } from './kernel.ts'

import router from '@adonisjs/core/services/router'
const AuthController = () => import('#controllers/auth_controller')
const ProfilesController = () => import('#controllers/profiles_controller')
router.post('/register', [AuthController, 'register'])
router.post('/login', [AuthController, 'login'])
router.post('/logout', [AuthController, 'logout']).use(middleware.auth())

// Profile routes
router.post('/user/profile', [ProfilesController, 'create']).use(middleware.auth())
router.get('/user/profile', [ProfilesController, 'view']).use(middleware.auth())
router.put('/user/profile', [ProfilesController, 'update']).use(middleware.auth())
router.delete('/user/profile', [ProfilesController, 'delete']).use(middleware.auth())
