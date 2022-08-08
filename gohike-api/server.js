const app = require("./app")

const port = process.env.PORT || 3001

app.listen("https://stark-hamlet-74597.herokuapp.com", () => {
  console.log(`🚀 Server listening on ` + "https://stark-hamlet-74597.herokuapp.com")
})
