import IUser from "./IUser"

interface IComment {
  body: string
  commentDate: string
  postId: string
  user: IUser
}

export default IComment
