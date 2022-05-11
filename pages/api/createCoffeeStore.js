import { findRecordByFilter, table, getMinifiedRecords } from "../../lib/airtable";

const createCoffeeStore = async (req, res) => {

    const { id, name, address, neighbourhood, voting, imgUrl } = req.body;

    try {
        if (id) {
            if (req.method === "POST") {
                // find record
                const records = await findRecordByFilter(id);
                if (records.length !== 0) {
                    // record exist 
                    res.json(records);
                } else {
                    if ( id && name) {
                        // create record
                        const createRecords = await table.create([
                            {
                                fields: {
                                    id, name, address, neighbourhood, voting, imgUrl
                                }
                            }
                        ]);
                        const records = getMinifiedRecords(createRecords);

                        res.json({ message: "created a record", records});
                    } else {
                        res.status(400);
                        res.json({ message: "Name is missing"});
                    }
                } 
            }
        } else {
            res.status(400);
            res.json({ message: "Id is missing"});
        }
    }catch(err) {
        console.error(err);
        console.error("Error creating or finding stores", err.message);
        res.status(500);
        res.json({ message: "Error creating or finding stores", err});
    }

}

export default createCoffeeStore;
