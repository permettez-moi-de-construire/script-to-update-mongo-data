const { mongoConnect, postgresPool } = require("./dbConnect");

const { getDeals } = require("./hubspot");

const metaIds = [8, 9];

const ONBOARDING_PIPELINE = process.env.ONBOARDING_PIPELINE;
const FACILITATION_PIPELINE = process.env.FACILITATION_PIPELINE;

mongoConnect().then(async (collection) => {
  /* OnBoarding { pipelineId: 1489583 } */
  await disableActions(collection, +ONBOARDING_PIPELINE);
  /* Facilitation { pipelineId: 1489647 } */
  await disableActions(collection, +FACILITATION_PIPELINE);
});

const disableActions = async (collection, pipelineId) => {
  console.log("==================[DEBUT]==================");
  const deals = await getDeals(pipelineId, false, 0);
  console.log("[[ DEAL SIZE ]]", deals.length);

  if (deals.length) {
    // get association project deal
    const dealIds = deals.map((deal) => `'${deal.id}'`);

    console.log("[[ DEAL IDs ]]", dealIds);

    const pool = postgresPool();

    return pool.query(
      `SELECT * FROM project_deal_association WHERE deal_id IN (${dealIds.join(
        ","
      )})`,
      (error, results) => {
        console.log("[[ project_deal_association ]] ");

        if (error) {
          console.log("[[ WITH ERRORS ]]", error);
          return false;
        }

        if (results.rows.length) {
          console.log(
            "[[ project_deal_association length ]] ",
            results.rows.length
          );

          const projectIds = results.rows.map(
            (dealAssociation) => dealAssociation.project_id
          );

          console.log(`[[ PROJECT IDs ]]`, projectIds);

          return collection.actions
            .find({
              projectId: { $in: projectIds },
              metaId: { $in: metaIds },
              isDone: false,
            })
            .toArray(async function (_, docs) {
              console.log("ICI");

              if (docs) {
                if (docs.length) {
                  console.log(`[[ ACTION TO UPDATE ]]`, docs);
                  try {
                    if (!process.argv[2]) {
                      await collection.actions.updateMany(
                        { metaId: { $in: metaIds } },
                        { $set: { isDone: true } },
                        { multi: true }
                      );

                      console.log(`>>>>>>>>>>>> UPDATE ACTIONS SUCCESS`);
                    }

                    collection.mongo.close();
                    return true;
                  } catch (e) {
                    console.log(`<<<<<<<<<<< ERROR UPDATE ACTION`);
                    collection.mongo.close();
                    return false;
                  }
                }
              }
              console.log(`<<<<<<<<<<< NO ACTION UPDATED`);
              collection.mongo.close();
              return false;
            });
        }

        console.log(
          "<<<<<<<<<<< NO PROJECT DEAL ASSOCIATION FOUND IN POSTGRES"
        );
        return false;
      }
    );
  }

  console.log("<<<<<<<<<<< NO DEALS FOUND IN HUBSPOT");
  return false;
};
