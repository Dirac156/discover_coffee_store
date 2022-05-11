import Head from 'next/head'
import Banner from '../components/banner/banner'
import Card from '../components/card/card';
import Image from 'next/image';
import styles from '../styles/Home.module.css'
import { useEffect, useState, useContext } from 'react';

import useTrackLocation from "../hooks/use-track-location";
import { fetchCoffeeStores } from '../lib/coffee-stores';
import { ACTION_TYPES, StoreContext } from './../store/store-context';


export async function getStaticProps() {
  // ideally we make a request here
  const coffeeStores = await fetchCoffeeStores();
  return {
    props: {
      coffeeStores,
    }, 
  }
}

export default function Home(props) {


  const [coffeeStoresError, setCoffeeStoresError] = useState()

  const { handleTrackLocation, locationErrorMsg, isFindingLocation } = useTrackLocation();


  const handlePnBannerButtonClick = () => {
    handleTrackLocation();
  }

  const { dispatch, state } = useContext(StoreContext);

  const { coffeeStores, latLong } = state;

  async function newFetch(latLong) {
    if (latLong) {
      try {
        const response = await fetch(`/api/getCoffeeStoreByLocation?latLong=${latLong}&limit=50`);

        const coffeeStoresNearMe = await response.json();


        dispatch({ 
          type: ACTION_TYPES.SET_COFFEE_STORES, 
          payload: { coffeeStores: coffeeStoresNearMe}
        })
        setCoffeeStoresError();
        // set coffee stores
      }catch(err) {
        // set error
        console.error(err);
        setCoffeeStoresError(err.message);
      }
  }
}

  // fetch new coffee store when latlong changes
  useEffect(() => {
    newFetch(latLong);
     // eslint-disable-line react-hooks/exhaustive-deps
  } , [latLong])

  return (
    <div className={styles.container}>
      <Head>
        <title>Coffee Connoisseur</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        <Banner buttonText={ isFindingLocation ? "Loading..." : "View Stores nearby"} handleOnClick={handlePnBannerButtonClick}/>
        <p>{ locationErrorMsg ?  `Something went wrong: ${locationErrorMsg} ` : null }</p>
        <p>{ coffeeStoresError ?  `Something went wrong: ${coffeeStoresError} ` : null }</p>
        <div className={styles.heroImage}>
          <Image src={"/static/hero-image.png"} width={700} height={400} alt="banner" />
        </div>
        {
            coffeeStores.length > 0 && (
              <>
                <h2 className={styles.heading2}>Stores Near Me</h2>
                <div className={styles.cardLayout}>
                  {
                    coffeeStores.map((coffeeStore) => {
                      return (
                        <Card 
                          key={coffeeStore.id}
                          name={coffeeStore.name}
                          imgUrl={coffeeStore.imgUrl || `https://images.unsplash.com/photo-1504753793650-d4a2b783c15e?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=2000&q=80`}
                          href={`/coffee-store/${coffeeStore.id}`}
                        />
                      )
                    })
                  }
                </div>
              </>
            )
          }


          {
            props.coffeeStores.length > 0 && (
              <>
                <h2 className={styles.heading2}>Toronto stores</h2>
                <div className={styles.cardLayout}>
                  {
                    props.coffeeStores.map((coffeeStore) => {
                      return (
                        <Card 
                          key={coffeeStore.id}
                          name={coffeeStore.name}
                          imgUrl={coffeeStore.imgUrl || `https://images.unsplash.com/photo-1504753793650-d4a2b783c15e?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=2000&q=80`}
                          href={`/coffee-store/${coffeeStore.id}`}
                        />
                      )
                    })
                  }
                </div>
              </>
            )
          }
      </main>
      

      <footer className={styles.footer}>
      </footer>
    </div>
  )
}
