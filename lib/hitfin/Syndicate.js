var request = require('request')

module.exports = {
  create: function(accessToken, issueId, offerId){
    return new Promise((resolve, reject) => {
      const url = process.env.HITFIN_API_URL + '/api/securities/syndicate'
      const data = {
        "issue_id": issueId,
        "offer_id": offerId,
        "deal_carry_basis_points": 0,
        "expense_basis_points": 0,
        "fee_basis_points": 0
      }

      console.log("============================================================================")
      console.info("Syndicate.create")
      console.info(url)
      console.info(data)

      request.post({
        url: url,
        headers: {
          'Authorization': 'Bearer ' + accessToken
        },
        json: data
      }, function(error, response, body){
        console.error(error)
        console.info(body)

        if(error){
          reject(error)
        }
        else if(response.statusCode >=400){
          reject(body)
        }
        else{
          resolve(body.tx.hash)
        }
      })
    })
  }
}