import type { Request } from "express";

import en from "./../lang/errorCodes";
import logger from "./logger";
import ipHelper from "./ip-helpers";

export default (
  req: Request,
  data?: any,
  err?: any,
  code?: keyof typeof en,
  fields?: any
) => {
  let resMessage = err?.message ?? err;
  if (code != null) {
    let key = code;
    if (!en[code]) key = "00008";
    let userId = "";
    if (req.user) userId = req.user?._id;

    const enMessage = en[key];
    if (code === "00008" && resMessage) {
      logger.error(resMessage, {
        userId,
        code,
        ipAddress: ipHelper(req),
        route: req.originalUrl,
        stack: err.stack,
      });
    }
    resMessage = code === "00008" ? resMessage ?? enMessage : enMessage;
  }

  return {
    data,
    error: {
      code,
      message: resMessage,
      fields,
    },
  };
};
