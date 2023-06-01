import bodyParser from "body-parser";
import compression from "compression";
import cors, { type CorsOptions } from "cors";
import type { Application, Request, Response } from "express";
import passport from "passport";
import "../config/strategies/user";
import routes from "../api/routes/index";
import { Env } from "../config";

export default (app: Application) => {
  const corsOptions: CorsOptions = {
    origin(origin, callback) {
      if (!origin || Env.allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
  };

  app.use(cors(corsOptions));
  app.use(bodyParser.json());
  app.use(passport.initialize());
  app.use(Env.PREFIX, routes);
  app.use(compression());

  app.get("/", (req, res) =>
    res
      .status(200)
      .json({
        resultMessage: "Project is successfully working...",
        resultCode: "00004",
      })
      .end()
  );

  app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header(
      "Access-Control-Allow-Headers",
      "Origin, X-Requested-With, Content-Type, Accept, Authorization"
    );
    res.header("Content-Security-Policy-Report-Only", "default-src: https:");
    if (req.method === "OPTIONS") {
      res.header("Access-Control-Allow-Methods", "PUT POST PATCH DELETE GET");
      return res.status(200).json({});
    }
    next();
  });

  app.use((_req, _res, next) => {
    const error = new Error("Endpoint could not find!") as any;
    error.status = 404;
    next(error);
  });

  app.use(async (error: any, _: Request, res: Response) => {
    res.status(error.status || 500);
    return res.json({
      resultMessage: error.message,
      resultCode: "00008",
    });
  });
};
