module.exports = (mongoose) => {
	const { mongooseConnectionString } = require('../config.json')
  if (!mongooseConnectionString) return;

  mongoose.connect(mongooseConnectionString, {
	useNewUrlParser: true,
	useUnifiedTopology: true
}).then(() => {
	console.log(`[mongoose] Connected to the database!`);
}).catch((err) => {
	console.log(err);
})
}