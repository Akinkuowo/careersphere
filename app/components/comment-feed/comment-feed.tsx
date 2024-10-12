import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { IpostDocument } from "@/mongodb/models/post"
import { useUser } from "@clerk/nextjs"
import ReactTimeago from "react-timeago"


export const CommentFeed =({post} : {post: IpostDocument}) => {
    const { user } = useUser()

    const isOwner = user?.id == post.user.userId

    console.log(post.comments)
    return (
        <div className="space-y-2 mt-3">
            {post.comments?.map((comment) => (
                <div key={comment.id} className="flex space-x-1">
                    <Avatar>
                        <AvatarImage src={comment.user.userImage} />
                        <AvatarFallback>
                            {comment.user.firstname?.charAt(0)}
                            {comment.user.lastname?.charAt(0)}
                        </AvatarFallback>
                    </Avatar>

                    <div className="bg-gray-100 px-4 py-2 rounded-md w-full sm:w-auto md:min-w-[300px]">
                        <div className="flex justify-between">
                            <div>
                                <p className="font-semibold">
                                    {comment.user.firstname} {comment.user.lastname}{" "}
                                    {isOwner && (
                                        <Badge className="ml-2" variant="secondary">
                                        Author
                                        </Badge>
                                    )}

                                </p>
                                <p className="text-sm text-gray-400">

                                    @{comment.user.firstname}
                                    {comment.user.firstname} - {comment.user.userId.toString().slice(-4)}
                                </p>
                            </div>
                            <p className="text-sm text-gray-400">
                                <ReactTimeago date={new Date(comment.createdAt)} />
                            </p>
                        </div>

                        <p className="mt-3 text-sm">{comment.text}</p>
                    </div>
                </div>
            ))}
        </div>
    )
}