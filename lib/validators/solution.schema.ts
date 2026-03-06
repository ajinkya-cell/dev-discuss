import z from "zod";

export const createSolutionSchema = z.object({
    content : z.string().min(20)
})

export const updateSolutionSchema = z.object({
    content : z.string().min(20)
})