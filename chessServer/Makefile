
APP=server.py
HOST=0.0.0.0
PORT=5000
CERT=cert.pem
KEY=key.pem

.PHONY: run ssl run-ssl clean ngrok

# Default: run app with HTTP
run:
	python3 $(APP)

# Generate self-signed SSL certs
ssl:
	openssl req -x509 -newkey rsa:2048 -nodes \
		-keyout $(KEY) -out $(CERT) -days 365 \
		-subj "/C=US/ST=Nowhere/L=Nowhere/O=Dev/CN=localhost"

# Run app with HTTPS
run-ssl: ssl
	python3 $(APP) --ssl

# Run Flask app and expose via ngrok (requires ngrok installed)
ngrok:
	ngrok http $(PORT)

# Clean certs
clean:
	rm -f $(KEY) $(CERT)
