DROP SCHEMA public CASCADE;
CREATE SCHEMA public;

DROP DATABASE IF EXISTS hawkshopdb;
CREATE DATABASE hawkshopdb;

CREATE TABLE "produtos" (
  "id" SERIAL PRIMARY KEY,
  "categoria_id" int NOT NULL,
  "usuario_id" int,
  "nome" text NOT NULL,
  "descricao" text NOT NULL,
  "antigo_preco" int,
  "preco" int NOT NULL,
  "quantidade" int DEFAULT 0,
  "status" int DEFAULT 1,
  "criado_em" timestamp DEFAULT 'now()',
  "atualizado_em" timestamp DEFAULT 'now()'
);

CREATE TABLE "categorias" (
  "id" SERIAL PRIMARY KEY,
  "nome" text NOT NULL
);

INSERT INTO categorias(nome) VALUES('comida');
INSERT INTO categorias(nome) VALUES('eletrônicos');
INSERT INTO categorias(nome) VALUES('automóveis');

CREATE TABLE "arquivos" (
  "id" SERIAL PRIMARY KEY,
  "nome" text,
  "caminho" text NOT NULL,
  "produto_id" int
);

ALTER TABLE "produtos" ADD FOREIGN KEY ("categoria_id") REFERENCES "categorias" ("id");

ALTER TABLE "arquivos" ADD FOREIGN KEY ("produto_id") REFERENCES "produtos" ("id");

CREATE TABLE "usuarios" (
  "id" SERIAL PRIMARY KEY,
  "nome" text NOT NULL,
  "email" text UNIQUE NOT NULL,
  "senha" TEXT NOT NULL,
  "cpf_cnpj" text UNIQUE NOT NULL,
  "cep" text,
  "endereco" text,
  "criado_em" timestamp DEFAULT 'now()',
  "atualizado_em" timestamp DEFAULT 'now()'
);

--  FOREIGN KEY

ALTER TABLE "produtos" ADD FOREIGN KEY ("usuario_id") REFERENCES "usuarios" ("id");

-- CRIAR PROCEDURE

CREATE FUNCTION trigger_set_timestamp()
RETURNS TRIGGER AS $$
BEGIN 
  NEW.atualizado_em = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- auto updated_at products AUTO ATUALIZAÇÃO DE PRODUTOS

CREATE TRIGGER trigger_set_timestamp
BEFORE UPDATE ON produtos
FOR EACH ROW
EXECUTE PROCEDURE trigger_set_timestamp();


-- auto updated_at usuarios AUTO ATUALIZAÇÃO DE USUARIOS

CREATE TRIGGER trigger_set_timestamp
BEFORE UPDATE ON usuarios
FOR EACH ROW
EXECUTE PROCEDURE trigger_set_timestamp();


CREATE TABLE "session" (--session
  "sid" varchar NOT NULL COLLATE "default",
	"sess" json NOT NULL,
	"expire" timestamp(6) NOT NULL
)
WITH (OIDS=FALSE);

ALTER TABLE "session" ADD CONSTRAINT "session_pkey" PRIMARY KEY ("sid") NOT DEFERRABLE INITIALLY IMMEDIATE;

CREATE INDEX "IDX_session_expire" ON "session" ("expire");  

-- Efeito cascata
ALTER TABLE "produtos"
DROP CONSTRAINT produtos_usuario_id_fkey,
ADD CONSTRAINT produtos_usuario_id_fkey
FOREIGN KEY ("usuario_id")
REFERENCES "usuarios"("id")
ON DELETE CASCADE;

ALTER TABLE "arquivos"
DROP CONSTRAINT arquivos_produto_id_fkey,
ADD CONSTRAINT arquivos_produto_id_fkey
FOREIGN KEY ("produto_id")
REFERENCES "produtos" ("id")
ON DELETE CASCADE;

-- to run seeds

DELETE FROM produtos;
DELETE FROM usuarios;
DELETE FROM arquivos;

-- restart sequence auto_increment from tables ids

ALTER SEQUENCE produtos_id_seq RESTART WITH 1;
ALTER SEQUENCE usuarios_id_seq RESTART WITH 1;
ALTER SEQUENCE arquivos_id_seq RESTART WITH 1;

-- token password recovery

ALTER TABLE "usuarios" ADD COLUMN reset_token text;
ALTER TABLE "usuarios" ADD COLUMN reset_token_expires text;

-- Pedidos
CREATE TABLE "pedidos" (
	"id" SERIAL PRIMARY KEY,
  "vendedor_id" int NOT NULL,
  "comprador_id" int NOT NULL,
  "produto_id" int NOT NULL,
  "preco" int NOT NULL,
  "quantidade" int DEFAULT 0,
  "total" int NOT NULL,
  "status" int NOT NULL,
  "criado_em" timestamp DEFAULT (now()),
  "atualizado_em" timestamp DEFAULT (now())
);

ALTER TABLE "pedidos" ADD FOREIGN KEY ("vendedor_id") REFERENCES "usuarios"("id");
ALTER TABLE "pedidos" ADD FOREIGN KEY ("comprador_id") REFERENCES "usuarios"("id");
ALTER TABLE "pedidos" ADD FOREIGN KEY ("produto_id") REFERENCES "produtos"("id");

CREATE TRIGGER set_timestamp
BEFORE UPDATE ON pedidos
FOR EACH ROW
EXECUTE PROCEDURE trigger_set_timestamp();
