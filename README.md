# Introdução

Este projeto foi desenvolvido para uma aula de Microsserviços e seu funcionamento descentralizado.
A arquitetura de eventos está separada da seguinte maneira:
![image](https://github.com/user-attachments/assets/3b6ff6f7-dc1c-42a1-acd7-b87ea535eb74)

Temos uma exchange `business_events` do tipo `topic` que faz a gestão dos eventos-fila.

- A queue `notification_queue` está esperando qualquer evento acontecer para disparar alguma atualização para o usuário.
- A queue `check_stock_availability_queue` está esperando o evento `orders.created` para validar se o item está disponível para compra. Caso esteja, este dispara um novo evento na exchange `business_events` com a routing key `stock.available`.
- A queue `payment_queue` está esperando o evento `stock.available` para efetuar a cobrança do cliente. Caso a cobrança seja efetuada, este dispara um evento na exchange `business_events` com a routing key `order.success`

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
