# Introdução

Este projeto foi desenvolvido para uma aula de Microsserviços e seu funcionamento dedscentralizado.

## Recusros utilizados

- RabbitMQ
- Nest.JS
- Docker

## Inicialização

Primeiro clone o projeto utilizando o comando:

```
git clone https://github.com/NicolasWoitchik/microservice-example.git
```

O projeto utiliza [Docker Compose](https://docs.docker.com/compose/) para gerenciamento dos containers.

\*Para rodar o projeto é necessário que tenha instalado em seu computador o Docker e também o Docker Compose.

```
docker-compose build
```

```
docker-compose up -d
```

Caso queira diminuir o intervalo de mensagens do container `producer` basta alterar a variável de ammbiente `INTERVAL` no arquivo `./docker-compose.yml`.

## Visualização dos containers

Para visualizar as trocas de mensagens entre os containers basta rodar o commanddo abaixo:

```
docker-compose logs notification order stock producer -f
```

![image](https://github.com/user-attachments/assets/8c8e52e7-e106-4699-86f5-4378e927f1c1)

## Parar o projeto

Para parar o projeto como um todo basta rodar o comando abaixo:

```
docker-compose stop
```

Caso queira remove-lo por completo:

```
docker-compose down
```
