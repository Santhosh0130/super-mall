import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "../../firebase";

/**
 * Fetches all shops and their related products for a merchant.
 * @param {string} merchantId - The UID of the merchant.
 * @param {boolean} isOffer - If true, only fetch products with an offer.
 * @returns {Promise<Array>} List of shops with their filtered products.
 */
export const fetchShopDet = async (merchantId, isOffer = false) => {
  if (!merchantId) return [];

  const shopQuery = query(
    collection(db, "merchant-shops"), // fixed typo from "merchat-shops"
    where("merchantId", "==", merchantId)
  );

  const shopSnapShot = await getDocs(shopQuery);
  const shops = shopSnapShot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  }));

  const results = await Promise.all(
    shops.map(async (shop) => {
      const productQuery = query(
        collection(db, "products"),
        where("shopId", "==", shop.id),
        // where("offerPrice", ">", 0)
      );

      const productsSnapShot = await getDocs(productQuery);
      const products = productsSnapShot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }))
      .filter((p) => (isOffer ? p.discount > 0 : true)); // filter offer logic

      return { shop, products };
    })
  );

  return results;
};
