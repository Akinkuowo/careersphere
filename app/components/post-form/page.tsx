"use client"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { useUser } from "@clerk/nextjs"
import { ImageIcon, XIcon } from "lucide-react"
import { useRef, useState } from "react"
import toast from "react-hot-toast"

export const PostForm = () => {
    const { user } = useUser()
    const ref = useRef<HTMLFormElement>(null)
    const fileInputRef = useRef<HTMLInputElement>(null)
    const [ preview, setPreview ] = useState<string | null>(null)

    
    const handlePostAction = async (formData: FormData) => {
        const formDataCopy = formData;
        ref.current?.reset();

        const userInput = formDataCopy.get("postInput") as string

        if(!userInput.trim()){
            throw new Error("you must provide a post text")
        }

        setPreview(null)
        try{

        }catch (error){
            toast.error("Error creating post", {
                style: {
                  borderRadius: "10px",
                  background: "#333",
                  color: "#fff",
                },
            })
        }
    } 

    const handleImageChange = (
        event: React.ChangeEvent<HTMLInputElement>
    ) => {
        const file = event.target.files?.[0]
        if(file){
            setPreview(URL.createObjectURL(file))
        }
    }

    
    return(
        <div className="mb-2">
            <form 
                ref={ref} 
                action={formData => {
                    handlePostAction(formData)
                }} 
                className="p-3 bg-white rounded-lg"
            >
                
                <div className="flex items-center space-x-2">
                <Avatar>
                    <AvatarImage src={user?.imageUrl} />
                    <AvatarFallback>
                        {user?.firstName?.charAt(0)}
                        {user?.lastName?.charAt(0)}
                    </AvatarFallback>
                </Avatar>

                <input 
                    type="text" 
                    name="postInput"
                    placeholder="Start writing a post..."
                    className="flex-1 outline-none rounded-full py-3 px-4 border"
                />

                <input 
                    ref={fileInputRef}
                    type="file" 
                    name="image" 
                    accept="image/*" 
                    hidden
                    onChange={handleImageChange}
                />

                <button type="submit" hidden>
                    POST
                </button>

                </div>

                {/* preview */}
                {preview && (
                    <div className="mt-3 mb-3">
                        <img 
                            src={preview} 
                            alt="Previewed Image" 
                            className="w-full h-60 object-cover" 

                        />
                    </div>
                )}

                <div className="flex justify-end space-x-2 mt-2">
                    <Button 
                        type="button" 
                        className="bg-sky-400"
                        onClick={() => fileInputRef.current?.click()}
                    >
                        <ImageIcon 
                            className="mr-2" 
                            size={16} 
                            color="currentColor"
                        />
                        {preview ? "Change Image" : "Add Image"}
                    </Button>
                    {preview && (
                        <Button 
                            className="bg-red-600 ml-3"
                            type="button"
                            onClick={() => setPreview(null)}
                        >
                             <XIcon 
                                className="mr-2" 
                                size={16} 
                                color="currentColor"
                            />
                            Remove Image
                        </Button>
                    )}
                </div>
            </form>

            <hr className="mt-2 border-gray-300" />
        </div>
    )
}