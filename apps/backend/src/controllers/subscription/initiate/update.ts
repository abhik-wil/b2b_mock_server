import { NextFunction, Request, Response } from "express";
import axios from "axios";
import fs from "fs";
import path from "path";
import YAML from "yaml";
import { v4 as uuidv4 } from "uuid";
import {
	send_nack,
	createAuthHeader,
	redis,
	redisFetchToServer,
	AGRI_EQUIPMENT_HIRING_EXAMPLES_PATH,
	SUBSCRIPTION_BAP_MOCKSERVER_URL,
} from "../../../lib/utils";
import { ERROR_MESSAGES } from "../../../lib/utils/responseMessages";
import { ON_ACTION_KEY } from "../../../lib/utils/actionOnActionKeys";

export const initiateUpdateController = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	try {
		let { scenario, update_target, transactionId } = req.body;
		const on_confirm = await redisFetchToServer(
			ON_ACTION_KEY.ON_CONFIRM,
			transactionId
		);
		if (!on_confirm) {
			return send_nack(res, ERROR_MESSAGES.ON_CONFIRM_DOES_NOT_EXISTED);
		}
		on_confirm.context.bpp_uri = SUBSCRIPTION_BAP_MOCKSERVER_URL;
		// update_target = update_target ? update_target : "payments"

		let { context, message } = on_confirm;
		const timestamp = new Date().toISOString();
		context.action = "update";
		context.timestamp = timestamp;
		let responseMessage: any;
		// Need to reconstruct this logic

		scenario = update_target ? update_target : "payments";

		if (scenario === "payments"){
			//FETCH ON UPDATE IF UPDATE PAYMENT FLOW COME
			const on_update = await redisFetchToServer(
				ON_ACTION_KEY.ON_UPDATE,
				transactionId
			);
			if (!on_update) {
				return send_nack(res, ERROR_MESSAGES.ON_UPDATE_DOES_NOT_EXISTED);
			}
			message = on_update.message;
		}

		switch (scenario) {
			case "payments":
				responseMessage = updatePaymentController(message, update_target);
				break;
			case "fulfillments":
				responseMessage = rescheduleRequest(message, update_target);
				break;
			case "items":
				responseMessage = modifyItemsRequest(message, update_target);
				break;
			default:
				responseMessage = requoteRequest(message, update_target);
				break;
		}

		const update = {
			context,
			message: responseMessage,
		};

		const header = await createAuthHeader(update);

		await redis.set(
			`${transactionId}-update-from-server`,
			JSON.stringify({ request: { ...update } })
		);
		const response = await axios.post(
			`${context.bpp_uri}/update?scenario=${scenario}`,
			update,
			{
				headers: {
					authorization: header,
				},
			}
		);

		await redis.set(
			`${transactionId}-update-from-server`,
			JSON.stringify({
				request: { ...update },
				response: {
					response: response.data,
					timestamp: new Date().toISOString(),
				},
			})
		);
		return res.json({
			message: {
				ack: {
					status: "ACK",
				},
			},
			transactionId,
		});
	} catch (error) {
		return next(error);
	}
};

function requoteRequest(message: any, update_target: string) {
	let {
		order: { items, payments, fulfillments, quote },
	} = message;

	items = items.map(
		({
			id,
			parent_item_id,
			...every
		}: {
			id: string;
			parent_item_id: object;
		}) => ({
			...every,
			id,
			parent_item_id,
		})
	);

	fulfillments.map((itm: any) => {
		itm.state.descriptor.code = "Completed";
	});

	const responseMessage = {
		update_target:
			update_target === "items"
				? "fulfillments,items"
				: update_target === "fulfillments"
				? "fulfillments"
				: "payments",
		order: {
			id: message.order.id,
			provider: {
				id: message.order.provider.id,
			},
			items,
			payments,
			fulfillments: fulfillments.map((itm: any) => ({
				...itm,
				stops: itm.stops.map((stop: any) => ({
					...stop,
				})),
			})),
			quote,
		},
	};
	return responseMessage;
}

function rescheduleRequest(message: any, update_target: string) {
	let {
		order: { items, payments, fulfillments, quote },
	} = message;

	items = items.map(
		({
			id,
			parent_item_id,
			...every
		}: {
			id: string;
			parent_item_id: object;
		}) => ({
			...every,
			id,
			parent_item_id,
		})
	);

	fulfillments.map((itm: any) => {
		itm.state.descriptor.code = "Pending";
	});

	const responseMessage = {
		update_target: "fulfillments",
		order: {
			id: message.order.id,
			status: "Accepted",
			provider: message.order.provider,
			items,
			payments,
			fulfillments: fulfillments.map((itm: any) => ({
				...itm,
				stops: itm.stops.map((stop: any) => ({
					...stop,
				})),
			})),
			quote,
		},
	};
	return responseMessage;
}

function updatePaymentController(message: any, update_target: string){
	let {
		order: { items, payments, fulfillments, quote },
	} = message;

	payments = payments.map((ele: any) => {
		ele.status = "PAID";
		return ele;
	});

	const responseMessage = {
		update_target,
		order: {
			id: message.order.id,
			status: "Completed",
			provider: message.order.provider,
			items,
			payments,
			fulfillments: fulfillments.map((itm: any) => ({
				...itm,
				stops: itm.stops.map((stop: any) => ({
					...stop,
				})),
			})),
			quote,
		},
	};
	return responseMessage;
}

function modifyItemsRequest(message: any, update_target: string){
	let {
		order: { items, payments, fulfillments, quote },
	} = message;

	//LOGIC CHANGED ACCORDING TO SANDBOX QUERIES
	const file = fs.readFileSync(
		path.join(
			AGRI_EQUIPMENT_HIRING_EXAMPLES_PATH,
			"update/update_extend_renting_period.yaml"
		)
	);
	const response = YAML.parse(file.toString());
	const updatedPackageQuantity = items.map((ele: any) => {
		ele.quantity.selected.count = 3; //Update quantity of tests
		return ele;
	});

	const responseMessage = {
		update_target: "items",
		order: {
			...response.value.message.order,
			id: uuidv4(),
			items: [updatedPackageQuantity[0]],
			payments,
			quote,
		},
	};

	return responseMessage;
}
