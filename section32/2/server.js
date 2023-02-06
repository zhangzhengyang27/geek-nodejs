const app = new (require('koa'));
const graphqlHTTP = require('koa-graphql');


app.use(
    graphqlHTTP({
        schema: require('./schema')
    })
)

// localhost:3000?query={comment{name}}
app.listen(3000);


