require("dotenv").config()
const express = require("express")
const routes = require("./routes")
const handlebars = require("express-handlebars")
const flash = require("connect-flash")
const session = require("express-session")
const methodOverride = require("method-override")
const passport = require("./config/passport")
const helpers = require("./helpers/auth-helpers")
const handlebarsHelpers = require("./helpers/handlebars-helpers")
const path = require("path")

const app = express()
const port = process.env.PORT || 3000
const SESSION_SECRET = "secret"

app.engine("hbs", handlebars({ extname: ".hbs", helpers: handlebarsHelpers }))
app.set("view engine", "hbs")
app.use(express.urlencoded({ extended: true }))
app.use(express.static("public"))
app.use(express.json())
app.use(session({ secret: SESSION_SECRET, resave: false, saveUninitialized: false }))
app.use(passport.initialize())
app.use(passport.session())
app.use(flash())
app.use(methodOverride("_method"))
app.use("/upload", express.static(path.join(__dirname, "upload")))
app.use((req, res, next) => {
	res.locals.success_messages = req.flash("success_messages")
	res.locals.error_messages = req.flash("error_messages")
	res.locals.user = helpers.getUser(req)
	next()
})
app.use(routes)

app.listen(port, () => console.log(`Twitter Fullstack listening on port ${port}!`))

module.exports = app
