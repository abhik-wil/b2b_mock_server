import { NextFunction, Request, Response } from "express";
import { SERVICES_EXAMPLES_PATH, checkIfCustomized, quoteCreatorService, responseBuilder } from "../../../lib/utils";


export const confirmController = (req: Request, res: Response, next: NextFunction) => {
	if (checkIfCustomized(req.body.message.order.items)) {
		return confirmServiceCustomizationController(req, res, next);
	}
	confirmConsultationController(req, res, next);
};


export const confirmConsultationController = (req: Request, res: Response, next: NextFunction) => {
	const { context, message: { order } } = req.body;
	const { fulfillments } = order

	const rangeStart = new Date().setHours(new Date().getHours() + 2)
	const rangeEnd = new Date().setHours(new Date().getHours() + 3)
	fulfillments[0].stops.push({
		type: "start",
		location: {
			id: "L1",
			descriptor: {
				name: "ABC Store"
			},
			gps: "12.956399,77.636803"
		},
		time: {
			range: {
				start: new Date(rangeStart).toISOString(),
				end: new Date(rangeEnd).toISOString()
			}
		},
		contact: {
			phone: "9886098860",
			email: "nobody@nomail.com"
		},
		person: {
			name: "Kishan"
		}
	})
	const responseMessage = {
		order: {
			...order,
			status: 'Accepted',
			fulfillments: [{
				...fulfillments[0],
				state: {
					descriptor: {
						code: "Pending"
					}
				},
				stops: fulfillments[0].stops.map((itm: any) => ({
					...itm,
					person: itm.customer && itm.customer.person ? itm.customer.person : undefined,
				})),
				rateable: true,
			}],
			provider: {
				...order.provider,
				rateable: true
			}
		}
	}
	return responseBuilder(
		res,
		next,
		context,
		responseMessage,
		`${req.body.context.bap_uri}${req.body.context.bap_uri.endsWith("/") ? "on_confirm" : "/on_confirm"
		}`,
		`on_confirm`,
		"healthcare-service"
	);
};


export const confirmServiceCustomizationController = (req: Request, res: Response, next: NextFunction) => {
	const { context, message: { order } } = req.body;
	const { fulfillments } = order

	const rangeStart = new Date().setHours(new Date().getHours() + 2)
	const rangeEnd = new Date().setHours(new Date().getHours() + 3)
	const timestamp = new Date()
	const end_time = new Date(timestamp.getTime() + 30 * 60 * 1000)

	context.action = "on_confirm"
	fulfillments[0].stops.splice(1, 0,
		{
			id: "L1",
			type: "start",
			location: {
				id: "L1",
				descriptor: {
					name: "ABC Store"
				},
				gps: "12.956399,77.636803"
			},
			time: {
				range: {
					start: timestamp.toISOString(),
					end: end_time.toISOString()
				}
			},
			contact: {
				phone: "9886098860",
				email: "nobody@nomail.com"
			},
			person: {
				name: "Kishan"
			}
		})
	fulfillments[0].stops.forEach((itm: any) => {
		if (itm.type === "end") {
			itm.id = "L2"
			itm.authorization = {
				type: "OTP",
				token: "1234",
				valid_from: "2023-11-16T09:30:00.000Z",
				valid_to: "2023-11-16T09:35:00.000Z",
				status: "valid"
			}
			itm.person = { name: itm.customer.person.name }
			itm.customer = undefined
		}
	})

	const responseMessage = {
		order: {
			...order,
			status: 'Accepted',
			provider: {
				...order.provider,
				rateable: true,
			},
			fulfillments: [{
				...fulfillments[0],
				// state hard coded
				state: {
					descriptor: {
						code: "Pending"
					}
				},
				rateable: true,
				// stops: 
			}]
		}
	}

	return responseBuilder(
		res,
		next,
		context,
		responseMessage,
		`${req.body.context.bap_uri}${req.body.context.bap_uri.endsWith("/") ? "on_confirm" : "/on_confirm"
		}`,
		`on_confirm`,
		"healthcare-service"
	);
};

