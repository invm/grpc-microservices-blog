
#Inspired from: https://github.com/gbahamondezc/node-grpc-ssl/blob/master/scripts/gen_certs.sh
# Output files
# ../certs/ca.key: Certificate Authority private key file (this shouldn"t be shared in real-life)
# ../certs/ca.crt: Certificate Authority trust certificate (this should be shared with users in real-life)
# ../certs/server.key: Server private key, password protected (this shouldn"t be shared)
# ../certs/server.csr: Server certificate signing request (this should be shared with the CA owner)
# ../certs/server.crt: Server certificate signed by the CA (this would be sent back by the CA owner) - keep on server
# Summary 
# Private files: ../certs/ca.key, ../certs/server.key, server.pem (We don"t need this, in our case), server.crt
# "Share" files: ../certs/ca.crt (needed by the client), ../certs/server.csr (needed by the CA)

echo "Purging current certs"
[ -d "../certs" ] && rm -rf "../certs"

echo "Creating certs folder ..."
mkdir ../certs && cd ../certs

echo "Generating certificates ..."
echo "Provide password"
stty -echo
read password
stty echo
read -p "Country [US]: " country
read -p "State [WA]: " state
read -p "City [Seattle]: " city
read -p "App name [Test]: " appname
read -p "Host [localhost]: " host

country=${country:-US}
state=${state:-WA}
city=${city:-Seattle}
appname=${appname:-Test}
host=${host:-localhost}

openssl genrsa -passout pass:$password -des3 -out ../certs/ca.key 4096

openssl req -passin pass:$password -new -x509 -days 365 -key ../certs/ca.key -out ../certs/ca.crt -subj  "/C=$country/ST=$state/L=$city/O=$appname/OU=$appname/CN=ca"

openssl genrsa -passout pass:$password -des3 -out ../certs/server.key 4096

openssl req -passin pass:$password -new -key ../certs/server.key -out ../certs/server.csr -subj  "/C=$country/ST=$state/L=$city/O=$appname/OU=Server/CN=$host"

openssl x509 -req -passin pass:$password -days 365 -in ../certs/server.csr -CA ../certs/ca.crt -CAkey ../certs/ca.key -set_serial 01 -out ../certs/server.crt

openssl rsa -passin pass:$password -in ../certs/server.key -out ../certs/server.key

openssl genrsa -passout pass:$password -des3 -out ../certs/client.key 4096

openssl req -passin pass:$password -new -key ../certs/client.key -out ../certs/client.csr -subj  "/C=$country/ST=$state/L=$city/O=$appname/OU=Client/CN=$host"

openssl x509 -passin pass:$password -req -days 365 -in ../certs/client.csr -CA ../certs/ca.crt -CAkey ../certs/ca.key -set_serial 01 -out ../certs/client.crt

openssl rsa -passin pass:$password -in ../certs/client.key -out ../certs/client.key