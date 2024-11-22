/*
|--------------------------------------------------------------------------
| Routes file
|--------------------------------------------------------------------------
|
| The routes file is used for defining the HTTP routes.
|
*/

import router from '@adonisjs/core/services/router'
const AuthController = () => import('#controllers/auth_controller')
const ProfilesController = () => import('#controllers/profiles_controller')
router.post('/register', [AuthController, 'register'])
router.post('/login', [AuthController, 'login'])
router.post('/logout', [AuthController, 'logout'])

// Profile routes
router.post('/user/profile', [ProfilesController, 'create'])
router.get('/user/profile', [ProfilesController, 'view'])
router.put('/user/profile', [ProfilesController, 'update'])
router.delete('/user/profile', [ProfilesController, 'delete'])
