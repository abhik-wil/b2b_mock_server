import { v4 as uuidv4 } from 'uuid';
import axios from 'axios';
import { responseBuilder } from '../../../lib/utils';
import { NextFunction, Response } from 'express';
import { Redis } from 'ioredis';

jest.mock('axios');
jest.mock('ioredis', () => ({
  Redis: () => ({
    set: jest.fn(),
    keys: jest.fn(),
  })
}));

let redis = new Redis();


describe('responseBuilder Sandbox Mode', () => {
  it('b2b sandbox mode responseBuilder', async () => {
    const reqContext = { transaction_id: 'test-transaction-id' };
    const message = { test: 'message' };
    const uri = 'http://mock-uri';
    const action = 'on_status';
    const domain = 'b2b';
    let res = {
      getHeader: jest.fn().mockReturnValue('sandbox'),
      locals: {},
      json: jest.fn(),
    } as any as Response;
    let next = jest.fn();

    redis.keys = jest.fn().mockResolvedValue(['transaction-id']);
    axios.post = jest.fn().mockResolvedValue({ data: { response: 'any response' } });

    await responseBuilder(res, next, reqContext, message, uri, action, domain);

    // expect(redis.set).toHaveBeenCalledWith(
    //   'transaction-id',
    //   expect.any(String)
    // );
    // expect(axios.post).toHaveBeenCalledWith(
    //   uri,
    //   expect.any(Object),
    //   expect.any(Object)
    // );
    expect(res.json).toHaveBeenCalledWith({
      message: {
        ack: {
          status: 'ACK',
        },
      },
    });
  });

  // Additional test cases for different scenarios
});
