const passport = require("passport")
const LocalStrategy = require("passport-local")
const bcrypt = require("bcryptjs")
const db = require("../models")
const { User, Tweet, Like } = require("../models")

passport.use(new LocalStrategy(
	{
		usernameField: "account",
		passwordField: "password",
		passReqToCallback: true
	},
	(req, account, password, cb) => {
		User.findOne({ where: { account } })
			.then(user => {
				if (!user) return cb(null, false, req.flash("error_messages", "帳號或密碼輸入錯誤！"))
				bcrypt.compare(password, user.password).then(res => {
					if (!res) return cb(null, false, req.flash("error_messages", "帳號或密碼輸入錯誤！"))
					return cb(null, user)
				})
			})
	}
))

passport.serializeUser((user, cb) => {
	cb(null, user.id)
})
passport.deserializeUser((id, cb) => {
	User.findByPk(id, {
		include: [
			{ model: Tweet, include: Like },
			{ model: User, as: "Followers" },
			{ model: User, as: "Followings" }
		]
	})
		.then(user => cb(null, user.toJSON()))
		.catch(err => cb(err))
})

module.exports = passport
