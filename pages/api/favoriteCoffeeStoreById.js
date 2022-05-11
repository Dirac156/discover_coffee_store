
import { findRecordByFilter, getMinifiedRecords, table } from "../../lib/airtable";

const favoriteCoffeeStoreById = async (req, res) => {
    try {
        if (req.method === "PUT") {
            const { id } = req.body;
            if (id) {
                const records = await findRecordByFilter(id);

                if (records.length !== 0 ) {
                    const record = records[0];
                    const calculateVoting = parseInt(record.voting) + 1;

                    // updatea record

                    const updateRecord = await table.update([
                        {
                            id: record.recordId,
                            fields: {
                                voting: calculateVoting
                            }
                        }
                    ]);

                    if ( updateRecord ) {
                        res.json(getMinifiedRecords(updateRecord));
                    } else {
                        res.json({ message: "The record was not updated"})
                    }
                } else {
                    res.json({ message: "Coffee store id doesn't exisy", id });
                }
            } else {
                res.json({  message: "id is missing" })
            }
        } else {
            // method is not put
            res.json({ message: "PUT Request"})
        }
    }catch(err) {
        res.status(500);
        res.json({ message: "Error upvoting coffee store", error: err })
    }
}


export default favoriteCoffeeStoreById;