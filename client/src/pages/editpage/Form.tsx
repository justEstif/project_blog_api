import { useForm } from 'react-hook-form'
import { useLocation } from 'react-router-dom'
import useStore from '../../store'
import IUpdatePostProps from '../../interface/IUpdatePostProp'
import IPost from '../../interface/IPost'
import SButton from '../../components/SButton'
import useUpdatePost from './useUpdatePost'
import SInput from '../../components/SInput'
import tw from 'tailwind-styled-components'
import STextArea from '../../components/STextArea'

interface IProps {
  post: IPost | undefined
}

const STextAreaB = tw(STextArea)`h-80`
const STextAreaS = tw(STextArea)`h-60`

const Form = ({ post }: IProps) => {
  const { register, handleSubmit } = useForm<IUpdatePostProps>({
    defaultValues: {
      body: post?.body,
      title: post?.title,
      tags: post?.tags.join(','),
      summary: post?.summary,
      published: post?.published
    }
  })
  const { setPost } = useUpdatePost()
  const token = useStore((state) => state.user?.token.token)
  const postID = useLocation().state
  const onSubmit = handleSubmit((data) => {
    if (token) {
      data.token = token
      data.postId = postID
      setPost(data)
    }
  })
  return (
    <form onSubmit={onSubmit} className="flex flex-col gap-4">
      <div className="flex flex-col gap-3">
        <label htmlFor="title" className="font-mono font-bold text-gray-500">
          Title
        </label>
        <SInput
          autoComplete="off"
          id="title"
          type="text"
          placeholder="Enter title..."
          {...register('title')}
        />
      </div>

      <div className="flex flex-col gap-3">
        <label htmlFor="body" className="font-mono font-bold text-gray-500">
          Body
        </label>
        <STextAreaB
          id="body"
          placeholder="Enter body..."
          {...register('body')}
        />
      </div>

      <div className="flex flex-col gap-3">
        <label htmlFor="summary" className="font-mono font-bold text-gray-500">
          Summary
        </label>

        <STextAreaS
          id="summary"
          placeholder="Enter summary ..."
          {...register('summary')}
        />
      </div>

      <div className="flex flex-col gap-3">
        <label htmlFor="Tags" className="font-mono font-bold text-gray-500">
          Tags <span className="italic">(separate by comma)</span>
        </label>
        <SInput type="text" {...register('tags')} />
      </div>

      <div className="flex gap-3 content-center">
        <label htmlFor="Tags" className="font-mono font-bold text-gray-500">
          Publish
        </label>
        <input type="checkbox" {...register('published')} />
      </div>

      <div className="flex justify-center content-center my-6">
        <SButton type="submit">Update Post</SButton>
      </div>
    </form>
  )
}

export default Form
