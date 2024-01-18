import express from 'express'

import authRoute from './auth.route'

const v1Route = express.Router()

const defaultRoutes = [
  { path: '/auth', route: authRoute }
  // {path: "/auth", route: authRoute},
]

defaultRoutes.forEach((route) => {
  v1Route.use(route.path, route.route)
})

// const devRoutes = [
//   // routes available only in development mode
//   {
//     path: '/docs',
//     route: docsRoute
//   }
// ]

// if (configEnv.env === 'development') {
//   devRoutes.forEach((route) => {
//     router.use(route.path, route.route)
//   })
// }

export default v1Route
