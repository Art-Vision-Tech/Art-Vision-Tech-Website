var usuarioModel = require("../models/usuarioModel");
var ambienteModel = require("../models/ambienteModel"); 

function autenticar(req, res) {
    var email = req.body.emailServer;
    var senha = req.body.senhaServer;

    if (email == undefined) {
        res.status(400).send("Seu email está undefined!");
    } else if (senha == undefined) {
        res.status(400).send("Sua senha está indefinida!");
    } else {

        usuarioModel.autenticar(email, senha)
            .then(
                function (resultadoAutenticar) {
                    console.log(`\nResultados encontrados: ${resultadoAutenticar.length}`);
                    console.log(`Resultados: ${JSON.stringify(resultadoAutenticar)}`); // transforma JSON em String

                    if (resultadoAutenticar.length == 1) {
                        console.log(resultadoAutenticar);

                        ambienteModel.buscarAmbientesPorMuseu(resultadoAutenticar[0].museuId)
                        .then((resultadoAmbiente) => {
                            if(resultadoAmbiente.length > 0 ) {
                                res.json({
                                    idFuncionario: resultadoAutenticar[0].idFuncionario,
                                    cpf: resultadoAutenticar[0].cpf,
                                    email: resultadoAutenticar[0].email,
                                    nome: resultadoAutenticar[0].nome,
                                    senha: resultadoAutenticar[0].senha,
                                    nomeMuseu: resultadoAutenticar[0].nomeMuseu,
                                    cnpj: resultadoAutenticar[0].cnpj,
                                    dataRegistro: resultadoAutenticar[0].dataRegistro,
                                    ambiente: resultadoAmbiente
                                });
                            } else {
                                res.status(204).json({ ambiente: [] });
                            }
                        })



                    } else if (resultadoAutenticar.length == 0) {
                        res.status(403).send("Email e/ou senha inválido(s)");
                    } else {
                        res.status(403).send("Mais de um usuário com o mesmo login e senha!");
                    }
                }
            ).catch(
                function (erro) {
                    console.log(erro);
                    console.log("\nHouve um erro ao realizar o login! Erro: ", erro.sqlMessage);
                    res.status(500).json(erro.sqlMessage);
                }
            );
    }

}

function cadastrar(req, res) {
    // Crie uma variável que vá recuperar os valores do arquivo cadastro.html
    var nome = req.body.nomeServer;
    var cpf = req.body.cpfServer;
    var email = req.body.emailServer;
    var senha = req.body.senhaServer;
    var museuId = req.body.museuServer;

    // Faça as validações dos valores
    if (nome == undefined) {
        res.status(400).send("Seu nome está undefined!");
    } else if (cpf == undefined) {
        res.status(400).send("Seu cpf está undefined!");
    } else if (email == undefined) {
        res.status(400).send("Seu email está undefined!");
    } else if (senha == undefined) {
        res.status(400).send("Sua senha está undefined!");
    } else if (museuId == undefined) {
        res.status(400).send("Sua museu está undefined!");
    } else {

        // Passe os valores como parâmetro e vá para o arquivo usuarioModel.js
        usuarioModel.cadastrar(nome, cpf, email, senha, museuId)
            .then(
                function (resultado) {
                    res.json(resultado);
                }
            ).catch(
                function (erro) {
                    console.log(erro);
                    console.log(
                        "\nHouve um erro ao realizar o cadastro! Erro: ",
                        erro.sqlMessage
                    );
                    res.status(500).json(erro.sqlMessage);
                }
            );
    }
}
function atualizarPerfil(req, res) {
    var nome = req.body.nomeServer;
    var email = req.body.emailServer;
    var idFuncionario = req.body.idServer;
    
    
    

    if (nome == undefined) {
        res.status(400).send("Seu nome está undefined!");
    }
    if (email == undefined) {
        res.status(400).send("Seu nome está undefined!");
    }

    usuarioModel.atualizarPerfil(nome, email, idFuncionario).then(function(resultado){
        res.status(200).send("Perfil atualizado com sucesso");
    }).catch(function(erro){
        res.status(500).json(erro.sqlMessage);
    })
}
module.exports = {
    autenticar,
    cadastrar,
    atualizarPerfil,
}