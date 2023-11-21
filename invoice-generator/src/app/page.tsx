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
  const [shipping, setShipping] = useState(0);
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
    const newQuantity = Number(e.target.value);
    const newPrice = orderList[index].ppp * newQuantity;
  
    setOrderList(prevOrderList => {
      if (index >= prevOrderList.length) {
        // If the index is beyond the current length of orderList, add a new order
        const newOrderData: Order = {
          name: String(products[index][0]),
          quantity: newQuantity,
          ppp: orderList[index].ppp,
          price: newPrice,
        };
        return [...prevOrderList, newOrderData];
      } else {
        // If the index is within the current length of orderList, update the existing order
        return prevOrderList.map((order, i) =>
          i === index
            ? { ...order, quantity: newQuantity, price: newPrice }
            : order
        );
      }
    });
  };

  const handleProductChange = (e: ChangeEvent<HTMLSelectElement>, index: number) => {
    setOrderList((prevOrderList) => {
      const newProductName = e.target.value;
      const newPrice = Number(orderList[index].ppp) * Number(prevOrderList[index]?.quantity || 0);
  
      if (index >= prevOrderList.length) {
        // If the index is beyond the current length of orderList, add a new order
        const newOrderData: Order = {
          name: newProductName,
          quantity: 0,
          ppp: orderList[index].ppp,
          price: newPrice,
        };
        return [...prevOrderList, newOrderData];
      } else {
        // If the index is within the current length of orderList, update the existing order
        return prevOrderList.map((order, i) =>
          i === index
            ? { ...order, name: newProductName, price: newPrice }
            : order
        );
      }
    });
  };

  const handlePPPChange = (e : ChangeEvent<HTMLTextAreaElement>, index : number) => {
    const newProductPrice = Number(e.target.value);
    const newPrice = newProductPrice * orderList[index].quantity;
  
    setOrderList(prevOrderList => {
      if (index >= prevOrderList.length) {
        // If the index is beyond the current length of orderList, add a new order
        const newOrderData: Order = {
          name: String(products[index][0]),
          quantity: 0,
          ppp: newProductPrice,
          price: newPrice,
        };
        return [...prevOrderList, newOrderData];
      } else {
        // If the index is within the current length of orderList, update the existing order
        return prevOrderList.map((order, i) =>
          i === index
            ? { ...order, ppp: newProductPrice, price: newPrice }
            : order
        );
      }
    });
  }

  const handleNameChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    setName(e.target.value);
  }

  const handleShippingChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    setShipping(Number(e.target.value));
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
          onKeyDown={(event) => {
            if (event.key === 'Enter') {
              event.preventDefault();
            }
          }}
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
      <div className='pt-4'>
        <div className='pb-2'>送料</div>
        <div className="flex items-center">
          <textarea
            className='w-[15%] focus:outline-none border border-gray-300 resize-none px-2 py-2 rounded-md'
            rows={1}
            onChange={handleShippingChange}
            onKeyDown={(event) => {
              if (event.key === 'Enter') {
                event.preventDefault();
              }
            }}
          />
          <span className='text-base pl-2'>円</span>
        </div>
      </div>
      <div className='flex w-full bg-[#00264D] text-white px-2 py-2 rounded-md mt-8 mb-2 space-x-4'>
        <div className='w-[55%]'>
          品名
        </div>
        <div className='w-[16%]'>
          単価
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
          <div key={index} className='flex items-center w-full pr-1 pb-2'>
            <select onChange={(event) => handleProductChange(event, index)} className='focus:outline-none border border-gray-300 px-2 py-2 w-[55%] rounded-md'>
              {
                products.map((product, index) => (
                  <option key={index} value={product[0]}>{product[0]}</option>
                ))
              }
            </select>
            <textarea 
              className='w-[13%] rounded-md focus:outline-none border border-gray-300 resize-none px-2 py-2 ml-4'
              rows={1}
              onChange={(event) => handlePPPChange(event, index)}
              onKeyDown={(event) => {
                if (event.key === 'Enter') {
                  event.preventDefault();
                }
              }}
            />
            <span className='ml-1'>円</span>
            <textarea 
              className='w-[10%] rounded-md focus:outline-none border border-gray-300 resize-none px-2 py-2 ml-4'
              rows={1}
              onChange={(event) => handleQuantChange(event, index)}
              onKeyDown={(event) => {
                if (event.key === 'Enter') {
                  event.preventDefault();
                }
              }}
            />
            {orderList && orderList[index] && (
              <div className='ml-4'>
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
        <MyDocument name={name} date={date} total={total} shipping={shipping} orderList={orderList}/>
      </div>
    </div>
  )
}
