"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Checkbox } from "@/components/ui/checkbox"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { MessageSquare, Heart, Share2 } from "lucide-react"
import Image from "next/image"

type Comment = {
  id: number
  content: string
  hasReplies: boolean
  createdAt: string
  author: string
}

type Post = {
  id: number
  imageUrl: string
  author: string
  likes: number
  comments: number
  shares: number
}

export default function CommentsPage() {
  const [activeTab, setActiveTab] = useState("all")
  const [comments, setComments] = useState<Comment[]>([])
  const [aiResponses, setAiResponses] = useState<{ [key: number]: string }>({})
  const [selectedComments, setSelectedComments] = useState<number[]>([])
  const [allSelected, setAllSelected] = useState(false)
  const [post, setPost] = useState<Post | null>(null)

  // Simulated post data
  useEffect(() => {
    setPost({
      id: 1,
      imageUrl: "/placeholder.svg?height=300&width=300",
      author: "John Doe",
      likes: 120,
      comments: 45,
      shares: 12
    })
  }, [])

  // Simulated comments data
  useEffect(() => {
    setComments([
      { id: 1, content: "Great post!", hasReplies: true, createdAt: "2023-05-01T12:00:00Z", author: "Alice" },
      { id: 2, content: "I disagree.", hasReplies: false, createdAt: "2023-05-01T13:00:00Z", author: "Bob" },
      { id: 3, content: "Interesting perspective.", hasReplies: false, createdAt: "2023-05-01T14:00:00Z", author: "Charlie" },
      { id: 4, content: "Could you elaborate?", hasReplies: true, createdAt: "2023-05-01T15:00:00Z", author: "David" },
    ])
  }, [])

  // Simulated AI response generation
  useEffect(() => {
    const newAiResponses = comments.reduce((acc, comment) => {
      if (!comment.hasReplies) {
        acc[comment.id] = `Thank you for your comment, ${comment.author}. We appreciate your feedback on this post.`
      }
      return acc
    }, {})
    setAiResponses(newAiResponses)
  }, [comments])

  const handleCheckboxChange = (commentId: number) => {
    setSelectedComments(prev => 
      prev.includes(commentId) 
        ? prev.filter(id => id !== commentId)
        : [...prev, commentId]
    )
  }

  const handleSelectAll = () => {
    setAllSelected(!allSelected)
    setSelectedComments(allSelected ? [] : comments.filter(c => !c.hasReplies).map(c => c.id))
  }

  const handleAiResponseChange = (commentId: number, value: string) => {
    setAiResponses(prev => ({ ...prev, [commentId]: value }))
  }

  const handlePostComments = () => {
    console.log("Posting comments:", selectedComments.map(id => ({
      commentId: id,
      aiResponse: aiResponses[id]
    })))
    // Here you would typically send this data to your backend
  }

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <h2 className="text-3xl font-bold text-center mb-8">Comments</h2>
      
      {post && (
        <Card className="w-full max-w-md mx-auto mb-8">
          <CardContent className="p-0">
            <Image
              src={post.imageUrl}
              alt={`Post by ${post.author}`}
              width={300}
              height={300}
              className="w-full h-48 object-cover"
            />
          </CardContent>
          <CardFooter className="flex justify-between items-center p-4">
            <span className="font-semibold">{post.author}</span>
            <div className="flex space-x-4">
              <span className="flex items-center"><Heart className="w-4 h-4 mr-1" /> {post.likes}</span>
              <span className="flex items-center"><MessageSquare className="w-4 h-4 mr-1" /> {post.comments}</span>
              <span className="flex items-center"><Share2 className="w-4 h-4 mr-1" /> {post.shares}</span>
            </div>
          </CardFooter>
        </Card>
      )}

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="all">All Comments</TabsTrigger>
          <TabsTrigger value="no-replies">Comments without Replies</TabsTrigger>
        </TabsList>
        <TabsContent value="all">
          <div className="space-y-4">
            {comments.map(comment => (
              <Card key={comment.id} className="w-full">
                <CardContent className="p-4">
                  <div className="flex justify-between items-start mb-2">
                    <span className="font-semibold">{comment.author}</span>
                    <span className="text-sm text-gray-500">{new Date(comment.createdAt).toLocaleString()}</span>
                  </div>
                  <p>{comment.content}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
        <TabsContent value="no-replies">
          <div className="space-y-4">
            <div className="flex items-center space-x-2 mb-4">
              <Checkbox
                id="select-all"
                checked={allSelected}
                onCheckedChange={handleSelectAll}
              />
              <label htmlFor="select-all" className="text-sm font-medium">Select All</label>
            </div>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[50px]">Select</TableHead>
                  <TableHead>Comment</TableHead>
                  <TableHead>AI Response</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {comments.filter(c => !c.hasReplies).map(comment => (
                  <TableRow key={comment.id}>
                    <TableCell>
                      <Checkbox
                        checked={selectedComments.includes(comment.id)}
                        onCheckedChange={() => handleCheckboxChange(comment.id)}
                      />
                    </TableCell>
                    <TableCell>
                      <div>
                        <span className="font-semibold block">{comment.author}</span>
                        {comment.content}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Textarea
                        value={aiResponses[comment.id] || ""}
                        onChange={(e) => handleAiResponseChange(comment.id, e.target.value)}
                        rows={3}
                        className="w-full"
                      />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            <Button 
              onClick={handlePostComments} 
              disabled={selectedComments.length === 0}
              className="w-full"
            >
              Post Selected Comments
            </Button>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}