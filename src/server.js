
import express from 'express'   
import { readEmprestimos, writeUsers}from './db.js'
const app = express()     
app.use(express.json())
            

app.get('/Emprestimos', async (req, res) => { 
  const emprestimos = await readEmprestimos()
  res.json(emprestimos)
})

app.get('/users/:id', async (req, res) => {
const emprestimos= await readEmprestimos()
const emprestimo = emprestimos.find(u => u.id === Number(req.params.id))
if(!emprestimo) return res.status(404).json({erro: 'emprestimo não encontrado'})
  res.json(emprestimo)
})

app.post('/Emprestimos', async (req, res) => {
const {nomeAluno, livro} = req.body || {}

if (!nomeAluno || typeof nomeAluno !== 'string'){ 
  return res.status(400).json({erro:'nome é obrigatório'})
}
if (!livro || typeof livro !== 'string'){
  return res.status(400).json({erro:'livro é obrigatório'})
}
const emprestimos = readEmprestimos()
const novoId = emprestimos.length ? Math.max(...emprestimos.map(u => u.id)) + 1 : 1

const novo = {id:novoId, nomeAluno, livro }
emprestimos.push(novo)
await writeUsers(emprestimos)

res.status(201).json(novo)
})

app.put('/Emprestimos', async (req, res) =>{
  const id = Number(req.params.id)

  const {nomeAluno, livro} = req.body || {}

  if(!nome || !email) {
    return res.status(400).json({
      erro: 'nome e livro são obrigatórios para atualização'
    })
  }

  const emprestimos = await readEmprestimos()
  const idx = emprestimos.findIndex(u => u.id === id)
  if (idx === -1) return res.status(404).json({
    erro: 'emprestimo não encontrado'})

    emprestimos[idx] = {id, nomeAluno, livro}

    await writeUsers(emprestimos)
    res.json(emprestimos[idx])
})

app.delete('/Emprestimos/:id', async (req, res) => {
const id = Number(req.params.id)
const emprestimos = await readEmprestimos()
const emprestimo = emprestimos.find(u => u.id === id)
if (!emprestimo)return res.status(404).json({
  erro:'Emprestimo não encontrado'
})
if (emprestimo.deleteAt) return res.status(409).json({
  erro:'Já removido'
})
emprestimo.deleteAt = new Date().toISOString()
await writeUsers(emprestimos)
res.status(204).end()
})


app.listen(3000, () => console.log('API rodando em :3000'))

