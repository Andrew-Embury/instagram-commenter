import { MessageSquare } from "lucide-react"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import Image from "next/image"

export default function PostsPage() {
  const posts = [
    { id: 1, imageUrl: "/placeholder.svg?height=300&width=300", commentCount: 15 },
    { id: 2, imageUrl: "/placeholder.svg?height=300&width=300", commentCount: 8 },
    { id: 3, imageUrl: "/placeholder.svg?height=300&width=300", commentCount: 23 },
    { id: 4, imageUrl: "/placeholder.svg?height=300&width=300", commentCount: 5 },
  ]

  return (
    <>
      <h2 className="mb-4 text-2xl font-bold">Posts</h2>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {posts.map((post) => (
          <Card key={post.id}>
            <CardContent className="p-0">
              <Image
                src={post.imageUrl}
                alt={`Post ${post.id}`}
                width={300}
                height={300}
                className="rounded-t-lg object-cover"
              />
            </CardContent>
            <CardFooter className="p-4">
              <div className="flex items-center text-sm text-gray-500">
                <MessageSquare className="mr-2 h-4 w-4" />
                {post.commentCount} comments
              </div>
            </CardFooter>
          </Card>
        ))}
      </div>
    </>
  )
}