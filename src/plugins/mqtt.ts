var fastifyPlugin = require('fastify-plugin')
var mqtt = require('mqtt')

async function fastifyMqtt(fastify, opts, next) {
  try {
    const client = mqtt.connect(`mqtt://10.0.0.17`, {
      clientId: 'q4u_api_client-' + Math.floor(Math.random() * 1000000),
      username: opts.username,
      password: opts.password
    })
    fastify.decorate('mqttClient', client)
    next()
  } catch (err) {
    next(err)
  }
}

module.exports = fastifyPlugin(fastifyMqtt, '>=0.30.0')
