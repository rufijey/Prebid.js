import { expect } from 'chai';
import { spec } from 'modules/tikhonovBidAdapter.js';
import { newBidder } from 'src/adapters/bidderFactory.js';

describe('tikhonovBidAdapter', function () {
  const adapter = newBidder(spec);

  const bid = {
    bidder: 'tikhonov',
    bidId: '123',
    params: {
      placementId: 'demo123'
    },
    sizes: [[300, 250]]
  };

  describe('inherited functions', function () {
    it('exists and is a function', function () {
      expect(adapter.callBids).to.exist.and.to.be.a('function');
    });
  });

  describe('isBidRequestValid', function () {
    it('should return true when placementId is present', function () {
      expect(spec.isBidRequestValid(bid)).to.be.true;
    });

    it('should return false when params are missing', function () {
      expect(spec.isBidRequestValid({})).to.be.false;
      expect(spec.isBidRequestValid({ params: {} })).to.be.false;
    });
  });

  describe('buildRequests', function () {
    it('should build a POST request with correct data', function () {
      const req = spec.buildRequests([bid], { bidderRequestId: '111' });

      expect(req).to.be.an('array').that.is.not.empty;
      expect(req[0].method).to.equal('POST');
      expect(req[0].url).to.equal('https://prebid.tikhonov.ua/auction');
      expect(req[0].data).to.include({
        placementId: 'demo123',
        bidId: '123'
      });
      expect(req[0].data.sizes).to.deep.equal([[300, 250]]);
    });
  });

  describe('interpretResponse', function () {
    it('should interpret a valid server response', function () {
      const serverResponse = {
        body: {
          bidId: '123',
          cpm: 1.5,
          width: 300,
          height: 250,
          ad: '<div>Test Ad</div>',
          creativeId: 'creative-1',
          currency: 'USD',
          adomain: ['example.com']
        }
      };

      const result = spec.interpretResponse(serverResponse, {});
      expect(result).to.be.an('array').that.is.not.empty;

      const bidRes = result[0];
      expect(bidRes.requestId).to.equal('123');
      expect(bidRes.cpm).to.equal(1.5);
      expect(bidRes.width).to.equal(300);
      expect(bidRes.height).to.equal(250);
      expect(bidRes.ad).to.include('Test Ad');
      expect(bidRes.creativeId).to.equal('creative-1');
      expect(bidRes.currency).to.equal('USD');
      expect(bidRes.meta.advertiserDomains).to.deep.equal(['example.com']);
    });

    it('should return empty array for empty or invalid response', function () {
      expect(spec.interpretResponse({ body: {} }, {})).to.be.an('array').that.is.empty;
      expect(spec.interpretResponse({ body: null }, {})).to.be.an('array').that.is.empty;
    });
  });
});
