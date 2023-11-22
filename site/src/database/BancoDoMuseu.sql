create database museu;

use museu;

--

create table Registro_sensor (
idRegistro int auto_increment,
dht11_temperatura float,
dht11_umidade float,
dtRegistro timestamp default now(), -- atualizar o horario que foi capturado a temperatura e a umidade (lembrando que para aparecer no gráfico e feita a ligação pela API no vscode)
fkAmbiente int,
primary key (idRegistro, fkAmbiente),
foreign key (fkAmbiente)
references ambiente(idAmbiente)
);

--

 insert into Registro_sensor (dht11_temperatura, dht11_umidade) values
 ('24.7', '20'),
 ('24.7', '27'),
('22.2', '22'),
 ('21.9', '29');

--

create table Ambiente (
idAmbiente int primary key auto_increment,
nome_ambiente varchar (45),
andar varchar(10),
qtd_acervo int,
fkMuseu int,
constraint fkMuseu foreign key (FkMuseu) references museu(idMuseu)
) auto_increment = 100;

--

 insert into Ambiente (nome_ambiente, andar, qtd_acervo, fkMuseu) values
 ('Sala 1', '1º andar', '200', 1),
 ('Sala 1', '1º andar', '67', 2),
 ('Sala 1', '1º andar', '240', 3),
 ('Sala 2', '2º andar', '80', 1),
 ('Sala 2', '2º andar', '47', 2),
 ('Sala 2', '2º andar', '240', 3),
 ('Sala 3', '3º andar', '240', 1),
 ('Sala 3', '3º andar', '240', 2),
 ('Sala 3', '3º andar', '240', 3);
 
 
--
 
create table Funcionario(
idFuncionario int auto_increment,
FkMuseu int,
primary key (IdFuncionario, FkMuseu),
nome varchar(45),
cpf char(11) unique,
email varchar (45),
senha varchar (45),
foreign key (FkMuseu)
references museu(idMuseu)
) auto_increment = 1000;

-- 

insert into Funcionario (nome, cpf, email, senha, fkMuseu) values
('Lucas', '00565860860', 'lucas1990@outlook.com', 'Lluquinhas123', 1),
('Marcos', '16321760846', 'marcoslindo@gmail.com', 'mar55cosS', 2),
('Bruno', '86793705849', 'nanatsunotazai@sptech.school', 'brunoBruno231', 3);

--

create table Museu (
idMuseu int primary key auto_increment,
cnpj char (14) unique,
nome varchar (45),
telefone varchar (11),
fkEndereço int,
constraint fkEndereço foreign key (fkEndereço)
references 	endereço(idEndereço)
);

--

insert into Museu (cnpj, nome, telefone, fkEndereço) values
('27685616000108', 'Catavento', '958238976', 1),
('92486446000196', 'Nacional', '998838976', 2),
('15123795000100', 'Bacia', '999784576', 3);

--

create table Endereço (
idEndereço int primary key auto_increment,
cep char(8),
estado char(2),
cidade varchar(35),
bairro varchar(35),
numero varchar(4)
);

-- 

insert into Endereço (cep, estado, cidade, bairro, numero) values
('04856680', 'SP', 'São Paulo', 'Jardim das Pedras(Zona Sul)', '239'),
('39990972', 'MG', 'Água Vermelhas', 'Mocó', '560'),
('87055607', 'PR', 'Maringá', 'Conjunto Habitacional Céu Azul', '45');	


-- selects

select * from Registro as reg join Ambiente as amb
on  reg.fkAmbiente = amb.idAmbiente;

select * from Ambiente as amb join Museu as mus
on amb.fkMuseu = mus.idMuseu;

select * from Funcionario as func join Museu as mus
on func.fkMuseu = mus.idMuseu;

select * from Museu as mus join Endereço as ende
on mus.FkEndereço = ende.idEndereço;

-- 

select * from Registro;
select * from Sensor;
select * from Ambiente;
select * from Museu;
select * from Funcionario;
select * from Endereço;

drop database museu;




