import styles from "../../styles/coffee-store.module.css";
import cls from "classnames";
import { useRouter } from "next/router";
import Link from "next/link";
import Head from "next/head";
import useSWR from "swr";
import { fetcher } from "../../lib/fetcher";

import { fetchCoffeeStores } from "../../lib/coffee-stores";
import Image from "next/image";
import { useContext, useEffect, useState } from "react";
import { StoreContext } from "../../store/store-context";
import { isEmpty } from "../../utils";

export async function getStaticProps({ params }) {
    const coffeeStoresData = await fetchCoffeeStores();
    const obj = coffeeStoresData.find((coffeeStoreData) => (coffeeStoreData.id.toString() === params.id))
    
    return {
        props: {
            coffeeStore: obj ? obj : [],
        }
    }
}

export async function getStaticPaths() {
    const coffeeStoresData = await fetchCoffeeStores();
    const paths = coffeeStoresData.map(coffeeStore => {
        return ( { params: { id: coffeeStore.id.toString() }} )
    })
    return {
        paths,
        fallback: true
    }
}

const CoffeeStore = (initialProps) => {
    const [coffeeStore, setCoffeeStore] = useState(initialProps)
    const [votingCount, setVotingCount] = useState(0);
    const {
        state: { coffeeStores }
    } = useContext(StoreContext);
    const router = useRouter();

    const id = router.query.id;

    const { data, error } = useSWR(`/api/getCoffeeStoreById?id=${id}`, fetcher);

    const handleUpVoteButton = async () => {
        try{
            const response = await fetch('/api/favoriteCoffeeStoreById', {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    id: `${coffeeStore.id}`,
                }),
            });

            const dbCoffeeStore = await response.json();
            if ( dbCoffeeStore && dbCoffeeStore.length > 0) {
                let count = votingCount + 1;
                setVotingCount(count);
            }
        }catch(err) {
            console.error("Error upvoting coffee store", err);
        }
    }

    const handleCreateCoffeeStore = async (coffeeStore) => {
        try{
            const response = await fetch('/api/createCoffeeStore', {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    id: `${coffeeStore.id}`, 
                    name: coffeeStore.name,  
                    voting: coffeeStore.voting || 0,
                    imgUrl: coffeeStore.imgUrl, 
                    neighbourhood: neighbourhood || "", 
                    address: address || ""
                }),
            });

            await response.json();
        }catch(err) {
            console.error("Error creating coffee store", err);
        }
    }


    useEffect(() => {
        if (isEmpty(initialProps.coffeeStore)){
            if (coffeeStores.length > 0) {
                const coffeeStoreFromContext = coffeeStores.find((coffeeStoreData) => {
                    return (coffeeStoreData.id.toString() === id)
                })

                if (coffeeStoreFromContext) {
                    setCoffeeStore(coffeeStoreFromContext);
                    handleCreateCoffeeStore(coffeeStoreFromContext);
                }
            }
        } else {
            handleCreateCoffeeStore(initialProps.coffeeStore);
        }
         // eslint-disable-line react-hooks/exhaustive-deps
    }, [id, initialProps, initialProps.coffeeStore]);

    useEffect(() => {
        if (data && data.length > 0) {
            setCoffeeStore(data[0]);
            setVotingCount(data[0].voting);
        }
    }, [data]);

    if (router.isFallback) {
        return <div>...loading</div>
    }

    if (error) {
        return <div>Something went wrong retrieving coffee store page</div>
    }

    const { address, name, neighbourhood, imgUrl } = coffeeStore;

    return (
        <div className={styles.layout}>
            <Head>
                <title>{name}</title>
            </Head>
            <div className={styles.container}>
                <div className={styles.col1}>
                    <div className={styles.backToHomeLink}>
                        <Link href="/">
                            <a>🌝 Back to home</a>
                        </Link>
                    </div>
                    <div className={styles.nameWrapper}>
                        <h1 className={styles.name}>{name}</h1>
                    </div>
                    <Image src={imgUrl || "https://images.unsplash.com/photo-1504753793650-d4a2b783c15e?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=2000&q=80"} width={600} height={360} className={styles.storeImg} alt={name} />
                </div>

                <div className={cls(styles.col2, "glass")}>
                    <div className={styles.iconWrapper}>
                        <Image src="/static/icons/places.svg" alt="icon" width="24" height="24" />
                        <p className={styles.text}>{address}</p>
                    </div>
                    {
                        neighbourhood || votingCount? 
                        <>
                            <div className={styles.iconWrapper}>
                                <Image src="/static/icons/nearMe.svg" alt="icon" width="24" height="24" />
                                <p className={styles.text}>{neighbourhood}</p>
                            </div>
                            <div className={styles.iconWrapper}>
                                <Image src="/static/icons/stars.svg" alt="icon" width="24" height="24" />
                                <p className={styles.text}>{votingCount}</p>
                            </div>
                        </> 
                        :
                    null
                    }


                    <button className={styles.upvoteButton} onClick={handleUpVoteButton}>
                        Up Vote!
                    </button>

                </div>
            </div>
        </div>
    )
}

export default CoffeeStore;