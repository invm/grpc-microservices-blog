# GRPC Blog

## Prerequisites

Download ```protoc``` binary from for your OS
```
https://github.com/protocolbuffers/protobuf/releases
```

To create protos files run from root folder

```
protoc -I=. ./protos/<protoName>.proto --js_out=import_style=commonjs,binary:./<serverFolder> --grpc_out=./<serverFolder> --plugin=protoc-gen-grpc=./<serverFolder>/node_modules/.bin/grpc_tools_node_protoc_plugin
```

Create certificates
```
chmod u+x ./scripts/gen_certs.sh

./scripts/gen_certs.sh
```

To create knex migrations
```
./server/node_modules/.bin/knex migrations:make <name>
```