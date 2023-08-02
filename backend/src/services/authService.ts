import { auth, requiredScopes } from 'express-oauth2-jwt-bearer'

const AuthService = {
  WRITE_COURSE_SCOPE: requiredScopes('write:courses'),
  AUTH_MIDDLEWARE: auth({
    audience: 'https://course-visualiser.co.nz',
    issuerBaseURL: `https://course-visualiser.au.auth0.com/`,
  }),
}

export default AuthService
