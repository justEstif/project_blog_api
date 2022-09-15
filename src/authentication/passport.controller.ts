import bcrypt from 'bcryptjs'
import { Strategy as LocalStrategy } from 'passport-local'
import { Strategy as JWTStrategy, ExtractJwt } from 'passport-jwt'
import UserModel from '../user/user.model'
import endpoints from '../utils/endpoints'
import passport from 'passport'

const passportController = () => {
  const localStrategy = new LocalStrategy(async (email, password, cb) => {
    const user = await UserModel.findOne({ email: email })
    if (!user) {
      return cb(null, false, { message: 'Incorrect email or password' })
    } else {
      const matchingPassword = await bcrypt.compare(
        password,
        user.get('password', null, { getters: false })
      )
      if (matchingPassword) {
        return cb(null, user, { message: 'Logged in successfully' })
      } else {
        return cb(null, false, { message: 'Incorrect email or password' })
      }
    }
  })

  const jwtStrategy = new JWTStrategy(
    {
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: endpoints.JWT_SECRET
    },
    async (jwtPayload, cb) => {
      try {
        const user = await UserModel.findById(jwtPayload.id)
        if (user) delete user.password
        return cb(null, user)
      } catch (err) {
        return cb(err)
      }
    }
  )

  passport.use(localStrategy)
  passport.use(jwtStrategy)
}

export default passportController
