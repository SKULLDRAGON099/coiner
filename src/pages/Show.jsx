import React, { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import showStore from '../stores/showStore';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import Header from "../components/Header";

export default function Show() {
  const store = showStore();
  const params = useParams();

  useEffect(() => {
    store.fetchData(params.id);
  }, []);

  if (!store.data) return <></>

  return (
    <div>
    <Header back />
      <header className='show-header'>
        <img src={store.data?.image?.large} alt="Coin Image" />
        <h2>{store.data?.name} ({store.data?.symbol})</h2>
      </header>

      <div className="width">

      <div className="show-graph">

        <ResponsiveContainer width="100%" height="100%">

        <AreaChart
       
        data={store.graphData}
        margin={{
          top: 10,
          right: 30,
          left: 0,
          bottom: 0,
        }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="Date" />
        <YAxis />
        <Tooltip />
        <Area type="monotone" dataKey="Price" stroke="#8884d8" fill="#8884d8" />
      </AreaChart>

        </ResponsiveContainer>
      </div>
      </div>
      
    </div>
  );
}
