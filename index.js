import express from 'express';
import session from 'express-session';
import cookieParser from 'cookie-parser';
import path from 'path'

const porta = 3000;
const host = 'localhost';

var listaUsuarios = [];
var mensagens = {}; //teste bate papo

const app = express();

app.use(express.urlencoded({ extended: true }));

app.use(session({
    secret: 'MinH4Ch4v3S3cr3t4',
    resave: false,
    saveUninitialized: true,
    cookie: {
        secure: false,
        httpOnly: true,
        maxAge: 1000 * 60 * 15 //30 minutos
    }
}));

app.use(cookieParser());

app.use(express.static('./public'));

function cadastrarUsuario(req, res) {
    res.send(`
        <!DOCTYPE html>
        <html lang="pt-br">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Cadastro de Usuario</title>
            <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css" rel="stylesheet" crossorigin="anonymous">
            <style>
                .error-message {
                    color: red;
                    font-size: 0.9em;
                }
                .form-control.is-invalid {
                    border-color: red;
                }
            </style>
        </head>
        <body>
            <div class="container mt-5">
                <h1>Cadastro De Usuario</h1>
                <h3>Preencha as informações</h3>
                <form id="formCadastro" action="/cadastrarUsuario" method="POST" novalidate>
                    <div class="mb-3">
                        <label for="nome" class="form-label">Nome Completo</label>
                        <input type="text" class="form-control" id="nome" name="nome" placeholder="Informe o nome do Usuario">
                        <span class="error-message" id="erroNome"></span>
                    </div>
                    <div class="mb-3">
                        <label for="nick" class="form-label">NickName que Deseja</label>
                        <input type="text" class="form-control" id="nick" name="nick" placeholder="Apelido que será exibido">
                        <span class="error-message" id="erroNick"></span>
                    </div>
                    <div class="mb-3">
                        <label for="nascimento" class="form-label">Data de Nascimento</label>
                        <input type="date" class="form-control" id="nascimento" name="nascimento">
                        <span class="error-message" id="erroNascimento"></span>
                    </div>
                    <div class="mb-3">
                        <label for="email" class="form-label">Email</label>
                        <input type="email" class="form-control" id="email" name="email" placeholder="exem@ex.com">
                        <span class="error-message" id="erroEmail"></span>
                    </div>
                    <div class="mb-3">
                        <label for="senha" class="form-label">Senha</label>
                        <input type="password" class="form-control" id="senha" name="senha">
                        <span class="error-message" id="erroSenha"></span>
                    </div>
                    <div class="mb-3">
                        <label for="senha2" class="form-label">Confirmar Senha</label>
                        <input type="password" class="form-control" id="senha2" name="senha2">
                        <span class="error-message" id="erroSenha"></span>
                    </div>
                    <button type="submit" class="btn btn-primary">Cadastrar</button>
                </form>
                  <div class="collapse navbar-collapse" id="navbarSupportedContent">
                    <ul class="navbar-nav mr-auto">
                            <a class="nav-link disabled" href="#">Disabled</a> 
                     </ul>
                  </div>
            </div>
            <script>
                document.getElementById('formCadastro').addEventListener('submit', function(event) {
                    let isValid = true;
                    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

                    document.querySelectorAll('.error-message').forEach(el => el.textContent = '');
                    document.querySelectorAll('.form-control, .form-select').forEach(el => el.classList.remove('is-invalid'));

                    if (!document.getElementById('nome').value.trim()) {
                        document.getElementById('erroNome').textContent = 'Por favor, preencha o nome completo!';
                        document.getElementById('nome').classList.add('is-invalid');
                        isValid = false;
                    }
                    if (!document.getElementById('nick').value.trim()) {
                        document.getElementById('erronick').textContent = 'Por favor, preencha o Apelido!';
                        document.getElementById('nick').classList.add('is-invalid');
                        isValid = false;
                    }
                    if (!document.getElementById('nascimento').value.trim()) {
                        document.getElementById('erroNascimento').textContent = 'Por favor, preencha a data de nascimento!';
                        document.getElementById('nascimento').classList.add('is-invalid');
                        isValid = false;
                    }
                    if (!document.getElementById('email').value.trim()) {
                        document.getElementById('erroEmail').textContent = 'Por favor, preencha o email!';
                        document.getElementById('email').classList.add('is-invalid');
                        isValid = false;
                    }
                    if (!emailRegex.test(document.getElementById('email').value)){
                        document.getElementById('erroEmail').textContent = 'Por favor, preencha com um email!';
                        document.getElementById('email').classList.add('is-invalid');
                        isValid = false;
                    }
                    if (!document.getElementById('senha').value.trim()) {
                        document.getElementById('erroSenha').textContent = 'Por favor, faça uma SENHA!';
                        document.getElementById('senha').classList.add('is-invalid');
                        isValid = false;
                    }
                    if (document.getElementById('senha').value !== document.getElementById('senha2').value) {
                        document.getElementById('erroSenha').textContent = "As senhas não coincidem!";
                        document.getElementById('senha').classList.add('is-invalid');
                        isValid = false;
                    }
                    if (!isValid) {
                        event.preventDefault();
                    }
                });
            </script>
        </body>
        </html>
    `);
}

function menu(req,resp){
    const dataHoraUltimoLogin = req.cookies['dataHoraUltimoLogin'];
    if(!dataHoraUltimoLogin){
        dataHoraUltimoLogin='';
    }
    resp.send(`
        <!DOCTYPE html>
        <html lang="pt-br">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Cadastro de Cliente</title>
            <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-QWTKZyjpPEjISv5WaRU9OFeRpok6YctnYmDr5pNlyT2bRjXh0JMhjY6hW+ALEwIH" crossorigin="anonymous">
        </head>
        <body>
        <nav class="navbar navbar-expand-lg bg-body-tertiary">
            <div class="container-fluid">
                <a class="navbar-brand" href="#">Menu Principal</a>
                <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Alternar navegação">
                <span class="navbar-toggler-icon"></span></button>

                <div class="collapse navbar-collapse" id="navbarSupportedContent">
                    <ul class="navbar-nav me-auto mb-2 mb-lg-0">
                        <li class="nav-item">
                            <a class="nav-link active" aria-current="page" href="/cadastrarUsuarioView">Cadastro de Usuário</a>
                            <a class="nav-link active" aria-current="page" href="/batePapo">Bate-Papo</a>
                            <a class="nav-link active" aria-current="page" href="/logout">Sair</a>
                            <a class="nav-link disabled" href="#" tabindex="-1" aria-disabled="true">Seu último acesso foi realizado em ${dataHoraUltimoLogin}</a>
                        </li>
                    </ul>
                </div>
            </div>
        </nav>
</body>
    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/js/bootstrap.bundle.min.js" integrity="sha384-YvpcrYf0tY3lHB60NNkmXc5s9fDVZLESaAA55NDzOxhy9GkcIdslK1eN7N6jIeHz" crossorigin="anonymous"></script>
</html> `
    )
}

function cadastrarUsuarioView(req,resp){
    const nome = req.body.nome;
    const nick = req.body.nick;

    const dataHoraUltimoLogin = req.cookies['dataHoraUltimoLogin'];
    if (!dataHoraUltimoLogin){
        dataHoraUltimoLogin='';
    }

    const usuario = { nome, nick};
    listaUsuarios.push(usuario);

   
    resp.write(`   
        <!DOCTYPE html>
        <html lang="pt-br">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Lista de Usuarios</title>
            <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-QWTKZyjpPEjISv5WaRU9OFeRpok6YctnYmDr5pNlyT2bRjXh0JMhjY6hW+ALEwIH" crossorigin="anonymous">
        </head>
        <body>
        <table class="table">
  <thead>
    <tr>
      <th scope="col">Nome</th>
      <th scope="col">Nick</th>
    </tr>
  </thead>
  <tbody>`);

  for (var i = 0; i < listaUsuarios.length; i++){
    resp.write(`<tr>
                <td>${listaUsuarios[i].nome}</td>
                <td>${listaUsuarios[i].nick}</td>
                </tr>
        `)
  }

    resp.write(`
        </tbody>
        </table>
        <a class="btn btn-dark" href="/cadastrarUsuarioView" role="button">Continuar cadastrando</a>
        <a class="btn btn-dark" href="/" role="button">Voltar para o menu</a>
         <div>
            <p><span>Seu último acesso foi realizado em ${dataHoraUltimoLogin}</span></p>
         </div>
        </body>
        <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/js/bootstrap.bundle.min.js" integrity="sha384-YvpcrYf0tY3lHB60NNkmXc5s9fDVZLESaAA55NDzOxhy9GkcIdslK1eN7N6jIeHz" crossorigin="anonymous"></script>
        </html>
    `);

resp.end();

}

function autenticarUsuario(req, resp){
    const usuario = req.body.usuario;
    const senha = req.body.senha;

    if(usuario=== 'admin' && senha === '123'){
        //registrar que o usuario autenticou
        req.session.usuarioLogado = true;
        resp.cookie('dataHoraUltimoLogin', new Date().toLocaleString(), {maxAge: 1000 * 60 * 60 * 24 * 30, httpOnly: true });
        resp.redirect('/')
    }
    else{
        resp.send(`
                    <html>
                        <head>
                        <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.0.2/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-EVSTQN3/azprG1Anm3QDgpJLIm9Nao0Yz1ztcQTwFspd3yD65VohhpuuCOmLASjC" crossorigin="anonymous">
                        </head>
                        <body>
                            <div class="container w-25"> 
                                <div class="alert alert-danger" role="alert">
                                Usuário ou senha inválidos!
                                </div>
                                <div>
                                    <a href="/login.html" class="btn btn-primary">Tentar novamente</a>
                                            </div>
                                </div>
                        </body>
                        <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.0.2/dist/js/bootstrap.bundle.min.js"
                                integrity="sha384-MrcW6ZMFYlzcLA8Nl+NtUVF0sA7MsXsP1UyJoMp4YLEuNSfAP+JcXn/tWtIaxVXM"
                                crossorigin="anonymous">
                        </script>
                    </html> 
                  `);
    }
}

function verificarAutenticacao(req, resp, next){
    if(req.session.usuarioLogado){
        next();
    }
    else
    {
        resp.redirect('/login.html');
    }
};

function batePapo(req, resp) {
    const dataHoraUltimoLogin = req.cookies['dataHoraUltimoLogin'] || '';

    // Formulário de bate-papo
    resp.send(`
        <!DOCTYPE html>
        <html lang="pt-br">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Bate-Papo</title>
            <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css" rel="stylesheet" crossorigin="anonymous">
        </head>
        <body>
            <h3>Bate-Papo</h3>
            <form action="/enviarMensagem" method="POST">
                <div class="mb-3">
                    <label for="usuarioDestinatario" class="form-label">Escolha o Usuário para Conversar</label>
                    <select class="form-select" id="usuarioDestinatario" name="usuarioDestinatario" required>
                        <option value="" disabled selected>Selecione um usuário</option>
                        ${listaUsuarios.map(usuario => `
                            <option value="${usuario.nick}">${usuario.nick}</option>
                        `).join('')}
                    </select>
                </div>
                <div class="mb-3">
                    <label for="mensagem" class="form-label">Mensagem</label>
                    <textarea class="form-control" id="mensagem" name="mensagem" rows="3" required></textarea>
                </div>
                <button type="submit" class="btn btn-primary">Enviar</button>
            </form>

            <h4>Mensagens</h4>
            <div>
                ${Object.keys(mensagens).map(par => {
                    const [usuario1, usuario2] = par.split('_');
                    return `
                        <h5>${usuario1} & ${usuario2}</h5>
                        <ul>
                            ${mensagens[par].map(msg => `<li>${msg}</li>`).join('')}
                        </ul>
                    `;
                }).join('')}
            </div>

            <a href="/" class="btn btn-dark">Voltar ao Menu</a>
        </body>
        </html>
    `);
}

function enviarMensagem(req, resp) {
    const { usuarioDestinatario, mensagem } = req.body;
    const usuarioRemetente = req.session.usuario ? req.session.usuario.nick : 'desconhecido';

    if (!mensagens[`${usuarioRemetente}_${usuarioDestinatario}`]) {
        mensagens[`${usuarioRemetente}_${usuarioDestinatario}`] = [];
    }
    mensagens[`${usuarioRemetente}_${usuarioDestinatario}`].push(`${usuarioRemetente}: ${mensagem}`);

    resp.redirect('/batePapo');
}

app.get('/login.html', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'login.html'));
});


app.get('/logout', (req,resp)=>{
     req.session.destroy();
     resp.redirect('/login.html');
});
app.post('/login', autenticarUsuario);
app.get('/',verificarAutenticacao, menu);
app.get('/cadastrarUsuarioView',verificarAutenticacao, cadastrarUsuario);
app.post('/cadastrarUsuario', verificarAutenticacao, cadastrarUsuarioView);
app.get('/batePapo', batePapo);
app.post('/enviarMensagem', enviarMensagem);
app.listen(porta, host, () => {
    console.log('Servidor iniciado e em execução no endereço http://localhost:3000');
})