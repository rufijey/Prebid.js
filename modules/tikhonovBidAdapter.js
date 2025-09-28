import {registerBidder} from '../src/adapters/bidderFactory.js';
import {BANNER} from '../src/mediaTypes.js';

const BIDDER_CODE = 'tikhonov';
const AUCTION_ENDPOINT = 'https://prebid.tikhonov.ua/auction';

export const spec = {
  code: BIDDER_CODE,
  supportedMediaTypes: [BANNER],

  isBidRequestValid: bid => !!bid.params?.placementId,

  buildRequests: (validBidRequests, bidderRequest) => {
    return validBidRequests.map(bid => {
      return {
        method: 'POST',
        url: AUCTION_ENDPOINT,
        data: {
          placementId: bid.params.placementId,
          bidId: bid.bidId,
          sizes: bid.sizes || []
        }
      };
    });
  },

  interpretResponse: (serverResponse, request) => {
    const body = serverResponse.body;
    if (!body || !body.cpm) {
      return [];
    }

    return [{
      requestId: body.bidId,
      cpm: body.cpm,
      width: body.width,
      height: body.height,
      ad: body.ad,
      ttl: 300,
      creativeId: body.creativeId || '123',
      netRevenue: true,
      currency: body.currency || 'USD',
      meta: {
        advertiserDomains: body.adomain || []
      }
    }];
  }
};

registerBidder(spec);
