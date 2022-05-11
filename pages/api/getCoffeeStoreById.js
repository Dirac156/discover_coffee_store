import { findRecordByFilter } from "../../lib/airtable";

const getCoffeeStoreById = async (req, res) => {
    const { id } = req.query;

    if (id) {
        try {
            const records = await findRecordByFilter(id);
            if (records.length) {
                res.json(records);
            }
            else {
                res.json({ message: `id could not be found`})
            }
        }catch(err) {
            res.status(500);
            res.json({ message: "Something went wrong", error});
        }
    } else {
        res.status(400);
        res.json({ message: "id is missing" });
    }
};

export default getCoffeeStoreById;