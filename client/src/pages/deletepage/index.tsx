import { useNavigate } from 'react-router-dom'
import { Link } from 'react-router-dom'
import { useLocation } from 'react-router-dom'
import useStore from '../../store'
import { useForm } from 'react-hook-form'
import useDeletePost from '../../hooks/useDeletePost'
import SHeader from '../../components/SHeader'
import useGetPost from '../../hooks/useGetPost'

interface IPostId {
  postid: string
}
const DeletePage = () => {
  const { handleSubmit } = useForm<IPostId>()
  const { setDeleteData } = useDeletePost()
  const postId = useLocation().state
  const { post } = useGetPost(postId)
  const navigate = useNavigate()
  const store = useStore((state) => state)
  const token = store.user?.token.token || ''
  const onSubmit = handleSubmit((_) => {
    setDeleteData({
      postId: postId,
      token: token
    })
    navigate('/owner')
  })
  return (
    <>
      <SHeader>
        <p className="text-5xl capitalize">Delete Post</p>
        <p className="text-3xl text-slate-700">Title: {post?.title}</p>
      </SHeader>

      <div className="flex justify-center content-center">
        <form onSubmit={onSubmit}>
          <div className="flex gap-4">
            <button type="submit" className="hover:bg-green-500">
              Confirm
            </button>
            <Link to={`/owner`}>
              <button>Cancel</button>
            </Link>
          </div>
        </form>
      </div>
    </>
  )
}

export default DeletePage
