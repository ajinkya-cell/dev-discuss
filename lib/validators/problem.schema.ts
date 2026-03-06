import z from "zod";

export const createProblemSchema = z.object({
    title : z.string().min(5),
    description : z.string().min(20),
    tags : z.array(z.string()).min(1)
})

export const updateProblemSchema = z.object({
    title : z.string().min(5).optional(),
    description : z.string().min(20).optional(),
    tags : z.array(z.string()).optional()    
})