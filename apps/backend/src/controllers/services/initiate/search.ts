import { NextFunction, Request, Response } from "express";
import fs from "fs";
import path from "path";
import YAML from "yaml";
import { v4 as uuidv4 } from "uuid";
import {
	MOCKSERVER_ID,
	send_response,
	AGRI_EQUIPMENT_HIRING_EXAMPLES_PATH,
	SERVICES_EXAMPLES_PATH,
	HEALTHCARE_SERVICES_EXAMPLES_PATH,
	AGRI_SERVICES_EXAMPLES_PATH,
	SERVICES_BAP_MOCKSERVER_URL,
	BID_AUCTION_SERVICES_EXAMPLES_PATH,
} from "../../../lib/utils";
import { ACTTION_KEY } from "../../../lib/utils/actionOnActionKeys";
import { SERVICES_DOMAINS } from "../../../lib/utils/apiConstants";

export const initiateSearchController = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	try {
		const { bpp_uri, city, domain } = req.body;
		let onSearch, file;

		switch (domain) {
			case SERVICES_DOMAINS.SERVICES:
				file = fs.readFileSync(
					path.join(SERVICES_EXAMPLES_PATH, "search/search_by_category.yaml")
				);
				onSearch = YAML.parse(file.toString());
				break;

			case SERVICES_DOMAINS.HEALTHCARE_SERVICES:
				file = fs.readFileSync(
					path.join(HEALTHCARE_SERVICES_EXAMPLES_PATH, "search/search.yaml")
				);
				onSearch = YAML.parse(file.toString());
				break;

			case SERVICES_DOMAINS.AGRI_EQUIPMENT:
				file = fs.readFileSync(
					path.join(
						AGRI_EQUIPMENT_HIRING_EXAMPLES_PATH,
						"search/search_by_category.yaml"
					)
				);
				onSearch = YAML.parse(file.toString());
				break;

			case SERVICES_DOMAINS.AGRI_SERVICES:
				file = fs.readFileSync(
					path.join(
						AGRI_SERVICES_EXAMPLES_PATH,
						"search/search_by_category.yaml"
					)
				);
				onSearch = YAML.parse(file.toString());
				break;
			case SERVICES_DOMAINS.BID_ACTION_SERVICES:
				file = fs.readFileSync(
					path.join(
						BID_AUCTION_SERVICES_EXAMPLES_PATH,
						"search/search_by_category.yaml"
					)
				);
				onSearch = YAML.parse(file.toString());
				break;
			default:
				file = fs.readFileSync(
					path.join(SERVICES_EXAMPLES_PATH, "search/search_by_category.yaml")
				);
				onSearch = YAML.parse(file.toString());
				break;
		}
		let search = YAML.parse(file.toString());
		search = search.value;
		const transaction_id = uuidv4();
		const timestamp = new Date().toISOString();

		search = {
			...search,
			context: {
				...search.context,
				timestamp,
				location: {
					...search.context.location,
					city: {
						code: city,
					},
				},
				transaction_id,
				domain,
				bap_id: MOCKSERVER_ID,
				bap_uri: SERVICES_BAP_MOCKSERVER_URL,
				message_id: uuidv4(),
			},
		};
		search.bpp_uri = bpp_uri;
		await send_response(res, next, search, transaction_id, ACTTION_KEY.SEARCH);
	} catch (error) {
		return next(error);
	}
};
