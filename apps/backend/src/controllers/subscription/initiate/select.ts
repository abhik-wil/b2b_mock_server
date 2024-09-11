import { NextFunction, Request, Response } from "express";
import {
	MOCKSERVER_ID,
	checkIfCustomized,
	send_response,
	send_nack,
	redisFetchToServer,
	Item,
	SUBSCRIPTION_BAP_MOCKSERVER_URL,
	SUBSCRIPTION_EXAMPLES_PATH,
} from "../../../lib/utils";
import { v4 as uuidv4 } from "uuid";
import fs from "fs";
import YAML from "yaml";
import _ from "lodash";
import path from "path";

export const initiateSelectController = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	try {
		const { transactionId } = req.body;

		const on_search = await redisFetchToServer("on_search", transactionId);
		if (!on_search) {
			return send_nack(res, "On Search doesn't exist");
		}
		return intializeRequest(req, res, next, on_search);
	} catch (error) {
		return next(error);
	}
};

const intializeRequest = async (
	req: Request,
	res: Response,
	next: NextFunction,
	transaction: any
) => {
	try {
		const {
			context,
			message: {
				catalog: { providers, payments },
			},
		} = transaction;

		const { scenario } = req?.query || "";
		const { transaction_id } = context;
		const { id, fulfillments } = providers?.[0];
		let items = [];
		let file: any;
		let response: any;
		items = providers[0].items = [
			providers?.[0]?.items.map(
				({
					id,
					fulfillment_ids,
				}: {
					id: string;
					fulfillment_ids: string[];
				}) => ({ id, fulfillment_ids: [fulfillment_ids?.[1]] })
			)?.[0],
		];

		let fulfillment: any = [
			{
				...fulfillments?.[2],
				// type: "subscription",
				// stops:fulfillments?.[2]?.stops,
				stops: [
					{
						type: "start",
						time: {
							label: "selected",
							range: {
								start: providers?.[0]?.time?.schedule?.times?.[0] ?? new Date(),
							},
							duration: fulfillments?.[2]?.stops?.time?.duration
								? fulfillments?.[2]?.stops?.time?.duration
								: "P6M",
							schedule: {
								frequency: fulfillments?.[2]?.stops?.time?.schedule?.frequency,
							},
						},
					},
				],
				tags: fulfillments?.[2]?.tags,
			},
		];
		switch (scenario) {
			case "subscription-with-eMandate":
				file = fs.readFileSync(
					path.join(SUBSCRIPTION_EXAMPLES_PATH, "select/select_mandate.yaml")
				);
				response = YAML.parse(file.toString());
				fulfillment = fulfillment;
				break;
			case "single-order-offline-without-subscription":
				file = fs.readFileSync(
					path.join(SUBSCRIPTION_EXAMPLES_PATH, "select/select_single.yaml")
				);
				response = YAML.parse(file.toString());
				fulfillment = response?.value?.message?.order?.fulfillments;

				break;
			case "single-order-online-without-subscription":
				file = fs.readFileSync(
					path.join(
						SUBSCRIPTION_EXAMPLES_PATH,
						"select/select_single_online.yaml"
					)
				);
				response = YAML.parse(file.toString());
				fulfillment = response?.value?.message?.order?.fulfillments;
				break;
			default:
				fulfillment = fulfillment;
		}

		console.log("scenariosssssssssssss",scenario,fulfillment)

		const select = {
			context: {
				...context,
				timestamp: new Date().toISOString(),
				action: "select",
				bap_id: MOCKSERVER_ID,
				bap_uri: SUBSCRIPTION_BAP_MOCKSERVER_URL,
				message_id: uuidv4(),
			},

			message: {
				order: {
					provider: {
						id,
					},
					items: items.map((itm: Item) => ({
						...itm,
						fulfillment_ids: itm.fulfillment_ids
							? itm.fulfillment_ids?.map((id: string) => String(id))
							: undefined,
						quantity: {
							selected: {
								count: 1,
							},
						},
					})),

					fulfillments: fulfillment,
					payments: [{ type: payments?.[0].type }],
				},
			},
		};
		await send_response(res, next, select, transaction_id, "select",scenario);
	} catch (error) {
		return next(error);
	}
};
