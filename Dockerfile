FROM apify/actor-node-playwright:latest

# Copia tudo para dentro do container
COPY . ./

# Instala dependências e baixa os navegadores
RUN npm install && npx playwright install --with-deps

CMD ["npm", "start"]
