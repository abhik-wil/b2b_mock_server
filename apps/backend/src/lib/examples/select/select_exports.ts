export const selectExports = {
  context: {
    domain: "ONDC:RET10",
    location: {
      city: {
        code: "std:080"
      },
      country: {
        code: "IND"
      }
    },
    action: "select",
    version: "2.0.1",
    bap_id: "buyerapp.com",
    bap_uri: "https://buyerapp.com/grocery",
    bpp_id: "sellerapp.com",
    bpp_uri: "https://sellerapp.com/grocery",
    transaction_id: "T1",
    message_id: "M1",
    timestamp: "2023-01-08T22:00:30.000Z",
    ttl: "PT1D"
  },
  message: {
    order: {
      provider: {
        id: "P1",
        locations: [
          {
            id: "L1"
          }
        ],
        ttl: "P1D"
      },
      items: [
        {
          id: "I1",
          location_ids: [
            "L1"
          ],
          fulfillment_ids: [
            "F1"
          ],
          quantity: {
            selected: {
              count: 200
            }
          },
          "add-ons": [
            {
              id: "78787723"
            }
          ],
          tags: [
            {
              descriptor: {
                code: "BUYER_TERMS"
              },
              list: [
                {
                  descriptor: {
                    code: "ITEM_REQ"
                  },
                  value: "free text on Item Customization"
                },
                {
                  descriptor: {
                    code: "PACKAGING_REQ"
                  },
                  value: "free text on packaging Customization"
                }
              ]
            }
          ]
        }
      ],
      fulfillments: [
        {
          id: "F1",
          type: "Delivery",
          stops: [
            {
              type: "end",
              location: {
                gps: "1.3806217468119772, 103.74636438437074",
                area_code: "680230",
                city: {
                  name: "Jurong East"
                },
                country: {
                  code: "SGP"
                },
                state: {
                  name: ""
                }
              },
              contact: {
                phone: "9886098860"
              }
            }
          ],
          customer: {
            person: {
              creds: [
                {
                  id: "ESG-12345678",
                  type: "License",
                  desc: "Import License No. ESG-12345678",
                  icon: "https://abcd.cdn.com/images/license-img",
                  url: "https://abcd.dnb.com/verify?id=’ESG-12345678'"
                }
              ]
            }
          },
          tags: [
            {
              descriptor: {
                code: "DELIVERY_TERMS"
              },
              list: [
                {
                  descriptor: {
                    code: "INCOTERMS"
                  },
                  value: "CIF"
                },
                {
                  descriptor: {
                    code: "NAMED_PLACE_OF_DELIVERY"
                  },
                  value: "SGP"
                }
              ]
            }
          ]
        }
      ],
      payments: [
        {
          type: "ON-FULFILLMENT"
        }
      ],
      tags: [
        {
          descriptor: {
            code: "buyer_id"
          },
          list: [
            {
              descriptor: {
                code: "buyer_id_code"
              },
              value: "gst"
            },
            {
              descriptor: {
                code: "buyer_id_no"
              },
              value: "xxxxxxxxxxxxxxx"
            }
          ]
        }
      ]
    }
  }
}