# Overview
Tikhonov Bidder Adapter


Module Name: Tikhonov Bidder Adapter  

Module Type: Bidder Adapter  

Maintainer: tikhonov.alexander.work@gmail.com  



---



# Description



The Tikhonov header bidding adapter connects with the Tikhonov demand platform to fetch bids for display inventory.  

This adapter provides a simple solution for accessing banner demand through Prebid.js.



---



Test Parameters



```javascript

var adUnits = [



// Banner adUnit

 {

   code: 'div-test-div',

   sizes: [[300, 250]],

   bids: [{

     bidder: 'tikhonov',

     params: {

       placementId: 'demo123'

     }

   }]

 },



 // Another Banner adUnit

 {

   code: 'div-another-div',

   sizes: [[728, 90]],

   bids: [{

     bidder: 'tikhonov',

     params: {

       placementId: 'banner456'

     }

   }]

 }

];



