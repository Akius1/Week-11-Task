import createError from "http-errors";
import express, { Request, Response, NextFunction } from "express";
import path from "path";
import cookieParser from "cookie-parser";
import logger from "morgan";
import { graphqlHTTP } from "express-graphql";

import schema from "./schema/schema";
import mongoose from "mongoose";
import { verifyToken } from "./routes/index";

var app = express();

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

app.use(
  "/graphql",
  graphqlHTTP(async (req) => ({
    schema,
    context: await verifyToken(req),
    graphiql: true,
  }))
);

//app.use("/users", usersRouter);

mongoose.set("useFindAndModify", false);
mongoose
  .connect(
    "mongodb+srv://user_1:akius123@organizations.jkima.mongodb.net/<GraphQL>?retryWrites=true&w=majority",
    { useNewUrlParser: true, useUnifiedTopology: true }
  )
  .then((res) => {
    console.log("connected");
  })
  .catch((err) => {
    console.log(err);
  });
// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (
  err: { message: any; status: any },
  req: Request,
  res: Response,
  next: NextFunction
) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render("error");
});

export default app;
