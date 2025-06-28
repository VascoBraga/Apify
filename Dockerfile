FROM apify/actor-node-playwright-chrome

# Copia todos os arquivos do projeto
COPY . ./

# Instala apenas as dependências do seu código
RUN npm install

# Entrypoint
CMD ["npm", "start"]
