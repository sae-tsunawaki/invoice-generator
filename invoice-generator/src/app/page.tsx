'use client'
import ja from 'date-fns/locale/ja';
import { ChangeEvent, useEffect, useState } from 'react';
import DatePicker, { registerLocale } from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { MyDocument, pdhDownloadHandler } from './MyDocument';
import { products } from './constants';

export interface Order {
  name: string,
  quantity: number,
  ppp: number,
  price: number,
}

export default function Home() {
  const Today = new Date();
  const [date, setDate] = useState(Today);
  const [orderList, setOrderList] = useState<any[]>([]);
  const [name, setName] = useState("");
  const [total, setTotal] = useState(0);
  const [hover, setHover] = useState(false);
  registerLocale('ja', ja);

  useEffect(() => {
    if (total !== 0) {
      pdhDownloadHandler();
    }
  }, [total]);

  const handleGenerateClick = () => {
    setTotal(orderList.reduce((sum, item) => sum + item.price, 0));
  }

  const handleAddRow = () => {
    console.log(orderList);
    const newOrder : Order = {
      name: String(products[0][0]),
      quantity: 0,
      ppp: 0,
      price: 0,
    };
    setOrderList([...orderList, newOrder]);
  }

  const handleQuantChange = (e: ChangeEvent<HTMLTextAreaElement>, index: number) => {
    console.log(orderList);
    const newQuantity = Number(e.target.value);
    const newPrice = Number(products[index][1]) * newQuantity;
  
    setOrderList(prevOrderList => {
      if (index >= prevOrderList.length) {
        // If the index is beyond the current length of orderList, add a new order
        const newOrderData: Order = {
          name: String(products[index][0]),
          quantity: newQuantity,
          ppp: Number(products[index][1]),
          price: newPrice,
        };
        return [...prevOrderList, newOrderData];
      } else {
        // If the index is within the current length of orderList, update the existing order
        return prevOrderList.map((order, i) =>
          i === index
            ? { ...order, quantity: newQuantity, ppp: Number(products[index][1]), price: newPrice }
            : order
        );
      }
    });
  };

  const handleProductChange = (e: ChangeEvent<HTMLSelectElement>, index: number) => {
    console.log(orderList);
    setOrderList((prevOrderList) => {
      const newProductName = e.target.value;
      const newProduct = products.find(([name]) => name === newProductName);
      const newPrice = newProduct?.[1] ? Number(newProduct[1]) * Number(prevOrderList[index]?.quantity || 0) : 0;
  
      if (index >= prevOrderList.length) {
        // If the index is beyond the current length of orderList, add a new order
        const newOrderData: Order = {
          name: newProductName,
          quantity: 0,
          ppp: Number(newProduct?.[1]),
          price: newPrice,
        };
        return [...prevOrderList, newOrderData];
      } else {
        // If the index is within the current length of orderList, update the existing order
        return prevOrderList.map((order, i) =>
          i === index
            ? { ...order, name: newProductName, ppp: Number(newProduct?.[1]), price: newPrice }
            : order
        );
      }
    });
  };

  const handleDeleteOrder = (index: number) => {
    setOrderList((prevOrderList) => {
      // Create a new array without the item at the specified index
      const updatedOrderList = [...prevOrderList.slice(0, index), ...prevOrderList.slice(index + 1)];
      return updatedOrderList;
    });
  };

  const handleNameChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    setName(e.target.value);
  }

  return (
    <div className='bg-gray-50 h-screen font-sans px-96 py-12 text-[#737373] text-sm'>
      <div className='flex justify-center items-center text-2xl'>
        請求書作成
      </div>
      <div className='pt-8'>
        <div className='pb-2'>氏名</div>
        <textarea
          className='w-full focus:outline-none border border-gray-300 resize-none px-2 py-2 rounded-md'
          rows={1}
          onChange={handleNameChange}
        />
      </div>
      <div className='pt-4'>
        <div className='pb-2'>日付</div>
        <DatePicker
          className='w-full focus:outline-none border border-gray-300 resize-none px-2 py-2 rounded-md'
          onChange={(selectedDate) => setDate(selectedDate || Today)}
          selected={date}
          dateFormat="yyyy/MM/dd"
          locale='ja'
        />
      </div>
      <div className='flex w-full bg-[#00264D] text-white px-2 py-2 rounded-md mt-8 mb-2 space-x-4'>
        <div className='w-[77%]'>
          品名
        </div>
        <div className='w-[10%]'>
          数量
        </div>
        <div>
          金額
        </div>
      </div>
      {
        orderList.map((order, index) => (
          <div key={index} className='flex items-center space-x-4 w-full pr-1 pb-2' onMouseEnter={() => setHover(true)} onMouseLeave={() => setHover(false)}>
            {
              hover ? ( null
                // <div onClick={() => handleDeleteOrder(index)}>
                //   <svg xmlns="http://www.w3.org/2000/svg" width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="#737373" stroke-width="2" stroke-linecap="butt" stroke-linejoin="bevel"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path><line x1="10" y1="11" x2="10" y2="17"></line><line x1="14" y1="11" x2="14" y2="17"></line></svg>
                // </div>
              )
              : (null)}
            <select onChange={(event) => handleProductChange(event, index)} className='focus:outline-none border border-gray-300 px-2 py-2 w-[77%] rounded-md'>
              {
                products.map((product, index) => (
                  <option value={product[0]}>{product[0]}</option>
                ))
              }
            </select>
            <textarea 
              className='w-[10%] rounded-md focus:outline-none border border-gray-300 resize-none px-2 py-2'
              rows={1}
              onChange={(event) => handleQuantChange(event, index)}
              onKeyDown={(event) => {
                if (event.key === 'Enter') {
                  event.preventDefault();
                }
              }}
            />
            {orderList && orderList[index] && (
              <div>
                {orderList[index].price ? `¥${orderList[index].price}` : "¥0"}
              </div>
            )}
          </div>
        ))
      }
      <div className='pt-1'>
        <button onClick={handleAddRow} className='flex items-center rounded-lg border border-gray-100 bg-gray-200 px-1.5 py-1.5'>
          <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#737373" stroke-width="2" stroke-linecap="butt" stroke-linejoin="bevel"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
          品物を追加
        </button>
      </div>
      <div className='flex justify-center items-center pt-4'>
        <button id='generation' className='px-4 py-2 rounded-3xl' onClick={handleGenerateClick}>
          請求書を作成
        </button>
      </div>
      <div className='hidden'>
        <MyDocument name={name} date={date} total={total} orderList={orderList}/>
      </div>
    </div>
  )
}
