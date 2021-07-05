const { hubspotClient } = require("./dbConnect");

const getDeals = async (pipelineId, isNext, after = 0) => {
  const filter = {
    propertyName: "pipeline",
    operator: "EQ",
    value: +pipelineId,
  };
  const filterGroup = { filters: [filter] };

  const next = isNext ? { after } : {};

  const publicObjectSearchRequest = {
    filterGroups: [filterGroup],
    ...next,
  };

  const hubspot = hubspotClient();
  const result = await hubspot.crm.deals.searchApi.doSearch(
    publicObjectSearchRequest
  );
  // Dealstage to exclude : 1189824
  if (result.body.results.length) {
    console.log(
      "[[ DEAL NAME ]]",
      result.body.results
        .filter((deal) => deal.properties.dealstage !== "1189824")
        .map((deal) => `'${deal.properties.dealname}'`)
    );
    console.log(
      "[[ FROM DIFFERENT PIPELINE ]]",
      result.body.results.filter(
        (deal) => +deal.properties.pipeline !== +pipelineId
      )
    );
    return [
      ...result.body.results.filter(
        (deal) => deal.properties.dealstage !== "1189824"
      ),
      ...(await getDeals(pipelineId, true, after + 10)),
    ];
  }

  return [];
};

exports.getDeals = getDeals;
