import DataTable from 'react-data-table-component';
import {useRouter} from "next/router";

import {CryptoFeaturedData} from "../../types";

export default function CryptoTable({ data }: { data: CryptoFeaturedData[]}) {
  const columns = [
    {
      name: 'Name',
      selector: (row: CryptoFeaturedData) => row.name,
      cell: (row: CryptoFeaturedData) => (
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
      selector: (row: CryptoFeaturedData) => row.value,
      format: (row: CryptoFeaturedData) => `${row.value}`,
      right: true,
      sortable: true
    },
    {
      name: 'Chart',
      cell: (row: CryptoFeaturedData) => <div>{''}</div>, // You'd need to implement actual charts
    },
    {
      name: 'Change',
      selector: (row: CryptoFeaturedData) => row.change,
      cell: (row: CryptoFeaturedData) => <div style={{color: row.change > 0 ? 'green' : row.change === 0 ? 'gray' : 'red'}}>{row.change.toFixed(2)}%</div>,
      right: true,
      sortable: true
    },
    {
      name: 'Market Cap',
      selector: (row: CryptoFeaturedData) => row.marketCap || '',
      format: (row: CryptoFeaturedData) => row.marketCap ? `$${(parseFloat(row.marketCap) / 1e9).toFixed(1)}T` : '',
      sortable: true,
      right: true
    },
    {
      name: 'Volume (24h)',
      selector: (row: CryptoFeaturedData) => row.volume || '',
      format: (row: CryptoFeaturedData) => row.volume ? `$${(parseFloat(row.volume) / 1e9).toFixed(1)}T` : '',
      sortable: true,
      right: true,
    },
    {
      name: 'Supply',
      selector: (row: CryptoFeaturedData) => row.supply || '',
      format: (row: CryptoFeaturedData) => row.supply ? `${row.supply.toLocaleString()}M` : '',
    },
    {
      name: 'Trade',
      selector: (row: CryptoFeaturedData) => `${row.tradeAble}`,
      cell: (row: CryptoFeaturedData) => row.tradeAble ? <button style={{backgroundColor: 'blue', color: 'white', border: 'none', padding: '5px 10px', borderRadius: '5px'}}>Trade</button> : '',
    },
  ];

  const router = useRouter();

  const handleRowClick = (row: CryptoFeaturedData) => {
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