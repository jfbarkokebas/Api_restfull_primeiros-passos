const { request, response } = require('express')
const express = require('express')
const app = express()

// npm install uuid -> gerador de ID único e universal
const { v4: uuidv4, v4 } = require('uuid')

//o express precisa dessa configuração para trabalhar com JSON
app.use(express.json())

/**
 * REQUEST -> traz todas as informações requisitadas pelo CLIENTE
 * RESPONSE -> é a reposta formatada de tudo que vai ser devolvido
 *             para a aplicação cliente
 */

//GET http://localhost:3000/projects?title=Node&owner=Aluizio&page=1


//INSOMNIA -> simulador de frontend

const projects = []

/* middlewares -> trata dados antes de chegarem a api.
  Por exemplo: faz logs no sistema, valida tokens... */
function logRoutes(request, response, next) {

  const { method, url } = request
  const route = `[${method.toUpperCase()}] ${url}`
  console.log(route);


  return next()
}
//PRIMEIRO É EXECUTADO MIDDLEWARE ANTES DE  QUALQUER ROTA
app.use(logRoutes)

app.get('/projects', (request, response) => {

  return response.json(projects)
})

app.post('/projects', (request, response) => {

  const { name, owner } = request.body

  const project = {
    id: uuidv4(),
    name,
    owner,
  }

  projects.push(project)

  return response.status(201).json(project)
})

//altera todas as informações
app.put('/projects/:id', (request, response) => {

  const { id } = request.params
  const { name, owner } = request.body
  const projectIndex = projects.findIndex(item => item.id === id)


  if (projectIndex < 0) {
    response.status(404).json({ error: "Project not found" })
  }

  if (!name || !owner) {
    return response.status(400).json({ error: "Name and owner are required" })
  }

  const newProject = {
    id,
    name,
    owner,
  }

  projects[projectIndex] = newProject

  return response.json(newProject)
})

app.delete('/projects/:id', (request, response) => {

  const { id } = request.params
  const projectIndex = projects.findIndex(item => item.id === id)

  if (projectIndex < 0) {
    response.status(404).json({ error: "Project not found" })
  }

  projects.splice(projectIndex, 1)

  return response.status(204).send()
})

app.listen(3000, () => {
  console.log('Server started on por 3000! :D');
})


/* GET 'http://localhost:3000/projects' */