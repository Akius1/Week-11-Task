"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const http_errors_1 = __importDefault(require("http-errors"));
const express_1 = __importDefault(require("express"));
const path_1 = __importDefault(require("path"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const morgan_1 = __importDefault(require("morgan"));
const express_graphql_1 = require("express-graphql");
const schema_1 = __importDefault(require("./schema/schema"));
const mongoose_1 = __importDefault(require("mongoose"));
const index_1 = require("./routes/index");
var app = express_1.default();
// view engine setup
app.set("views", path_1.default.join(__dirname, "views"));
app.set("view engine", "ejs");
app.use(morgan_1.default("dev"));
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: false }));
app.use(cookie_parser_1.default());
app.use(express_1.default.static(path_1.default.join(__dirname, "public")));
app.use("/graphql", express_graphql_1.graphqlHTTP(async (req) => ({
    schema: schema_1.default,
    context: await index_1.verifyToken(req),
    graphiql: true,
})));
//app.use("/users", usersRouter);
async function connectTocluster() {
    await mongoose_1.default
        .connect(
    //"mongodb+srv://user_1:akius123@organizations.jkima.mongodb.net/<GraphQL>?retryWrites=true&w=majority",
    "mongodb://localhost/week11", {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useFindAndModify: false,
    })
        .then((res) => {
        //console.log("connected");
    })
        .catch((err) => {
        //console.log(err);
    });
}
connectTocluster();
// catch 404 and forward to error handler
app.use(function (req, res, next) {
    next(http_errors_1.default(404));
});
// error handler
app.use(function (err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get("env") === "development" ? err : {};
    // render the error page
    res.status(err.status || 500);
    res.render("error");
});
exports.default = app;
