import { v4 as uuidv4 } from 'uuid';
import axios from 'axios';
import { B2B_BPP_MOCKSERVER_URL, createAuthHeader, MOCKSERVER_ID, redis, responseBuilder } from '../../../lib/utils/';
import { NextFunction, Response } from 'express';

jest.mock('axios');
let actions = ['on_search', 'on_select', 'on_init', 'on_confirm', 'on_status', 'on_track', 'on_cancel', 'on_update', 'on_rating', 'on_support'];

describe('responseBuilder Sandbox Mode', () => {
  afterEach(() => {
    redis.disconnect()
  })

  for (let action of actions) {
    it('b2b sandbox mode responseBuilder - ' + action, async () => {
      const reqContext = { transaction_id: 'test-transaction-id' };
      const message = { test: 'message' };
      const uri = 'http://mock-uri';
      const domain = 'b2b';
      let res = {
        getHeader: jest.fn().mockReturnValue('sandbox'),
        locals: {},
        json: jest.fn(),
      } as any as Response;
      let next = jest.fn();

      redis.keys = jest.fn().mockResolvedValue(['transaction-id']);
      redis.set = jest.fn().mockResolvedValue(true);
      axios.post = jest.fn().mockResolvedValue({ data: { response: 'any response' } });

      await responseBuilder(res, next, reqContext, message, uri, action, domain);

      expect(redis.set).toHaveBeenCalledWith(
        `${reqContext.transaction_id}-${action}-from-server`,
        expect.any(String)
      );

      let ts = new Date();
      ts.setSeconds(ts.getSeconds() + 1);
      expect(axios.post).toHaveBeenCalledWith(
        uri,
        {
          message,
          context: {
            bpp_id: MOCKSERVER_ID,
            bpp_uri: B2B_BPP_MOCKSERVER_URL,
            timestamp: expect.any(String),
            action,
            transaction_id: reqContext.transaction_id,
          },
        },
        {
          headers: {
            authorization: expect.stringMatching(/Signature\s+keyId="[^"]+",\s*algorithm="[^"]+",\s*created="\d+",\s*expires="\d+",\s*headers="[^"]+",\s*signature="[^"]+"/),
          },
        }
      );
      expect(res.json).toHaveBeenCalledWith({
        message: {
          ack: {
            status: 'ACK',
          },
        },
      });
    });
  }
});
