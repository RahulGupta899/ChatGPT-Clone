import express from 'express'
import * as dotenv from 'dotenv'
import cors from 'cors'
import {Configuration,OpenAIApi } from 'openai'
dotenv.config()

const configuration = new Configuration({
    apiKey: process.env.OPENAI_API_KEY
})
const opeai = new OpenAIApi(configuration)

const app = express()
app.use(cors({origin:'*'}))
app.use(express.json())

app.get('/', async(req,res)=>{
    res.status(200).send({
        message: 'Hello from codeX'
    })
})

app.post('/',async(req,res)=>{
    try{
        console.log(process.env.OPENAI_API_KEY)
        const prompt = req.body.prompt;
        const response = await opeai.createCompletion({
            model: 'code-davinci-002',
            prompt: `${prompt}`,
            temperature: 0,
            max_tokens: 3000,
            top_p: 1,
            frequency_penalty: 0.5,
            presence_penalty: 0
        }) 
        console.log(response)
        res.json({
            bot: response.data.choices[0].text
        }) 
    }
    catch(error){
        console.log(error.message)
        res.status(500).json({
            success: false,
            message: error.message
        })
    }
})

app.listen(5000, ()=>{
    console.log('SERVER IS RUNNING ON PORT http://localhost:5000')
    console.log("KEY: ",process.env.OPENAI_API_KEY)
})

