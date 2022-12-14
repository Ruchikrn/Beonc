import React, { useEffect, useState } from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from 'recharts';

import { dynamicGraph } from '../../utils/dynamicGraph';
import { color } from '../color';
import { host } from '../../utils';
import { nameSort } from '../../utils';
import Select from 'react-select';

const CeoncSignalFunction = ({ graphWidth, data4, dataType4 }) => {
  const [data, setData] = useState([]);
  const [dataSort, setDataSort] = useState([]);
  const [dataSortPalikaProvince, setDataSortPalikaProvince] = useState();
  const [dataSortProvince, setDataSortProvince] = useState();
  const [dataSortOnlyFacility, setdataSortOnlyFacility] = useState();
   const [value1, setValue1] = useState('');
   const [value5, SetValue5] = useState('');

  const requestOptions = {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
    mode: 'cors',
  };

  let filterType = 'default';

  if (data4 === 'year') {
    filterType = 'year';
  } else if (data4 === 'province') {
    filterType = 'province';
  } else if (data4 === 'palika') {
    filterType = 'palika';
  } else if (data4 === 'all') {
    filterType = 'all';
  } else if (data4 === 'month') {
    filterType = 'month';
  }

  useEffect(() => {
    let dismount = false;

    const getRequest = async () => {
      let res = await fetch(`${host}/ceonc/signalfunction`, requestOptions);
      let data = await res.json();

      if (!dismount) {
        if (res.ok) {
          setData(data);
        }
      }
    };

     const getRequestPalikaProvince = async () => {
       let res = await fetch(`${host}/palikaprovince`, requestOptions);
       let data = await res.json();

       if (!dismount) {
         if (res.ok) {
           setDataSortPalikaProvince(data);
           setDataSortProvince(nameSort(data, '', 'province'));
         }
       }
     };

    const getRequestYear = async () => {
      if (filterType === 'all') {
        let requestOptionsBody = {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            startDate: dataType4['startDate'],
            endDate: dataType4['endDate'],
            province:
              dataType4['province'] === 'All' ? '' : dataType4['province'],
            district:
              dataType4['district'] === 'All' ? '' : dataType4['district'],
            palika: dataType4['palika'] === 'All' ? '' : dataType4['palika'],
            facility:
              dataType4['facility'] === 'All' ? '' : dataType4['facility'],
          }),
          mode: 'cors',
        };

        let res = await fetch(
          `${host}/ceonc/signalfunction/filter`,
          requestOptionsBody
        );
        let data = await res.json();

        if (!dismount) {
          if (res.ok) {
            setDataSort(data);
          }
        }
      }
      // if (filterType === "year") {
      //   let res = await fetch('/ceonc/signalfunction/year', requestOptions)
      //   let data = await res.json()

      //   if (!dismount) {
      //     if (res.ok) {
      //       setDataSort(data)
      //     }
      //   }
      // } else if (filterType === "province") {
      //     let res = await fetch('/ceonc/signalfunction/province', requestOptions)
      //     let data = await res.json()

      //     if (!dismount) {
      //       if (res.ok) {
      //         setDataSort(data)
      //       }
      //     }
      // } else if (filterType === "palika") {
      //     let res = await fetch('/ceonc/signalfunction/palika', requestOptions)
      //     let data = await res.json()

      //     if (!dismount) {
      //       if (res.ok) {
      //         setDataSort(data)
      //       }
      //     }
      // } else if (filterType === "all") {
      //     let res = await fetch('/ceonc/signalfunction/all', requestOptions)
      //     let data = await res.json()

      //     if (!dismount) {
      //       if (res.ok) {
      //         setDataSort(data)
      //       }
      //     }
      // } else if (filterType === "month") {
      //     let res = await fetch('/ceonc/signalfunction/month', requestOptions)
      //     let data = await res.json()

      //     if (!dismount) {
      //       if (res.ok) {
      //         setDataSort(data)
      //       }
      //     }
      // }
    };

    getRequestPalikaProvince();
    getRequest();
    getRequestYear();
    return () => {
      dismount = true;
    };
  }, [dataType4]);

  const palikaSelector = (selected, type) => {
    if (type === 'province') {
      setdataSortOnlyFacility(
        nameSort(dataSortPalikaProvince, selected, 'OnlyProvince')
      );
    }
  };

  if (filterType !== 'default') {
    return (
      <div className="graphItems">
        {dataSort.map((items, index) => {
          return (
            <div key={index} className="graphItem">
              <p className="text-center header-color">
                {items['date']} {items['province']} {items['district']}{' '}
                {items['palika']} {items['facility']}
              </p>
              <div>
                <p className="text-center header-color">
                  Readiness of CEONC for delivering 9 Signal Function
                </p>
              </div>
              <BarChart
                width={dynamicGraph(graphWidth)}
                height={500}
                data={items['data']}
              >
                <CartesianGrid strokeDasharray="9 9" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="Standards Met" stackId="a" fill={color.color_1} />
                <Bar
                  dataKey="Standards Not Met"
                  stackId="a"
                  fill={color.color_3}
                />
              </BarChart>
            </div>
          );
        })}
      </div>
    );
  } else {
    return (
      <div>
        <div>
          <p className="text-center header-color">
            Readiness of CEONC for delivering 9 Signal Function
          </p>
        </div>
        <div className="flex gap-2 mb-2 justify-center">
          <div className="box">
            Province
            <Select
              className="select-dropdown"
              options={dataSortProvince}
              value={value1}
              onChange={(option) => {
                setValue1(option);
                palikaSelector(option, 'province');
              }}
            />
          </div>
          <div className="box">
            Facilities by Province
            <Select
              className="select-dropdown"
              options={dataSortOnlyFacility}
              value={value5}
              onChange={(option) => {
                SetValue5(option);
                palikaSelector(option, 'OnlyProvince');
              }}
            />
          </div>
        </div>
        <BarChart width={dynamicGraph(graphWidth)} height={500} data={data}>
          <CartesianGrid strokeDasharray="9 9" />
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar dataKey="Standards Met" stackId="a" fill={color.color_1} />
          <Bar dataKey="Standards Not Met" stackId="a" fill={color.color_3} />
        </BarChart>
      </div>
    );
  }
};

export default CeoncSignalFunction;
