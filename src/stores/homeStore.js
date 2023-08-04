import create from 'zustand';
import axios from 'axios';
import debounce from '../helpers/debounce';

const homeStore = create((set) => ({
  coins: [],
  trending: [],
  query: '',
  searched: false,

  setQuery: (e) => {
    const query = e.target.value;
    set({ query });
    homeStore.getState().searchCoins();
  },

  searchCoins: debounce(async () => {
    const { query, trending } = homeStore.getState();

    if (query.length > 2) {
      try {
        const res = await axios.get(`https://api.coingecko.com/api/v3/search?query=${query}`);

        const coins = res.data.coins.map((coin) => ({
          name: coin.name,
          image: coin.large,
          id: coin.id
        }));

        set({ coins, searched: true });
      } catch (error) {
        console.error('Error searching coins:', error);
      }
    } else {
      set({ coins: trending , searched: false});
    }
  }, 500),

  fetchCoins: async () => {
    try {
      const [res, btcRes] = await Promise.all([
        axios.get('https://api.coingecko.com/api/v3/search/trending'),
        axios.get('https://api.coingecko.com/api/v3/simple/price?ids=bitcoin&vs_currencies=usd'),
      ]);

      const btcPrice = btcRes.data.bitcoin.usd;

      const coins = res.data.coins.map((coin) => ({
        name: coin.item.name,
        image: coin.item.large,
        id: coin.item.id,
        priceBtc: coin.item.price_btc.toFixed(6),
        priceUSd: (coin.item.price_btc * btcPrice).toFixed(6),
      }));

      set({ coins, trending: coins });
    } catch (error) {
      console.error('Error fetching trending coins:', error);
    }
  },
}));

export default homeStore;
