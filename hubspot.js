const { 
    hubspotClient,
 } = require('./dbConnect')

const getDeals = async (pipelineId, isNext, after = 0) => {
    const filter = { propertyName: 'pipeline', operator: 'EQ', value: +pipelineId }
    const filterGroup = { filters: [filter] }

    const next =  isNext ? { after } : {}

    const publicObjectSearchRequest = {
        filterGroups: [filterGroup],
        ...next
    }

    const hubspot = hubspotClient();
    const result = await hubspot.crm.deals.searchApi.doSearch(publicObjectSearchRequest)

    if(result.body.results.length) {
        console.log('[[ DEAL NAME ]]', result.body.results.map(deal => `'${deal.properties.dealname}'`))

        return [...result.body.results , ...(await getDeals(pipelineId, true, after + 10))]
    }

    return [];
}

exports.getDeals = getDeals