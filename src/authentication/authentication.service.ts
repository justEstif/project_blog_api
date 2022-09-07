import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import WrongCredentialsException from '../exception/WrongCredentialsException'
import UserAlreadyExistsException from '../exception/UserAlreadyExistsException'
import DataStoredInToken from '../interface/dataStoredInToken'
import TokenData from '../interface/tokenData.interface'
import CreateUserDto from '../user/user.dto'
import IUser from '../user/user.interface'
import UserModel from '../user/user.model'
import endpoints from '../utils/endpoints'
import LogInDto from './logIn.dto'

class AuthenticationService {
  public register = async (userData: CreateUserDto) => {
    const matchingUserData = await UserModel.findOne({
      $or: [{ email: userData.email }, { username: userData.username }]
    })
    if (matchingUserData) {
      if (matchingUserData.email === userData.email) {
        throw new UserAlreadyExistsException('email', userData.email)
      } else {
        throw new UserAlreadyExistsException('username', userData.username)
      }
    } else {
      const hashedPassword = await bcrypt.hash(userData.password, 10)
      const user = await UserModel.create({
        ...userData,
        password: hashedPassword // adding hashed pw to db
      })
      user.password = undefined // clearing user pw from response
      const tokenData = this.createToken(user)
      const cookie = this.createCookie(tokenData)
      return { user, cookie }
    }
  }

  public logIn = async (logInData: LogInDto) => {
    const user = await UserModel.findOne({ email: logInData.email })
    if (user) {
      const matchingPassword = await bcrypt.compare(
        logInData.password,
        user.get('password', null, { getters: false })
      )
      if (matchingPassword) {
        const tokenData = this.createToken(user)
        const cookie = this.createCookie(tokenData)
        user.password = undefined // clearing user pw from response
        return { user, cookie }
      } else {
        throw new WrongCredentialsException()
      }
    } else {
      throw new WrongCredentialsException()
    }
  }

  public logOut = () => {
    return 'Authorization=;Max-age=0'
  }

  private createCookie(tokenData: TokenData) {
    return `Authorization=${tokenData.token}; HttpOnly; Max-Age=${tokenData.expiresIn}`
  }

  private createToken(user: IUser): TokenData {
    const expiresIn = 24 * 60 * 60 // a day
    const secret = endpoints.JWT_SECRET
    const dataStoredInToken: DataStoredInToken = {
      _id: user._id // only stores the current users id
    }
    return {
      expiresIn,
      token: jwt.sign(dataStoredInToken, secret, { expiresIn })
    }
  }
}

export default AuthenticationService
