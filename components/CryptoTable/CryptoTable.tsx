import DataTable from 'react-data-table-component';
import {useRouter} from "next/router";

import {CryptoFeaturedProductData} from "../../types";
import {numberDisplay} from "../../utils/number-utils";

export default function CryptoTable({ data }: { data: CryptoFeaturedProductData[]}) {
  const columns = [
    {
      name: 'Name',
      selector: (row: CryptoFeaturedProductData) => row.name,
      cell: (row: CryptoFeaturedProductData) => (
        <div style={{display: 'flex', alignItems: 'center'}}>
          <div style={{marginRight: '10px'}}>
            <img src={row.icon} alt={row.name} width="20" height="20"/>
          </div>
          <div style={{display: 'flex', flexDirection: 'column', justifyContent: 'center'}}>
            <div>{row.name}</div>
            <div style={{fontSize: '0.8em', color: 'gray'}}>{row.symbol}</div>
          </div>
        </div>
      ),
    },
    {
      name: 'Price',
      selector: (row: CryptoFeaturedProductData) => row.priceUsd,
      format: (row: CryptoFeaturedProductData) => `$${row.priceUsd}`,
      right: true,
      sortable: true
    },
    {
      name: 'Chart',
      cell: (row: CryptoFeaturedProductData) => <div>{''}</div>, // You'd need to implement actual charts
    },
    {
      name: 'Change',
      selector: (row: CryptoFeaturedProductData) => row.changePercent24Hr,
      cell: (row: CryptoFeaturedProductData) => <div style={{color: row.changePercent24Hr > 0 ? 'green' : row.changePercent24Hr === 0 ? 'gray' : 'red'}}>{row.changePercent24Hr.toFixed(2)}%</div>,
      right: true,
      sortable: true
    },
    {
      name: 'Market Cap',
      selector: (row: CryptoFeaturedProductData) => row.marketCapUsd || '',
      format: (row: CryptoFeaturedProductData) => row.marketCapUsd ? numberDisplay(parseFloat(row.priceUsd)) : '',
      sortable: true,
      right: true
    },
    {
      name: 'Volume (24h)',
      selector: (row: CryptoFeaturedProductData) => row.volumeUsd24Hr || '',
      format: (row: CryptoFeaturedProductData) => row.volumeUsd24Hr ? numberDisplay(parseFloat(row.volumeUsd24Hr)) : '',
      sortable: true,
      right: true,
    },
    {
      name: 'Supply',
      selector: (row: CryptoFeaturedProductData) => row.supply || '',
      format: (row: CryptoFeaturedProductData) => row.supply ? numberDisplay(parseFloat(row.supply), '') : '',
      right: true
    },
    {
      name: 'Trade',
      selector: (row: CryptoFeaturedProductData) => `${row.tradeAble}`,
      cell: (row: CryptoFeaturedProductData) => row.tradeAble ? <button style={{backgroundColor: 'blue', color: 'white', border: 'none', padding: '5px 10px', borderRadius: '5px'}}>Trade</button> : '',
    },
  ];

  const router = useRouter();

  const handleRowClick = (row: CryptoFeaturedProductData) => {
    router.push(`/price/${row.symbol.toLowerCase()}`);
  };
  return (
    <>
      {/*large screen*/}
      <DataTable
        pointerOnHover
        highlightOnHover
        pagination
        paginationPerPage={30}
        dense
        columns={columns}
        onRowClicked={handleRowClick}
        data={data} />
      {/*mobile*/}
    </>
  );
};