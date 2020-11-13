require('dotenv').config({
  path: `./environments/.env.${process.env.NODE_ENV || 'local'}`
});
const express = require('express');
const bodyParser = require('body-parser');
const request = require('request');

const PORT = process.env.EXPRESS_PORT;
const TARGET_URL = process.env.TARGET_URL;
const app = express();

app.use(bodyParser.json());

app.listen(PORT, () => {
  app.post('/webhook', (req, res) => {
    const data = req.body;

    const mapped = {
      username: 'Bugsnag Bot',
      content: 'Notificação de erro do Bugsnag',
      embeds: [
        {
          title: data.error.exceptionClass,
          description: data.error.message,
          url: data.error.url,
          fields: [
            {
              name: 'Projeto',
              value: data.project.name,
            },
            {
              name: 'Mensagem de erro',
              value: data.error.message,
              inline: true,
            },
          ]
        }
      ]
    };
    
    request(TARGET_URL, {
      headers: {
        'content-type': 'application/json',
      },
      method: 'POST',
      body: JSON.stringify(mapped),
    }, function (error) {
      if (error) {
        console.error(error);
      }
    });

    res.send();
  });
});