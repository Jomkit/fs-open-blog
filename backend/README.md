# Full-Stack Open Blog Exercise

A brief exercise project following along with the instructions on part 13 of the Full-Stack Open online course by the University of Helsinki.

## Prerequisites

- Node 22
- Docker
- Express
- Postgres
- Sequelize

## Quickstart

To start the project and test out the API, first follow the steps below for set-up. Start up the postgres server on docker via `docker start container_name`, then from the root backend directory run `npm run dev`. You should be able to interact with the API using curl, or any other preferred method (I like using insomnia).

## Set-Up

To configure this project for local development, follow the following steps.

### Containerized Postgres Server

Assuming the docker-cli has been properly installed and configured, set up a containerized postgres server with the following command:

```shell
    docker run -d --name mypostgres -p 5432:5432 -e POSTGRES_PASSWORD=yourpassword postgres
```

Substitute `mypostgres` with the desired name (blog-server) and optionally use your own password instead of `yourpassword`
- `-d` is the detached flag
- `--name` indicates the name of the docker container 
- `-p` is the port flag
- `-e` is the shorthand for the environment variable flag

### Environment Variables

The current containerized Postgres database is accessible via environment variable in the following format:

```
DATABASE_URL=postgres://postgres:mysecretpassword@localhost:5432/postgres
```

Substituting `mysecretpassword` for `yourpassword`, or whichever you've chosen (definitely `yourpassword` in this exercise though)

### OPTIONAL: Access Postgres Server

To access the postgres db in case you want to check the table and columns have been properly configured, or if you need to trouble shoot, start the postgres server simply execute the following docker command:

```shell
    docker exec -it CONTAINER_NAME psql -U postgres
```

