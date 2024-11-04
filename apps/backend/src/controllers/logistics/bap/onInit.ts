import { NextFunction, Request, Response } from "express";
import {
	responseBuilder,
	LOGISTICS_DOM_EXAMPLES_PATH,
	LOGISTICS_INT_EXAMPLES_PATH
} from "../../../lib/utils";

import fs from "fs";
import path from "path";
import YAML from "yaml";

export const onInitController = (
	req: Request,
	res: Response,
	next: NextFunction
) => {

		try {
			let domain = req.body.context.domain;
			let confirm;
			let error = req.body.error;
			
				switch (domain) {
					case "ONDC:LOG10":
						var file = fs.readFileSync(
							path.join(
								LOGISTICS_DOM_EXAMPLES_PATH,
								"/confirm/confirm_air.yaml"
							)
						);
						confirm = YAML.parse(file.toString());
						break;
					case "ONDC:LOG11":
						var file = fs.readFileSync(
							path.join(
								LOGISTICS_INT_EXAMPLES_PATH,
								"/confirm/confirm_air.yaml"
							)
						);
						confirm = YAML.parse(file.toString());
						break;
					default:
						var file = fs.readFileSync(
							path.join(
								LOGISTICS_DOM_EXAMPLES_PATH,
								"/confirm/confirm_air.yaml"
							)
						);
						confirm = YAML.parse(file.toString());
						break;
				}
				return responseBuilder(
					res,
					next,
					confirm.value.context,
					confirm.value.message,
					`${req.body.context.bpp_uri}${
						req.body.context.bpp_uri.endsWith("/") ? "confirm" : "/confirm"
					}`,
					`confirm`,
					"logistics"
				);
			
		} catch (error) {
			return next(error);
		}
};
