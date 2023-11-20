import domtoimage from 'dom-to-image';
import jsPDF from 'jspdf';
import { products } from './constants';

type Props = {
  name: string,
  date: any,
  total: number,
  orderList: any[],
};
  
export const pdhDownloadHandler = async () => {
  const div = document.getElementById('pdf-id');
  if (!div) { return; }
  const options = { background: 'white', height: 1562, width: 1100 };
  domtoimage.toPng(div, options).then((dataUrl) => {
      //Initialize JSPDF
      const doc = new jsPDF();
      //Add image Url to PDF
      doc.addImage(dataUrl, 'PNG', 0, 0, 210, 297);
      doc.save('invoice.pdf');
  })
};
export const MyDocument = ({name, date, total, orderList} : Props) => {

  const options = {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  };

  return (
      <div id="pdf-id" className='py-12 bg-white text-black'> 
        <div className='px-16 flex items-center justify-between'>
          <div className='text-[#0d918f] text-3xl'>
            請   求   書
          </div>
          <div>
            {date.toLocaleDateString('ja-JA', options)}
          </div>
        </div>
        <hr className="mx-16 border-[#0d918f] my-4" />
        <div className='flex justify-between py-4'>
          <div>
            <div className='px-16 text-2xl pt-8 pb-2'>
              {name} 様
            </div>
            <hr className="mx-16 border-[#0d918f] w-[315px] pb-4" />
            <div className='flex items-center'>
              <div>
                <div className='flex relative items-center'>
                  <svg className='-mr-6 ml-0' xmlns="http://www.w3.org/2000/svg" width="170" height="42" viewBox="0 0 24 24" fill="#0d918f" stroke="#0d918f" stroke-width="2" stroke-linecap="butt" stroke-linejoin="bevel"><rect x="3" y="3" width="200" height="18" rx="2" ry="2"></rect></svg>
                  <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 24 24" fill="#0d918f" stroke="#0d918f" stroke-width="1" stroke-linecap="butt" stroke-linejoin="bevel"><path d="M9 18l6-6-6-6"/></svg>          
                  <div className='absolute left-20 top-5 text-base text-white'>
                    ご請求金額
                  </div>
                </div>
              </div>
              <div className='text-xl font-semibold pl-6'>
                ¥ {total.toLocaleString()}
              </div>
            </div>
            <hr className="mx-16 border-[#0d918f] w-[187px] ml-48 -mt-2" />
          </div>
          <div className='pr-16'>
            <div>本草閣自然療法センターOSAKA</div>
            <div className='pt-1.5'>〒533-0033 </div>
            <div className='pb-2'>大阪府大阪市東淀川区東中島4-2-5</div>
            <div>TEL 080-3352-9660</div>
            <div>honzokaku.osaka@gmail.com</div>
            <div>http://www.honzoosaka2222.com</div>
          </div>
        </div>
        <div className='px-16 pt-4 text-lg'>
          <table className="w-full">
            <thead>
              <tr className='text-white bg-[#0d918f]'>
                <th className='w-[50%] font-normal'>品名</th>
                <th className='w-[16%] font-normal'>数量</th>
                <th className='w-[16%] font-normal'>単価</th>
                <th className='w-[18%] font-normal'>金額</th>
              </tr>
            </thead>
            <tbody> 
              {
                orderList.map((order, index) => (
                    <tr key={index}>
                      <td className='text-left'>{order.name}</td>
                      <td>{order.quantity}</td>
                      <td>{order.ppp.toLocaleString()}</td>
                      <td>{order.price.toLocaleString()}</td>
                    </tr>
                  )
                )
              }
            </tbody>
          </table>
        </div>
        <div className='px-16 pl-[50%] text-lg'>
          <table className="w-full">
            <tbody>
              <tr>
                <td className='text-left w-[64%]'>小計</td>
                <td>¥{total.toLocaleString()}</td>
              </tr>
              <tr>
                <td className='text-left'>送料</td>
                <td>¥520</td>
              </tr>
              <tr>
                <td className='text-left'>合計 (税込)</td>
                <td>¥{(total + 520).toLocaleString()}</td>
              </tr>
            </tbody>
          </table>
        </div>
        <div className='flex relative items-center'>
          <svg className='-mr-6 ml-0' xmlns="http://www.w3.org/2000/svg" width="170" height="42" viewBox="0 0 24 24" fill="#0d918f" stroke="#0d918f" stroke-width="2" stroke-linecap="butt" stroke-linejoin="bevel"><rect x="3" y="3" width="200" height="18" rx="2" ry="2"></rect></svg>
          <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 24 24" fill="#0d918f" stroke="#0d918f" stroke-width="1" stroke-linecap="butt" stroke-linejoin="bevel"><path d="M9 18l6-6-6-6"/></svg>          
          <div className='absolute left-[85px] top-5 text-base text-white'>
            お振込先
          </div>
        </div>
        <div className='mx-16 border border-[#0d918f] text-lg px-1.5 py-1.5'>
          生命宇宙研究所 株式会社三井住友銀行 浜松町支店 普通 7783595
        </div>
      </div>
  );
}