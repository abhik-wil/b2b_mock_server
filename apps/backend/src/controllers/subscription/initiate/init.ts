import { NextFunction, Request, Response } from "express";
import { v4 as uuidv4 } from "uuid";
import fs from "fs";
import YAML from "yaml";
import {
	MOCKSERVER_ID,
	send_response,
	send_nack,
	redisFetchToServer,
	SUBSCRIPTION_BAP_MOCKSERVER_URL,
	SUBSCRIPTION_EXAMPLES_PATH,
	quoteSubscription,
	redisFetchFromServer,
} from "../../../lib/utils";
import {
	ACTTION_KEY,
	ON_ACTION_KEY,
} from "../../../lib/utils/actionOnActionKeys";
import { ERROR_MESSAGES } from "../../../lib/utils/responseMessages";
import { BILLING_DETAILS } from "../../../lib/utils/apiConstants";
import path from "path";

export const initiateInitController = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	try {
		const { transactionId } = req.body;
		const {scenario} = req.query;
		const on_search = await redisFetchFromServer(
			ON_ACTION_KEY.ON_SEARCH,
			transactionId
		);
		if (!on_search) {
			return send_nack(res, ERROR_MESSAGES.ON_SEARCH_DOES_NOT_EXISTED);
		}
		const providersItems = on_search?.message?.catalog?.providers[0]?.items;
		req.body.providersItems = providersItems;

		const on_select = await redisFetchToServer(
			ON_ACTION_KEY.ON_SELECT,
			transactionId
		);
		if (!on_select) {
			return send_nack(res, ERROR_MESSAGES.ON_SELECT_DOES_NOT_EXISTED);
		}
		if (Object.keys(on_select).includes("error")) {
			return send_nack(res, ERROR_MESSAGES.ON_SELECT_DOES_NOT_EXISTED);
		}
		on_select.providersItems = providersItems;
		return intializeRequest(res, next, on_select, scenario);
	} catch (error) {
		return next(error);
	}
};

const intializeRequest = async (
	res: Response,
	next: NextFunction,
	transaction: any,
	scenario: any
) => {
	try {
		const {
			context,
			message: {
				order: { provider, fulfillments, quote },
			},
			providersItems,
		} = transaction;
		let { payments, items } = transaction.message.order;
		const { id, type, stops } = fulfillments[0];
		const { id: parent_item_id, location_ids, ...item } = items[0];

		items = items.map(
			({ location_ids, ...items }: { location_ids: any }) => items
		);

		let quoteData: any = transaction?.message?.order?.quote?transaction?.message?.order?.quote:quoteSubscription(
			items,
			providersItems,
			"",
			fulfillments[0]
		);

		let file: any;
		/*****HANDLE SCENARIOS OF INIT*****/
		switch (scenario) {
			case "subscription-with-manual-payments":
				file = fs.readFileSync(
					path.join(SUBSCRIPTION_EXAMPLES_PATH, "init/init_manual.yaml")
				);
				break;
			case "subscription-with-eMandate":
				file = fs.readFileSync(
					path.join(SUBSCRIPTION_EXAMPLES_PATH, "init/init_mandate.yaml")
				);
				break;
			case "subscription-with-full-payments":
				file = fs.readFileSync(
					path.join(SUBSCRIPTION_EXAMPLES_PATH, "init/init_full.yaml")
				);
				break;

			case "single-order-offline-without-subscription":
				file = fs.readFileSync(
					path.join(SUBSCRIPTION_EXAMPLES_PATH, "init/init_single.yaml")
				);
				break;
			case "single-order-online-without-subscription":
				file = fs.readFileSync(
					path.join(SUBSCRIPTION_EXAMPLES_PATH, "init/init.yaml")
				);
				break;
			default:
				file = fs.readFileSync(
					path.join(SUBSCRIPTION_EXAMPLES_PATH, "init/init.yaml")
				);
		}

		const response = YAML.parse(file.toString());

		const init = {
			context: {
				...context,
				timestamp: new Date().toISOString(),
				action: ACTTION_KEY.INIT,
				bap_id: MOCKSERVER_ID,
				bap_uri: SUBSCRIPTION_BAP_MOCKSERVER_URL,
				message_id: uuidv4(),
			},
			message: {
				order: {
					provider: {
						...provider,
						locations: [{ id: uuidv4() }],
					},
					items,
					billing: BILLING_DETAILS,
					fulfillments,
					payments: [
						{
							...response?.value?.message?.order?.payments[0],
							params: {
								amount: (quoteData?.price?.value).toString(),
								currency: "INR",
							},
						},
					],
				},
			},
		};
		await send_response(
			res,
			next,
			init,
			context.transaction_id,
			ACTTION_KEY.INIT,
			(scenario = scenario)
		);
	} catch (error) {
		next(error);
	}
};
