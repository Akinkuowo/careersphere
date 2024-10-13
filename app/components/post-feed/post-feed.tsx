import { IpostDocument } from "@/mongodb/models/post"
import { Post } from "../post/page"


export const PostFeed = ({posts}: {posts: IpostDocument[]}) => {
    

    return(
        <div className="space-y-2 mb-20">
           {
            posts.map((post) => (
                <Post key={post.id} post={post} />
            ))
           /* {posts.map((post) => (
            <Post key={post.id} post={post} />
           ))} */}
        </div>
    )
}

