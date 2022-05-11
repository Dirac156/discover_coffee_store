import { createApi } from 'unsplash-js';

/* 
** on your node server
*/
const unplashApi = createApi({
  accessKey: process.env.NEXT_PUBLIC_UNPLASH_ACCESS_KEY,
  //...other fetch options
});

const getUrlForCoffeeStores = (latLong, query, limit) => {
    return ` https://api.foursquare.com/v3/places/nearby?ll=${latLong}&query=${query}&v=20220105&limit=${limit}`
}

export const fetchCoffeeStores = async (latLong="43.65267326999575,-79.39545615725015", limit=7) => {
    const url = getUrlForCoffeeStores(latLong, "coffee store", limit)
    const response = await fetch(url, {
    "headers": {
      'Authorization': process.env.NEXT_PUBLIC_FOURSQUARE_API_KEY
    }
  })

  const data = await response.json();
  const photos = await unplashApi.search.getPhotos({
        query: "coffee shop",
        perPage: 40,
        orientation: "portrait"

  });

  const unplashResults = photos.response.results;

  const photosUrls = unplashResults.map(result => result.urls['small'])
   
  const transformedData = data?.results?.map((venue, idx) => {

      const location = venue.location;

      return {
          id: venue.fsq_id,
          name: venue.name,
          imgUrl: photosUrls[idx],
          address: location.address || location.formatted_address || location.country || "",
          neighbourhood: location.neighbourhood || location.cross_street || location.region || ""
      }}) || [];
    
    return transformedData
}