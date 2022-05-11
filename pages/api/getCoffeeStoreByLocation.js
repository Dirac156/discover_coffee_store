import { fetchCoffeeStores } from "../../lib/coffee-stores";

const getCoffeeStoreByLocation = async (req, res) => {

    try {
        // configured latlong and limit
        const {latLong, limit} = req.query;
        const response = await fetchCoffeeStores(latLong, limit);
        res.status(200)
        res.json(response);
    }catch(err) {
        console.error("There is an error", err);
        res.status(500);
        res.json({ message: "Oh no! Something went wrong", err });
    }
}

export default getCoffeeStoreByLocation;