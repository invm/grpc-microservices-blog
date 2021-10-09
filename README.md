# Nodejs gRPC microservices

A simple implementation of grpc with nodejs and psql, distributed into different client and server services, with ssl certs generation script.

## Prerequisites

- node (in order to create protos files)
- docker
- docker-compose
- openssl (optional,needed in order to work with ssl certificates, otherwise possible with insecure credentials)

Create protos files run from server folder (needs ```npm i ``` first)

```
./node_modules/.bin/grpc_tools_node_protoc \
  --js_out=import_style=commonjs,binary:./protos \          
  --grpc_out=grpc_js:./protos \                      
  --plugin=protoc-gen-grpc=./node_modules/.bin/grpc_tools_node_protoc_plugin \    
  -I ../protos \                                                                  
  ../protos/*.proto
```

### How to run

Copy output files from previous command to client service

Create .env file in root folder from the .env.example

Create certificates
```
chmod u+x ./scripts/gen_certs.sh

./scripts/gen_certs.sh
```

Simply run
```
docker-compose up 
```