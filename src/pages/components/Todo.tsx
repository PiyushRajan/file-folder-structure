import React,{useState} from 'react'
import { Box, HStack, Input, Button, VStack } from '@chakra-ui/react';

interface Item {
    id: string;
    description: string;
  }

const Todo = () => {
    const [toDo, setToDo] = useState<Item[]>([
        {id: "1", description: "hello"},
        {id: "2", description: "bye"}
    ])
    const [input, setInput] = useState<string>("")
    const [isEditing, setIsEditing] = useState<boolean>(false);
    const [editId, setEditId] = useState<string>("")

    const handleSubmit = () => {
        const uniqueId = Math.random().toString(36).substr(2, 9);
        const updatedTodo = [...toDo];
        if (input && !isEditing) {
            updatedTodo.push({id: uniqueId, description: input})
            setToDo(updatedTodo);
        }
        if(input && isEditing) {
           updatedTodo.forEach((val)=>{
                if(val.id === editId) {
                    val.description = input;
                }
                setToDo(updatedTodo);
            })
        }
        setInput("");
        setIsEditing(false);
    }

    const handleDelete = (id:string) => { 
        const updatedTodo = toDo.filter((item)=>item.id !== id);
        setToDo(updatedTodo);
    }

    const handleEdit = (id:string) => {
        toDo.filter((item)=> id === item.id ? setInput(item.description) : "");
        setIsEditing(true);
        setEditId(id);
    }
    
  return (
    <VStack>
      <HStack>
        <Input onChange={(e) => setInput(e.target.value)} value={input}/>
        <Button onClick={handleSubmit}>{isEditing? "Update" : "Submit"}</Button>
      </HStack>
    {toDo.map((val)=> (
            <HStack key={val.id}>
            <Box>{val.description}</Box>
            <Button onClick={()=>handleEdit(val.id)}>Edit</Button>
            <Button onClick={()=>handleDelete(val.id)}>X</Button>
        </HStack>
    ))}
    </VStack>
  )
}

export default Todo